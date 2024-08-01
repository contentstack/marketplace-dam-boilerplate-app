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

const getDisplayUrl = (asset: any) => {
  return {
    preview: `http://localhost:4000${asset?.assetUrl}` ?? "", // preview_url present in asset object
  };
};

const getAssetType = (asset: any) => "image";

const getViewIconforTooltip = (type: string) => {
  return {
    preview: PREVIEW_ICON, // preview_url present in asset object
  };
};

const rteFunctions: any = {
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
};

export default rteFunctions;
