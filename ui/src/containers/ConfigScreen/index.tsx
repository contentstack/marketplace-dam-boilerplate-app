/* Import React modules */
import React, { useCallback, useContext } from "react";
/* ContentStack Modules */
// For all the available venus components, please refer below doc
// https://venus-storybook.contentstack.com/?path=/docs/components-textinput--default
import "@contentstack/venus-components/build/main.css";
/* Import our modules */
import {
  JsonComponent,
  RadioInputField,
  SelectInputField,
  TextInputField,
} from "./Components";
import AppConfigContext from "../../common/contexts/AppConfigContext";
import ConfigStateProvider from "../../common/providers/ConfigStateProvider";
import { MarketplaceAppContext } from "../../common/contexts/MarketplaceAppContext";
import AppFailed from "../../components/AppFailed";
import rootConfig from "../../root_config";
/* Import our CSS */
import "./styles.scss";
import { TypeCustomConfigUpdateParams } from "../../common/types";

const ConfigScreen: React.FC = function () {
  const { appFailed } = useContext(MarketplaceAppContext);
  // context usage for global states thorughout the component
  const { installationData, setInstallationData, checkConfigFields } =
    useContext(AppConfigContext);

  // entire configuration object returned from configureConfigScreen
  const configInputFields: any = rootConfig?.configureConfigScreen?.();

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

      const updatedConfig = installationData?.configuration || {};
      const updatedServerConfig = installationData?.serverConfiguration || {};

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
      checkConfigFields({
        configuration: updatedConfig,
        serverConfiguration: updatedServerConfig,
      });
      setInstallationData({
        configuration: updatedConfig,
        serverConfiguration: updatedServerConfig,
      });
      return true;
    },
    [
      setInstallationData,
      installationData,
      installationData?.configuration,
      installationData?.serverConfiguration,
    ]
  );

  // converting the config in proper format for updateConfig
  const updateValueFunc = (
    configName: string,
    configValue: any,
    inConfig?: boolean,
    inServerConfig?: boolean
  ) => {
    const value: any = {};
    value.target = { name: configName, value: configValue };
    updateConfig(value, inConfig, inServerConfig);
  };

  // updating the custom config state
  const handleCustomConfigUpdate = ({
    fieldName,
    fieldValue,
    saveConfig,
    saveServerConfig,
  }: TypeCustomConfigUpdateParams) => {
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
                updateConfig={updateConfig}
              />
            </div>
          );
        case "radioInputFields":
          return (
            <div key={`${objKey}_${index}`}>
              <RadioInputField objKey={objKey} objValue={objValue} />
            </div>
          );
        case "selectInputFields":
          return (
            <div key={`${objKey}_${index}`}>
              <SelectInputField objKey={objKey} objValue={objValue} />
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
        {appFailed ? (
          <AppFailed />
        ) : (
          <ConfigStateProvider updateValueFunc={updateValueFunc}>
            <div className="config-wrapper" data-testid="config-wrapper">
              {renderConfig()}
              {rootConfig?.customConfigComponent?.(
                installationData?.configuration,
                installationData?.serverConfiguration,
                handleCustomConfigUpdate
              )}
              <JsonComponent />
            </div>
          </ConfigStateProvider>
        )}
      </div>
    </div>
  );
};

export default ConfigScreen;
