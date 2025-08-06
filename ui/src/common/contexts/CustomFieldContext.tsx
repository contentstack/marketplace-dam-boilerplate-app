import { createContext } from "react";
import { TypeAsset, TypeSDKData } from "../types";

interface TypeCustomFieldContext {
  renderAssets: TypeAsset[];
  setRenderAssets: Function;
  selectedAssets: any;
  setSelectedAssets: Function;
  removeAsset: Function;
  uniqueID: string;
  setRearrangedAssets: Function;
  state: TypeSDKData;
  currentLocale: string;
  handleBtnDisable: Function;
  isBtnDisable: boolean;
}

const CustomFieldContext = createContext<TypeCustomFieldContext>({
  renderAssets: [],
  setRenderAssets: () => {},
  selectedAssets: {},
  setSelectedAssets: () => {},
  removeAsset: () => {},
  uniqueID: "",
  setRearrangedAssets: () => {},
  state: {
    config: {},
    contentTypeConfig: {},
    location: null,
    appSdkInitialized: false,
  },
  currentLocale: "",
  handleBtnDisable: () => {},
  isBtnDisable: false,
});

export default CustomFieldContext;
