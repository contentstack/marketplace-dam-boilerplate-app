import constants from "../constants";

export const getAssetType = (fileType: string | undefined): string => {
  if (!fileType) return "document";

  const extension = fileType.toLowerCase();
  const {
    audioExtensions,
    videoExtensions,
    imageExtensions,
    excelExtensions,
    presentationExtensions,
  } = constants.fileExtensions;

  if (videoExtensions.includes(extension)) {
    return "video";
  }
  if (audioExtensions.includes(extension)) {
    return "audio";
  }
  if (imageExtensions.includes(extension)) {
    return "image";
  }
  if (excelExtensions.includes(extension)) {
    return "excel";
  }
  if (presentationExtensions.includes(extension)) {
    return "presentation";
  }
  if (extension === "pdf") {
    return "pdf";
  }
  if (extension === "zip" || extension === "rar" || extension === "7z") {
    return "zip";
  }
  if (extension === "json") {
    return "json";
  }
  if (extension === "docx" || extension === "doc") {
    return "document";
  }
  if (extension === "html" || extension === "htm") {
    return "code";
  }
  return "document";
};

export const getAssetIcon = (assetType: string): string => {
  const iconMap = constants.tableConstants.assetIconMap;
  return iconMap[assetType] || "Document";
};
