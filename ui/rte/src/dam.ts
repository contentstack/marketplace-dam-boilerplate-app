import { v4 } from "uuid";
import localeTexts from "./common/locale/en-us/index";
import utils from "./common/utils/index";
import rteConfig from "./rte_config";

let rte: any;
let savedSelection: any;
let config: any;

const saveData = (event: any) => {
  if (event?.origin !== process.env.REACT_APP_CUSTOM_FIELD_URL) return;
  const { data } = event;
  if (data?.message === "openedReady") {
    event?.source?.postMessage(
      {
        message: "init",
        config,
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

  if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "window") {
    rteConfig?.handleSelectorWindow?.(config);
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
      url = rteConfig?.getSelectorWindowUrl?.(config);
    } else {
      url = `${process.env.REACT_APP_CUSTOM_FIELD_URL}/#/selector-page?location=${queryLocation}`;
    }

    if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "authWindow") {
      new Promise((resolve, reject) => {
        rteConfig?.handleAuthWindow?.(config, resolve, reject);
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
