/* Utility functions */

import React from "react";
import { Link, Tooltip } from "@contentstack/venus-components";
import noImage from "../asset/NoImg.svg";

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
  const itemStatusMap: any = {};
  for (let index = 0; index < length; index += 1) {
    itemStatusMap[index] = status;
  }
  return itemStatusMap;
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

const getImageDOM = (url: string, texts: any) => {
  if (url) {
    return (
      <div className="img-container">
        <img src={url ?? getNoImageUrl(errorImage)} alt="assetImg" />
      </div>
    );
  }
  return (
    <Tooltip
      content={texts.toolTip}
      position="top"
      variantType="light"
      type="secondary"
    >
      <div className="no-image-container">
        {/* eslint-disable-next-line */}
        <img src={noImage} alt={texts.altText} className="noimage-container" />
      </div>
    </Tooltip>
  );
};

const EmptySearch = (texts: any) => ({
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

const utils = {
  getAssetType,
  getItemStatusMap,
  getImageDOM,
  EmptySearch,
};

export default utils;
