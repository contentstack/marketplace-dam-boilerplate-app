/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */

/* NOTE: Remove Functions which are not used */

import { TypeAsset, TypeRootCustomField } from "../../../../src/common/types";

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) =>
    // Enter your code for filteration of assets to the specified format
    ({
      // eslint-disable-next-line
      id: asset?._id,
      type: "image", // supported types: 'image' | 'code' | 'pdf' | 'excel' | 'presentation' | 'document' | 'json' | 'text/plain' | 'zip' | 'video' | 'audio' | 'image/tiff';
      name: asset?.assetName,
      width: asset?.dimension?.width,
      height: asset?.dimension?.height,
      size: "", // add size in bytes as string eg.'416246'
      // Table support: These fields support both table format and standard format
      thumbnailUrl: asset?.thumbnail || asset?.thumbnailUrl || "",
      previewUrl: asset?.assetUrl || asset?.previewUrl || "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: asset?.platformUrl || "", // add this parameter if you want "Open In DAM" in tooltip action items
      cs_metadata: asset?.cs_metadata,
    })
  );
  return filterAssetArray;
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
};

export default rootCustomField;
