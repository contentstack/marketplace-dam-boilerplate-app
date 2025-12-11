import { Configurations, Props, TypeOption } from "../types";
import constants from "../constants";
import localeTexts from "../locale/en-us";

const isObject = (value: any) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// function to merge 2 objects
const mergeObjects = (target: any = [], source: any = []) => {
  // Iterate through `source` properties and if an `Object` then
  // set property to merge of `target` and `source` properties
  Object.keys(source)?.forEach((key) => {
    if (isObject(target) && isObject(source)) {
      if (source[key] instanceof Object && key in target)
        Object.assign(source[key], mergeObjects(target[key], source[key]));
    } else Object.assign(source[key], target[key]);
  });

  // Join `target` and modified `source`
  Object.assign(target ?? {}, source);
  return target;
};

const getOptions = (arr: string[], defaultFeilds?: string[]) =>
  arr?.map((option: string) => ({
    label: option,
    value: option,
    isDisabled: defaultFeilds?.includes(option) ?? false,
  }));

const configRootUtils = ({
  customJsonOptions,
  rootConfigDefaultOptions,
}: any) => {
  let defaultFeildsVal = [...rootConfigDefaultOptions];
  let customJsonConfigObj:
    | { is_custom_json: boolean; dam_keys: TypeOption[] }
    | {} = {};
  let jsonOptions: TypeOption[] | [] = [];

  // create actual options for select field
  if (customJsonOptions?.length && rootConfigDefaultOptions?.length) {
    jsonOptions = getOptions(customJsonOptions, rootConfigDefaultOptions);
    defaultFeildsVal = getOptions(
      rootConfigDefaultOptions,
      rootConfigDefaultOptions
    );
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
  let isLegacy = true;

  Object.keys(configInputFields)?.forEach((field: string) => {
    if (configInputFields?.[field]?.saveInConfig)
      saveInConfig[field] = configInputFields[field];
    if (configInputFields?.[field]?.saveInServerConfig)
      saveInServerConfig[field] = configInputFields[field];
    if (configInputFields?.[field]?.isMultiConfig) isLegacy = false;
  });

  return {
    saveInConfig,
    saveInServerConfig,
    isLegacy,
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

const mergeOptions = (
  oldOptions: TypeOption[],
  newOptions: TypeOption[],
  mode?: "remove" | "unset"
): TypeOption[] => {
  const newMap = new Map<string, TypeOption>(
    newOptions?.map((opt) => [opt?.value, opt])
  );
  const resultMap = new Map<string, TypeOption>();
  oldOptions?.forEach((opt) => {
    const existsInNew = newMap?.has(opt?.value);
    if (mode === "remove" && !existsInNew) return;

    if (mode === "unset" && !existsInNew)
      resultMap?.set(opt?.value, { ...opt, isDisabled: false });
    else resultMap?.set(opt?.value, opt);
  });

  newOptions?.forEach((opt) => {
    resultMap?.set(opt?.value, opt);
  });
  return Array.from(resultMap.values());
};

const getModifiedConditionalOptions = (
  installation_data: any,
  conditionalFieldExec: Function,
  rootConfigDefaultOptions: string[]
) => {
  const currentDamKeys: string[] =
    installation_data?.configuration?.dam_keys?.map(
      (keyObj: any) => keyObj?.value
    ) ?? [];
  const defaults = conditionalFieldExec(
    installation_data?.configuration,
    installation_data?.serverConfiguration
  );
  const conditionalDefaults: any[] = Array.isArray(defaults) ? defaults : [];

  const { removeKeys, newOptions } = conditionalDefaults?.reduce(
    (acc: any, { operation, options }: any) => {
      (options ?? [])?.forEach((key: string) => {
        const keyExists = currentDamKeys?.includes(key);
        if (operation === "remove" && keyExists) {
          acc?.removeKeys?.add(key);
        } else if (operation === "add") {
          acc?.newOptions?.push({
            label: key,
            value: key,
            isDisabled: true,
          });
        }
      });
      return acc;
    },
    { removeKeys: new Set<string>(), newOptions: [] as any[] }
  );

  const opt: TypeOption[] = [];
  installation_data?.configuration?.dam_keys?.forEach((keyObj: TypeOption) => {
    if (!removeKeys?.has(keyObj?.value)) {
      opt?.push({
        ...keyObj,
        isDisabled: rootConfigDefaultOptions?.includes(keyObj?.value) ?? false,
      });
    }
  });

  const modifiedOptions = mergeOptions(opt, newOptions);
  return modifiedOptions;
};

/**
 * Validates config rules (branch and locale level configurations)
 * This should be executed before checkConfigValidity in AppConfigProvider
 */
const validateConfigRules = (config: Props, serverConfig: Props) => {
  const configRules = config?.config_rules;

  // List of valid config keys from serverConfig
  const validConfigKeys = new Set<string>(
    Object.keys(serverConfig?.multi_config_keys ?? {})
  );

  if (configRules && typeof configRules === "object") {
    const errors: string[] = [];

    const branchLevelRules: Map<string, string[]> = new Map();

    Object.entries(configRules).forEach(
      ([branchUid, branchObj]: [string, any], index) => {
        if (!branchUid || !branchObj) {
          // eslint-disable-next-line
          errors.push(`Rule ${index + 1}: Branch is required`);
          return;
        }

        const hasBranchLevelConfig =
          branchObj?.config_label &&
          Array.isArray(branchObj?.config_label) &&
          branchObj?.config_label?.length;

        const hasLocaleSpecificRules =
          branchObj?.locales &&
          typeof branchObj?.locales === "object" &&
          Object.keys(branchObj?.locales)?.length;

        // Validate branch-level config labels against available configs
        if (hasBranchLevelConfig && !hasLocaleSpecificRules) {
          const invalidConfigs = branchObj?.config_label?.filter(
            (cfg: string) => !validConfigKeys?.has(cfg)
          );
          if (invalidConfigs.length > 0) {
            errors.push(
              `Branch "${branchUid}" has invalid or deleted config(s): [${invalidConfigs?.join(
                ", "
              )}]. Please remove or update these config rules.`
            );
          }

          // Check if more than one config in branch-level array (invalid - should only be one)
          if (branchObj.config_label.length > 1) {
            errors.push(
              `Branch "${branchUid}" cannot have multiple branch-level configs. ` +
              `Found: [${branchObj?.config_label?.join(", ")}]. ` +
              `Only one branch-level config per branch is allowed.`
            );
          } else if (branchLevelRules?.has(branchUid)) {
            // This shouldn't happen with proper UI prevention, but validate anyway
            const existingConfigs = branchLevelRules?.get(branchUid) || [];
            errors.push(
              `Branch "${branchUid}" cannot have multiple branch-level configs. ` +
              `Existing: [${existingConfigs?.join(
                ", "
              )}], Attempted: [${branchObj?.config_label?.join(", ")}]`
            );
          } else {
            // Valid branch-level rule - store it
            branchLevelRules?.set(branchUid, branchObj?.config_label);
          }
        }

        // If locales exist, check that all locale entries have config_label
        if (hasLocaleSpecificRules) {
          Object.entries(branchObj.locales).forEach(
            ([locale, localeObj]: [string, any]) => {
              if (
                !localeObj?.config_label ||
                !Array.isArray(localeObj?.config_label) ||
                localeObj?.config_label?.length === 0
              ) {
                errors.push(
                  `Locale "${locale}" in branch "${branchUid}" requires a config selection`
                );
              } else {
                // Validate locale config labels
                const invalidLocaleConfigs = localeObj?.config_label?.filter(
                  (cfg: string) => !validConfigKeys?.has(cfg)
                );
                if (invalidLocaleConfigs?.length) {
                  errors.push(
                    `Locale "${locale}" in branch "${branchUid}" has invalid or deleted config(s): [${invalidLocaleConfigs.join(
                      ", "
                    )}]. Please remove or update this config rule.`
                  );
                }
              }
            }
          );
        }
      }
    );

    if (errors.length > 0) {
      return { disableSave: true, message: errors[0] };
    }
  }

  return { disableSave: false, message: "" };
};

// Select component styles for RuleContainer
const customSelectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
  singleValue: (base: any) => ({
    ...base,
    maxWidth: "100%",
    ...constants.textOverflowStyles,
  }),
  multiValue: (base: any) => ({
    ...base,
    maxWidth: "100%",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    maxWidth: "100%",
    ...constants.textOverflowStyles,
  }),
  option: (base: any) => ({
    ...base,
    ...constants.textOverflowStyles,
  }),
};

// Helper function to get select styles for invalid config
const getInvalidConfigSelectStyles = (isInvalid: boolean) => {
  if (!isInvalid) return customSelectStyles;

  const colors = localeTexts?.ConfigFields?.AdvancedConfig?.common?.invalidConfigColors;

  return {
    ...customSelectStyles,
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state?.isFocused ? colors?.borderFocused : colors?.borderUnfocused,
      borderWidth: "1px",
      boxShadow: state?.isFocused ? `0 0 0 2px ${colors?.boxShadow}` : "none",
      "&:hover": {
        borderColor: colors?.borderHover,
      },
    }),
  };
};

const ConfigScreenUtils = {
  mergeObjects,
  getOptions,
  configRootUtils,
  getIntialValueofComponents,
  getDefaultInputValues,
  getSaveConfigOptions,
  getModifiedConditionalOptions,
  mergeOptions,
  validateConfigRules,
  customSelectStyles,
  getInvalidConfigSelectStyles,
};

export default ConfigScreenUtils;
