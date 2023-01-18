/* Import React modules */
import React, { useCallback } from "react";
/* ContentStack Modules */
// For all the available venus components, please refer below doc
// https://venus-storybook.contentstack.com/?path=/docs/components-textinput--default
import ContentstackAppSdk from "@contentstack/app-sdk";
import "@contentstack/venus-components/build/main.css";
/* Import our modules */
import {
  RadioInputField,
  SelectInputField,
  TextInputField,
} from "./Components";
import rootConfig from "../../root_config";
import utils from "../../common/utils";
import { TypeAppSdkConfigState, TypeOption } from "../../common/types";
/* Import our CSS */
import "./styles.scss";

const ConfigScreen: React.FC = function () {
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

  React.useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const sdkConfigData = appSdk?.location?.AppConfigWidget?.installation;
        if (sdkConfigData) {
          const installationDataFromSDK =
            await sdkConfigData?.getInstallationData();
          const setInstallationDataOfSDK = sdkConfigData?.setInstallationData;
          const installationDataOfSdk = utils.mergeObjects(
            state.installationData,
            installationDataFromSDK
          );
          setState({
            ...state,
            installationData: installationDataOfSdk,
            setInstallationData: setInstallationDataOfSDK,
            appSdkInitialized: true,
          });

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

  /** updateConfig - Function where you should update the State variable
   * Call this function whenever any field value is changed in the DOM
   * */
  const updateConfig = useCallback(
    async (e: any, inConfig?: boolean, inServerConfig?: boolean) => {
      // eslint-disable-next-line prefer-const
      let { name: fieldName, value: fieldValue } = e?.target;
      if (typeof fieldValue === "string") {
        fieldValue = fieldValue?.trim();
      }

      const updatedConfig = state?.installationData?.configuration || {};
      const updatedServerConfig =
        state?.installationData?.serverConfiguration || {};

      if (inConfig || configInputFields?.[fieldName]?.saveInConfig) {
        updatedConfig[fieldName] = fieldValue;
      }
      /* Use ServerConfiguration Only When Webhook is Enbaled */
      if (
        inServerConfig ||
        configInputFields?.[fieldName]?.saveInServerConfig
      ) {
        updatedServerConfig[fieldName] = fieldValue;
      }

      if (state?.setInstallationData) {
        await state.setInstallationData({
          ...state.installationData,
          configuration: updatedConfig,
          serverConfiguration: updatedServerConfig,
        });
      }
      return true;
    },
    [
      state?.setInstallationData,
      state?.installationData,
      state?.installationData?.configuration,
      state?.installationData?.serverConfiguration,
    ]
  );

  // converting the config in proper format for updateConfig
  const updateValueFunc = (configName: string, configValue: string) => {
    const value: any = {};
    value.target = { name: configName, value: configValue };
    updateConfig(value);
  };

  // updating the select option state
  const updateSelectConfig = useCallback(
    (e: TypeOption, fieldName: string) => {
      setSelectInputValues({ ...selectInputValues, [fieldName]: e });
      updateValueFunc(fieldName, e?.value);
    },
    [selectInputValues]
  );

  // updating the radio option state
  const updateRadioOptions = useCallback(
    (fieldName: string, option: TypeOption) => {
      setRadioInputValues({ ...radioInputValues, [fieldName]: option });
      updateValueFunc(fieldName, option?.value);
    },
    [radioInputValues]
  );

  // updating the custom config state
  const handleCustomConfigUpdate = (
    fieldName: string,
    fieldValue: string,
    saveConfig: boolean,
    saveServerConfig: boolean
  ) => {
    const configObj: any = {};
    configObj.target = { name: fieldName, value: fieldValue };
    updateConfig(configObj, saveConfig, saveServerConfig);
  };

  // return render jsx for the config object provided
  const renderConfig = () =>
    Object.entries(configInputFields)?.map(([objKey, objValue, index]: any) => {
      switch (objValue?.type) {
        case "textInputFields":
          return (
            <div key={`${objKey}_${index}`}>
              <TextInputField
                objKey={objKey}
                objValue={objValue}
                currentValue={
                  // prettier-ignore
                  // eslint-disable-next-line
                  objValue?.saveInConfig
                    ? (state?.installationData?.configuration?.[objKey])
                    : (objValue?.saveInServerConfig
                    ? state?.installationData?.serverConfiguration?.[objKey]
                    : "")
                }
                updateConfig={updateConfig}
              />
            </div>
          );
        case "radioInputFields":
          return (
            <div key={`${objKey}_${index}`}>
              <RadioInputField
                objKey={objKey}
                objValue={objValue}
                currentValue={radioInputValues[objKey]}
                updateConfig={updateRadioOptions}
              />
            </div>
          );
        case "selectInputFields":
          return (
            <div key={`${objKey}_${index}`}>
              <SelectInputField
                objKey={objKey}
                objValue={objValue}
                currentValue={selectInputValues[objKey]}
                updateConfig={updateSelectConfig}
              />
            </div>
          );
        default:
          // eslint-disable-next-line
          return <></>;
      }
    });

  /* If need to get any data from API then use,
  getDataFromAPI({queryParams, headers, method, body}) function.
  Refer services/index.ts for more details and update the API
  call there as per requirement. */

  return (
    <div className="layout-container">
      <div className="page-wrapper">
        <div className="config-wrapper" data-testid="config-wrapper">
          {renderConfig()}
          {rootConfig?.customConfig?.(
            state?.installationData?.configuration,
            state?.installationData?.serverConfiguration,
            handleCustomConfigUpdate
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
