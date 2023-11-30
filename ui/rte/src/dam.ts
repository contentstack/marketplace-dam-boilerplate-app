import { v4 } from "uuid";
import localeTexts from "./common/locale/en-us/index";
import utils from "./common/utils/index";
import rteConfig from "./rte_config";

let rte: any;
let savedSelection: any;
let config: any;

const saveData = (event: any) => {
  const { data } = event;

  if (data?.message === "openedReady") {
    event?.source?.postMessage(
      {
        message: "init",
        config,
        type: rteConfig?.damEnv?.DAM_APP_NAME,
      },
      process.env.REACT_APP_UI_URL ?? ""
    );
  } else {
    let dataArr;
    if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE !== "novalue") {
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

export const onClickHandler = async (props) => {
  rte = props?.rte;
  savedSelection = props?.savedSelection;
  config = props?.config;

  if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "window") {
    rteConfig?.handleSelectorWindow?.(config);
  } else {
    const windowLocation = window.location.origin;
    let queryLocation = "";
    switch (windowLocation) {
      case process.env.REACT_APP_UI_URL_NA:
        queryLocation = "NA";
        break;
      case process.env.REACT_APP_UI_URL_EU:
        queryLocation = "EU";
        break;
      case process.env.REACT_APP_UI_URL_AZURE_NA:
        queryLocation = "AZURE_NA";
        break;
      default:
        queryLocation = "AZURE_EU";
    }
    let url;
    if (rteConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "url") {
      url = rteConfig?.getSelectorWindowUrl?.(config);
    } else {
      url = `${process.env.REACT_APP_UI_URL}/#/selector-page?location=${queryLocation}`;
    }
    utils.popupWindow({
      url,
      title: localeTexts.SelectorPage.title,
      w: 1500,
      h: 800,
    });
  }

  window.addEventListener("message", saveData, false);
};
