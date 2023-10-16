/* eslint-disable @typescript-eslint/no-unused-vars */

/* NOTE: Remove Functions which are not used */

import React from "react";
import { TypeSelectorContainer } from "../../common/types";
import CustomComponent from "../CustomComponent";

/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    CompactView: any; // chnage according to DAM application
  }
}

const openComptactView = (
  config: any,
  selectedIds: string[],
  onSuccess: Function,
  onCancel: Function,
  { containerRef, containerClass, containerId }: TypeSelectorContainer,
  setError: Function
) => {
  /* Implement your DAM compact view implementation here
  declare your selected DAM variable in the above scope and call the open function from DAM compact view on that variable
  use onSuccess function to send your data to custom field [onSuccess accepts an array of asset objects]  */
};

// If there is no script then provide a custom component here
const customSelectorComponent = (
  config: any,
  setError: Function,
  successFn: Function,
  closeFn: Function
) => <CustomComponent />;

const rootSelectorPage = {
  openComptactView,
  customSelectorComponent,
};

export default rootSelectorPage;
