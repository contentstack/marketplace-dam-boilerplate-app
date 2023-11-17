/* Utility functions for root_config */

import React from "react";
import { Link, Tooltip } from "@contentstack/venus-components";
import noImage from "../../common/asset/NoImg.svg";

interface TypeSelectorConfig {
  keyArr: string[];
  appConfig: any;
  customConfig: any;
  currentLocale: string;
  pairs?: string[];
  valueChecks?: any;
}

interface TypeLocaleConfigData {
  customConfig: any;
  currentLocale: string;
  returnConfig: any;
  mapArr: string[];
  valueChecks: any;
  pairs?: string[];
}

const getFilteredConfigObj = (
  mapArr: string[],
  checkObj: any,
  valueChecks: any
) => {
  const returnObj: any = {};
  mapArr?.forEach((key: string) => {
    if (key in checkObj && checkObj?.[key] !== "") {
      if (
        valueChecks &&
        key in valueChecks &&
        Array.isArray(valueChecks[key]) &&
        valueChecks[key]?.length
      ) {
        if (valueChecks[key]?.includes(checkObj[key]))
          returnObj[key] = checkObj[key];
      } else {
        returnObj[key] = checkObj[key];
      }
    }
  });
  return returnObj;
};

const checkArrEqual = (arr1: string[], arr2: string[]) =>
  [...arr1]?.sort()?.join(",") === [...arr2]?.sort()?.join(",");

const handleLocaleConfig = (data: TypeLocaleConfigData) => {
  const {
    customConfig,
    currentLocale,
    returnConfig,
    mapArr,
    valueChecks,
    pairs,
  } = data;
  let returnValue = { ...returnConfig };
  // prettier-ignore
  if (('locale' in customConfig) && (currentLocale in customConfig?.locale)) {
		const localeConfigObj = customConfig?.locale?.[currentLocale];
		if (
			typeof localeConfigObj === 'object' &&
			!Array.isArray(localeConfigObj) &&
			localeConfigObj !== null
		) {
			returnValue = {
				...returnValue,
				...getFilteredConfigObj(mapArr, localeConfigObj, valueChecks),
      };
      if (pairs) {
        const tempConfig: any = {
          ...getFilteredConfigObj(pairs, localeConfigObj, valueChecks),
        };
        if (checkArrEqual(pairs, Object.keys(tempConfig))) {
          returnValue = { ...returnValue, ...tempConfig };
        }
      }
		}
	}
  return returnValue;
};

const getSelectorConfig = (props: TypeSelectorConfig) => {
  const { keyArr, appConfig, customConfig, currentLocale, pairs, valueChecks } =
    props;
  // if no customConfig
  if (!Object.keys(customConfig)?.length) return appConfig;
  // if customConfig
  let returnConfig = { ...appConfig };
  if (!pairs?.length) {
    returnConfig = {
      ...returnConfig,
      ...getFilteredConfigObj(keyArr, customConfig, valueChecks),
    };
    // if locale present in customConfig
    returnConfig = {
      ...returnConfig,
      ...handleLocaleConfig({
        customConfig,
        currentLocale,
        returnConfig,
        mapArr: keyArr,
        valueChecks,
      }),
    };
  } else {
    const modifiedArr = keyArr?.filter((key: string) => !pairs?.includes(key));
    returnConfig = {
      ...returnConfig,
      ...getFilteredConfigObj(modifiedArr, customConfig, valueChecks),
    };
    const newConfig: any = {
      ...getFilteredConfigObj(pairs, customConfig, valueChecks),
    };
    if (checkArrEqual(pairs, Object.keys(newConfig))) {
      returnConfig = { ...returnConfig, ...newConfig };
    }
    // if locale present in customConfig
    returnConfig = {
      ...returnConfig,
      ...handleLocaleConfig({
        customConfig,
        currentLocale,
        returnConfig,
        mapArr: modifiedArr,
        valueChecks,
        pairs,
      }),
    };
  }
  return returnConfig;
};

const getAssetType = (extension: string) => {
  extension = extension?.toLowerCase();
  let assetType = "document";
  const audioExtensions = ["mp3", "m4a", "flac", "wav", "wma", "aac"];
  const videoExtnesions = [
    "mp4",
    "mov",
    "wmv",
    "avi",
    "avchd",
    "flv",
    "f4v",
    "swf",
    "ogg",
  ];
  const imageExtension = [
    "jpeg",
    "jpg",
    "png",
    "gif",
    "bmp",
    "apng",
    "avif",
    "jfif",
    "pjpeg",
    "pjp",
    "svg",
    "webp",
    "ico",
    "cur",
    "tif",
    "tiff",
  ];
  const excelExtension = [
    "xlsx",
    "xlsm",
    "xlsb",
    "xltx",
    "xltm",
    "xls",
    "xlt",
    "xml",
    "xlam",
    "xla",
    "xlw",
    "xlr",
  ];

  if (videoExtnesions?.includes(extension)) {
    assetType = "video";
  } else if (audioExtensions?.includes(extension)) {
    assetType = "audio";
  } else if (imageExtension?.includes(extension)) {
    assetType = "image";
  } else if (excelExtension?.includes(extension)) {
    assetType = "excel";
  } else if (extension === "pdf") {
    assetType = "pdf";
  } else if (extension === "zip") {
    assetType = "zip";
  } else if (extension === "json") {
    assetType = "json";
  }
  return assetType;
};

