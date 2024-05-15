/* eslint-disable @typescript-eslint/no-unused-vars */

/* NOTE: Remove Functions which are not used */

import React from "react";
import {
  TypeErrorFn,
  TypeRootSelector,
  TypeSelectorContainer,
} from "../../common/types";
import CustomComponent from "../CustomComponent";

/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    BynderCompactView: any; // chnage according to DAM application
  }
}

const openComptactView = (
  config: any,
  selectedIds: string[],
  onSuccess: (assets: any[]) => void,
  onCancel: () => void,
  { containerRef, containerClass, containerId }: TypeSelectorContainer,
  setError: (errObj: TypeErrorFn) => void
) => {
  /* Implement your DAM compact view implementation here
  declare your selected DAM variable in the above scope and call the open function from DAM compact view on that variable
  use onSuccess function to send your data to custom field [onSuccess accepts an array of asset objects]  */
  console.info("config values for opern compact view---", config.language, config.org_url);
  window.BynderCompactView?.open({
    language: config?.language,
    mode: config?.mode,
    theme: {
      colorButtonPrimary: "#3380FF",
    },
    portal: {
      url: `${config?.org_url}`,
    },
    assetTypes: ["image", "audio", "video", "document", "archive"],
    onSuccess(data: any, additionalInfo: any) {
      if (config?.mode === "SingleSelectFile") {
        data[0].additionalInfo = additionalInfo;
        onSuccess(data);
      } else {
        onSuccess(data);
      }
    },
    container: containerRef.current,
  });
};

// If there is no script then provide a custom component here
const customSelectorComponent = (
  config: any,
  setError: (errObj: TypeErrorFn) => void,
  successFn: (assets: any[]) => void,
  closeFn: () => void,
  selectedAssetIds: string[]
) => (
  // eslint-disable-next-line
  <></>
);

const rootSelectorPage: TypeRootSelector = {
  openComptactView,
  customSelectorComponent,
};

export default rootSelectorPage;
