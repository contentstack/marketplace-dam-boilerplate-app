/* eslint-disable @typescript-eslint/no-unused-vars */

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
    org_url: {
      type: "textInputFields",
      labelText: "Bynder Organization URL",
      helpText: "Enter Your Bynder Organization URL",
      placeholderText: "Enter Your Bynder Organization URL",
      instructionText: "Enter Your Bynder Organization URL",
      inputFieldType: "url", // type: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'date' | 'time' | string;
      saveInConfig: true,
      saveInServerConfig: false,
      isAccordianConfig: true,
    },
    language: {
      type: "selectInputFields",
      labelText: "Language",
      helpText: "Select a Language for Bynder GUI",
      placeholderText: "Language",
      // instructionText: "Language",
      options: [
        { label: "English", value: "en_US" },
        { label: "Dutch", value: "nl_NL" },
        { label: "German", value: "de_DE" },
        { label: "French", value: "fr_FR" },
        { label: "Spanish", value: "es_ES" },
      ],
      defaultSelectedOption: "en_US",
      saveInConfig: true,
      saveInServerConfig: false,
      isAccordianConfig: true,
    },
    mode: {
      type: "radioInputFields",
      labelText: "Mode",
      helpText: "Select a Bynder Mode for Bynder GUI",
      instructionText: "Select a Bynder Mode for Bynder GUI",
      options: [
        {
          label: "Multi Select",
          value: "MultiSelect",
        },
        {
          label: "Single Select File",
          value: "SingleSelectFile",
        },
      ],
      defaultSelectedOption: "MultiSelect",
      saveInConfig: true,
      saveInServerConfig: false,
      isAccordianConfig: true,
    },
  });

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
  customWholeJson,
};

export default rootConfigScreen;
