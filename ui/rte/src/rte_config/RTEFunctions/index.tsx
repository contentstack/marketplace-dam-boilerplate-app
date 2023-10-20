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
const NEWTAB_ICON = "NewTab";

const getDisplayUrl = (asset: any) => {};

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
};

const getViewIconforTooltip = (type: string) => {
  /* possible return values ==> Eye and NewTab */
};

const getSelectorWindowUrl = (config: any) => {
  return ""; // return url to be opened as selector page
};

const handleSelectorPageData = (event: any) => {
  return []; // return array of asset objects which are selected
};

const handleSelectorWindow = (config: any) => {
  /* code logic to open the DAM selector page */
};

const rteFunctions: any = {
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
  getSelectorWindowUrl,
  handleSelectorPageData,
  handleSelectorWindow,
};

export default rteFunctions;
