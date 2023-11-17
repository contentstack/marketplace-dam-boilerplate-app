/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import { TypeAsset, TypeRootCustomField } from "../../common/types";

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) =>
    // Enter your code for filteration of assets to the specified format
    ({
      // eslint-disable-next-line
      id: asset?._id,
      type: "image",
      name: asset?.assetName,
      width: asset?.dimension?.width,
      height: asset?.dimension?.height,
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl: asset?.assetUrl,
      previewUrl: asset?.assetUrl, // add this parameter if you want "Preview" in tooltip action items
      platformUrl: "", // add this parameter if you want "Open In DAM" in tooltip action items
    })
  );
  return filterAssetArray;
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
};

export default rootCustomField;
