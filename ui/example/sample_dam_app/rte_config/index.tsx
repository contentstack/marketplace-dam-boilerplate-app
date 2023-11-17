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

const rteConfig: any = {
  damEnv,
  getDisplayUrl,
  getAssetType,
  getViewIconforTooltip,
  getSelectorWindowUrl,
  handleSelectorPageData,
  handleSelectorWindow,
};

export default rteConfig;
