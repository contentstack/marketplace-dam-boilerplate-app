import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  IS_DAM_SCRIPT: true,
  DAM_APP_NAME: "DAM",
  CONFIG_FIELDS: [],
  ASSET_UNIQUE_ID: "id",
  DAM_SCRIPT_URL: "",
  SELECTOR_PAGE_LOGO: Logo,
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
};

export default DamEnvVariables;
