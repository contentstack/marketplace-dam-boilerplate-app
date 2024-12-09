import { Notification } from "@contentstack/venus-components";
import { Configurations, Props, TypeOption } from "../types";
import rootConfig from "../../root_config";

// function to merge 2 objects
const mergeObjects = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` then
  // set property to merge of `target` and `source` properties
  Object.keys(source)?.forEach((key) => {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeObjects(target[key], source[key]));
    }
  });

  // Join `target` and modified `source`
  Object.assign(target ?? {}, source);
  return target;
};

const toastMessage = ({ type, text }: Props) => {
  Notification({
    notificationContent: {
      text,
    },
    notifyProps: {
      hideProgressBar: true,
      className: "modal_toast_message",
    },
    type,
  });
};

const getOptions = (arr: string[], defaultFeilds?: string[]) =>
  arr?.map((option: string) => ({
    label: option,
    value: option,
    isDisabled: defaultFeilds?.includes(option) ?? false,
  }));

const configRootUtils = () => {
  // custom whole json options from rootconfig
  const { customJsonOptions, defaultFeilds } =
    rootConfig?.customWholeJson?.() ?? {};
  let defaultFeildsVal = [...defaultFeilds];
  let customJsonConfigObj:
    | { is_custom_json: boolean; dam_keys: TypeOption[] }
    | {} = {};
  let jsonOptions: TypeOption[] | [] = [];

  // create actual options for select field
  if (customJsonOptions?.length && defaultFeilds?.length) {
    jsonOptions = getOptions(customJsonOptions, defaultFeilds);
    defaultFeildsVal = getOptions(defaultFeilds);
    customJsonConfigObj = {
      is_custom_json: false,
      dam_keys: defaultFeildsVal,
    };
  }

  return {
    jsonOptions,
    defaultFeilds: defaultFeildsVal,
    customJsonConfigObj,
  };
};

const getSaveConfigOptions = (configInputFields: Configurations) => {
  // config objs to be saved in configuration
  const saveInConfig: Configurations = {};
  // config objs to be saved in serverConfiguration
  const saveInServerConfig: Configurations = {};

  Object.keys(configInputFields)?.forEach((field: string) => {
    if (configInputFields?.[field]?.saveInConfig)
      saveInConfig[field] = configInputFields[field];
    if (configInputFields?.[field]?.saveInServerConfig)
      saveInServerConfig[field] = configInputFields[field];
  });

  return {
    saveInConfig,
    saveInServerConfig,
  };
};

const getDefaultInputValues = (configInputFields: Configurations) => {
  const { saveInConfig, saveInServerConfig } =
    getSaveConfigOptions(configInputFields);

  const radioValuesKeys: string[] = [
    ...(Object.keys(saveInConfig)?.filter(
      (value) => saveInConfig?.[value]?.type === "radioInputField"
    ) ?? []),
    ...(Object.keys(saveInServerConfig)?.filter(
      (value) => saveInServerConfig?.[value]?.type === "radioInputField"
    ) ?? []),
  ];

  const selectValuesKeys: string[] = [
    ...(Object.keys(saveInConfig)?.filter(
      (value) => saveInConfig?.[value]?.type === "selectInputField"
    ) ?? []),
    ...(Object.keys(saveInServerConfig)?.filter(
      (value) => saveInServerConfig?.[value]?.type === "selectInputField"
    ) ?? []),
  ];

  return {
    radioValuesKeys,
    selectValuesKeys,
  };
};

const getIntialValueofComponents = ({
  savedData,
  radioValuesKeys,
  selectValuesKeys,
  configInputFields,
}: {
  savedData: Props;
  radioValuesKeys: string[];
  selectValuesKeys: string[];
  configInputFields: Configurations;
}) => {
  const radioValuesObj: Record<string, TypeOption> = {};
  const selectValuesObj: Record<string, TypeOption> = {};
  Object.keys(savedData)?.forEach((item: string) => {
    let itemKey = item;
    if (item?.includes("$:")) itemKey = item?.split("$:")?.[1];
    if (radioValuesKeys?.includes(itemKey)) {
      const radioValue = configInputFields?.[itemKey]?.options?.filter(
        (v: TypeOption) => v?.value === savedData?.[item]
      )?.[0];
      if (radioValue) radioValuesObj[item] = radioValue;
    }
    if (selectValuesKeys?.includes(itemKey)) {
      const selectValue = configInputFields?.[itemKey]?.options?.filter(
        (v: TypeOption) => v?.value === savedData?.[item]
      )?.[0];
      if (selectValue) selectValuesObj[item] = selectValue;
    }
  });

  return { radioValuesObj, selectValuesObj };
};

const ConfigScreenUtils = {
  mergeObjects,
  toastMessage,
  getOptions,
  configRootUtils,
  getIntialValueofComponents,
  getDefaultInputValues,
  getSaveConfigOptions,
};

export default ConfigScreenUtils;
