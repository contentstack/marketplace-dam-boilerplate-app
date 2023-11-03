/* Variables for getAssetType function */
const ASSET_IMAGE_TYPE = "Image";
const ASSET_VIDEO_TYPE = "Video";

/* Variables for getViewIconforTooltip function */
const PREVIEW_ICON = "Eye";
const NEWTAB_ICON = "NewTab";

const getDisplayUrl = (asset: any) => {
  switch (asset.__typename) {
    case ASSET_IMAGE_TYPE:
      return asset?.files?.webImage?.url;
    case ASSET_VIDEO_TYPE:
      return asset?.previewUrls[0];
    default:
      return asset?.url;
  }
};

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
  return asset?.__typename;
};

const getViewIconforTooltip = (type: string) => {
  /* possible return values ==> Eye and NewTab */
  type = type.toLowerCase();
  if (type === "image" || type === "video") return PREVIEW_ICON;
  return NEWTAB_ICON;
};

const rteFunctions: any = {
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
};

export default rteFunctions;
