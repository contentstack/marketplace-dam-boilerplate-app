/* Utility functions for root_config */

const getAssetType = (extension: string) => {
  extension = extension?.toLowerCase();
  let assetType = "document";
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
  const excelExtension = [
    "xlsx",
    "xlsm",
    "xlsb",
    "xltx",
    "xltm",
    "xls",
    "xlt",
    "xml",
    "xlam",
    "xla",
    "xlw",
    "xlr",
  ];

  if (videoExtnesions?.includes(extension)) {
    assetType = "video";
  } else if (audioExtensions?.includes(extension)) {
    assetType = "audio";
  } else if (imageExtension?.includes(extension)) {
    assetType = "image";
  } else if (excelExtension?.includes(extension)) {
    assetType = "excel";
  } else if (extension === "pdf") {
    assetType = "pdf";
  } else if (extension === "zip") {
    assetType = "zip";
  } else if (extension === "json") {
    assetType = "json";
  }
  return assetType;
};

const utils = {
  getAssetType,
};

export default utils;
