import rootConfigScreen from "./ConfigScreen";
import DamEnvVariables from "./DamEnv";
import rootCustomField from "./CustomField";
import rootSelectorPage from "./SelectorPage";
import { TypeRootConfig } from "../common/types";

// <------------ ENVIRONMENT VALUES ------------>

const damEnv = DamEnvVariables;

// <--------- CONFIG SCREEN FUNCTIONS ---------->

const configureConfigScreen = rootConfigScreen?.configureConfigScreen;

const customConfigComponent = rootConfigScreen?.customConfigComponent;

const checkConfigValidity = rootConfigScreen?.checkConfigValidity;

const customWholeJson = rootConfigScreen?.customWholeJson;

// <---------- CUSTOM FIELD FUNCTIONS ---------->

const filterAssetData = rootCustomField?.filterAssetData;

const handleConfigtoSelectorPage = rootCustomField?.handleConfigtoSelectorPage;

const getSelectorWindowUrl = rootCustomField?.getSelectorWindowUrl;

const handleSelectorPageData = rootCustomField?.handleSelectorPageData;

const handleSelectorWindow = rootCustomField?.handleSelectorWindow;

const handleAuthWindow = rootCustomField?.handleAuthWindow;

const modifyAssetsToSave = rootCustomField?.modifyAssetsToSave;

// <---------- SELECTOR PAGE FUNCTIONS ---------->

const openComptactView = rootSelectorPage?.openComptactView;

const customSelectorComponent = rootSelectorPage?.customSelectorComponent;

const rootConfig: TypeRootConfig = {
  damEnv,
  configureConfigScreen,
  customConfigComponent,
  checkConfigValidity,
  customWholeJson,
  filterAssetData,
  handleConfigtoSelectorPage,
  getSelectorWindowUrl,
  handleSelectorPageData,
  handleAuthWindow,
  modifyAssetsToSave,
  handleSelectorWindow,
  openComptactView,
  customSelectorComponent,
};

export default rootConfig;
