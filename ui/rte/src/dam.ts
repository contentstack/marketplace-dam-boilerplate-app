import { v4 } from "uuid";
import localeTexts from "./common/locale/en-us/index";
import utils from "./common/utils/index";
import rteConfig from "./rte_config";

let rte: any;
let savedSelection: any;
let config: any;
let advancedConfig: any;
let currentLocale: string;

const getCurrentConfigLabel = () => {
  const { config_label: configLabel, locale } = advancedConfig;
  let finalConfigLabel = configLabel?.[0] ?? config?.default_multi_config_key;
  if (locale?.[currentLocale]?.config_label?.length) {
    finalConfigLabel = locale?.[currentLocale]?.config_label?.[0];
  }
  return finalConfigLabel;
};

const getConfig = () => {
  // eslint-disable-next-line
  const { multi_config_keys, default_multi_config_key } = config;
  if (Object.keys(multi_config_keys ?? {})?.length) {
    const finalConfigLabel = getCurrentConfigLabel();
    const multiConfig = multi_config_keys?.[finalConfigLabel] ?? {};

    const finalConfig = default_multi_config_key
      ? {
          ...config,
          selected_config: {
            ...multiConfig,
          },
        }
      : { ...config };
    delete finalConfig.default_multi_config_key;
    delete finalConfig.multi_config_keys;

    const finalContentTypeConfig = { ...advancedConfig };
    delete finalContentTypeConfig.config_label;
    delete finalContentTypeConfig.locale;

    return { config: finalConfig, contentTypeConfig: finalContentTypeConfig };
  }
  return { config, contentTypeConfig: advancedConfig };
};

// returns final config values from app_config and custom_field_config
const getSelectorConfig = () => {
  const finalConfig = getConfig();
  const configObj =
    rteConfig?.handleConfigtoSelectorPage?.(
      finalConfig?.config,
      finalConfig?.contentTypeConfig,
      currentLocale
    ) ?? {};

  if (Object.keys(configObj)?.length) return configObj;
  return finalConfig?.config;
};

const saveData = (event: any) => {
  const { data } = event;

  if (data?.message === "openedReady") {
    event?.source?.postMessage(
      {
        message: "init",
        config: getSelectorConfig(),
        type: rteConfig?.damEnv?.DAM_APP_NAME,
      },
      process.env.REACT_APP_CUSTOM_FIELD_URL ?? ""
    );
  } else {
    let dataArr;
    if (
      rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "window" ||
      rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "url"
    ) {
      dataArr = rteConfig?.handleSelectorPageData?.(event);
    } else if (
      data?.message === "add" &&
      data?.type === rteConfig?.damEnv?.DAM_APP_NAME
    ) {
      dataArr = data?.selectedAssets;
    }
    dataArr?.forEach((asset: any) => {
      asset.height = null;
      asset.width = null;

      const element = {
        type: rteConfig?.damEnv?.DAM_APP_NAME,
        attrs: asset,
        uid: v4()?.split("-")?.join(""),
        children: [{ text: "" }],
      };

      rte?.insertNode(element, {
        at: savedSelection,
      });
    });
  }
};

const openSelector = (url) => {
  utils.popupWindow({
    url,
    title: localeTexts.SelectorPage.title,
    w: 1500,
    h: 800,
  });
};

export const onClickHandler = async (props) => {
  rte = props?.rte;
  savedSelection = props?.savedSelection;
  config = props?.config;
  advancedConfig = props?.advancedConfig;
  currentLocale = props?.currentLocale;

  const finalConfig = getConfig();

  if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "window") {
    rteConfig?.handleSelectorWindow?.(
      finalConfig?.config,
      finalConfig?.contentTypeConfig
    );
  } else {
    const windowLocation = window.location.origin;
    let queryLocation = "";
    const regionMapping = JSON.parse(
      process.env.REACT_APP_REGION_MAPPING ?? ""
    );
    const newMapping = {};
    Object.keys(regionMapping)?.forEach(
      (key) => (newMapping[key] = regionMapping?.[key]?.JSON_RTE_URL)
    );

    for (const [key, value] of Object.entries(newMapping)) {
      if (value === windowLocation) {
        queryLocation = key;
        break;
      }
    }

    let url;
    if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "url") {
      url = rteConfig?.getSelectorWindowUrl?.(
        finalConfig?.config,
        finalConfig?.contentTypeConfig
      );
    } else {
      url = `${process.env.REACT_APP_CUSTOM_FIELD_URL}/#/selector-page?location=${queryLocation}`;
    }

    if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "authWindow") {
      new Promise((resolve, reject) => {
        rteConfig?.handleAuthWindow?.(
          finalConfig?.config,
          finalConfig?.contentTypeConfig,
          resolve,
          reject
        );
      })
        .then(() => {
          openSelector(url);
        })
        .catch((error) => {
          console.error("Error: Authentication Failed in Auth Window", error);
        });
    } else {
      openSelector(url);
    }
  }

  window.addEventListener("message", saveData, false);
};
