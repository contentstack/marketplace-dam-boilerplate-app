import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { GenericObjectType } from "@contentstack/app-sdk/dist/src/types/common.types";
import { isEmpty } from "lodash";
import AppConfigContext from "../contexts/AppConfigContext";
import rootConfig from "../../root_config";
import { Props, TypeAppSdkConfigState } from "../types";
import useAppLocation from "../hooks/useAppLocation";
import localeTexts from "../locale/en-us";
import ConfigScreenUtils from "../utils/ConfigScreenUtils";
import CustomFieldUtils from "../utils/CustomFieldUtils";
import { MarketplaceAppContext } from "../contexts/MarketplaceAppContext";

const AppConfigProvider: React.FC = function ({ children }) {
  const configInputFields = rootConfig?.configureConfigScreen?.();
  const { saveInConfig, saveInServerConfig } =
    ConfigScreenUtils.getSaveConfigOptions(configInputFields);
  const { jsonOptions, defaultFeilds, customJsonConfigObj } =
    ConfigScreenUtils.configRootUtils();

  // ref for managing the save button disable state
  const appConfig = useRef<GenericObjectType>();

  const { location } = useAppLocation();
  const { appSdk } = useContext(MarketplaceAppContext);

  // state for configuration
  const [installation, setInstallation] = React.useState<Props>({});
  // check for initial state for rendering children
  const [initialStateLoaded, setInitialStateLoaded] = useState(false);

  // function to check if field values are empty and handles save button disable on empty field values
  const checkConfigFields = async ({
    configuration,
    serverConfiguration,
  }: TypeAppSdkConfigState) => {
    let allBranches = [];
    if (appSdk) {
      allBranches = appSdk?.stack?.getAllBranches();
    }
    const requiredFields = rootConfig.damEnv.REQUIRED_CONFIG_FIELDS;
    const missingValues: string[] = [];
    const lengthExceeded: string[] = [];

    const flatStructure: Record<string, string> = CustomFieldUtils.flatten({
      configuration,
      serverConfiguration,
    });

    Object.entries(flatStructure)?.forEach(
      ([objKey, objValue]: [string, string]) => {
        const key: string = objKey.split(".")?.at(-1) ?? "";
        if (requiredFields?.includes(key)) {
          const value =
            typeof objValue === "boolean" ? `${objValue}` : objValue;
          const keySplit = objKey?.split(".multi_config_keys.")?.at(-1);
          if (!value && keySplit) {
            missingValues?.push(keySplit);
          }
          if (
            configInputFields?.[key]?.maxLength &&
            value?.length > configInputFields?.[key]?.maxLength &&
            keySplit
          ) {
            lengthExceeded?.push(keySplit);
          }
        }
      }
    );

    const { disableSave: isConfigValid, message: disableMsg } =
      (await rootConfig?.checkConfigValidity?.(
        configuration,
        serverConfiguration
      )) ?? false;

    let errorMsg = "";
    if (isConfigValid) errorMsg = disableMsg;
    else if (missingValues?.length)
      errorMsg = localeTexts.ConfigFields.missingCredentials;
    else if (lengthExceeded?.length)
      errorMsg = localeTexts.ConfigFields.maxLengthExceeded;
    else if (configuration?.default_multi_config_key === "")
      errorMsg = localeTexts.ConfigFields.missingDefaultConfig;

    if (
      allBranches?.length ===
      Object.keys(configuration?.multi_config_branches ?? {})?.length
    )
      errorMsg = "";

    if (errorMsg) {
      appConfig?.current?.setValidity(false, {
        message: errorMsg,
      });
    } else {
      appConfig?.current?.setValidity(true);
    }
  };

  const getCustomFieldConfigObj = (config: Props) => {
    // eslint-disable-next-line
    const { is_custom_json, dam_keys } = config;
    if (!dam_keys && !is_custom_json?.toString()) {
      return customJsonConfigObj;
    }
    return {
      is_custom_json,
      dam_keys,
    };
  };

  const getInitialInstallationState = (
    installationDataFromSDK: TypeAppSdkConfigState
  ) => {
    const {
      configuration: savedConfig,
      serverConfiguration: savedServerCofig,
    } = installationDataFromSDK;
    let finalState = {};
    if (isEmpty(savedConfig) && isEmpty(savedServerCofig)) {
      finalState = {
        configuration: {
          ...Object.keys(saveInConfig)?.reduce((acc, value) => {
            let finalConfigValue = "";
            if (saveInConfig?.[value]?.type !== "textInputField")
              finalConfigValue =
                saveInConfig?.[value]?.defaultSelectedOption ?? "";
            if (!saveInConfig?.[value]?.isMultiConfig) {
              return {
                ...acc,
                [value]: finalConfigValue,
              };
            }
            return { ...acc };
          }, {}),
          ...customJsonConfigObj,
        },
        serverConfiguration: {
          ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
            let finalServerConfigValue = "";
            if (saveInServerConfig?.[value]?.type !== "textInputField")
              finalServerConfigValue =
                saveInServerConfig?.[value]?.defaultSelectedOption ?? "";
            if (!saveInServerConfig?.[value]?.isMultiConfig) {
              return {
                ...acc,
                [value]: finalServerConfigValue,
              };
            }
            return { ...acc };
          }, {}),
        },
      };
    } else {
      const appState = {
        configuration: {
          ...Object.keys(saveInConfig)?.reduce((acc, value) => {
            let finalConfigValue = savedConfig?.[value] ?? "";
            if (saveInConfig?.[value]?.type !== "textInputField")
              finalConfigValue =
                savedConfig?.[value] ??
                saveInConfig?.[value]?.defaultSelectedOption ??
                "";
            if (!saveInConfig?.[value]?.isMultiConfig) {
              return {
                ...acc,
                [value]: finalConfigValue,
              };
            }

            const multiConfigKeys = savedConfig?.multi_config_keys
              ? Object.keys(savedConfig?.multi_config_keys)
              : ["legacy_config"];

            return ConfigScreenUtils.mergeObjects(acc, {
              multi_config_keys: multiConfigKeys?.reduce(
                (nestedAcc: Props, nestedValue: string) => ({
                  ...nestedAcc,
                  [nestedValue]: {
                    ...(nestedAcc?.[nestedValue] ?? {}),
                    [value]: finalConfigValue,
                  },
                }),
                {}
              ),
            });
          }, {}),
          ...getCustomFieldConfigObj(savedConfig),
        },
        serverConfiguration: {
          ...Object.keys(saveInServerConfig)?.reduce((acc, value) => {
            let finalServerConfigValue = savedServerCofig?.[value] ?? "";
            if (saveInServerConfig?.[value]?.type !== "textInputField")
              finalServerConfigValue =
                savedServerCofig?.[value] ??
                saveInServerConfig?.[value]?.defaultSelectedOption ??
                "";
            if (!saveInServerConfig?.[value]?.isMultiConfig) {
              return {
                ...acc,
                [value]: finalServerConfigValue,
              };
            }

            const multiServerConfigKeys = savedServerCofig?.multi_config_keys
              ? Object.keys(savedServerCofig?.multi_config_keys)
              : ["legacy_config"];

            return ConfigScreenUtils.mergeObjects(acc, {
              multi_config_keys: multiServerConfigKeys.reduce(
                (nestedAcc: Props, nestedValue: string) => ({
                  ...nestedAcc,
                  [nestedValue]: {
                    ...(nestedAcc?.[nestedValue] ?? {}),
                    [value]: finalServerConfigValue,
                  },
                }),
                {}
              ),
            });
          }, {}),
        },
      };

      if (
        !savedConfig?.multi_config_keys &&
        !savedServerCofig?.multi_config_keys
      ) {
        finalState = appState;
      } else {
        finalState = ConfigScreenUtils.mergeObjects(
          appState,
          installationDataFromSDK
        );
      }
    }
    return finalState;
  };

  const checkEmptyMultiConfigKey = ({
    configuration,
    serverConfiguration,
  }: Props) => {
    let isEmptyKeyPresent = false;
    const newConfiguration = { ...configuration };
    const rawConfigKeys: string[] = Object.keys(
      configuration?.multi_config_keys ?? {}
    );
    const invalidConfigValues = rawConfigKeys?.filter(
      (key) => key?.trim() === "" || key === "null" || key === "undefined"
    );
    if (invalidConfigValues?.length) {
      isEmptyKeyPresent = true;
      invalidConfigValues?.forEach((value) => {
        delete newConfiguration[value];
      });
    }

    const newServerConfiguration = { ...serverConfiguration };
    const rawServerConfigKeys: string[] = Object.keys(
      serverConfiguration?.multi_config_keys ?? {}
    );
    const invalidServerConfigValues = rawServerConfigKeys?.filter(
      (key) => key?.trim() === "" || key === "null" || key === "undefined"
    );
    if (invalidServerConfigValues?.length) {
      isEmptyKeyPresent = true;
      invalidServerConfigValues?.forEach((value) => {
        delete newServerConfiguration[value];
      });
    }
    if (isEmptyKeyPresent) {
      return {
        isEmptyKeyPresent,
        data: {
          configuration: newConfiguration,
          serverConfiguration: newServerConfiguration,
        },
      };
    }
    return {
      isEmptyKeyPresent,
    };
  };

  useEffect(() => {
    if (location) {
      const sdkConfigData = location?.installation;
      appConfig.current = sdkConfigData;

      if (sdkConfigData) {
        sdkConfigData
          .getInstallationData()
          .then(async (installationDataFromSDK: TypeAppSdkConfigState) => {
            const initialState: Props = getInitialInstallationState(
              installationDataFromSDK
            );
            const { isEmptyKeyPresent, data } =
              checkEmptyMultiConfigKey(initialState);
            if (isEmptyKeyPresent)
              sdkConfigData?.setInstallationData({ ...sdkConfigData, ...data });
            await setInstallation(initialState);

            setInitialStateLoaded(true);
            checkConfigFields({
              configuration: initialState?.configuration,
              serverConfiguration: initialState?.serverConfiguration,
            });
          })
          .catch((err: Error) => {
            console.error(err);
          });
      }
    }
  }, [location]);

  const setInstallationData = useCallback(
    async (data: TypeAppSdkConfigState) => {
      const newInstallationData: TypeAppSdkConfigState = {
        ...installation,
        configuration: data?.configuration,
        serverConfiguration: data?.serverConfiguration,
      };
      await setInstallation(newInstallationData);
      await location?.installation?.setInstallationData(newInstallationData);
    },
    [location]
  );

  const StateContext = useMemo(
    () => ({
      installationData: installation,
      setInstallationData,
      appConfig,
      jsonOptions,
      defaultFeilds,
      saveInConfig,
      saveInServerConfig,
      checkConfigFields,
    }),
    [
      installation,
      setInstallationData,
      appConfig,
      jsonOptions,
      defaultFeilds,
      saveInConfig,
      saveInServerConfig,
      checkConfigFields,
    ]
  );

  return (
    <AppConfigContext.Provider value={StateContext}>
      {initialStateLoaded && children}
    </AppConfigContext.Provider>
  );
};
export default AppConfigProvider;
