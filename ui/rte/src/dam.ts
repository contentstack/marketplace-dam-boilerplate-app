import { v4 } from "uuid";
import { Notification } from "@contentstack/venus-components";
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

const flatten = (data: any) => {
  const result: any = {};
  function recurse(cur: any, prop: string) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      let l;
      // eslint-disable-next-line
      for (let i = 0, l = cur?.length; i < l; i++)
        recurse(cur?.[i], `${prop}[${i}]`);
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      // eslint-disable-next-line
      for (const p in cur) {
        isEmpty = false;
        recurse(cur?.[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
};

const convertToBytes = (value: number, unit: string) => {
  const units = ["BYTES", "KB", "MB", "GB", "TB"];
  const index = units?.findIndex((u) => u === unit);
  return value * 1024 ** (index ?? 0);
};

const saveData = (event: any) => {
  if (event?.origin !== process.env.REACT_APP_CUSTOM_FIELD_URL) return;
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
    const {
      SIZE_NAME: SIZE,
      SIZE_UNIT = "BYTES",
      HEIGHT_NAME: HEIGHT,
      WIDTH_NAME: WIDTH,
    } = rteConfig.damEnv.ADVANCED_ASSET_PARAMS ?? {};
    const { size, height, width } = advancedConfig?.advanced;
    const acceptedAssets: any[] = [];
    const rejectedAssets: any[] = [];

    const checkValues = new Map([
      [SIZE, size],
      [HEIGHT, height],
      [WIDTH, width],
    ]);
    const checks: string[] = [];
    [SIZE, HEIGHT, WIDTH]?.forEach((key) => {
      if (key) {
        checks?.push(key);
      }
    });

    dataArr?.forEach((asset: any) => {
      if (Object.keys(config?.multi_config_keys ?? {})?.length) {
        const configLabel = getCurrentConfigLabel();
        asset.cs_metadata = {
          config_label: configLabel,
        };
      }
      const assetFlatStructure = flatten(asset);
      let itemCount = 0;
      let validationCount = 0;

      checks?.forEach((key) => {
        const propValue = checkValues?.get(key);
        if (propValue) {
          itemCount += 1;
          const value = convertToBytes(assetFlatStructure?.[key], SIZE_UNIT);
          if (
            (propValue?.max &&
              propValue?.min &&
              !propValue?.exact &&
              value <= propValue?.max &&
              value >= propValue?.min) ||
            (propValue?.max &&
              !propValue?.min &&
              !propValue?.exact &&
              value <= propValue?.max) ||
            (propValue?.min &&
              !propValue?.max &&
              !propValue?.exact &&
              value >= propValue?.min) ||
            (propValue?.exact && value === propValue?.exact)
          ) {
            validationCount += 1;
          }
        }
      });

      if (itemCount === validationCount) {
        acceptedAssets?.push(asset);
        
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
      } else rejectedAssets?.push(asset);
    });

    if (rejectedAssets?.length) {
      let message = `${localeTexts.RTE.assetValidation.errorStatement.replace(
        "$var",
        "Some Assets"
      )}`;

      if (rteConfig?.damEnv?.ADVANCED_ASSET_PARAMS?.ASSET_NAME) {
        const rejectedAssetNames = rejectedAssets?.map((asset: any) => {
          const assetFlatStructure = flatten(asset);
          return assetFlatStructure?.[
            rteConfig?.damEnv?.ADVANCED_ASSET_PARAMS?.ASSET_NAME ?? ""
          ];
        });
        message = `${localeTexts.RTE.assetValidation.errorStatement.replace(
          "$var",
          rejectedAssetNames?.map((item) => `"${item}"`)?.join(", ")
        )}`;
      }

      Notification({
        displayContent: {
          error: {
            error_message: message,
          },
        },
        notifyProps: {
          hideProgressBar: true,
          closeButton: true,
        },
        type: "error",
      });
    }
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
