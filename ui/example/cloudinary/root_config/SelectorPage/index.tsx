/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import {
  Props,
  TypeErrorFn,
  TypeRootSelector,
  TypeSelectorContainer,
} from "../../common/types";

/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    CompactView: any; // chnage according to DAM application
  }
}

declare let cloudinary: any;

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
  let configObj = config;
  if (config?.selected_config) {
    configObj = config?.selected_config;
  }
  window.CompactView = cloudinary?.openMediaLibrary(
    {
      cloud_name: configObj?.cloudName,
      api_key: configObj?.apiKey,
      inline_container: `.${containerClass}`,
      multiple: true,
      max_files: 8,
    },
    {
      /* Call the onSuccess Function on receiving assets data from DAM compact view */
      insertHandler: (assets: any) => onSuccess(assets?.assets),
    }
  );
};

const rootSelectorPage: TypeRootSelector = {
  openComptactView,
};

export default rootSelectorPage;
