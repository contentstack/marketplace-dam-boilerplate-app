import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}

export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  contentTypeConfig?: any;
  location: any;
  appSdkInitialized: boolean;
}

export interface TypeAsset {
  id: string;
  type: string;
  name: string;
  width: string;
  height: string;
  size: string;
  thumbnailUrl: string;
  previewUrl?: string; // if you don't want "preview" platform option don't provide this parameter
  platformUrl?: string; // if you don't want "open in DAM" platform option don't provide this parameter
}

export interface TypeSelectedItems {
  assets: TypeAsset[];
  removeAsset: Function;
  setRearrangedAssets: Function;
}

export interface TypeCardContainer {
  assets: TypeAsset[];
  removeAsset: Function;
  sensors: any;
  onDragEnd: (event: any) => void;
  onDragCancel: () => void;
  onDragStart: ({ active }: any) => void;
  activeId: string | null;
}

export interface TypeSelectorContainer {
  containerRef: any;
  containerClass: string;
  containerId: string;
}

export interface TypeAssetCard {
  asset: TypeAsset;
  removeAsset: Function;
  id: string;
}

export interface TypeAssetList {
  asset: TypeAsset;
  removeAsset: Function;
  id: string;
}

export interface TypeOption {
  label: string;
  value: string;
}

export interface TypeConfigComponent {
  objKey: string;
  objValue: any;
  currentValue: any;
  updateConfig: Function;
  errorState: string[];
}

export type Props = {
  [key: string]: any;
};

export interface TypeRadioOption {
  fieldName: string;
  mode: TypeOption;
  index: number;
  radioOption: TypeOption;
  updateRadioOptions: Function;
}

export type TypeWarningtext = {
  error: boolean;
  data: any;
};
