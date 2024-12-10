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
  Select,
  ToggleSwitch,
  Tooltip,
  FieldLabel,
  Help,
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
  BranchOption,
  TypeMultiBranch,
} from "../../common/types";
import ConfigScreenUtils from "../../common/utils/ConfigScreenUtils";
/* Import our CSS */
import "./styles.scss";

const ConfigScreen: React.FC = function () {
  // default limit for Multi-Config
  const MAX_MULTI_CONFIG_LIMIT = parseInt(
    process.env.REACT_APP_MULTI_CONFIG_LIMIT ?? "10",
    10
  );
  // failed state received from MarketplaceAppContext
  const { appFailed, appSdk } = useContext(MarketplaceAppContext);
  // context usage for global states thorughout the component
  const { installationData, setInstallationData, checkConfigFields } =
    useContext(AppConfigContext);
  // state to handle updatation of field of "type = customInputField"
  const [customUpdateTrigger, setCustomUpdateTrigger] =
    useState<TypeUpdateTrigger>({} as TypeUpdateTrigger);
  // state for disabling multi-config Add Btn
  const [isAddBtnDisble, setIsAddBtnDisble] = useState<boolean>(false);
  // state for multiconfig branch options
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);
  // state to handle branch checkbox
  const [branchChkboxState, setBranchChkboxState] = useState<any>({});
  // state for multiconfig branch support values
  const [selectedBranchOptions, setSelectedBranchOptions] =
    React.useState<TypeMultiBranch>({});
  // state for selected branches
  const [activeBranches, setActiveBranches] = useState<string[]>([]);
  // state for rendering multi-config name modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // default multiconfig key
  const [defaultKey, setDefaultKey] = React.useState<string>();

  // updating the custom config state
  const handleCustomConfigUpdate = (...args: TypeFnHandleCustomConfigProps) => {
    const [
      configLabel,
      configName,
      configValue,
      saveInConfig,
      saveInServerConfig,
    ] = args;
    const configToUpdate: TypeUpdateTrigger = { configName, configValue };
    if (configLabel)
      configToUpdate.configName = `${configLabel}$--${configName}`;
    if (saveInConfig) configToUpdate.saveInConfig = saveInConfig;
    if (saveInServerConfig)
      configToUpdate.saveInServerConfig = saveInServerConfig;
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

  const handleDefaultConfigFn = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { checked: boolean } },
    acckey: string
  ) => {
    const target = e?.target as HTMLInputElement;
    let currentKey = "";
    if (target?.checked) {
      currentKey = acckey;
    }
    setDefaultKey(currentKey);
    setInstallationData({
      ...installationData,
      configuration: {
        ...installationData?.configuration,
        default_multi_config_key: currentKey,
      },
    });
  };

  useEffect(() => {
    const fn = async () => {
      if (appSdk) {
        const allBranches = appSdk?.stack?.getAllBranches();
        await setBranchOptions(
          allBranches?.map(({ uid, api_key }: any) => ({
            label: uid,
            value: uid,
            api_key,
          }))
        );
        const defaultLabel =
          installationData?.configuration?.default_multi_config_key ??
          "legacy_config";
        handleDefaultConfigFn({ target: { checked: true } }, defaultLabel);
        const multiConfigBranchObj: Record<string, string[]> =
          installationData?.configuration?.multi_config_branches ?? {};
        const branchCheckBox: Record<string, boolean> = {};
        Object.values(multiConfigBranchObj)?.forEach((value: string[]) => {
          branchCheckBox[value?.[0]] = true;
        });
        setBranchChkboxState(branchCheckBox);
      }
    };
    fn();
  }, []);

  useEffect(() => {
    const multiConfigBranchObj: Record<string, string[]> =
      installationData?.configuration?.multi_config_branches;
    if (multiConfigBranchObj) {
      const branchOptionsState =
        ConfigScreenUtils.generateSelectedBranchOptions(
          multiConfigBranchObj,
          branchOptions
        );
      setSelectedBranchOptions(branchOptionsState);
      setActiveBranches(Object.keys(multiConfigBranchObj) ?? []);
    }
  }, [installationData]);
  const handleSelectedBranchOptions = (
    values: BranchOption[],
    acckey: string
  ) => {
    setSelectedBranchOptions({ ...selectedBranchOptions, [acckey]: values });
    const multibranchValue = ConfigScreenUtils.generateMultiBranchConfig({
      ...selectedBranchOptions,
      [acckey]: values,
    });
    const updatedData = {
      ...installationData,
      configuration: {
        ...installationData?.configuration,
        multi_config_branches: multibranchValue,
      },
    };
    setInstallationData(updatedData);
  };
  const generateBranchOptions = (configLabel: string) => {
    const selectedOptions = selectedBranchOptions?.[configLabel]?.map(
      (option: BranchOption) => option?.value
    );
    return branchOptions?.map((option: BranchOption) => ({
      ...option,
      isDisabled:
        activeBranches?.includes(option?.value) &&
        !selectedOptions?.includes(option?.value),
    }));
  };
  const handleMultiConfigBranchChkbox = (
    e: React.MouseEvent<HTMLInputElement>,
    acckey: string
  ) => {
    const target = e?.target as HTMLInputElement;
    if (target?.checked) {
      setBranchChkboxState({ ...branchChkboxState, [acckey]: true });
      setSelectedBranchOptions({ ...selectedBranchOptions, [acckey]: [] });
      handleSelectedBranchOptions([], acckey);
      handleDefaultConfigFn({ target: { checked: false } }, "");
    } else {
      setBranchChkboxState({ ...branchChkboxState, [acckey]: false });
      const tempMultiBranch = { ...selectedBranchOptions };
      const branchsToRemove = tempMultiBranch?.[acckey];
      const usedBranches = [...activeBranches];
      const updatedActiveBranches = usedBranches?.filter(
        (branch) =>
          !branchsToRemove?.some((toRemove) => toRemove?.value === branch)
      );
      setActiveBranches(updatedActiveBranches);
      handleSelectedBranchOptions([], acckey);
    }
  };

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
      inServerConfig?: boolean
    ) => {
      const { name: fieldName, value } = e?.target ?? {};
      let fieldValue = value;
      if (typeof fieldValue === "string") {
        fieldValue = fieldValue?.trim();
      }

      const updatedConfig = installationData?.configuration ?? {};
      const updatedServerConfig = installationData?.serverConfiguration ?? {};

      const descructValue = fieldName?.split("$--");
      let mutiConfigName: string | undefined = descructValue?.[0];
      let configFieldName: string | undefined = descructValue?.[1];

      if (descructValue?.length === 1) {
        mutiConfigName = undefined;
        configFieldName = descructValue?.[0];
      }

      if (inConfig !== undefined && inServerConfig !== undefined) {
        mutiConfigName = undefined;
        configFieldName = fieldName;
      }

      if (inConfig || configInputFields?.[configFieldName]?.saveInConfig) {
        if (
          configInputFields?.[configFieldName]?.isMultiConfig &&
          mutiConfigName
        ) {
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
        if (
          configInputFields?.[configFieldName]?.isMultiConfig &&
          mutiConfigName
        ) {
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
      branchOptions,
      setInstallationData,
      installationData,
      installationData?.configuration,
      installationData?.serverConfiguration,
    ]
  );

  const handleMultiConfigLimit = (multiConfigObj: Props) => {
    if (Object.keys(multiConfigObj ?? {})?.length === MAX_MULTI_CONFIG_LIMIT) {
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
    inServerConfig?: boolean
  ) => {
    const value: { target: { name: string; value: any } } = {
      target: { name: configName, value: configValue },
    };
    updateConfig(value, inConfig, inServerConfig);
  };

  useEffect(() => {
    if (Object.keys(customUpdateTrigger)?.length) {
      const {
        configName,
        configValue,
        saveInConfig = true,
        saveInServerConfig = false,
      } = customUpdateTrigger;
      updateValueFunc(
        configName,
        configValue,
        saveInConfig,
        saveInServerConfig
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
      defaultConfig = Object.keys(multiConfigData)?.[0];
      setDefaultKey(defaultConfig);
    }

    handleMultiConfigLimit(multiConfigData ?? serverMultiConfigData);

    setInstallationData({
      ...installationData,
      configuration: {
        ...installationData?.configuration,
        multi_config_keys: { ...multiConfigData },
        default_multi_config_key: defaultConfig ?? "",
      },
      serverConfiguration: {
        ...installationData?.serverConfiguration,
        multi_config_keys: { ...serverMultiConfigData },
      },
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
        <Field className="multi-config-branch-checkbox">
          <div className="multi-config-toggle">
            <Tooltip
              content={
                localeTexts.ConfigFields.AccordianConfig.tooltip.branchsupport
              }
              position="right"
              disabled={
                !(defaultKey === acckey && !branchChkboxState?.[acckey])
              }
            >
              <>
                <FieldLabel
                  htmlFor="toggleSwitch"
                  requiredText="(optional)"
                  className={`${
                    !branchChkboxState?.[acckey]
                      ? "Label--color--secondary"
                      : ""
                  }`}
                  disabled={
                    defaultKey === acckey && !branchChkboxState?.[acckey]
                  }
                >
                  {localeTexts.ConfigFields.AccordianConfig.branchBoxText}
                  <span className=" FieldLabel__required-text ml-8">
                    (optional)
                  </span>
                  <Help
                    text={localeTexts.ConfigFields.AccordianConfig.helptext}
                  />
                </FieldLabel>
                <ToggleSwitch
                  labelColor="primary"
                  labelPosition="left"
                  onChange={(e: any) =>
                    handleMultiConfigBranchChkbox(e, acckey)
                  }
                  checked={branchChkboxState?.[acckey]}
                  disabled={
                    defaultKey === acckey && !branchChkboxState?.[acckey]
                  }
                />
              </>
            </Tooltip>
          </div>
          {branchChkboxState?.[acckey] && (
            <Select
              options={generateBranchOptions(acckey)}
              onChange={(values: BranchOption[]) =>
                handleSelectedBranchOptions(values, acckey)
              }
              value={selectedBranchOptions?.[acckey] ?? []}
              isClearable
              isMulti
              isSearchable
              version="v2"
            />
          )}
        </Field>
        <Field className="multi-config-default-checkbox">
          <Tooltip
            content={
              localeTexts.ConfigFields.AccordianConfig.tooltip.setasdefault
            }
            position="right"
            disabled={!branchChkboxState?.[acckey]}
          >
            <Checkbox
              label={localeTexts.ConfigFields.AccordianConfig.checkboxText}
              onClick={(e: any) => handleDefaultConfigFn(e, acckey)}
              checked={defaultKey === acckey && !branchChkboxState?.[acckey]}
              disabled={branchChkboxState?.[acckey]}
            />
          </Tooltip>
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
