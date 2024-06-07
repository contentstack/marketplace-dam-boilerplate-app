import rteFunctions from "./RTEFunctions";
import DamEnvVariables from "./DamEnv";

// <------------ ENVIRONMENT VALUES ------------>

const damEnv = DamEnvVariables;

// <------------ JSON RTE FUNCTIONS ------------>

const getDisplayUrl = rteFunctions?.getDisplayUrl;

const getAssetType = rteFunctions?.getAssetType;

const getViewIconforTooltip = rteFunctions?.getViewIconforTooltip;

const getSelectorWindowUrl = rteFunctions?.getSelectorWindowUrl;

const handleSelectorPageData = rteFunctions?.handleSelectorPageData;

const handleSelectorWindow = rteFunctions?.handleSelectorWindow;

const handleAuthWindow = rteFunctions?.handleAuthWindow;

const handleConfigtoSelectorPage = rteFunctions?.handleConfigtoSelectorPage;

const rteConfig: any = {
  damEnv,
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
  getSelectorWindowUrl,
  handleSelectorPageData,
  handleSelectorWindow,
  handleAuthWindow,
  handleConfigtoSelectorPage,
};

export default rteConfig;
