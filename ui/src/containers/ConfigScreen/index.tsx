/* Import React modules */
import React, { useCallback, useContext, useEffect } from "react";
/* ContentStack Modules */
import {
  Accordion,
  Field,
  Button,
  Checkbox,
  Dropdown,
  Icon,
  cbModal,
  Line,
} from "@contentstack/venus-components";
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
import { TypeCustomConfigUpdateParams } from "../../common/types";
import MultiConfigModal from "./MultiConfigModal";
import AppFailed from "../../components/AppFailed";
import DeleteModal from "../../components/DeleteModal";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";
/* Import our CSS */
import "./styles.scss";

const ConfigScreen: React.FC = function () {
  const { appFailed } = useContext(MarketplaceAppContext);
  // context usage for global states thorughout the component
  const { installationData, setInstallationData, checkConfigFields } =
    useContext(AppConfigContext);
  // entire configuration object returned from configureConfigScreen
  const configInputFields: any = rootConfig?.configureConfigScreen?.();
  // state for rendering multi-config name modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // default multiconfig key
  const [defaultKey, setDefaultKey] = React.useState<string>();

  const handleDefaultConfigFn = (e: any, acckey: string) => {
    if (e?.target?.checked) {
      setDefaultKey(acckey);
      setInstallationData({
        ...installationData,
        configuration: {
          ...installationData?.configuration,
          default_multi_config_key: acckey,
        },
      });
    }
  };

  useEffect(() => {
    const defaultLabel =
      installationData?.configuration?.default_multi_config_key ??
      "legacy_config";
    handleDefaultConfigFn({ target: { checked: true } }, defaultLabel);
  }, []);

  const filterFieldsForMultiConfig = () => {
    const accConfigFields: any = {};
    const accServerFields: any = {};
    Object.entries(configInputFields)?.forEach(
      ([fieldKey, fieldValue]: any) => {
        if (fieldValue?.isAccordianConfig) {
          if (fieldValue?.saveInConfig) {
            accConfigFields[fieldKey] = fieldValue;
          }
          if (fieldValue?.saveInServerConfig) {
            accServerFields[fieldKey] = fieldValue;
          }
        }
      }
    );
    return {
      accConfigFields,
      accServerFields,
    };
  };

  /** updateConfig - Function where you should update the State variable
   * Call this function whenever any field value is changed in the DOM
   * */
  const updateConfig = useCallback(
    async (e: any, inConfig?: boolean, inServerConfig?: boolean) => {
      // eslint-disable-next-line prefer-const
      let { name: fieldName, value: fieldValue } = e?.target ?? {};
      if (typeof fieldValue === "string") {
        fieldValue = fieldValue?.trim();
      }

      const updatedConfig = installationData?.configuration || {};
      const updatedServerConfig = installationData?.serverConfiguration || {};

      const descructValue = fieldName?.split("$--");
      let mutiConfigName = descructValue?.[0];
      let configFieldName = descructValue?.[1];

      if (descructValue?.length === 1) {
        mutiConfigName = undefined;
        configFieldName = descructValue?.[0];
      }

      if (inConfig !== undefined && inServerConfig !== undefined) {
        mutiConfigName = undefined;
        configFieldName = fieldName;
      }

      if (inConfig || configInputFields?.[configFieldName]?.saveInConfig) {
        if (configInputFields?.[configFieldName]?.isAccordianConfig) {
          updatedConfig.multi_config_keys[mutiConfigName][configFieldName] =
            fieldValue;
        } else {
          updatedConfig[configFieldName] = fieldValue;
        }
      }

      if (
        inServerConfig ||
        configInputFields?.[configFieldName]?.saveInServerConfig
      ) {
        if (configInputFields?.[configFieldName]?.isAccordianConfig) {
          updatedServerConfig.multi_config_keys[mutiConfigName][
            configFieldName
          ] = fieldValue;
        } else {
          updatedServerConfig[configFieldName] = fieldValue;
        }
      }
      // validation for save button disable
      checkConfigFields({
        configuration: updatedConfig,
        serverConfiguration: updatedServerConfig,
      });
      // seetting the config data in installation object for save
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

  const handleMultiConfig = (newConfigName: string) => {
    const { accConfigFields, accServerFields } = filterFieldsForMultiConfig();

    const configFieldObj: any = {};
    Object.entries(accConfigFields)?.forEach(([key, value]: any) => {
      let finalValue = "";
      if (value?.type !== "textInputFields") {
        finalValue = value?.defaultSelectedOption ?? "";
      }
      configFieldObj[key] = finalValue;
    });

    const serverConfigFieldObj: any = {};
    Object.entries(accServerFields)?.forEach(([key, value]: any) => {
      let finalValue = "";
      if (value?.type !== "textInputFields") {
        finalValue = value?.defaultSelectedOption ?? "";
      }
      serverConfigFieldObj[key] = finalValue;
    });

    let configInstallationObj = {
      ...installationData?.configuration,
      multi_config_keys: {
        ...installationData?.configuration?.multi_config_keys,
        [newConfigName]: configFieldObj,
      },
    };

    if (
      !Object.keys(installationData?.configuration?.multi_config_keys ?? {})
        ?.length
    ) {
      configInstallationObj = {
        ...installationData?.configuration,
        multi_config_keys: {
          ...installationData?.configuration?.multi_config_keys,
          [newConfigName]: configFieldObj,
        },
        default_multi_config_key: newConfigName,
      };
      setDefaultKey(newConfigName);
    }

    setInstallationData({
      ...installationData,
      configuration: {
        ...configInstallationObj,
      },
      serverConfiguration: {
        ...installationData?.serverConfiguration,
        multi_config_keys: {
          ...installationData?.serverConfiguration?.multi_config_keys,
          [newConfigName]: serverConfigFieldObj,
        },
      },
    });
  };

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
  const renderFields = (nonAccordianFields: any, acckey?: string) =>
    Object.entries(nonAccordianFields)?.map(
      ([objKey, objValue, index]: any) => {
        switch (objValue?.type) {
          case "textInputFields":
            return (
              <div key={`${objKey}_${index}`}>
                <TextInputField
                  objKey={objKey}
                  objValue={objValue}
                  updateConfig={updateConfig}
                  acckey={acckey}
                />
                {!acckey && <Line type="dashed" />}
              </div>
            );
          case "radioInputFields":
            return (
              <div key={`${objKey}_${index}`}>
                <RadioInputField
                  objKey={objKey}
                  objValue={objValue}
                  acckey={acckey}
                />
                {!acckey && <Line type="dashed" />}
              </div>
            );
          case "selectInputFields":
            return (
              <div key={`${objKey}_${index}`}>
                <SelectInputField
                  objKey={objKey}
                  objValue={objValue}
                  acckey={acckey}
                />
                {!acckey && <Line type="dashed" />}
              </div>
            );
          default:
            // eslint-disable-next-line
            return <></>;
        }
      }
    );

  const handleDeleteConfirmation = (configKey: string) => {
    const multiConfigData =
      installationData?.configuration?.multi_config_keys ?? {};
    const serverMultiConfigData =
      installationData?.serverConfiguration?.multi_config_keys ?? {};
    const defaultConfig =
      installationData?.configuration?.default_multi_config_key ?? "";

    delete multiConfigData[configKey];
    delete serverMultiConfigData[configKey];

    let defaultConfigKey;
    if (defaultConfig === configKey) {
      defaultConfigKey = Object.keys(multiConfigData)?.[0];
      setDefaultKey(defaultConfigKey);
    }

    setInstallationData({
      ...installationData,
      configuration: {
        ...installationData?.configuration,
        multi_config_keys: { ...multiConfigData },
        default_multi_config_key: defaultConfigKey ?? "",
      },
      serverConfiguration: {
        ...installationData?.serverConfiguration,
        multi_config_keys: { ...serverMultiConfigData },
      },
    });
  };

  const handleClickDeleteModal = (configKey: string) => {
    cbModal({
      // eslint-disable-next-line react/no-unstable-nested-components
      component: (props: any) => (
        <DeleteModal
          remove={handleDeleteConfirmation}
          id={configKey}
          name={configKey}
          configLocation
          {...props}
        />
      ),
      testId: "cs-modal-storybook",
    });
  };

  const accordianInstance = (acckey: any, accordianFields: any) => (
    <div className="multi-config-wrapper__configblock" key={acckey}>
      <Accordion
        className="multi-config-accordian"
        dashedLineVisibility="hover"
        errorMessage=""
        renderExpanded
        isContainerization
        title={
          <div className="multi-config-label-wrapper">
            {acckey}
            {defaultKey === acckey && (
              <span className="multi-config-default-label">
                {localeTexts.ConfigFields.AccordianConfig.defaultLabel}
              </span>
            )}
          </div>
        }
        version="v2"
        actions={[
          {
            actionClassName: "font-color-tertiary",
            component: (
              <div className="Dropdown-wrapper">
                <Dropdown
                  list={[
                    {
                      label: (
                        <div className="multi-config-dropdown-action-item">
                          <Icon
                            icon={localeTexts.Icons.checkCircleDark}
                            size="small"
                            version="v2"
                          />
                          {
                            localeTexts.ConfigFields.AccordianConfig.accActions
                              .default
                          }
                        </div>
                      ),
                      action: () => {
                        handleDefaultConfigFn(
                          { target: { checked: true } },
                          acckey
                        );
                      },
                    },
                    {
                      label: (
                        <div className="multi-config-dropdown-action-item">
                          <Icon
                            icon={localeTexts.Icons.delete}
                            size="small"
                            version="v2"
                          />
                          {
                            localeTexts.ConfigFields.AccordianConfig.accActions
                              .delete
                          }
                        </div>
                      ),
                      action: () => {
                        handleClickDeleteModal(acckey);
                      },
                    },
                  ]}
                  type="click"
                  withIcon
                >
                  <Icon
                    icon={localeTexts.Icons.dotsThreeLargeVertical}
                    size="medium"
                    version="v2"
                  />
                </Dropdown>
              </div>
            ),
            onClick: () => {},
          },
        ]}
      >
        {renderFields(accordianFields, acckey)}
        <Field className="multi-config-default-checkbox">
          <Checkbox
            label={localeTexts.ConfigFields.AccordianConfig.checkboxText}
            onClick={(e: any) => handleDefaultConfigFn(e, acckey)}
            checked={defaultKey === acckey}
          />
        </Field>
      </Accordion>
    </div>
  );

  const renderAccFields = (accordianFields: any) => {
    const accordianKeys = Object.keys(
      installationData?.configuration?.multi_config_keys ??
        installationData?.serverConfiguration?.multi_config_keys ??
        {}
    );
    return (
      <div className="multi-config-accordian-wrapper">
        <Accordion
          version="v2"
          title={`${rootConfig?.damEnv?.DAM_APP_NAME} ${localeTexts.ConfigFields.AccordianConfig.mainName}`}
          renderExpanded
          accordionDataCount={accordianKeys?.length}
        >
          <p className="multi-config-wrapper__sublabel">
            {localeTexts.ConfigFields.AccordianConfig.multiConfigLabel}
          </p>
          {accordianKeys?.map((acckey: any) =>
            accordianInstance(acckey, accordianFields)
          )}
          <Button
            className="multi-config-button"
            buttonType="secondary"
            icon={localeTexts.Icons.addPlusBold}
            size="medium"
            onClick={() => setIsModalOpen(true)}
          >
            {localeTexts.ConfigFields.AccordianConfig.btnText}
          </Button>
          {isModalOpen ? (
            <MultiConfigModal
              handleMultiConfig={handleMultiConfig}
              multiConfigData={
                installationData?.configuration?.multi_config_keys ?? {}
              }
              closeModal={() => setIsModalOpen(false)}
            />
          ) : (
            // eslint-disable-next-line
            <></>
          )}
        </Accordion>
      </div>
    );
  };

  const renderConfig = () => {
    const renderValue: any = [];
    const accordianFields: any = {};
    const nonAccordianFields: any = {};
    const dashedLine = <Line type="dashed" />;
    Object.entries(configInputFields)?.forEach(([objKey, objValue]: any) => {
      if (objValue?.isAccordianConfig) accordianFields[objKey] = objValue;
      else nonAccordianFields[objKey] = objValue;
    });

    if (Object.keys(accordianFields)?.length) {
      const value = renderAccFields(accordianFields);
      renderValue?.push(value);
      renderValue?.push(dashedLine);
    }

    if (Object.keys(nonAccordianFields)?.length) {
      const value = renderFields(nonAccordianFields);
      renderValue?.push(value);
    }

    const customComponent = rootConfig?.customConfigComponent?.(
      installationData?.configuration,
      installationData?.serverConfiguration,
      handleCustomConfigUpdate
    );
    renderValue?.push(customComponent);

    return renderValue;
  };

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
              <JsonComponent />
            </div>
          </ConfigStateProvider>
        )}
      </div>
    </div>
  );
};

export default ConfigScreen;
