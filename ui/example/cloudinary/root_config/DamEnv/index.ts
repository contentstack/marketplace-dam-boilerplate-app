import Logo from "../../common/asset/logo.svg";
import { TypeRootDamEnv } from "../../common/types";

const DamEnvVariables: TypeRootDamEnv = {
  IS_DAM_SCRIPT: true,
  DAM_APP_NAME: "Cloudinary",
  CONFIG_FIELDS: ["cloudName", "apiKey"],
  ASSET_UNIQUE_ID: "public_id",
  DAM_SCRIPT_URL: "https://media-library.cloudinary.com/global/all.js",
  SELECTOR_PAGE_LOGO: Logo,
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
  ADVANCED_ASSET_PARAMS: {
    ASSET_NAME: "public_id", // add property name for NAME. If present in nested structure, add nested structure reference.
    SIZE_NAME: "bytes", // add property name for SIZE. If present in nested structure, add nested structure reference.
    SIZE_UNIT: "BYTES", // possible values "BYTES"(default), "KB", "MB", "GB", "TB". Mention the unit for asset size provided by third-party dam.
    HEIGHT_NAME: "height", // add property name for HEIGHT. If present in nested structure, add nested structure reference.
    WIDTH_NAME: "width", // add property name for WIDTH. If present in nested structure, add nested structure reference.
  },
};
export default DamEnvVariables;
