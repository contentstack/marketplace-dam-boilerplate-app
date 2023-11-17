import placeholderImageSrc from "../../components/ErrorImage";
import localeTexts from "../locale/en-us/index";

const popupWindow = (windowDetails) => {
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

const handleImageError = (event) => {
  event.target.src = `data:image/svg+xml;base64,${btoa(placeholderImageSrc)}`;
};

const getIconType = (resource_type) => {
  let assetType;
  resource_type = resource_type?.toLowerCase();
  if (resource_type) {
    switch (true) {
      case resource_type.indexOf("image") > -1:
        assetType = null;
        break;
      case resource_type.indexOf("pdf") > -1:
        assetType = "Pdf";
        break;
      case resource_type.indexOf("archive") > -1:
        assetType = "Archive";
        break;
      case resource_type.indexOf("video") > -1:
        assetType = "Video";
        break;
      case resource_type.indexOf("audio") > -1:
        assetType = "Audio";
        break;
      default:
        assetType = "Document";
    }
  }
  return assetType;
};

const getToolTipIconContent = (type) => {
  if (type === "Eye") return localeTexts.RTE.ToolTip.viewIcon;
  return localeTexts.RTE.ToolTip.openInDAM;
};

const getTargetValue = (fieldName, type) => {
  if (type === "redactor-attributes")
    return fieldName === "target" ? false : undefined;
  return fieldName === "target" ? "_blank" : true;
};

const getHeightWidth = (displayType) =>
  displayType === "download" ? "180px" : "auto";

const getInitialDimensions = (element, displayType) => ({
  width: `${
    element?.attrs?.width
      ? `${element?.attrs?.width}px`
      : getHeightWidth(displayType)
  }`,
  height: `${
    element?.attrs?.height
      ? `${element?.attrs?.height}px`
      : getHeightWidth(displayType)
  }`,
});

const getProperties = (isHighlight, isInline, displayType) => ({
  highlightclass: isHighlight ? "embed-asset-active" : "",
  downloadTypeclass:
    !isInline && displayType === "download" ? "embed-download" : "",
});

const getAlignmentStyle = (alignment, attrs, isInline) => {
  let alignmentStyle;
  if (alignment) {
    if (alignment === "center" || alignment === "justify") {
      delete attrs.style.float;
    }
    const marginAlignment = {
      center: { margin: "auto" },
      left: { marginRight: "auto" },
      right: { marginLeft: "auto" },
    };
    alignmentStyle = marginAlignment[alignment];
  }

  if (isInline) {
    alignmentStyle = { display: "inline-block", marginRight: "8px" };
    if (alignment) {
      alignmentStyle.float = alignment;
    }
  }
  alignmentStyle = isInline ? { ...alignmentStyle } : alignmentStyle;
  return alignmentStyle;
};

const utils = {
  popupWindow,
  handleImageError,
  getIconType,
  getTargetValue,
  getHeightWidth,
  getToolTipIconContent,
  getInitialDimensions,
  getProperties,
  getAlignmentStyle,
};

export default utils;
