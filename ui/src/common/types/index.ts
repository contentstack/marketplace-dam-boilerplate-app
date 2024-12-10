export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}

export type Props = {
  [key: string]: any;
};

interface ConfigStructure {
  selected_config: Props;
  default_multi_config_key: string;
  multi_config_keys: Props;
  is_custom_json: boolean;
  dam_keys: TypeOption[];
  [key: string]: any;
}

export interface TypeAppSdkConfigState {
  configuration: ConfigStructure;
  serverConfiguration: {
    multi_config_keys: Props;
    [key: string]: any;
  };
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
  thumbnailUrl: string;
  size?: any;
  height?: any;
  width?: any;
  previewUrl?: string;
  platformUrl?: string;
  cs_metadata?: Props;
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
  isDisabled?: boolean;
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
  handleMultiConfig: (config: string) => void;
  multiConfigData: Props;
  closeModal: () => void;
}

export type TypeFnHandleCustomConfigProps = [
  configLabel: string,
  fieldName: string,
  fieldValue: any,
  saveInConfig?: boolean,
  saveInServerConfig?: boolean
];

export interface TypeCustomConfigParams {
  config: Props;
  serverConfig: Props;
  handleCustomConfigUpdate: (...args: TypeFnHandleCustomConfigProps) => void;
}

export interface TypeCustomConfig {
  customConfig?: TypeCustomConfigParams;
  currentConfigLabel: string;
}

type InputFieldType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "search"
  | "url"
  | "date"
  | "time"
  | string;

export interface TypeBaseFields {
  type:
    | "textInputField"
    | "radioInputField"
    | "selectInputField"
    | "customInputField";
  labelText: string;
  helpText?: string;
  placeholderText?: string;
  instructionText?: string;
  saveInConfig: boolean;
  saveInServerConfig: boolean;
  isMultiConfig?: boolean;
  options?: TypeOption[];
  defaultSelectedOption?: string;
  component?: (acckey: string) => React.ReactNode;
}

export interface TypeInputField extends TypeBaseFields {
  inputFieldType: InputFieldType;
}

export interface TypeCustomField
  extends Omit<
    TypeBaseFields,
    "labelText" | "helpText" | "placeholderText" | "instructionText"
  > {
  type: "customInputField";
}

export type CombinedFields = TypeBaseFields | TypeCustomField | TypeInputField;

export type Configurations = Record<string, CombinedFields>;

export interface TypeUpdateTrigger {
  configName: string;
  configValue: any;
  saveInConfig?: boolean;
  saveInServerConfig?: boolean;
}

export interface ConfigStateProviderProps {
  children: React.ReactNode;
  updateValueFunc: (
    configName: string,
    configValue: any,
    inConfig?: boolean,
    inServerConfig?: boolean
  ) => void;
}

export interface TypeEmptySearchProps {
  EmptySearchHeading: string;
  EmptySearchDescription: string;
  EmptySearchMessage: string;
  EmptySearchHelpLink: string;
  EmptySearchHelpText: string;
}

interface MinMax {
  min: number;
  max: number;
  exact: number;
}

export interface TypeAdvancedConfig {
  size: MinMax;
  height: MinMax;
  width: MinMax;
}

export interface TypeIconElement {
  type: string;
  thumbnailUrl: string;
  handleImageError: () => void;
  isConfigAvailable: boolean;
}

export type BranchOption = {
  label: string;
  value: string;
  api_key: string;
};
export type MultiConfigBranchObj = {
  [key: string]: string[];
};
export type TypeSelectOptions = Omit<BranchOption, "api_key">;
export type TypeMultiBranch = Record<string, BranchOption[]>;
