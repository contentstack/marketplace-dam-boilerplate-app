/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  TypeErrorFn,
  TypeRootSelector,
  TypeSelectorContainer,
} from "../../common/types";

/* These variables are to be used in openCompactView function. The developer should change these variables according to the DAM platform that is being implemented */
declare global {
  interface Window {
    BynderCompactView: any; // change according to DAM application
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
      onSuccess(data);
    },
    container: containerRef.current,
  });
};

const rootSelectorPage: TypeRootSelector = {
  openComptactView,
};

export default rootSelectorPage;
