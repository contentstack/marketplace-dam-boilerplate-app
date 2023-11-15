/* eslint-disable @typescript-eslint/no-unused-vars */

/* NOTE: Remove Functions which are not used */

import React from "react";
import { TypeErrorFn, TypeRootSelector } from "../../common/types";
import CustomComponent from "../CustomComponent";
import assetData from "../AssetData";

// If there is no script then provide a custom component here
const customSelectorComponent = (
  config: any,
  setError: (errObj: TypeErrorFn) => void,
  successFn: (assets: any[]) => void,
  closeFn: () => void,
  selectedAssetIds: string[]
) => {
  const getSelectedIDs = (assetIds: any[]) => {
    const ids: any = {};
    assetIds?.forEach((assetId: string) => {
      ids[parseInt(assetId, 10)] = true;
    });
    console.info("ids", ids);
    return ids;
  };

  return (
    <CustomComponent
      selectedAssetIds={getSelectedIDs(selectedAssetIds)}
      successFn={successFn}
      closeFn={closeFn}
      assetData={assetData}
    />
  );
};

const rootSelectorPage: TypeRootSelector = {
  customSelectorComponent,
};

export default rootSelectorPage;
