import { Notification } from "@contentstack/venus-components";
import { TypeOption } from "../types";
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
  Object.assign(target || {}, source);
  return target;
};

const toastMessage = ({ type, text }: any) => {
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

const getOptions = (arr: string[], defaultFeilds?: any[]) =>
  arr?.map((option: string) => ({
    label: option,
    value: option,
    isDisabled: defaultFeilds?.includes(option) ?? false,
  }));

const configRootUtils = () => {
  // custom whole json options from rootconfig
  // eslint-disable-next-line
  let { customJsonOptions, defaultFeilds } =
    rootConfig?.customWholeJson?.() ?? {};
  let customJsonConfigObj: any = {};
  let jsonOptions: any[] = [];

  // create actual options for select field
  if (customJsonOptions?.length && defaultFeilds?.length) {
    jsonOptions = getOptions(customJsonOptions, defaultFeilds);
    defaultFeilds = getOptions(defaultFeilds);
    customJsonConfigObj = {
      is_custom_json: false,
      dam_keys: defaultFeilds,
    };
  }

  return {
    jsonOptions,
    defaultFeilds,
    customJsonConfigObj,
  };
};

const getSaveConfigOptions = (configInputFields: any) => {
  // config objs to be saved in configuration
  const saveInConfig: any = {};
  // config objs to be saved in serverConfiguration
  const saveInServerConfig: any = {};

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

const getDefaultInputValues = (configInputFields: any) => {
  const { saveInConfig, saveInServerConfig } =
    getSaveConfigOptions(configInputFields);

  const radioValuesKeys = [
    ...(Object.keys(saveInConfig)?.filter(
      (value) => saveInConfig?.[value]?.type === "radioInputField"
    ) ?? []),
    ...(Object.keys(saveInServerConfig)?.filter(
      (value) => saveInServerConfig?.[value]?.type === "radioInputField"
    ) ?? []),
  ];

  const selectValuesKeys = [
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
}: any) => {
  const radioValuesObj: any = {};
  const selectValuesObj: any = {};
  Object.keys(savedData)?.forEach((item: string) => {
    let itemKey = item;
    if (item?.includes("$:")) itemKey = item?.split("$:")?.[1];
    if (radioValuesKeys?.includes(itemKey)) {
      radioValuesObj[item] = configInputFields?.[itemKey]?.options?.filter(
        (v: TypeOption) => v?.value === savedData?.[item]
      )[0];
    }
    if (selectValuesKeys?.includes(itemKey)) {
      selectValuesObj[item] = configInputFields?.[itemKey]?.options?.filter(
        (v: TypeOption) => v?.value === savedData?.[item]
      )[0];
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