const CustomComponentTexts = {
  EmptySearch: {
    heading: "No matching results found!",
    description:
      "Please try changing the search query or filters to find what you are looking for.",
    actions: "Not sure where to start? Visit our",
    help: "help center",
  },
  NoImg: {
    content: "File Image Not Available",
    alt: "No Image available",
  },
  Table: {
    search: "Search by Name",
    name: {
      singular: "Asset",
      plural: "Assets",
    },
    cancel: "Cancel",
    addBtn: {
      s: "Add",
      e: "Asset(s)",
    },
  },
};

const EmptySearch: any = {
  heading: (
    <h4 style={{ color: "#222222" }}>
      {CustomComponentTexts.EmptySearch.heading}
    </h4>
  ),
  description: <p>{CustomComponentTexts.EmptySearch.description}</p>,
  actions: (
    <div className="">
      <p>
        {CustomComponentTexts.EmptySearch.actions}{" "}
        <Link
          fontColor="link"
          fontSize="medium"
          fontWeight="regular"
          href="https://contentstack.com"
          iconName="NewTab"
          target="_blank"
          testId="cs-link"
          underline={false}
        >
          {CustomComponentTexts.EmptySearch.help}
        </Link>
      </p>
    </div>
  ),
  moduleIcon: "Search",
};

const errorImage = `<svg
			width='156'
			height='173'
			viewBox='0 0 156 173'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<g clipPath='url(#clip0_2030_41621)'>
				<rect width='156' height='173' fill='white' />
				<rect
					x='47.5'
					y='57.5'
					width='59'
					height='59'
					rx='7.5'
					fill='white'
					stroke='#647696'
				/>
				<path
					d='M106 109.5V98.5L94.5 88L76 106L60 90.5L48 102.5V109.5C48 112.814 50.6863 115.5 54 115.5H100C103.314 115.5 106 112.814 106 109.5Z'
					fill='white'
					stroke='#647696'
				/>
				<rect
					x='48'
					y='58'
					width='58'
					height='58'
					rx='7'
					stroke='#647696'
					strokeWidth='2'
				/>
				<path
					d='M48 102.609L60.2917 90.4348L76.2708 106.261M66.4375 116L94.7083 88L106 99'
					stroke='#647696'
					strokeWidth='2'
				/>
				<circle
					cx='70'
					cy='77'
					r='6'
					stroke='#647696'
					strokeWidth='2'
				/>
				<path
					d='M45 118.286L108.286 55'
					stroke='#647696'
					strokeWidth='2'
				/>
				<path
					d='M46.4142 119.7L109.7 56.4142'
					stroke='white'
					strokeWidth='2'
				/>
			</g>
			<defs>
				<clipPath id='clip0_2030_41621'>
					<rect width='156' height='173' fill='white' />
				</clipPath>
			</defs>
		</svg>`;

const getNoImageUrl = (imageSvg: string) =>
  `data:image/svg+xml;base64,${btoa(imageSvg)}`;

const getImageDOM = (url: string) => {
  if (url) {
    return (
      <div className="img-container">
        <img src={url ?? getNoImageUrl(errorImage)} alt="assetImg" />
      </div>
    );
  }
  return (
    <Tooltip
      content={CustomComponentTexts.NoImg.content}
      position="top"
      variantType="light"
      type="secondary"
    >
      <div className="no-image-container">
        {/* eslint-disable-next-line */}
        <img
          src={noImage}
          alt={CustomComponentTexts.NoImg.alt}
          className="noimage-container"
        />
      </div>
    </Tooltip>
  );
};

const tableColumns = [
  {
    Header: "Image",
    id: "Image",
    accessor: (obj: any) => getImageDOM(obj?.assetUrl),
    default: true,
    disableSortBy: true,
    columnWidthMultiplier: 1,
    addToColumnSelector: true,
  },
  {
    Header: "ID",
    id: "ID",
    accessor: (obj: any) =>
      // eslint-disable-next-line
      `${obj?._id}` ?? "--",
    default: true,
    disableSortBy: true,
    columnWidthMultiplier: 1,
    addToColumnSelector: true,
  },
  {
    Header: "Name",
    id: "Name",
    accessor: (obj: any) => obj?.assetName ?? "--",
    default: true,
    disableSortBy: true,
    columnWidthMultiplier: 2,
    addToColumnSelector: true,
  },
  {
    Header: "Dimensions (H x W)",
    id: "Dimensions",
    accessor: (obj: any) => (
      <div>{`${obj?.dimensions?.height} x ${obj?.dimensions?.width}`}</div>
    ),
    default: false,
    disableSortBy: true,
    columnWidthMultiplier: 3.5,
    addToColumnSelector: true,
  },
];

const getItemStatusMap = (length: number, status: string) => {
  const itemStatusMap: any = {};
  for (let index = 0; index < length; index += 1) {
    itemStatusMap[index] = status;
  }
  return itemStatusMap;
};

const utils = {
  getSelectorConfig,
  getAssetType,
  getItemStatusMap,
  tableColumns,
  EmptySearch,
  CustomComponentTexts,
};

export default utils;
