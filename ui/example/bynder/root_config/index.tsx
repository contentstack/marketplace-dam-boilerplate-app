/* eslint-disable */
import React from "react";
import { TypeAsset, TypeSelectorContainer } from "../common/types";
import Logo from "../common/asset/logo.svg";
import utils from "./utils";

// ####### ENVIRONMENT VALUES #######
const damEnv = {
  IS_DAM_SCRIPT: true,
  DAM_APP_NAME: "Bynder",
  CONFIG_FIELDS: ["org_url", "language", "mode"],
  ASSET_UNIQUE_ID: "id",
  DAM_SCRIPT_URL:
    "https://ucv.bynder.com/5.0.5/modules/compactview/bynder-compactview-3-latest.js",
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
    org_url: {
      type: "textInputFields",
      labelText: "Bynder Organization URL",
      helpText: "Enter Your Bynder Organization URL",
      placeholderText: "Enter Bynder Organization URL",
      saveInConfig: true,
      saveInServerConfig: false,
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
    },
  };
};

// ####### CUSTOM FIELD #######
const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    const { id, name, type, url, files } = asset;
    return {
      id,
      type,
      name,
      width: files?.webImage?.width,
      height: files?.webImage?.height,
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl: files?.webImage?.url || "",
      previewUrl: files?.webImage?.url || "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: url || "", // add this parameter if you want "Open In DAM" in tooltip action items
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
    valueChecks: {
      language: ["en_US", "nl_NL", "de_DE", "fr_FR", "es_ES"],
      mode: ["SingleSelectFile", "MultiSelect"],
    },
  });
};

// ####### SELECTOR PAGE #######
/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    BynderCompactView: any; // change according to DAM application
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
  window.BynderCompactView?.open({
    language: config?.language,
    mode: config?.mode,
    theme: {
      colorButtonPrimary: "#3380FF",
    },
    portal: {
      url: `${config?.org_url}`,
    },
    assetTypes: ["image", "audio", "video", "document", "archive"],
    onSuccess(data: any, additionalInfo: any) {
      onSuccess(data);
    },
    container: containerRef.current,
  });
};

const rootConfig: any = {
  damEnv,
  configureConfigScreen,
  filterAssetData,
  openComptactView,
  handleConfigtoSelectorPage,
};

export default rootConfig;
