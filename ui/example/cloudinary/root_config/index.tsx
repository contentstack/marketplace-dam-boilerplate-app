/* eslint-disable */
import React from "react";
import { TypeAsset, TypeSelectorContainer } from "../common/types";
import Logo from "../common/asset/logo.svg";
import utils from "./utils";

// <------------ ENVIRONMENT VALUES ------------>

const damEnv = {
  IS_DAM_SCRIPT: true,
  DAM_APP_NAME: "Cloudinary",
  CONFIG_FIELDS: ["cloudName", "apiKey"],
  ASSET_UNIQUE_ID: "public_id",
  DAM_SCRIPT_URL: "https://media-library.cloudinary.com/global/all.js",
  SELECTOR_PAGE_LOGO: Logo,
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
};

// <--------- CONFIG SCREEN FUNCTIONS ---------->

const configureConfigScreen = () => {
  /* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations
  6. Supported type options are textInputFields, radioInputFields, selectInputFields */

  return {
    cloudName: {
      type: "textInputFields",
      labelText: "Cloud Name",
      placeholderText: "Enter Cloud Name",
      instructionText: `Enter your Cloudinary account's Cloud Name`,
      saveInConfig: true,
      saveInServerConfig: false,
    },
    apiKey: {
      type: "textInputFields",
      labelText: "API Key",
      placeholderText: "Enter API Key",
      instructionText: `Enter your Cloudinary account's API Key`,
      saveInConfig: true,
      saveInServerConfig: false,
    },
  };
};

const customWholeJson = () => {
  const customJsonOptions: string[] = [
    "public_id",
    "resource_type",
    "secure_url",
    "type",
    "format",
    "version",
    "url",
    "width",
    "height",
    "bytes",
    "duration",
    "tags",
    "metadata",
    "created_at",
    "access_mode",
    "access_control",
    "created_by",
    "uploaded_by",
  ];

  const defaultFeilds: string[] = ["public_id", "resource_type", "secure_url"];

  return {
    customJsonOptions,
    defaultFeilds,
  };
};

// <---------- CUSTOM FIELD FUNCTIONS ---------->

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    const { public_id, resource_type, secure_url, bytes, width, height } =
      asset;
    return {
      id: public_id,
      type: resource_type,
      name: public_id,
      width,
      height,
      size: bytes, // add size in bytes as string eg.'416246'
      thumbnailUrl: secure_url || "",
      previewUrl: secure_url || "", // add this parameter if you want "Preview" in tooltip action items
    };
  });
  return filterAssetArray;
};

// <---------- SELECTOR PAGE FUNCTIONS ---------->

/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    CompactView: any; // chnage according to DAM application
  }
}

declare let cloudinary: any; // declare your variable for DAM compact view here

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
  window.CompactView = cloudinary?.openMediaLibrary(
    {
      cloud_name: config?.cloudName,
      api_key: config?.apiKey,
      inline_container: `.${containerClass}`,
      multiple: true,
      max_files: 8,
    },
    {
      /* Call the onSuccess Function on receiving assets data from DAM compact view */
      insertHandler: (assets: any) => onSuccess(assets?.assets),
    }
  );
};

const rootConfig: any = {
  damEnv,
  configureConfigScreen,
  customWholeJson,
  filterAssetData,
  openComptactView,
};

export default rootConfig;
