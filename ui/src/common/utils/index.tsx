/* Utility functions */

import React from "react";
import { Link, Notification } from "@contentstack/venus-components";
import { TypeEmptySearchProps, Props } from "../types";

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

const getItemStatusMap = (length: number, status: string) => {
  const itemStatusMap: Record<number, string> = {};
  for (let index = 0; index < length; index += 1) {
    itemStatusMap[index] = status;
  }
  return itemStatusMap;
};

const getNoImageUrl = (imageSvg: string) =>
  `data:image/svg+xml;base64,${btoa(imageSvg)}`;

const EmptySearch = (texts: TypeEmptySearchProps) => ({
  heading: <h4 style={{ color: "#222222" }}>{texts.EmptySearchHeading}</h4>,
  description: <p>{texts.EmptySearchDescription}</p>,
  actions: (
    <div className="">
      <p>
        {texts.EmptySearchMessage}
        {texts.EmptySearchHelpLink && (
          <Link
            fontColor="link"
            fontSize="medium"
            fontWeight="regular"
            href={texts.EmptySearchHelpLink}
            iconName="NewTab"
            target="_blank"
            testId="cs-link"
            underline={false}
          >
            {texts.EmptySearchHelpText}
          </Link>
        )}
      </p>
    </div>
  ),
  moduleIcon: "Search",
});

const toastMessage = ({ type, content }: Props) => {
  Notification({
    notificationContent: content,
    notifyProps: {
      hideProgressBar: true,
      className: "modal_toast_message",
    },
    type,
  });
};

const utils = {
  getAssetType,
  getItemStatusMap,
  EmptySearch,
  getNoImageUrl,
  toastMessage,
};

export default utils;
