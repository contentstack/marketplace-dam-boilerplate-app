import React from "react";

/* Variables for getAssetType function */
const ASSET_DOCUMENT_TYPE = "Document";
const ASSET_IMAGE_TYPE = "Image";
const ASSET_PDF_TYPE = "Pdf";
const ASSET_ARCHIVE_TYPE = "Archive";
const ASSET_VIDEO_TYPE = "Video";
const ASSET_AUDIO_TYPE = "Audio";

/* Variables for getViewIconforTooltip function */
const PREVIEW_ICON = "Eye";
const NEWTAB_ICON = "OpenURL";

const getDisplayUrl = (asset: any) => {
  /* returns the display url of the asset. Return Type = "String" */
};

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
};

const getViewIconforTooltip = (type: string) => {
  /* 
    Returns an object with either or both preview and openInDam properties.
    Note: The values of the properties are the same as the values of the PREVIEW_ICON and NEWTAB_ICON variables.
  */
  return {
    preview: PREVIEW_ICON,
    openInDam: NEWTAB_ICON,
  };
};

const getSelectorWindowUrl = (config: any, contentTypeConfig: any) => {
  return ""; // return url to be opened as selector page
};

const handleSelectorPageData = (event: any) => {
  return []; // return array of asset objects which are selected
};

const handleSelectorWindow = (config: any, contentTypeConfig: any) => {
  /* code logic to open the DAM selector page */
};

const handleAuthWindow = (
  config: any,
  contentTypeConfig: any,
  resolve: Function,
  reject: Function
) => {
  /* code logic to open the DAM auth window */
  resolve(); // if authentication is success, call resolve() | if failed, call reject(error) with error
};

const handleConfigtoSelectorPage = (
  config: any,
  contentTypeConfig: any,
  currentLocale: string
) => {
  /* Return Config to be used on selector page */
  return {};
};

const rteFunctions: any = {
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
  getSelectorWindowUrl,
  handleSelectorPageData,
  handleSelectorWindow,
  handleAuthWindow,
  handleConfigtoSelectorPage,
};

export default rteFunctions;
