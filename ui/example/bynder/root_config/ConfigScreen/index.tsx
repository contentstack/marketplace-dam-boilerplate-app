/* eslint-disable @typescript-eslint/no-unused-vars */
import { TypeRootConfigSreen } from "../../common/types";

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
      placeholderText: "Enter Bynder Organization URL",
      inputFieldType: "url",
      saveInConfig: true,
      saveInServerConfig: false,
      isAccordianConfig: true,
    },
    language: {
      type: "selectInputFields",
      labelText: "Language",
      helpText: "Select a Language for Bynder GUI",
      placeholderText: "Language",
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
      isAccordianConfig: true,
    },
  });

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
