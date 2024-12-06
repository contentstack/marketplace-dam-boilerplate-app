export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}

export type Props = {
  [key: string]: any;
};

export interface TypeAppSdkConfigState {
  configuration: Props;
  serverConfiguration: Props;
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

export interface TypeCardContainer {
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
  id: string;
}

export interface TypeAssetList {
  id: string;
}

export interface TypeOption {
  label: string;
  value: string;
}

export interface TypeConfigComponent {
  objKey: string;
  objValue: any;
  updateConfig?: Function;
  acckey?: string;
}

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

export interface TypeRootDamEnv {
  IS_DAM_SCRIPT?: boolean;
  DAM_APP_NAME: string;
  SELECTOR_CONFIG_CHECK_FIELDS: string[];
  REQUIRED_CONFIG_FIELDS: string[];
  ASSET_UNIQUE_ID: string;
  DAM_SCRIPT_URL?: string;
  SELECTOR_PAGE_LOGO?: any;
  DIRECT_SELECTOR_PAGE: string;
  ADVANCED_ASSET_PARAMS?: {
    ASSET_NAME?: string;
    SIZE_NAME?: string;
    SIZE_UNIT?: string;
    HEIGHT_NAME?: string;
    WIDTH_NAME?: string;
  };
}

export interface TypeRootConfigSreen {
  configureConfigScreen?: Function;
  checkConfigValidity?: Function;
  customWholeJson?: Function;
}

export interface TypeRootCustomField {
  filterAssetData?: Function;
  getSelectorWindowUrl?: Function;
  handleConfigtoSelectorPage?: Function;
  handleSelectorPageData?: Function;
  handleSelectorWindow?: Function;
  handleAuthWindow?: Function;
  modifyAssetsToSave?: Function;
}

export interface TypeRootSelector {
  openComptactView?: Function;
  customSelectorComponent?: Function;
}

export interface TypeRootConfig {
  damEnv: TypeRootDamEnv;
  configureConfigScreen?: Function;
  checkConfigValidity?: Function;
  customWholeJson?: Function;
  filterAssetData?: Function;
  getSelectorWindowUrl?: Function;
  handleSelectorPageData?: Function;
  handleSelectorWindow?: Function;
  openComptactView?: Function;
  customSelectorComponent?: Function;
  handleConfigtoSelectorPage?: Function;
  handleAuthWindow?: Function;
  modifyAssetsToSave?: Function;
}

export interface TypeCustomConfigUpdateParams {
  fieldName: string;
  fieldValue: string;
  saveConfig?: boolean;
  saveServerConfig?: boolean;
}

export interface TypeErrorFn {
  isErr: boolean;
  errorText: string;
}

export interface AddMultiConfigurationModalProps {
  handleMultiConfig: (config: any) => void;
  multiConfigData: any;
  closeModal: any;
}

export type TypeFnHandleCustomConfigProps = [
  configLabel: string,
  fieldName: string,
  fieldValue: any,
  saveInConfig?: boolean,
  saveInServerConfig?: boolean
];

export interface TypeCustomConfigParams {
  config: any;
  serverConfig: any;
  handleCustomConfigUpdate: (...args: TypeFnHandleCustomConfigProps) => void;
}

export interface TypeCustomConfig {
  customConfig?: TypeCustomConfigParams;
  currentConfigLabel: string;
}
