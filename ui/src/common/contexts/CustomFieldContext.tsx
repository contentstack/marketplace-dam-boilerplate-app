import { createContext } from "react";

interface TypeCustomFieldContext {
  renderAssets: any[];
  setRenderAssets: Function;
  selectedAssets: any[];
  setSelectedAssets: Function;
  removeAsset: Function;
  uniqueID: string;
  setRearrangedAssets: Function;
  state: any;
  currentLocale: string;
}

const CustomFieldContext = createContext<TypeCustomFieldContext>({
  renderAssets: [],
  setRenderAssets: () => {},
  selectedAssets: [],
  setSelectedAssets: () => {},
  removeAsset: () => {},
  uniqueID: "",
  setRearrangedAssets: () => {},
  state: {},
  currentLocale: "",
});

export default CustomFieldContext;
