/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/naming-convention */

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
    const { public_id, resource_type, secure_url, bytes, width, height } =
      asset;
    return {
      id: public_id,
      type: resource_type, // supported types: 'image' | 'code' | 'pdf' | 'excel' | 'presentation' | 'document' | 'json' | 'text/plain' | 'zip' | 'video' | 'audio' | 'image/tiff';
      name: public_id,
      width,
      height,
      size: bytes, // add size in bytes as string eg.'416246'
      thumbnailUrl: secure_url ?? "",
      previewUrl: secure_url ?? "", // add this parameter if you want "Preview" in tooltip action items
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
