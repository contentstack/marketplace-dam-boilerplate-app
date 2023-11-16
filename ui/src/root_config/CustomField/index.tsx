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
  const filterAssetArray: TypeAsset[] = assets?.map((asset) =>
    // Enter your code for filteration of assets to the specified format
    ({
      id: "",
      type: "",
      name: "",
      width: "",
      height: "",
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl: "",
      previewUrl: "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: "", // add this parameter if you want "Open In DAM" in tooltip action items
    })
  );
  return filterAssetArray;
};

const handleConfigtoSelectorPage = (
  config: any,
  contentTypeConfig: any,
  currentLocale: string
) =>
  utils.getSelectorConfig({
    keyArr: DamEnvVariables?.CONFIG_FIELDS,
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

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
  getSelectorWindowUrl,
  handleConfigtoSelectorPage,
  handleSelectorPageData,
  handleSelectorWindow,
};

export default rootCustomField;
