/* Utility functions for root_config */

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

const compareFn = (a: string, b: string): number => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const checkArrEqual = (arr1: string[], arr2: string[]) =>
  [...arr1]?.sort(compareFn)?.join(",") ===
  [...arr2]?.sort(compareFn)?.join(",");

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
  if (('locale' in customConfig) && (currentLocale in (customConfig?.locale ?? {}))) {
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

const utils = {
  getSelectorConfig,
  getAssetType,
};

export default utils;
