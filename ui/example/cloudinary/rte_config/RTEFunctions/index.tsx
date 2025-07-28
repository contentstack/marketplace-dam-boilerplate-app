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
  return {
    preview: asset?.secure_url ?? "", // preview_url present in asset object
  };
};

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
  const fileExtension = asset?.secure_url?.split(".")?.pop()?.toLowerCase();
  if (
    [
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
    ].includes(fileExtension)
  ) {
    return "Image";
  } else if (
    [
      "mp4",
      "mov",
      "wmv",
      "avi",
      "avchd",
      "flv",
      "f4v",
      "swf",
      "ogg",
      "webm",
    ].includes(fileExtension)
  ) {
    return "Video";
  } else if (["pdf"].includes(fileExtension)) {
    return "Pdf";
  } else if (["mp3", "ogg", "wav"].includes(fileExtension)) {
    return "Audio";
  } else if (["zip", "rar", "tar", "7z"].includes(fileExtension)) {
    return "Archive";
  } else {
    return "Document";
  }
};

const getViewIconforTooltip = (type: string) => {
  /* 
    Returns an object with either or both preview and openInDam properties.
    Note: The values of the properties are the same as the values of the PREVIEW_ICON and NEWTAB_ICON variables.
  */
  return {
    preview: PREVIEW_ICON,
  };
};

const rteFunctions: any = {
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
};

export default rteFunctions;
