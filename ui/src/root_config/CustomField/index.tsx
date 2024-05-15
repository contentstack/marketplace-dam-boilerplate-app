/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import {
  TypeAsset,
  TypeErrorFn,
  TypeRootCustomField,
} from "../../common/types";
import DamEnvVariables from "../DamEnv";
import utils from "../utils";

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // console.info("eachhhh asset info in filerAsset ----", asset);
    // Enter your code for filteration of assets to the specified format
    const {
      id,
      name,
      url,
      files,
      previewUrls,
      additionalInfo,
      databaseId,
      assetTracker,
    } = asset;
    let type = "";
    let trackerStatus;
    const fileExtension = asset.extensions[0];
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
      type = "Image";
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
      ].includes(fileExtension)
    ) {
      type = "Video";
    } else if (["pdf"].includes(fileExtension)) {
      type = "Pdf";
    } else if (["mp3", "ogg", "wav"].includes(fileExtension)) {
      type = "Audio";
    } else if (["zip", "rar", "tar", "7z"].includes(fileExtension)) {
      type = "Zip";
    } else {
      type = "Document";
    }

    let previewUrlValue: any;
    switch (type.toLowerCase()) {
      case "image":
        previewUrlValue = files?.webImage?.url || "";
        break;
      case "video":
        previewUrlValue = previewUrls?.[0] || "";
        break;
      default:
        break;
    }

    return {
      id,
      databaseId,
      type,
      trackerStatus: assetTracker,
      name,
      width: files?.webImage?.width,
      height: files?.webImage?.height,
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl:
        additionalInfo?.selectedFile?.url ?? files?.webImage?.url ?? "",
      previewUrl: additionalInfo?.selectedFile?.url ?? previewUrlValue, // add this parameter if you want "Preview" in tooltip action items
      platformUrl: url || "", // add this parameter if you want "Open In DAM" in tooltip action items
    };
  });
  return filterAssetArray;
};

const handleConfigtoSelectorPage = (
  config: any,
  contentTypeConfig: any,
  currentLocale: string
) =>
  utils.getSelectorConfig({
    keyArr: DamEnvVariables?.SELECTOR_PAGE_CONFIG_FIELDS,
    appConfig: config,
    customConfig: contentTypeConfig,
    currentLocale,
  });

const getSelectorWindowUrl = (config: any, contentTypeConfig: any) => {
  return ""; // return url to be opened as selector page
};

const handleSelectorPageData = (event: any) => {
  // "event" is the event object which is received from your opened selector page
  return []; // return array of asset objects which are selected
};

const handleSelectorWindow = (
  config: any,
  contentTypeConfig: any,
  setError: (errObj: TypeErrorFn) => void
) => {
  /* code logic to open the DAM selector window */
};

const handleAuthWindow = (
  configObj: {
    config: any;
    contentTypeConfig: any;
  },
  resolve: Function,
  reject: Function
) => {
  /* code logic to open the DAM auth window */
  resolve(); // if authentication is success, call resolve() | if failed, call reject(error) with error
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
  getSelectorWindowUrl,
  handleConfigtoSelectorPage,
  handleSelectorPageData,
  handleSelectorWindow,
  handleAuthWindow,
};

export default rootCustomField;
