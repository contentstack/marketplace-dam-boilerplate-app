/* eslint-disable */
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
import rootConfig from "../../root_config";
import { TypeOption } from "../../common/types";
/* Import our CSS */
import "./styles.scss";
import AppConfigContext from "../../common/contexts/AppConfigContext";

const ConfigScreen: React.FC = function () {
  // context usage for global states thorughout the component
  const {
    StateContext: { state },
    CustomOptionsContext: { customOptions, setCustomOptions },
    CustomCheckContext: { setIsCustom },
    DamKeysContext: { damKeys, setDamKeys },
    KeyPathContext: { keyPathOptions, setKeyPathOptions },
    RadioInputContext: { radioInputValues, setRadioInputValues },
    SelectInputContext: { selectInputValues, setSelectInputValues },
    CustomFieldsContext: { configInputFields },
    checkConfigFields,
  } = useContext(AppConfigContext);

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
      checkConfigFields({
        configuration: updatedConfig,
        serverConfiguration: updatedServerConfig,
      });
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

  const updateCustomJSON = (e: any) => {
    const check = e?.target?.id !== "wholeJSON";
    setIsCustom(check);
    updateValueFunc("is_custom_json", check, true);
  };

  const updateTypeObj = (list: any[]) => {
    const damKeysTemp: any[] = [];
    list?.forEach((key: any) => damKeysTemp?.push(key?.value));
    setDamKeys(list);
    updateValueFunc("dam_keys", list, true);
  };

  const handleModalValue = (
    modalValueArr: any[],
    mode: string,
    updatedValue: any[]
  ) => {
    const updatedOptions = [
      ...keyPathOptions,
      ...modalValueArr,
      ...updatedValue,
    ];
    setKeyPathOptions(updatedOptions);
    updateValueFunc("keypath_options", updatedOptions, true);
    setCustomOptions([...customOptions, ...modalValueArr, ...updatedValue]);
    if (mode === "createApply") {
      const selectedKeys = [...damKeys, ...updatedValue];
      setDamKeys(selectedKeys);
      updateTypeObj(selectedKeys);
    }
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
              <RadioInputField
                objKey={objKey}
                objValue={objValue}
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
          {rootConfig?.customConfigComponent?.(
            state?.installationData?.configuration,
            state?.installationData?.serverConfiguration,
            handleCustomConfigUpdate
          )}
          <JsonComponent
            handleModalValue={handleModalValue}
            updateCustomJSON={updateCustomJSON}
            updateTypeObj={updateTypeObj}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
