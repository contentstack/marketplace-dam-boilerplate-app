import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  DAM_APP_NAME: "DAM",
  ASSET_UNIQUE_ID: "id",
  SELECTOR_PAGE_LOGO: Logo,
  CONFIG_FIELDS: [],
  REQUIRED_CONFIG_FIELDS: [],
  IS_DAM_SCRIPT: true,
  DAM_SCRIPT_URL: "",
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", "authWindow", default => "novalue"
};

export default DamEnvVariables;
