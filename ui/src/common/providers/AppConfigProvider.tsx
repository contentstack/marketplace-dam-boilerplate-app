import React, { useMemo, useRef, useEffect, useCallback } from "react";
import AppConfigContext from "../contexts/AppConfigContext";
import rootConfig from "../../root_config";
import { TypeAppSdkConfigState } from "../types";
import useAppLocation from "../hooks/useAppLocation";
import localeTexts from "../locale/en-us";
import ConfigScreenUtils from "../utils/ConfigScreenUtils";
import CustomFieldUtils from "../utils/CustomFieldUtils";

const AppConfigProvider: React.FC = function ({ children }) {
  const configInputFields = rootConfig?.configureConfigScreen?.();
  const { saveInConfig, saveInServerConfig } =
    ConfigScreenUtils.getSaveConfigOptions(configInputFields);
  const { jsonOptions, defaultFeilds, customJsonConfigObj } =
    ConfigScreenUtils.configRootUtils();

  // ref for managing the save button disable state
  const appConfig = useRef<any>();

  const { location } = useAppLocation();

  // state for configuration
  const [installation, setInstallation] = React.useState<TypeAppSdkConfigState>(
    {
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
    }
  );

  // function to check if field values are empty and handles save button disable on empty field values
  const checkConfigFields = async ({
    configuration,
    serverConfiguration,
  }: any) => {
    const requiredFields = rootConfig.damEnv.REQUIRED_CONFIG_FIELDS;
    const missingValues: string[] = [];

    const flatStructure = CustomFieldUtils.flatten({
      configuration,
      serverConfiguration,
    });

    Object.entries(flatStructure)?.forEach(([objKey, objValue]: any) => {
      const key = objKey.split(".")?.at(-1);
      if (requiredFields?.includes(key)) {
        const value = typeof objValue === "boolean" ? `${objValue}` : objValue;
        if (!value) {
          missingValues?.push(objKey?.split(".multi_config_keys.")?.at(-1));
        }
      }
    });

    const isConfigValid =
      (await rootConfig?.checkConfigValidity?.(
        configuration,
        serverConfiguration
      )) ?? true;

    if (missingValues?.length && isConfigValid) {
      appConfig?.current?.setValidity(false, {
        message: localeTexts.ConfigFields.missingCredentials,
      });
    } else {
      appConfig?.current?.setValidity(true);
    }
  };

  useEffect(() => {
    if (location) {
      const sdkConfigData = location?.installation;
      appConfig.current = sdkConfigData;

      if (sdkConfigData) {
        sdkConfigData
          .getInstallationData()
          .then((installationDataFromSDK: TypeAppSdkConfigState) => {
            const installationDataOfSdk = ConfigScreenUtils.mergeObjects(
              installation,
              installationDataFromSDK
            );
            setInstallation(installationDataOfSdk);
            checkConfigFields(installationDataOfSdk);
          })
          .catch((err: Error) => {
            console.error(err);
          });
      }
    }
  }, [location]);

  const setInstallationData = useCallback(
    async (data: { [key: string]: any }) => {
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
      {children}
    </AppConfigContext.Provider>
  );
};
export default AppConfigProvider;
