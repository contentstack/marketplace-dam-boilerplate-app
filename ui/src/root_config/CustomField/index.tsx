/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import {
  Props,
  TypeAsset,
  TypeErrorFn,
  TypeRootCustomField,
} from "../../common/types";

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) =>
    // Enter your code for filteration of assets to the specified format
    ({
      id: "",
      type: "", // supported types: 'image' | 'code' | 'pdf' | 'excel' | 'presentation' | 'document' | 'json' | 'text/plain' | 'zip' | 'video' | 'audio' | 'image/tiff';
      name: "",
      width: "",
      height: "",
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl: "",
      previewUrl: "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: "", // add this parameter if you want "Open In DAM" in tooltip action items
      cs_metadata: asset?.cs_metadata,
    })
  );
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
  /* code logic to modify the assets to save in Custom Field */
  return assets;
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
