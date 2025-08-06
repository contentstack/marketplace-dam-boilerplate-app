import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  DAM_APP_NAME: "DAM",
  ASSET_UNIQUE_ID: "id",
  SELECTOR_PAGE_LOGO: Logo,
  IS_DAM_SCRIPT: true,
  DAM_SCRIPT_URL: "",
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", "authWindow", default => "novalue"
  REQUIRED_CONFIG_FIELDS: ["textField", "radioField", "selectField"],
  SELECTOR_CONFIG_CHECK_FIELDS: [],
  ADVANCED_ASSET_PARAMS: {
    ASSET_NAME: "name", // add property name for NAME. If present in nested structure, add nested structure reference.
    SIZE_NAME: "size", // add property name for SIZE. If present in nested structure, add nested structure reference.
    SIZE_UNIT: "BYTES", // possible values "BYTES"(default), "KB", "MB", "GB", "TB". Mention the unit for asset size provided by third-party dam.
    HEIGHT_NAME: "height", // add property name for HEIGHT. If present in nested structure, add nested structure reference.
    WIDTH_NAME: "width", // add property name for WIDTH. If present in nested structure, add nested structure reference.
  },
};

export default DamEnvVariables;
