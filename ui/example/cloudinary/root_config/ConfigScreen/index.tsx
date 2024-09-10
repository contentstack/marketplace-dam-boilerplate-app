/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  TypeCustomConfigParams,
  TypeRootConfigSreen,
} from "../../common/types";

const configureConfigScreen = ({
  customConfig,
}: {
  customConfig: TypeCustomConfigParams;
}) =>
  /* IMPORTANT: 
  1. All sensitive information must be saved in serverConfig
  2. serverConfig is used when webhooks are implemented
  3. save the fields that are to be accessed in other location in config
  4. either saveInConfig or saveInServerConfig should be true for your field data to be saved in contentstack
  5. If values are stored in serverConfig then those values will not be available to other UI locations
  6. Supported type options are textInputField, radioInputField, selectInputField and customInputField */

  ({
    cloudName: {
      type: "textInputField",
      labelText: "Cloud Name",
      placeholderText: "Enter Cloud Name",
      instructionText: `Enter your Cloudinary account's Cloud Name`,
      inputFieldType: "text",
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: true,
    },
    apiKey: {
      type: "textInputField",
      labelText: "API Key",
      placeholderText: "Enter API Key",
      instructionText: `Enter your Cloudinary account's API Key`,
      inputFieldType: "password",
      saveInConfig: true,
      saveInServerConfig: false,
      isMultiConfig: true,
    },
  });

const customWholeJson = () => {
  const customJsonOptions: string[] = [
    "public_id",
    "resource_type",
    "secure_url",
    "type",
    "format",
    "version",
    "url",
    "width",
    "height",
    "bytes",
    "duration",
    "tags",
    "metadata",
    "created_at",
    "access_mode",
    "access_control",
    "created_by",
    "uploaded_by",
  ];

  const defaultFeilds: string[] = ["public_id", "resource_type", "secure_url"];

  return {
    customJsonOptions,
    defaultFeilds,
  };
};

const rootConfigScreen: TypeRootConfigSreen = {
  configureConfigScreen,
  customWholeJson,
};

export default rootConfigScreen;
