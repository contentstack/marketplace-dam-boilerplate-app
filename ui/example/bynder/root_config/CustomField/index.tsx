/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable arrow-body-style */
import { TypeAsset, TypeRootCustomField } from "../../common/types";

const filterAssetData = (assets: any[]) => {
  const filterAssetArray: TypeAsset[] = assets?.map((asset) => {
    // Enter your code for filteration of assets to the specified format
    const { id, name, type, url, files } = asset;
    return {
      id,
      type,
      name,
      width: files?.webImage?.width,
      height: files?.webImage?.height,
      size: "", // add size in bytes as string eg.'416246'
      thumbnailUrl: files?.webImage?.url || "",
      previewUrl: files?.webImage?.url || "", // add this parameter if you want "Preview" in tooltip action items
      platformUrl: url || "", // add this parameter if you want "Open In DAM" in tooltip action items
    };
  });
  return filterAssetArray;
};

const rootCustomField: TypeRootCustomField = {
  filterAssetData,
};

export default rootCustomField;
