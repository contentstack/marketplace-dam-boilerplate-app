/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
import { TypeAsset, TypeRootCustomField } from "../../common/types";

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    const { public_id, resource_type, secure_url, bytes, width, height } =
      asset;
    return {
      id: public_id,
      type: resource_type,
      name: public_id,
      width,
      height,
      size: bytes, // add size in bytes as string eg.'416246'
      thumbnailUrl: secure_url || "",
      previewUrl: secure_url || "", // add this parameter if you want "Preview" in tooltip action items
    };
  });
  return filterAssetArray;
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
};

export default rootCustomField;
