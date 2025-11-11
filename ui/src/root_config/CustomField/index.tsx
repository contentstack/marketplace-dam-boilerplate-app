/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import {
  Props,
  TypeAsset,
  TypeErrorFn,
  TypeRootCustomField,
} from "../../common/types";

const convertSizeToBytes = (fileSize: string | undefined): string => {
  if (!fileSize) return "0";

  const sizeStr = fileSize.toString().trim();
  const match = sizeStr.match(/^([\d.]+)\s*(KB|MB|GB|TB|BYTES?)?$/i);

  if (!match) return "0";

  const value = parseFloat(match[1]);
  const unit = (match[2] || "BYTES").toUpperCase();

  const multipliers: { [key: string]: number } = {
    BYTES: 1,
    BYTE: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  const bytes = Math.round(value * (multipliers[unit] || 1));
  return bytes.toString();
};

// Helper function to normalize file type
const normalizeFileType = (fileType: string | undefined): string => {
  if (!fileType) return "document";

  const type = fileType.toLowerCase();

  if (type.includes("image") || ["jpeg", "jpg", "png", "gif", "svg", "webp"].includes(type)) {
    return "image";
  }
  if (type.includes("video") || ["mp4", "mov", "avi", "webm"].includes(type)) {
    return "video";
  }
  if (type.includes("audio") || ["mp3", "wav", "m4a"].includes(type)) {
    return "audio";
  }
  if (type === "pdf") return "pdf";
  if (["xlsx", "xls", "xlsm"].includes(type)) return "excel";
  if (["pptx", "ppt", "pptm"].includes(type)) return "presentation";
  if (["docx", "doc"].includes(type)) return "document";
  if (type === "json") return "json";
  if (["zip", "rar", "7z"].includes(type)) return "zip";
  if (["html", "htm"].includes(type)) return "code";

  return "document";
};

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Asset is in raw Table format, transform it to TypeAsset format
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: asset?._id || "",
      type: normalizeFileType(asset?.fileType) || asset?.type || "document",
      name: asset?.assetName || asset?.name || "",
      width: asset?.dimensions?.width?.toString() || asset?.width?.toString() || "",
      height: asset?.dimensions?.height?.toString() || asset?.height?.toString() || "",
      size: asset?.fileSize ? convertSizeToBytes(asset?.fileSize) : (asset?.size?.toString() || "0"),
      thumbnailUrl: asset?.thumbnail || asset?.thumbnailUrl || "",
      previewUrl: asset?.assetUrl || asset?.previewUrl || "",
      platformUrl: asset?.platformUrl || "",
      cs_metadata: asset?.cs_metadata,
    };
  });

  return filterAssetArray;
};

const handleConfigtoSelectorPage = (
  config: Props,
  contentTypeConfig: Props,
  currentLocale: string
) => {
  /* Return Config to be used on selector page */
  return {};
};

const getSelectorWindowUrl = (config: Props, contentTypeConfig: Props) => {
  return ""; // return url to be opened as selector page
};

const handleSelectorPageData = (event: MessageEvent) => {
  // "event" is the event object which is received from your opened selector page
  return []; // return array of asset objects which are selected
};

const handleSelectorWindow = (
  config: Props,
  contentTypeConfig: Props,
  setError: (errObj: TypeErrorFn) => void
) => {
  /* code logic to open the DAM selector window */
};

const handleAuthWindow = (
  config: Props,
  contentTypeConfig: Props,
  resolve: Function,
  reject: Function
) => {
  /* code logic to open the DAM auth window */
  resolve(); // if authentication is success, call resolve() | if failed, call reject(error) with error
};

const modifyAssetsToSave = (
  config: Props,
  contentTypeConfig: Props,
  assets: any[]
) => {
  return filterAssetData(assets);
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
  getSelectorWindowUrl,
  handleConfigtoSelectorPage,
  handleSelectorPageData,
  handleSelectorWindow,
  handleAuthWindow,
  modifyAssetsToSave,
};

export default rootCustomField;
