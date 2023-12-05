import React from "react";
import { Icon, cbModal } from "@contentstack/venus-components";
import DeleteModal from "../../components/DeleteModal";
import { TypePopupWindowDetails } from "../types";
import localeTexts from "../locale/en-us";

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
    tootipActionArray?.push({
      actionTitle: localeTexts.CustomFields.assetCard.hoverActions.preview,
      actionIcon: <Icon icon="View" size="tiny" />,
      actionOnClick: () => window.open(previewUrl, "_blank"),
    });
  }

  if (platformUrl) {
    tootipActionArray?.push({
      actionTitle:
        localeTexts.CustomFields.assetCard.hoverActions.platformRedirect,
      actionIcon: <Icon icon="NewTab" size="mini" />,
      actionOnClick: () => window.open(platformUrl, "_blank"),
    });
  }

  tootipActionArray?.push({
    actionIcon: <Icon icon="RemoveFilled" size="mini" />,
    actionTitle: localeTexts.CustomFields.assetCard.hoverActions.remove,
    actionOnClick: () =>
      cbModal({
        component: (props: any) => (
          <DeleteModal remove={removeAsset} id={id} name={name} {...props} />
        ),
        modalProps: {
          size: "xsmall",
        },
      }),
  });

  return tootipActionArray;
};

const getListHoverActions = (
  type: string,
  removeAsset: Function,
  id: string,
  name: string,
  platformUrl?: string,
  previewUrl?: string
) => {
  const tootipActionArray = [
    {
      title: localeTexts.CustomFields.assetCard.hoverActions.drag,
      label: <Icon icon="MoveIcon" size="mini" className="drag" />,
      action: () => {
        /**/
      },
    },
  ];

  if (
    (type?.toLowerCase() === "image" || type?.toLowerCase() === "video") &&
    previewUrl
  ) {
    tootipActionArray?.push({
      title: localeTexts.CustomFields.assetCard.hoverActions.preview,
      label: <Icon icon="View" size="tiny" />,
      action: () => window.open(previewUrl, "_blank"),
    });
  }

  if (platformUrl) {
    tootipActionArray?.push({
      title: localeTexts.CustomFields.assetCard.hoverActions.platformRedirect,
      label: <Icon icon="NewTab" size="mini" />,
      action: () => window.open(platformUrl, "_blank"),
    });
  }

  tootipActionArray?.push({
    label: <Icon icon="RemoveFilled" size="mini" />,
    title: localeTexts.CustomFields.assetCard.hoverActions.remove,
    action: () =>
      cbModal({
        component: (props: any) => (
          <DeleteModal remove={removeAsset} id={id} name={name} {...props} />
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

const extractKeys = (arr: any[]) => arr?.map((key: any) => key?.value);

const removeEmptyFromArray = (arr: any) =>
  arr?.filter((item: any) => item !== undefined);

const cleanUpArrays: any = (obj: any) => {
  if (Array.isArray(obj)) {
    return removeEmptyFromArray(obj?.map((item) => cleanUpArrays(item)));
  }
  if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    Object.keys(obj)?.forEach((key) => {
      newObj[key] = cleanUpArrays(obj?.[key]);
    });
    return newObj;
  }
  return obj;
};

const convertStringAndMergeToObject = (
  inputString: string,
  value: any,
  existingObject: any
) => {
  const properties = inputString?.split(".");
  let temp: any = existingObject;

  for (let i = 0; i < properties?.length; i += 1) {
    const property = properties?.[i];
    const matchArrayIndex = property?.match(/(\w+)\[(\d+)\]/);
    const isLastProperty = i === properties?.length - 1;

    if (matchArrayIndex) {
      const arrayName = matchArrayIndex?.[1];
      const index = parseInt(matchArrayIndex?.[2], 10);
      if (!temp?.[arrayName]) {
        temp[arrayName] = [];
      }
      if (!temp?.[arrayName]?.[index]) {
        temp[arrayName][index] = isLastProperty ? value : {};
      }
      temp = temp?.[arrayName]?.[index];
    } else {
      if (!temp?.[property]) {
        temp[property] = isLastProperty ? value : {};
      }
      temp = temp?.[property] ?? {};
    }
  }
  return cleanUpArrays(existingObject);
};

const navigateObject = (obj: any, findkeys: string[]) => {
  let currentObj = obj;
  findkeys?.forEach((keyvalue: string) => {
    const regex = /\[.*\]/;
    if (regex?.test(keyvalue)) {
      const newKey = keyvalue?.replace(/\]/g, "");
      const subKeyArr = newKey?.split("[");
      if (currentObj?.hasOwnProperty(subKeyArr?.[0])) {
        currentObj = currentObj?.[subKeyArr?.[0]]?.[subKeyArr?.[1]];
      }
    } else if (currentObj?.hasOwnProperty(keyvalue)) {
      currentObj = currentObj?.[keyvalue];
    } else {
      currentObj = undefined;
    }
  });
  return currentObj;
};

const getFilteredAssets = (assets: any[], keyArray: string[]) =>
  assets?.map((asset: any) => {
    let returnObj: any = {};

    keyArray?.forEach((key: string) => {
      const result = navigateObject(asset, key?.split("."));
      if (result) {
        if (key?.includes(".") || key?.includes("[")) {
          const response = convertStringAndMergeToObject(
            key,
            result,
            returnObj
          );
          returnObj = response;
        } else {
          returnObj[key] = result;
        }
      }
    });
    return returnObj;
  });

const gridViewDropdown = [
  {
    label: (
      <span className="select-view">
        <Icon icon="Thumbnail" size="original" />
        <div>{localeTexts?.CustomFields?.toolTip?.thumbnail}</div>
      </span>
    ),
    value: "card",
    default: true,
  },
  {
    label: (
      <span className="select-view">
        <Icon icon="List" />
        <div>{localeTexts?.CustomFields?.toolTip?.list}</div>
      </span>
    ),
    value: "list",
  },
];

const CustomFieldUtils = {
  popupWindow,
  getHoverActions,
  getListHoverActions,
  uniqBy,
  findAssetIndex,
  removeEmptyFromArray,
  convertStringAndMergeToObject,
  findAsset,
  extractKeys,
  navigateObject,
  getFilteredAssets,
  gridViewDropdown,
};

export default CustomFieldUtils;
