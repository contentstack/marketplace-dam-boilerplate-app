/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

import React from "react";
import {
  Configurations,
  Props,
  TypeCustomConfigParams,
  TypeRootConfigSreen,
  TypedefaultOp,
} from "../../common/types";

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
      labelText: "Text input",
      helpText:
        "Add the required input for this configuration. (Max 250 characters.)",
      placeholderText: "Enter a value",
      instructionText: "Enter DAM app value (e.g., API key or URL)",
      inputFieldType: "password", // type: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'date' | 'time' | string;
      saveInConfig: false,
      saveInServerConfig: true,
      isMultiConfig: true,
    },
    selectField: {
      type: "selectInputField",
      labelText: "Select input",
      helpText: "Select a value that matches your DAM setup.",
      placeholderText: "Select a value",
      instructionText:
        "Select a predefined option from your DAM configuration.",
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
      helpText: "Select one option to configure this integration.",
      instructionText: "Select one option to define the app behavior.",
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
    const conditionalDefaults: TypedefaultOp[] = [];

    return conditionalDefaults;
  };

  return {
    customJsonOptions,
    defaultFeilds,
    conditionalFieldExec,
  };
};

const rootConfigScreen: TypeRootConfigSreen = {
  configureConfigScreen,
  customWholeJson,
};

export default rootConfigScreen;
