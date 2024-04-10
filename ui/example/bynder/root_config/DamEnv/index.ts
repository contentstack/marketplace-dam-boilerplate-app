import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  IS_DAM_SCRIPT: true,
  DAM_APP_NAME: "Bynder",
  SELECTOR_CONFIG_CHECK_FIELDS: ["org_url", "language", "mode"],
  ASSET_UNIQUE_ID: "id",
  DAM_SCRIPT_URL:
    "https://ucv.bynder.com/5.0.5/modules/compactview/bynder-compactview-3-latest.js",
  SELECTOR_PAGE_LOGO: Logo,
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
  ADVANCED_ASSET_PARAMS: {
    ASSET_NAME: "name", // add property name for NAME. If present in nested structure, add nested structure reference.
    SIZE_NAME: "files.webImage.fileSize", // add property name for SIZE. If present in nested structure, add nested structure reference.
    SIZE_UNIT: "BYTES", // possible values "BYTES"(default), "KB", "MB", "GB", "TB". Mention the unit for asset size provided by third-party dam.
    HEIGHT_NAME: "files.webImage.height", // add property name for HEIGHT. If present in nested structure, add nested structure reference.
    WIDTH_NAME: "files.webImage.width", // add property name for WIDTH. If present in nested structure, add nested structure reference.
  },
};

export default DamEnvVariables;
