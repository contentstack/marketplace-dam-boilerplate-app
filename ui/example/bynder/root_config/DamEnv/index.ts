import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  IS_DAM_SCRIPT: true,
  DAM_APP_NAME: "Bynder",
  CONFIG_FIELDS: ["org_url", "language", "mode"],
  ASSET_UNIQUE_ID: "id",
  DAM_SCRIPT_URL:
    "https://ucv.bynder.com/5.0.5/modules/compactview/bynder-compactview-3-latest.js",
  SELECTOR_PAGE_LOGO: Logo,
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
};

export default DamEnvVariables;
