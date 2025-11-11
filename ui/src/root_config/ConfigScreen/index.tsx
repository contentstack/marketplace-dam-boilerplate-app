/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import React from "react";
import {
  Configurations,
  Props,
  TypeCustomConfigParams,
  TypeRootConfigSreen,
  TypedefaultOp,
} from "../../common/types";
import CustomConfig from "../Components/CustomConfig";

const configureConfigScreen = (
  params?: TypeCustomConfigParams
): Configurations => {
  /* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations
  6. Supported type options are textInputField, radioInputField, selectInputField and customInputField */
  return {
    textField: {
      type: "textInputField",
      labelText: "DAM Text Input",
      helpText: "DAM Text Input Helptext",
      placeholderText: "DAM Text Input Placeholder",
      instructionText: "DAM Text Input Instruction Text",
      inputFieldType: "password", // type: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'date' | 'time' | string;
      saveInConfig: false,
      saveInServerConfig: true,
      isMultiConfig: true,
    },
    selectField: {
      type: "selectInputField",
      labelText: "DAM Select Input",
      helpText: "DAM Select Input Helptext",
      placeholderText: "DAM Select Input Placeholder",
      instructionText: "DAM Select Input Instruction Text",
      options: [
        { label: "option 1", value: "option1" },
        { label: "option 2", value: "option2" },
        { label: "option 3", value: "option3" },
        { label: "option 4", value: "option4" },
        { label: "option 5", value: "option5" },
      ],
      defaultSelectedOption: "option5",
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: true,
    },
    radioField: {
      type: "radioInputField",
      labelText: "DAM Radio Input",
      helpText: "DAM Radio Input Helptext",
      instructionText: "DAM Radio Input Instruction Text",
      options: [
        {
          label: "Option 1",
          value: "Option 1",
        },
        {
          label: "Option 2",
          value: "Option 2",
        },
      ],
      defaultSelectedOption: "Option 1",
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: false,
    },
    customField: {
      type: "customInputField",
      component: (currentConfigLabel: string) => (
        <CustomConfig
          customConfig={params}
          currentConfigLabel={currentConfigLabel}
        />
      ),
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: true,
    },
  };
};

const customWholeJson = () => {
  const customJsonOptions: string[] = [
    "option 1",
    "option 2",
    "option 3",
    "option 4",
    "option 5",
    "option 6",
    "option 7",
    "option 8",
    "option 9",
    "option 10",
  ];

  const defaultFeilds: string[] = ["option 1", "option 2", "option 3"];

  const conditionalFieldExec = (config: any, serverConfig: any) => {
    const options = ["option 10"];
    const defaultOpObj: TypedefaultOp = { operation: "add", options };
    const conditionalDefaults: TypedefaultOp[] = [];

    // if (option add condition) {
    //   conditionalDefaults?.push(defaultOpObj);
    // } else { // option remove condition
    //   defaultOpObj.operation = "remove";
    //   conditionalDefaults?.push(defaultOpObj);
    // }

    return conditionalDefaults;
  };

  return {
    customJsonOptions,
    defaultFeilds,
    conditionalFieldExec,
  };
};

const checkConfigValidity = async (config: Props, serverConfig: Props) => {
  // return value of the function is object which takes disableSave[type=boolean] and message[type=string]. Assigning "true" to disableSave will disable the button and "false" will enable to button.
  const configRules = config?.config_rules;

  // List of valid config keys from serverConfig
  const validConfigKeys = new Set<string>(
    Object.keys(serverConfig?.multi_config_keys ?? {})
  );

  if (configRules && typeof configRules === 'object') {
    const errors: string[] = [];

    const branchLevelRules: Map<string, string[]> = new Map();

    Object.entries(configRules).forEach(([branchUid, branchObj]: [string, any], index) => {
      if (!branchUid || !branchObj) {
        errors.push(`Rule ${index + 1}: Branch is required`);
        return;
      }

      const hasBranchLevelConfig = branchObj?.config_label &&
        Array.isArray(branchObj.config_label) &&
        branchObj.config_label.length > 0;

      const hasLocaleSpecificRules = branchObj?.locales &&
        typeof branchObj.locales === 'object' &&
        Object.keys(branchObj.locales).length > 0;

      // Validate branch-level config labels against available configs
      if (hasBranchLevelConfig && !hasLocaleSpecificRules) {
        const invalidConfigs = branchObj.config_label.filter(
          (cfg: string) => !validConfigKeys.has(cfg)
        );
        if (invalidConfigs.length > 0) {
          errors.push(
            `Branch "${branchUid}" has invalid or deleted config(s): [${invalidConfigs.join(', ')}]. ` +
            `Please remove or update these config rules.`
          );
        }

        // Check if more than one config in branch-level array (invalid - should only be one)
        if (branchObj.config_label.length > 1) {
          errors.push(
            `Branch "${branchUid}" cannot have multiple branch-level configs. ` +
            `Found: [${branchObj.config_label.join(', ')}]. ` +
            `Only one branch-level config per branch is allowed.`
          );
        } else if (branchLevelRules.has(branchUid)) {
          // This shouldn't happen with proper UI prevention, but validate anyway
          const existingConfigs = branchLevelRules.get(branchUid) || [];
          errors.push(
            `Branch "${branchUid}" cannot have multiple branch-level configs. ` +
            `Existing: [${existingConfigs.join(', ')}], Attempted: [${branchObj.config_label.join(', ')}]`
          );
        } else {
          // Valid branch-level rule - store it
          branchLevelRules.set(branchUid, branchObj.config_label);
        }
      }

      // If locales exist, check that all locale entries have config_label 
      if (hasLocaleSpecificRules) {
        Object.entries(branchObj.locales).forEach(([locale, localeObj]: [string, any]) => {
          if (!localeObj?.config_label || !Array.isArray(localeObj.config_label) || localeObj.config_label.length === 0) {
            errors.push(`Locale "${locale}" in branch "${branchUid}" requires a config selection`);
          } else {
            // Validate locale config labels
            const invalidLocaleConfigs = localeObj.config_label.filter(
              (cfg: string) => !validConfigKeys.has(cfg)
            );
            if (invalidLocaleConfigs.length > 0) {
              errors.push(
                `Locale "${locale}" in branch "${branchUid}" has invalid or deleted config(s): [${invalidLocaleConfigs.join(', ')}]. ` +
                `Please remove or update this config rule.`
              );
            }
          }
        });
      }
    });

    if (errors.length > 0) {
      return { disableSave: true, message: errors[0] };
    }
  }

  return { disableSave: false, message: "Enter a Valid Config" };
};

const rootConfigScreen: TypeRootConfigSreen = {
  configureConfigScreen,
  customWholeJson,
  checkConfigValidity,
};

export default rootConfigScreen;
