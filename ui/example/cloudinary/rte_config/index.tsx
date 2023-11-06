import React from "react";

/* Variables for getViewIconforTooltip function */
const PREVIEW_ICON = "Eye";

// <------------ ENVIRONMENT VALUES ------------>

const DamEnvVariables = {
  DAM_APP_NAME: "Cloudinary",
  ASSET_NAME_PARAM: "public_id",
  RTE_DAM_ICON: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4796 8.77231C15.4796 8.9558 15.3628 9.07256 15.1793 9.07256H9.39116C9.20767 9.07256 9.09091 8.9558 9.09091 8.77231V8.10509C9.09091 7.9216 9.20767 7.80484 9.39116 7.80484H15.1793C15.3628 7.80484 15.4796 7.9216 15.4796 8.10509V8.77231V8.77231ZM18.0484 10.6405C18.0484 10.824 17.9316 10.9408 17.7481 10.9408H10.6088C10.4254 10.9408 10.3086 10.824 10.3086 10.6405V9.97331C10.3086 9.78983 10.4254 9.67306 10.6088 9.67306H17.6814C17.8649 9.67306 17.9817 9.78983 17.9817 9.97331L18.0484 10.6405ZM20 12.5922C20 12.7756 19.8832 12.8924 19.6998 12.8924H11.96C11.7765 12.8924 11.6597 12.7756 11.6597 12.5922V11.9249C11.6597 11.7415 11.7765 11.6247 11.96 11.6247H19.6998C19.8832 11.6247 20 11.7415 20 11.9249V12.5922ZM20 14.5271C20 14.7106 19.8832 14.8274 19.6998 14.8274H11.96C11.7765 14.8274 11.6597 14.7106 11.6597 14.5271V13.8599C11.6597 13.6764 11.7765 13.5596 11.96 13.5596H19.6998C19.8832 13.5596 20 13.6764 20 13.8599V14.5271ZM18.0484 16.3953C18.0484 16.5788 17.9316 16.6956 17.7481 16.6956H10.6088C10.4254 16.6956 10.3086 16.5788 10.3086 16.3953V15.7281C10.3086 15.5446 10.4254 15.4279 10.6088 15.4279H17.6814C17.8649 15.4279 17.9817 15.5446 17.9817 15.7281L18.0484 16.3953ZM15.4796 18.3303C15.4796 18.5138 15.3628 18.6305 15.1793 18.6305H9.39116C9.20767 18.6305 9.09091 18.5138 9.09091 18.3303V17.663C9.09091 17.4796 9.20767 17.3628 9.39116 17.3628H15.1793C15.3628 17.3628 15.4796 17.4796 15.4796 17.663V18.3303V18.3303ZM4.52043 2.96747C4.52043 3.15096 4.6372 3.26772 4.82068 3.26772H10.6088C10.7923 3.26772 10.9091 3.15096 10.9091 2.96747V2.30025C10.9091 2.11676 10.7923 2 10.6088 2H4.82068C4.6372 2 4.52043 2.11676 4.52043 2.30025V2.96747ZM1.95163 4.90242C1.95163 5.08591 2.06839 5.20267 2.25188 5.20267H9.32444C9.50792 5.20267 9.62469 5.08591 9.62469 4.90242V4.2352C9.62469 4.05171 9.50792 3.93495 9.32444 3.93495H2.25188C2.06839 3.93495 1.95163 4.05171 1.95163 4.2352V4.90242V4.90242ZM0 6.83736C0 7.02085 0.116764 7.13762 0.300251 7.13762H8.04003C8.22352 7.13762 8.34028 7.02085 8.34028 6.83736V6.17014C8.34028 5.98666 8.22352 5.86989 8.04003 5.86989H0.300251C0.116764 5.86989 0 5.98666 0 6.17014V6.83736ZM0 8.77231C0 8.9558 0.116764 9.07256 0.300251 9.07256H8.04003C8.22352 9.07256 8.34028 8.9558 8.34028 8.77231V8.10509C8.34028 7.9216 8.22352 7.80484 8.04003 7.80484H0.300251C0.116764 7.80484 0 7.9216 0 8.10509V8.77231ZM1.95163 10.6405C1.95163 10.824 2.06839 10.9408 2.25188 10.9408H9.32444C9.50792 10.9408 9.62469 10.824 9.62469 10.6405V9.97331C9.62469 9.78983 9.50792 9.67306 9.32444 9.67306H2.25188C2.06839 9.67306 1.95163 9.78983 1.95163 9.97331V10.6405V10.6405ZM4.52043 12.5922C4.52043 12.7756 4.6372 12.8924 4.82068 12.8924H10.6088C10.7923 12.8924 10.9091 12.7756 10.9091 12.5922V11.9249C10.9091 11.7415 10.7923 11.6247 10.6088 11.6247H4.82068C4.6372 11.6247 4.52043 11.7415 4.52043 11.9249V12.5922Z"
        fill="#647696"
      />
    </svg>
  ),
  DIRECT_SELECTOR_PAGE: "novalue", // possible values "url", "window", default => "novalue"
};

// <------------ JSON RTE FUNCTIONS ------------>

const getDisplayUrl = (asset: any) => {
  return asset?.secure_url;
};

const getAssetType = (asset: any) => {
  /* possible return values ==> Document, Image, Pdf, Archive, Video, Audio */
  const { format } = asset;
  let assetType = "Document";
  let asset_type;
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

  if (videoExtnesions.indexOf(format) !== -1) {
    asset_type = "Video";
  } else if (audioExtensions.indexOf(format) !== -1) {
    asset_type = "Audio";
  } else if (imageExtension.indexOf(format) !== -1) {
    asset_type = "Image";
  } else if (format == "pdf") {
    asset_type = "pdf";
  } else if (format == "zip") {
    asset_type = "zip";
  }
  if (asset_type) {
    switch (true) {
      case asset_type.indexOf("Image") > -1:
        assetType = "Image";
        break;
      case asset_type.indexOf("pdf") > -1:
        assetType = "Pdf";
        break;
      case asset_type.indexOf("zip") > -1:
        assetType = "Archive";
        break;
      case asset_type.indexOf("Video") > -1:
        assetType = "Video";
        break;
      case asset_type.indexOf("Audio") > -1:
        assetType = "Audio";
        break;
    }
    return assetType;
  }
  return assetType;
};

const getViewIconforTooltip = (type: string) => {
  /* possible return values ==> Eye and NewTab */
  return PREVIEW_ICON;
};
