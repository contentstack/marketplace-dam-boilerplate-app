/* Variables for getAssetType function */
const ASSET_IMAGE_TYPE = "Image";
const ASSET_VIDEO_TYPE = "Video";

/* Variables for getViewIconforTooltip function */
const PREVIEW_ICON = "Eye";
const NEWTAB_ICON = "NewTab";

const getDisplayUrl = (asset: any) => {
  switch (asset?.__typename) {
    case ASSET_IMAGE_TYPE:
      return {
        preview: asset?.files?.webImage?.url ?? "", // preview_url present in asset object
        openInDam: asset?.url ?? "", // openInDAM_url present in asset object
      };
    case ASSET_VIDEO_TYPE:
      return {
        preview: asset?.previewUrls?.[0] ?? "", // preview_url present in asset object
        openInDam: asset?.url ?? "", // openInDAM_url present in asset object
      };
    default:
      return {
        openInDam: asset?.url ?? "", // openInDAM_url present in asset object
      };
  }
};

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
  return asset?.__typename;
};

const getViewIconforTooltip = (type: string) => {
  /* possible return values ==> Eye and NewTab */
  type = type?.toLowerCase();
  if (type === "image" || type === "video")
    return {
      preview: PREVIEW_ICON, // preview_url present in asset object
      openInDam: NEWTAB_ICON, // openInDAM_url present in asset object
    };
  return {
    openInDam: NEWTAB_ICON, // openInDAM_url present in asset object
  };
};

const rteFunctions: any = {
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
};

export default rteFunctions;
