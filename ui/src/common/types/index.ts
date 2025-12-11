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
  thumbnailUrl?: string;
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
  saveInServerConfig?: boolean,
  isMultiConfig?: boolean
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
  isMultiConfig?: boolean;
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

export interface TypedefaultOp {
  operation: "add" | "remove";
  options: string[];
}

export interface BranchRule {
  branch_uid: string[];
  config_label: string;
}
export interface UnifiedConfigRule {
  branch_uid: string;
  locales_uid: string[];
  config_label: string;
}

export interface AssetData {
  _id: string;
  assetName: string;
  assetUrl?: string;
  thumbnail?: string;
  fileSize?: string;
  fileType?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  createdDate?: string;
  [key: string]: any;
}

export interface TableColumn {
  Header: string;
  id?: string;
  accessor: string | any;
  disableSortBy?: boolean;
  columnWidthMultiplier?: number;
  default?: boolean;
  addToColumnSelector?: boolean;
  cssClass?: string;
}

export interface TableSelectorProps {
  config: any;
  setError: (errObj: any) => void;
  successFn: (assets: any[]) => void;
  closeFn: () => void;
  selectedAssetIds: string[];
  assetData: AssetData[];
}

export interface TableProps {
  setError: (errObj: any) => void;
  successFn: (assets: any[]) => void;
  closeFn: () => void;
  selectedAssetIds: string[];
  assetData: any[];
}

export interface TypeCustomComponent {
  config: any;
  setError: (errObj: any) => void;
  successFn: (assets: any[]) => void;
  closeFn: () => void;
  selectedAssetIds: string[];
}

export interface RuleContainerOption {
  label: string;
  value: any;
}

export interface RuleContainerMapping {
  [key: string]: any;
}

export interface RuleContainerConfig {
  branchPlaceholder?: string;
  configPlaceholder?: string;
  localePlaceholder?: string;
  isMultiBranch?: boolean;
  isMultiConfig?: boolean;
  isMultiLocale?: boolean;
  isBranchExhaustive?: boolean;
  isConfigExhaustive?: boolean;
  isLocaleExhaustive?: boolean;
  isLocaleDisabled?: boolean;
  // Legacy support - will be removed
  leftPlaceholder?: string;
  middlePlaceholder?: string;
  rightPlaceholder?: string;
  isMultiLeft?: boolean;
  isMultiMiddle?: boolean;
  isMultiRight?: boolean;
  isLeftExhaustive?: boolean;
  isMiddleExhaustive?: boolean;
  isRightExhaustive?: boolean;
  isRightDisabled?: boolean;
  noOptionsMessage?: string;
  deleteTooltip?: string;
  separator?: string;
  containerClass?: string;
  selectWidth?: string;
  separatorClass?: string;
  iconClass?: string;
  showTooltip?: boolean;
  showDeleteIcon?: boolean;
  isSearchable?: boolean;
  multiDisplayLimit?: number;
  maxCharacters?: number;
}

export interface RuleContainerProps {
  mappings: RuleContainerMapping[];
  branchOptions: RuleContainerOption[];
  configOptions: RuleContainerOption[];
  getLocaleOptionsForBranch?: (branch: string) => RuleContainerOption[];
  validConfigs?: Set<string>;
  isBranchLoading?: (branch: string) => boolean;

  onBranchSelect: (data: any, index: number) => void;
  onConfigSelect: (data: any, index: number) => void;
  onLocaleSelect?: (data: any, index: number) => void;
  onDelete: (index: number) => void;

  config?:
  | RuleContainerConfig
  | {
    branchPlaceholder?: string;
    configPlaceholder?: string;
    localePlaceholder?: string;
    noOptionsMessage?: string;
    deleteTooltip?: string;
    separator?: string;
    containerClass?: string;
    selectWidth?: string;
    separatorClass?: string;
    iconClass?: string;
    showTooltip?: boolean;
    showDeleteIcon?: boolean;
    isLocaleDisabled?: boolean;
    isSearchable?: boolean;
    multiDisplayLimit?: number;
    isMultiBranch?: boolean;
    isMultiConfig?: boolean;
    isMultiLocale?: boolean;
    isBranchExhaustive?: boolean;
    isConfigExhaustive?: boolean;
    isLocaleExhaustive?: boolean;
    maxCharacters?: number;
    ruleType?: string;
  };
}

export interface UnifiedRule {
  branch_uid: string | string[];
  locales_uid: string[];
  config_label: string | string[];
}

export interface ConfigRule {
  config_label: string[];
  locales?: {
    [localeCode: string]: {
      config_label: string[];
    };
  };
}

export interface ConfigRules {
  [branchId: string]: ConfigRule;
}

export interface LocaleType {
  code: string;
  name: string;
  fallback_locale: string | null;
  uid: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  ACL: any[];
  _version: number;
}
