import React from "react";
import { cbModal, Icon } from "@contentstack/venus-components";
import localeTexts from "../locale/en-us";
import { TypePopupWindowDetails } from "../types";
import DeleteModal from "../../containers/CustomField/DeleteModal";

// function to open a popup window
const popupWindow = (windowDetails: TypePopupWindowDetails) => {
  const left = window.screen.width / 2 - windowDetails.w / 2;
  const top = window.screen.height / 2 - windowDetails.h / 2;
  return window.open(
    windowDetails.url,
    windowDetails.title,
    "toolbar=no, location=no, directories=no, " +
      "status=no, menubar=no, scrollbars=no, resizable=no, " +
      `copyhistory=no, width=${windowDetails.w}, ` +
      `height=${windowDetails.h}, ` +
      `top=${top}, left=${left}`
  );
};

// function to merge 2 objects
const mergeObjects = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` then
  // set property to merge of `target` and `source` properties
  Object.keys(source)?.forEach((key) => {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], mergeObjects(target[key], source[key]));
    }
  });

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

// function to load script
const loadDAMScript = (url: string) =>
  new Promise((resolve) => {
    const DAMScript: any = document.createElement("script");
    const bodyTag = document.getElementsByTagName("body")?.[0];
    DAMScript.src = url;
    DAMScript.id = "DAMScript";
    DAMScript.type = "text/javascript";
    if (DAMScript?.readyState) {
      DAMScript.onreadystatechange = function () {
        if (
          DAMScript.readyState === "loaded" ||
          DAMScript.readyState === "complete"
        ) {
          DAMScript.onreadystatechange = null;
          resolve(true);
        }
      };
    } else {
      DAMScript.onload = function () {
        resolve(true);
      };
    }
    bodyTag.appendChild(DAMScript);
  });

// get hover action tooltip for asset card
const getHoverActions = (
  type: string,
  removeAsset: Function,
  id: string,
  name: string,
  platformUrl?: string,
  previewUrl?: string
) => {
  const tootipActionArray = [
    {
      actionTitle: localeTexts.CustomFields.assetCard.hoverActions.drag,
      actionIcon: <Icon icon="MoveIcon" size="mini" className="drag" />,
      actionOnClick: () => {
        /**/
      },
    },
  ];

  if (
    (type?.toLowerCase() === "image" || type?.toLowerCase() === "video") &&
    previewUrl
  ) {
    tootipActionArray.push({
      actionTitle: localeTexts.CustomFields.assetCard.hoverActions.preview,
      actionIcon: <Icon icon="View" size="tiny" />,
      actionOnClick: () => window.open(previewUrl, "_blank"),
    });
  }

  if (platformUrl) {
    tootipActionArray.push({
      actionTitle:
        localeTexts.CustomFields.assetCard.hoverActions.platformRedirect,
      actionIcon: <Icon icon="NewTab" size="mini" />,
      actionOnClick: () => window.open(platformUrl, "_blank"),
    });
  }

  tootipActionArray.push({
    actionIcon: <Icon icon="Trash" size="mini" />,
    actionTitle: localeTexts.CustomFields.assetCard.hoverActions.remove,
    actionOnClick: () =>
      cbModal({
        component: (props: any) => (
          <DeleteModal
            type="Asset"
            remove={removeAsset}
            id={id}
            name={name}
            {...props}
          />
        ),
        modalProps: {
          size: "xsmall",
        },
      }),
  });

  return tootipActionArray;
};

// function to filter unique assets of array based on "iteratee"
const uniqBy = (arr: any[], iteratee: any) => {
  if (typeof iteratee === "string") {
    const prop = iteratee;
    iteratee = (item: any) => item?.[prop];
  }

  return arr?.filter(
    (x, i, self) =>
      i === self?.findIndex((y) => iteratee(x) === iteratee(y)) && x !== null
  );
};

// find asset index from array of assets
function findAssetIndex(assets: any[], id: any) {
  let prod: number = -1;
  const assetsLength = (assets || [])?.length;
  for (let p = 0; p < assetsLength; p += 1) {
    if (assets[p]?.id === id) {
      prod = p;
      break;
    }
  }
  return prod;
}

// find assest from array of assets
function findAsset(assets: any[], id: any) {
  return assets?.find((asset: any) => asset?.id === id) || {};
}

const utils = {
  popupWindow,
  mergeObjects,
  loadDAMScript,
  getHoverActions,
  uniqBy,
  findAssetIndex,
  findAsset,
};

export default utils;
