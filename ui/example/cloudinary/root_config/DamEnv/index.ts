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
};
export default DamEnvVariables;
