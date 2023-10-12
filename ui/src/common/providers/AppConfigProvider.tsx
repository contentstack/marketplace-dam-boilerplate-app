import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { isEmpty } from "lodash";
import AppConfigContext from "../contexts/AppConfigContext";
import rootConfig from "../../root_config";
import { TypeAppSdkConfigState } from "../types";
import utils from "../utils";
import useAppLocation from "../hooks/useAppLocation";
import localeTexts from "../locale/en-us";

const AppConfigProvider: React.FC = function ({ children }) {
  const configInputFields = rootConfig?.configureConfigScreen?.();
  const { saveInConfig, saveInServerConfig } =
    utils.getSaveConfigOptions(configInputFields);
  const { jsonOptions, defaultFeilds, customJsonConfigObj } =
    utils.configRootUtils();

  // ref for managing the save button disable state
  const appConfig = useRef<any>();

  const { location } = useAppLocation();

  // state for error handling of empty field values
  const [errorState, setErrorState] = useState<any>([]);
  // state for configuration
  const [installationData, setInstallation] =
    React.useState<TypeAppSdkConfigState>({
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
    });

  useEffect(() => {
    if (!isEmpty(installationData)) return;
    const sdkConfigData = location?.installation;
    appConfig.current = sdkConfigData;
    sdkConfigData
      ?.getInstallationData()
      .then((data: TypeAppSdkConfigState) => {
        setInstallation(data);
      })
      .catch((err: Error) => {
        console.error(err);
      });
  }, [installationData, setInstallation]);

  const setInstallationData = useCallback(
    async (data: { [key: string]: any }) => {
      console.info("In setInstallationData", data, location);
      const newInstallationData: TypeAppSdkConfigState = {
        ...installationData,
        configuration: data?.configuration,
        serverConfiguration: data?.serverConfiguration,
      };
      await location?.installation?.setInstallationData(newInstallationData);
      setInstallation(newInstallationData);
    },
    [location, setInstallation]
  );

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

  const StateContext = useMemo(
    () => ({
      errorState,
      installationData,
      setInstallationData,
      appConfig,
      jsonOptions,
      defaultFeilds,
      saveInConfig,
      saveInServerConfig,
      checkConfigFields,
    }),
    [
      errorState,
      installationData,
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
