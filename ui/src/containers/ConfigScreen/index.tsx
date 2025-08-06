/* Import React modules */
import React, { useCallback, useContext, useEffect, useState } from "react";
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
  Tooltip,
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
import MultiConfigModal from "./MultiConfigModal";
import AppFailed from "../../components/AppFailed";
import DeleteModal from "../../components/DeleteModal";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";
import {
  CombinedFields,
  Configurations,
  TypeFnHandleCustomConfigProps,
  TypeUpdateTrigger,
  Props,
  TypeOption,
} from "../../common/types";
/* Import our CSS */
import "./styles.scss";

const ConfigScreen: React.FC = function () {
  // default limit for Multi-Config
  const MAX_MULTI_CONFIG_LIMIT = parseInt(
    process.env.REACT_APP_MULTI_CONFIG_LIMIT ?? "10",
    10
  );
  // failed state received from MarketplaceAppContext
  const { appFailed } = useContext(MarketplaceAppContext);
  // context usage for global states thorughout the component
  const { installationData, setInstallationData, checkConfigFields } =
    useContext(AppConfigContext);
  const [customUpdateTrigger, setCustomUpdateTrigger] =
    useState<TypeUpdateTrigger>({} as TypeUpdateTrigger);
  // state for disabling multi-config Add Btn
  const [isAddBtnDisble, setIsAddBtnDisble] = useState<boolean>(false);

  // updating the custom config state
  const handleCustomConfigUpdate = (...args: TypeFnHandleCustomConfigProps) => {
    const [
      configLabel,
      configName,
      configValue,
      saveInConfig,
      saveInServerConfig,
      isMultiConfig,
    ] = args;
    const configToUpdate: TypeUpdateTrigger = { configName, configValue };
    if (configLabel)
      configToUpdate.configName = `${configLabel}$--${configName}`;
    if (saveInConfig) configToUpdate.saveInConfig = saveInConfig;
    if (saveInServerConfig)
      configToUpdate.saveInServerConfig = saveInServerConfig;
    if (isMultiConfig) configToUpdate.isMultiConfig = isMultiConfig;
    setCustomUpdateTrigger(configToUpdate);
  };

  // entire configuration object returned from configureConfigScreen
  const configInputFields: Configurations = rootConfig?.configureConfigScreen?.(
    {
      config: installationData?.configuration,
      serverConfig: installationData?.serverConfiguration,
      handleCustomConfigUpdate,
    }
  );

  // state for rendering multi-config name modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // default multiconfig key
  const [defaultKey, setDefaultKey] = React.useState<string>();

  const handleDefaultConfigFn = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { checked: boolean } },
    acckey: string
  ) => {
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
    const multiConfigKeys = installationData?.configuration?.multi_config_keys;

    const defaultLabel =
      installationData?.configuration?.default_multi_config_key ??
      (multiConfigKeys && "legacy_config" in multiConfigKeys
        ? "legacy_config"
        : undefined);
    if (defaultLabel) {
      handleDefaultConfigFn({ target: { checked: true } }, defaultLabel);
    }
  }, []);

  const filterFieldsForMultiConfig = () => {
    const accConfigFields: Configurations = {};
    const accServerFields: Configurations = {};
    Object.entries(configInputFields)?.forEach(
      ([fieldKey, fieldValue]: [string, CombinedFields]) => {
        if (fieldValue?.isMultiConfig) {
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
    async (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | { target: { name: string; value: any } },
      inConfig?: boolean,
      inServerConfig?: boolean,
      isMultiConfig?: boolean
    ) => {
      const { name: fieldName, value } = e?.target ?? {};
      let fieldValue = value;
      if (typeof fieldValue === "string") {
        fieldValue = fieldValue?.trim();
      }

      const updatedConfig = installationData?.configuration ?? {};
      const updatedServerConfig = installationData?.serverConfiguration ?? {};

      const descructValue = fieldName?.split("$--");
      let multiConfigName: string | undefined = descructValue?.[0];
      let configFieldName: string | undefined = descructValue?.[1];

      if (descructValue?.length === 1) {
        multiConfigName = undefined;
        configFieldName = descructValue?.[0];
      }

      if (inConfig !== undefined && inServerConfig !== undefined) {
        multiConfigName = undefined;
        configFieldName = fieldName;
      }

      if (inConfig || configInputFields?.[configFieldName]?.saveInConfig) {
        if (
          (inConfig && isMultiConfig && multiConfigName) ||
          (configInputFields?.[configFieldName]?.isMultiConfig &&
            multiConfigName)
        ) {
          updatedConfig.multi_config_keys[multiConfigName][configFieldName] =
            fieldValue;
        } else {
          updatedConfig[configFieldName] = fieldValue;
        }
      }

      if (
        inServerConfig ||
        configInputFields?.[configFieldName]?.saveInServerConfig
      ) {
        if (
          (inServerConfig && isMultiConfig && multiConfigName) ||
          (configInputFields?.[configFieldName]?.isMultiConfig &&
            multiConfigName)
        ) {
          updatedServerConfig.multi_config_keys[multiConfigName][
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

  const handleMultiConfigLimit = (multiConfigObj: Props) => {
    if (Object.keys(multiConfigObj ?? {})?.length >= MAX_MULTI_CONFIG_LIMIT) {
      setIsAddBtnDisble(true);
    } else {
      setIsAddBtnDisble(false);
    }
  };

  const handleMultiConfig = (newConfigName: string) => {
    const { accConfigFields, accServerFields } = filterFieldsForMultiConfig();

    const configFieldObj: Record<string, string | TypeOption> = {};
    Object.entries(accConfigFields)?.forEach(
      ([key, value]: [string, CombinedFields]) => {
        let finalValue = "";
        if (value?.type !== "textInputField") {
          finalValue = value?.defaultSelectedOption ?? "";
        }
        configFieldObj[key] = finalValue;
      }
    );

    const serverConfigFieldObj: Record<string, string | TypeOption> = {};
    Object.entries(accServerFields)?.forEach(
      ([key, value]: [string, CombinedFields]) => {
        let finalValue = "";
        if (value?.type !== "textInputField") {
          finalValue = value?.defaultSelectedOption ?? "";
        }
        serverConfigFieldObj[key] = finalValue;
      }
    );

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

    const serverConfigInstallationObj = {
      ...installationData?.serverConfiguration,
      multi_config_keys: {
        ...installationData?.serverConfiguration?.multi_config_keys,
        [newConfigName]: serverConfigFieldObj,
      },
    };

    handleMultiConfigLimit(
      configInstallationObj?.multi_config_keys ??
        serverConfigInstallationObj?.multi_config_keys
    );

    setInstallationData({
      ...installationData,
      configuration: {
        ...configInstallationObj,
      },
      serverConfiguration: {
        ...serverConfigInstallationObj,
      },
    });
  };

  // converting the config in proper format for updateConfig
  const updateValueFunc = (
    configName: string,
    configValue: any,
    inConfig?: boolean,
    inServerConfig?: boolean,
    isMultiConfig?: boolean
  ) => {
    const value: { target: { name: string; value: any } } = {
      target: { name: configName, value: configValue },
    };
    updateConfig(value, inConfig, inServerConfig, isMultiConfig);
  };

  useEffect(() => {
    if (Object.keys(customUpdateTrigger)?.length) {
      const {
        configName,
        configValue,
        saveInConfig,
        saveInServerConfig,
        isMultiConfig,
      } = customUpdateTrigger;
      updateValueFunc(
        configName,
        configValue,
        saveInConfig,
        saveInServerConfig,
        isMultiConfig
      );
    }
  }, [customUpdateTrigger]);

  // return render jsx for the config object provided
  const renderFields = (nonAccordianFields: Configurations, acckey?: string) =>
    Object.entries(nonAccordianFields)?.map(([objKey, objValue]) => {
      switch (objValue?.type) {
        case "textInputField":
          return (
            <div key={objKey}>
              <TextInputField
                objKey={objKey}
                objValue={objValue}
                updateConfig={updateConfig}
                acckey={acckey}
              />
              {!acckey && <Line type="dashed" />}
            </div>
          );
        case "radioInputField":
          return (
            <div key={objKey}>
              <RadioInputField
                objKey={objKey}
                objValue={objValue}
                acckey={acckey}
              />
              {!acckey && <Line type="dashed" />}
            </div>
          );
        case "selectInputField":
          return (
            <div key={objKey}>
              <SelectInputField
                objKey={objKey}
                objValue={objValue}
                acckey={acckey}
              />
              {!acckey && <Line type="dashed" />}
            </div>
          );
        case "customInputField":
          if (objValue?.component) {
            return (
              <div className="custom-input-field">
                {objValue?.component(acckey ?? "")}
              </div>
            );
          }
          // eslint-disable-next-line
          return <></>;
        default:
          // eslint-disable-next-line
          return <></>;
      }
    });

  const handleDeleteConfirmation = (configKey: string) => {
    const multiConfigData =
      installationData?.configuration?.multi_config_keys ?? {};
    const serverMultiConfigData =
      installationData?.serverConfiguration?.multi_config_keys ?? {};
    let defaultConfig =
      installationData?.configuration?.default_multi_config_key ?? "";

    delete multiConfigData[configKey];
    delete serverMultiConfigData[configKey];

    if (defaultConfig === configKey) {
      defaultConfig = "";
      setDefaultKey(defaultConfig);
    }

    handleMultiConfigLimit(multiConfigData ?? serverMultiConfigData);

    const finaldata = {
      configuration: {
        ...installationData?.configuration,
        multi_config_keys: { ...multiConfigData },
        default_multi_config_key: defaultConfig ?? "",
      },
      serverConfiguration: {
        ...installationData?.serverConfiguration,
        multi_config_keys: { ...serverMultiConfigData },
      },
    };

    checkConfigFields(finaldata);
    setInstallationData({
      ...installationData,
      ...finaldata,
    });
  };

  const handleClickDeleteModal = (configKey: string) =>
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

  const accordianInstance = (
    acckey: string,
    accordianFields: Configurations
  ) => (
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
            onClick={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDefaultConfigFn(e, acckey)
            }
            checked={defaultKey === acckey}
          />
        </Field>
      </Accordion>
    </div>
  );

  const renderAccFields = (accordianFields: Configurations) => {
    const accordianKeys: string[] = Object.keys(
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
          {accordianKeys?.map(
            (acckey: string) =>
              acckey && accordianInstance(acckey, accordianFields)
          )}
          <Tooltip
            content="Maximum Limit Reached"
            position="right"
            disabled={!isAddBtnDisble}
          >
            <Button
              className="multi-config-button"
              buttonType="secondary"
              icon={localeTexts.Icons.addPlusBold}
              size="medium"
              onClick={() => setIsModalOpen(true)}
              disabled={isAddBtnDisble}
            >
              {localeTexts.ConfigFields.AccordianConfig.btnText}
            </Button>
          </Tooltip>

          {isModalOpen ? (
            <MultiConfigModal
              handleMultiConfig={handleMultiConfig}
              multiConfigData={
                installationData?.configuration?.multi_config_keys ?? {}
              }
              closeModal={() => setIsModalOpen(false)}
            />
          ) : null}
        </Accordion>
      </div>
    );
  };

  const renderConfig = () => {
    const renderValue: React.ReactElement[] = [];
    const accordianFields: Configurations = {};
    const nonAccordianFields: Configurations = {};
    const dashedLine = <Line type="dashed" />;
    Object.entries(configInputFields)?.forEach(
      ([objKey, objValue]: [string, CombinedFields]) => {
        if (objValue?.isMultiConfig) accordianFields[objKey] = objValue;
        else nonAccordianFields[objKey] = objValue;
      }
    );

    if (Object.keys(accordianFields)?.length) {
      const value: React.ReactElement = renderAccFields(accordianFields);
      renderValue?.push(value);
      renderValue?.push(dashedLine);
    }

    if (Object.keys(nonAccordianFields)?.length) {
      const value: React.ReactElement[] = renderFields(nonAccordianFields);
      renderValue?.push(...(value ?? []));
    }

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
