/* Variables for getViewIconforTooltip function */
const PREVIEW_ICON = "Eye";

const getDisplayUrl = (asset: any) => {
  return asset?.secure_url;
};

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
  const { format } = asset;
  let assetType = "Document";
  let asset_type;
  const audioExtensions = ["mp3", "m4a", "flac", "wav", "wma", "aac"];
  const videoExtnesions = [
    "mp4",
    "mov",
    "wmv",
    "avi",
    "avchd",
    "flv",
    "f4v",
    "swf",
    "ogg",
  ];
  const imageExtension = [
    "jpeg",
    "jpg",
    "png",
    "gif",
    "bmp",
    "apng",
    "avif",
    "jfif",
    "pjpeg",
    "pjp",
    "svg",
    "webp",
    "ico",
    "cur",
    "tif",
    "tiff",
  ];

  if (videoExtnesions.indexOf(format) !== -1) {
    asset_type = "Video";
  } else if (audioExtensions.indexOf(format) !== -1) {
    asset_type = "Audio";
  } else if (imageExtension.indexOf(format) !== -1) {
    asset_type = "Image";
  } else if (format == "pdf") {
    asset_type = "pdf";
  } else if (format == "zip") {
    asset_type = "zip";
  }
  if (asset_type) {
    switch (true) {
      case asset_type.indexOf("Image") > -1:
        assetType = "Image";
        break;
      case asset_type.indexOf("pdf") > -1:
        assetType = "Pdf";
        break;
      case asset_type.indexOf("zip") > -1:
        assetType = "Archive";
        break;
      case asset_type.indexOf("Video") > -1:
        assetType = "Video";
        break;
      case asset_type.indexOf("Audio") > -1:
        assetType = "Audio";
        break;
    }
    return assetType;
  }
  return assetType;
};

const getViewIconforTooltip = (type: string) => {
  /* possible return values ==> Eye and NewTab */
  return PREVIEW_ICON;
};

const rteFunctions: any = {
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
};

export default rteFunctions;
