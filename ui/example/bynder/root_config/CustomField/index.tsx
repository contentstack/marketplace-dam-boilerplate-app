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
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    const { id, name, type, url, files } = asset;
    return {
      id,
      type, // supported types: 'image' | 'code' | 'pdf' | 'excel' | 'presentation' | 'document' | 'json' | 'text/plain' | 'zip' | 'video' | 'audio' | 'image/tiff';
      name,
      width: files?.webImage?.width,
      height: files?.webImage?.height,
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl: files?.webImage?.url ?? "",
      previewUrl: files?.webImage?.url ?? "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: url ?? "", // add this parameter if you want "Open In DAM" in tooltip action items
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
  return config;
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
  handleConfigtoSelectorPage,
};

export default rootCustomField;
