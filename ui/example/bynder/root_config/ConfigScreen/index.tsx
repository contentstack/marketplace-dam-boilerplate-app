/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

import React from "react";
import {
  Configurations,
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
    org_url: {
      type: "textInputField",
      labelText: "Bynder Organization URL",
      helpText: "Enter Your Bynder Organization URL",
      placeholderText: "Enter Bynder Organization URL",
      inputFieldType: "url",
      saveInServerConfig: false,
      isMultiConfig: false,
    },
    language: {
      type: "selectInputField",
      labelText: "Language",
      helpText: "Select a Language for Bynder GUI",
      placeholderText: "Language",
      options: [
        { label: "English", value: "en_US" },
        { label: "Dutch", value: "nl_NL" },
        { label: "German", value: "de_DE" },
        { label: "French", value: "fr_FR" },
      ],
      defaultSelectedOption: "en_US",
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: false,
    },
    mode: {
      type: "radioInputField",
      labelText: "Mode",
      helpText: "Select a Bynder Mode for Bynder GUI",
      options: [
        {
          label: "Single Select File",
          value: "SingleSelectFile",
        },
        {
          label: "Multi Select",
          value: "MultiSelect",
        },
      ],
      defaultSelectedOption: "MultiSelect",
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: false,
    },
  };
};

const customWholeJson = () => {
  const customJsonOptions: string[] = [
    "id",
    "name",
    "type",
    "url",
    "files",
    "__typename",
    "description",
    "databaseId",
    "createdAt",
    "originalUrl",
    "publishedAt",
    "tags",
    "updatedAt",
    "metaproperties",
    "textMetaproperties",
    "derivatives",
  ];

  const defaultFeilds: string[] = ["id", "name", "type", "url", "files"];

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
