import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  DAM_APP_NAME: "DAM Sample App",
  ASSET_UNIQUE_ID: "_id",
  SELECTOR_PAGE_LOGO: Logo,
  CONFIG_FIELDS: [],
  IS_DAM_SCRIPT: false,
  DAM_SCRIPT_URL: "",
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
  ADVANCED_ASSET_PARAMS: {
    ASSET_NAME: "assetName", // add property name for NAME. If present in nested structure, add nested structure reference.
    SIZE_NAME: "dimensions.size", // add property name for SIZE. If present in nested structure, add nested structure reference.
    SIZE_UNIT: "BYTES", // possible values "BYTES"(default), "KB", "MB", "GB", "TB". Mention the unit for asset size provided by third-party dam.
    HEIGHT_NAME: "dimensions.height", // add property name for HEIGHT. If present in nested structure, add nested structure reference.
    WIDTH_NAME: "dimensions.width", // add property name for WIDTH. If present in nested structure, add nested structure reference.
  },
};

export default DamEnvVariables;
