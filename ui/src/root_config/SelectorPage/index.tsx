/* eslint-disable @typescript-eslint/no-unused-vars */

/* NOTE: Remove Functions which are not used */

import React from "react";
import {
  Props,
  TypeErrorFn,
  TypeRootSelector,
  TypeSelectorContainer,
} from "../../common/types";
import CustomSelector from "../Components/CustomSelector";
import assetData from "../AssetData";

/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    CompactView: any; // chnage according to DAM application
  }
}

const openComptactView = (
  config: Props,
  selectedIds: string[],
  onSuccess: (assets: any[]) => void,
  onCancel: () => void,
  { containerRef, containerClass, containerId }: TypeSelectorContainer,
  setError: (errObj: TypeErrorFn) => void
) => {
  /* Implement your DAM compact view implementation here
  declare your selected DAM variable in the above scope and call the open function from DAM compact view on that variable
  use onSuccess function to send your data to custom field [onSuccess accepts an array of asset objects]  */
};

// If there is no script then provide a custom component here
const customSelectorComponent = (
  config: Props,
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
    return ids;
  };

  return (
    <CustomSelector
      selectedAssetIds={getSelectedIDs(selectedAssetIds)}
      successFn={successFn}
      closeFn={closeFn}
      assetData={assetData}
    />
  );
};

const rootSelectorPage: TypeRootSelector = {
  openComptactView,
  customSelectorComponent,
};

export default rootSelectorPage;
