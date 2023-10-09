import React, { useState, useMemo, useRef } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import AppConfigContext from "../contexts/AppConfigContext";
import rootConfig from "../../root_config";
import { TypeAppSdkConfigState, TypeOption } from "../types";
import utils from "../utils";
import localeTexts from "../locale/en-us";

const AppConfigProvider: React.FC = function ({ children }) {
  // custom whole json options from rootconfig
  // eslint-disable-next-line
  let { customJsonOptions, defaultFeilds } = rootConfig?.customWholeJson?.();
  let customJsonConfigObj: any = {};
  let jsonOptions: any[] = [];

  // create actual options for select field
  if (customJsonOptions?.length && defaultFeilds?.length) {
    jsonOptions = utils.getOptions(customJsonOptions, defaultFeilds);
    defaultFeilds = utils.getOptions(defaultFeilds);
    customJsonConfigObj = {
      is_custom_json: false,
      dam_keys: defaultFeilds,
    };
  }

  // entire configuration object returned from configureConfigScreen
  const configInputFields = rootConfig?.configureConfigScreen?.();
  // config objs to be saved in configuration
  const saveInConfig: any = {};
  // config objs to be saved in serverConfiguration
  const saveInServerConfig: any = {};

  Object.keys(configInputFields)?.forEach((field: string) => {
    if (configInputFields[field]?.saveInConfig)
      saveInConfig[field] = configInputFields[field];
    if (configInputFields[field]?.saveInServerConfig)
      saveInServerConfig[field] = configInputFields[field];
  });

  // state for configuration
  const [state, setState] = React.useState<TypeAppSdkConfigState>({
    installationData: {
      configuration: {
        /* Add all your config fields here */
        /* The key defined here should match with the name attribute
        given in the DOM that is being returned at last in this component */
        ...Object.keys(saveInConfig)?.reduce((acc, value) => {
          if (saveInConfig?.[value]?.type === "textInputFields")
            return { ...acc, [value]: "" };
          return {
            ...acc,
            [value]: saveInConfig?.[value]?.defaultSelectedOption || "",
          };
        }, {}),
        ...customJsonConfigObj,
      },
      /* Use ServerConfiguration Only When Webhook is Enbaled */
      serverConfiguration: {
        ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
          if (saveInServerConfig?.[value]?.type === "textInputFields")
            return { ...acc, [value]: "" };
          return {
            ...acc,
            [value]: saveInServerConfig?.[value]?.defaultSelectedOption || "",
          };
        }, {}),
      },
    },
    setInstallationData: (): any => {},
    appSdkInitialized: false,
  });
  // state for error handling of empty field values
  const [errorState, setErrorState] = useState<any>([]);
  // local state for options of custom json
  const [customOptions, setCustomOptions] = useState<any[]>(jsonOptions);
  // local state for custom / whole json boolean value
  const [isCustom, setIsCustom] = React.useState(false);
  // local state for selected options of custom json dropdown
  const [damKeys, setDamKeys] = React.useState<any[]>(defaultFeilds ?? []);
  // saved custom key options
  const [keyPathOptions, setKeyPathOptions] = useState<any[]>([]);
  // local state for radio option config
  const [radioInputValues, setRadioInputValues] = React.useState<any>({
    ...Object.keys(saveInConfig)?.reduce((acc, value) => {
      if (saveInConfig?.[value]?.type === "radioInputFields")
        return {
          ...acc,
          [value]: saveInConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value === saveInConfig?.[value]?.defaultSelectedOption
          )[0],
        };
      return acc;
    }, {}),
    ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
      if (saveInServerConfig?.[value]?.type === "radioInputFields")
        return {
          ...acc,
          [value]: saveInServerConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value ===
              saveInServerConfig?.[value]?.defaultSelectedOption
          )[0],
        };
      return acc;
    }, {}),
  });
  // local state for select option config
  const [selectInputValues, setSelectInputValues] = React.useState<any>({
    ...Object.keys(saveInConfig)?.reduce((acc, value) => {
      if (saveInConfig?.[value]?.type === "selectInputFields")
        return {
          ...acc,
          [value]: saveInConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value === saveInConfig?.[value]?.defaultSelectedOption
          )[0],
        };
      return acc;
    }, {}),
    ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
      if (saveInServerConfig?.[value]?.type === "selectInputFields")
        return {
          ...acc,
          [value]: saveInServerConfig?.[value]?.options?.filter(
            (option: any) =>
              option?.value ===
              saveInServerConfig?.[value]?.defaultSelectedOption
          )[0],
        };
      return acc;
    }, {}),
  });

  // ref for managing the save button disable state
  const appConfig = useRef<any>();

  // function to check if field values are empty and handles save button disable on empty field values
  const checkConfigFields = ({ configuration, serverConfiguration }: any) => {
    const skipKeys = ["dam_keys", "is_custom_json", "keypath_options"];
    const missingValues: string[] = [];

    Object.entries({ ...configuration, ...serverConfiguration })?.forEach(
      ([key, value]: any) => {
        if (!skipKeys?.includes(key)) {
          if (
            !value ||
            (Array.isArray(value) && !value?.length) ||
            !Object.keys(value)?.length
          ) {
            missingValues?.push(key);
          }
        }
      }
    );

    setErrorState(missingValues);
    if (missingValues?.length) {
      appConfig?.current?.setValidity(false, {
        message: localeTexts.ConfigFields.invalidCredentials,
      });
    } else {
      appConfig?.current?.setValidity(true);
    }
  };

  React.useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const sdkConfigData = appSdk?.location?.AppConfigWidget?.installation;
        appConfig.current = sdkConfigData;
        if (sdkConfigData) {
          const installationDataFromSDK =
            await sdkConfigData?.getInstallationData();
          const setInstallationDataOfSDK = sdkConfigData?.setInstallationData;
          const installationDataOfSdk = utils.mergeObjects(
            state?.installationData,
            installationDataFromSDK
          );
          setState({
            ...state,
            installationData: installationDataOfSdk,
            setInstallationData: setInstallationDataOfSDK,
            appSdkInitialized: true,
          });
          checkConfigFields(installationDataOfSdk);
          setIsCustom(
            installationDataOfSdk?.configuration?.is_custom_json ?? false
          );
          setDamKeys(installationDataOfSdk?.configuration?.dam_keys ?? []);
          const keyOptions =
            installationDataFromSDK?.configuration?.keypath_options ?? [];
          setKeyPathOptions(keyOptions);
          setCustomOptions([...customOptions, ...keyOptions]);

          const radioValuesObj: any = {};
          const radioValuesKeys = [
            ...Object.keys(saveInConfig)?.filter(
              (value) => saveInConfig?.[value]?.type === "radioInputFields"
            ),
            ...Object.keys(saveInServerConfig)?.filter(
              (value) =>
                saveInServerConfig?.[value]?.type === "radioInputFields"
            ),
          ];

          const selectValuesObj: any = {};
          const selectValuesKeys = [
            ...Object.keys(saveInConfig)?.filter(
              (value) => saveInConfig?.[value]?.type === "selectInputFields"
            ),
            ...Object.keys(saveInServerConfig)?.filter(
              (value) =>
                saveInServerConfig?.[value]?.type === "selectInputFields"
            ),
          ];

          const savedData = {
            ...installationDataFromSDK?.configuration,
            ...installationDataFromSDK?.serverConfiguration,
          };

          Object.keys(savedData)?.forEach((item: string) => {
            if (radioValuesKeys?.includes(item)) {
              radioValuesObj[item] = configInputFields?.[item]?.options?.filter(
                (v: TypeOption) => v?.value === savedData?.[item]
              )[0];
            }
            if (selectValuesKeys?.includes(item)) {
              selectValuesObj[item] = configInputFields?.[
                item
              ]?.options?.filter(
                (v: TypeOption) => v?.value === savedData?.[item]
              )[0];
            }
          });

          setRadioInputValues(radioValuesObj);
          setSelectInputValues(selectValuesObj);
        }
      })
      .catch(() => {
        console.error("Something Went Wrong While Loading App SDK");
      });
  }, []);

  // context value to be used in child components
  const ErrorContext = useMemo(() => ({ errorState }), [errorState]);

  const StateContext = useMemo(() => ({ state }), [state]);

  const CustomOptionsContext = useMemo(
    () => ({ customOptions, setCustomOptions }),
    [customOptions, setCustomOptions]
  );

  const CustomCheckContext = useMemo(
    () => ({ isCustom, setIsCustom }),
    [isCustom, setIsCustom]
  );

  const DamKeysContext = useMemo(
    () => ({ damKeys, setDamKeys }),
    [damKeys, setDamKeys]
  );

  const KeyPathContext = useMemo(
    () => ({ keyPathOptions, setKeyPathOptions }),
    [keyPathOptions, setKeyPathOptions]
  );

  const RadioInputContext = useMemo(
    () => ({ radioInputValues, setRadioInputValues }),
    [radioInputValues, setRadioInputValues]
  );

  const SelectInputContext = useMemo(
    () => ({ selectInputValues, setSelectInputValues }),
    [selectInputValues, setSelectInputValues]
  );

  const CustomFieldsContext = useMemo(
    () => ({ configInputFields }),
    [configInputFields]
  );

  const contextValue = useMemo(
    () => ({
      ErrorContext,
      StateContext,
      CustomOptionsContext,
      CustomCheckContext,
      DamKeysContext,
      KeyPathContext,
      RadioInputContext,
      SelectInputContext,
      CustomFieldsContext,
      checkConfigFields,
    }),
    [
      ErrorContext,
      StateContext,
      CustomOptionsContext,
      CustomCheckContext,
      DamKeysContext,
      KeyPathContext,
      RadioInputContext,
      SelectInputContext,
      CustomFieldsContext,
      checkConfigFields,
    ]
  );

  return (
    <AppConfigContext.Provider value={contextValue}>
      {children}
    </AppConfigContext.Provider>
  );
};
export default AppConfigProvider;
