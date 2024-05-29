/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import React from "react";
import CustomComponent from "../CustomComponent";
import {
  TypeCustomConfigUpdateParams,
  TypeRootConfigSreen,
} from "../../common/types";

const configureConfigScreen = () =>
  /* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations
  6. Supported type options are textInputFields, radioInputFields, selectInputFields */
  ({
    textField: {
      type: "textInputFields",
      labelText: "DAM Text Input",
      helpText: "DAM Text Input Helptext",
      placeholderText: "DAM Text Input Placeholder",
      instructionText: "DAM Text Input Instruction Text",
      inputFieldType: "password", // type: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'date' | 'time' | string;
      saveInConfig: false,
      saveInServerConfig: true,
      isAccordianConfig: true,
    },
    selectField: {
      type: "selectInputFields",
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
      isAccordianConfig: true,
    },
    radioField: {
      type: "radioInputFields",
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
      isAccordianConfig: false,
    },
  });

// eslint-disable-next-line
const checkConfigValidity = async (config: any, serverConfig: any) => {
  // return value of the function is object which takes disableSave[type=boolean] and message[type=string]. Assigning "true" to disableSave will disable the button and "false" will enable to button.
  return { disableSave: false, message: "Enter a Valid Config" };
};

const customConfigComponent = (
  config: any,
  serverConfig: any,
  handleCustomConfigUpdate: (
    updateConfigObj: TypeCustomConfigUpdateParams
  ) => void
) => <CustomComponent />;

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

  return {
    customJsonOptions,
    defaultFeilds,
  };
};

const rootConfigScreen: TypeRootConfigSreen = {
  configureConfigScreen,
  checkConfigValidity,
  customConfigComponent,
  customWholeJson,
};

export default rootConfigScreen;
