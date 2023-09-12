/* eslint-disable */
import React from "react";
import { TypeAsset, TypeSelectorContainer } from "../common/types";
import CustomComponent from "./CustomComponent";
import Logo from "../common/asset/logo.svg";
import utils from "./utils";

// ####### ENVIRONMENT VALUES #######
const damEnv = {
  IS_DAM_SCRIPT: true,
  DAM_APP_NAME: "DAM",
  CONFIG_FIELDS: [],
  ASSET_UNIQUE_ID: "id",
  DAM_SCRIPT_URL: "",
  SELECTOR_PAGE_LOGO: Logo,
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
};

const configureConfigScreen = () => {
  /* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations
  6. Supported type options are textInputFields, radioInputFields, selectInputFields */

  return {
    textField: {
      type: "textInputFields",
      labelText: "DAM Text Input",
      helpText: "DAM Text Input Helptext",
      placeholderText: "DAM Text Input Placeholder",
      instructionText: "DAM Text Input Instruction Text",
      saveInConfig: false,
      saveInServerConfig: true,
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
    },
    radioField: {
      type: "radioInputFields",
      labelText: "DAM Radio Input",
      helpText: "DAM Radio Input Helptext",
      instructionText: "DAM Radio Input Instruction Text",
      options: [
        {
          label: "Single Select",
          value: "SingleSelect",
        },
        {
          label: "Multi Select",
          value: "MultiSelect",
        },
      ],
      defaultSelectedOption: "MultiSelect",
      saveInConfig: true,
      saveInServerConfig: false,
    },
  };
};

const customConfig = (
  config: any,
  serverConfig: any,
  handleCustomConfigUpdate: Function
) => {
  return <CustomComponent />;
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

  return {
    customJsonOptions,
    defaultFeilds,
  };
};

// ####### CUSTOM FIELD #######
const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    return {
      id: "",
      type: "",
      name: "",
      width: "",
      height: "",
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl: "",
      previewUrl: "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: "", // add this parameter if you want "Open In DAM" in tooltip action items
    };
  });
  return filterAssetArray;
};

const handleConfigtoSelectorPage = (
  config: any,
  contentTypeConfig: any,
  currentLocale: string
) => {
  return utils.getSelectorConfig({
    keyArr: damEnv?.CONFIG_FIELDS,
    appConfig: config,
    customConfig: contentTypeConfig,
    currentLocale,
  });
};

const getSelectorWindowUrl = (config: any, contentTypeConfig: any) => {
  return ""; // return url to be opened as selector page
};

const handleSelectorPageData = (event: any) => {
  // "event" is the event object which is received from your opened selector page
  return []; // return array of asset objects which are selected
};

const handleSelectorWindow = (
  config: any,
  contentTypeConfig: any,
  setError: Function
) => {
  /* code logic to open the DAM selector page */
};

// ####### SELECTOR PAGE #######
/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    CompactView: any; // chnage according to DAM application
  }
}

const openComptactView = (
  config: any,
  selectedIds: string[],
  onSuccess: Function,
  onCancel: Function,
  { containerRef, containerClass, containerId }: TypeSelectorContainer,
  setError: Function
) => {
  /* Implement your DAM compact view implementation here
  declare your selected DAM variable in the above scope and call the open function from DAM compact view on that variable
  use onSuccess function to send your data to custom field [onSuccess accepts an array of asset objects]  */
};

// If there is no script then provide a custom component here
const customComponent = (
  config: any,
  setError: Function,
  successFn: Function,
  closeFn: Function
) => <CustomComponent />;

const rootConfig: any = {
  damEnv,
  configureConfigScreen,
  customConfig,
  customWholeJson,
  filterAssetData,
  getSelectorWindowUrl,
  handleSelectorPageData,
  handleSelectorWindow,
  openComptactView,
  customComponent,
  handleConfigtoSelectorPage,
};

export default rootConfig;
