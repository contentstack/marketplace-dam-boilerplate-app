import rootConfigScreen from "./ConfigScreen";
import DamEnvVariables from "./DamEnv";
import rootCustomField from "./CustomField";
import rootSelectorPage from "./SelectorPage";

// <------------ ENVIRONMENT VALUES ------------>

const damEnv = DamEnvVariables;

// <--------- CONFIG SCREEN FUNCTIONS ---------->

const configureConfigScreen = rootConfigScreen?.configureConfigScreen;

const customConfigComponent = rootConfigScreen?.customConfigComponent;

const customWholeJson = rootConfigScreen?.customWholeJson;

// <---------- CUSTOM FIELD FUNCTIONS ---------->

const filterAssetData = rootCustomField?.filterAssetData;

const handleConfigtoSelectorPage = rootCustomField?.handleConfigtoSelectorPage;

const getSelectorWindowUrl = rootCustomField?.getSelectorWindowUrl;

const handleSelectorPageData = rootCustomField?.handleSelectorPageData;

const handleSelectorWindow = rootCustomField?.handleSelectorWindow;

// <---------- SELECTOR PAGE FUNCTIONS ---------->

const openComptactView = rootSelectorPage?.openComptactView;

const customSelectorComponent = rootSelectorPage?.customSelectorComponent;

const rootConfig: any = {
  damEnv,
  configureConfigScreen,
  customConfigComponent,
  customWholeJson,
  filterAssetData,
  getSelectorWindowUrl,
  handleSelectorPageData,
  handleSelectorWindow,
  openComptactView,
  customSelectorComponent,
  handleConfigtoSelectorPage,
};

export default rootConfig;
