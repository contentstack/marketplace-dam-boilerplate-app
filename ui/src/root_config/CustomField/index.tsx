/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

import {
  Props,
  TypeAsset,
  TypeErrorFn,
  TypeRootCustomField,
} from "../../common/types";

const filterAssetData = (assets: any[]): TypeAsset[] => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) =>
    // Enter your code for filteration of assets to the specified format
    ({
      id: asset?.id || "",
      type: asset?.type || "", // supported types: 'image' | 'code' | 'pdf' | 'excel' | 'presentation' | 'document' | 'json' | 'text/plain' | 'zip' | 'video' | 'audio' | 'image/tiff';
      name: asset?.name || "",
      width: asset?.width || "",
      height: asset?.height || "",
      size: asset?.size || "", // add size in bytes as string eg.'416246'
      thumbnailUrl: asset?.thumbnailUrl || "",
      previewUrl: asset?.previewUrl || "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: asset?.platformUrl || "", // add this parameter if you want "Open In DAM" in tooltip action items
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
  /* Return Config to be used on selector page 
  Note: If you need to fetch data from API, use makeAPIRequest via MarketplaceAppContext
  in the CustomField component and pass the data as needed. */
  return {};
};

const getSelectorWindowUrl = (config: Props, contentTypeConfig: Props) => {
  return "";
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
  /* code logic to open the DAM auth window 
  Note: If you need to fetch data from API for authentication, use makeAPIRequest 
  via MarketplaceAppContext in the CustomField component.
  if authentication is success, call resolve() | if failed, call reject(error) with error */
  resolve(); // if authentication is success, call resolve() | if failed, call reject(error) with error
};

const modifyAssetsToSave = (
  config: Props,
  contentTypeConfig: Props,
  assets: any[]
) => {
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
