import React from "react";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { GenericObjectType } from "@contentstack/app-sdk/dist/src/types/common.types";

export type MarketplaceAppContextType = {
  appSdk: UiLocation | null;
  appConfig: GenericObjectType;
  appFailed: boolean;
};

export const MarketplaceAppContext =
  React.createContext<MarketplaceAppContextType>({
    appSdk: null,
    appConfig: {},
    appFailed: false,
  });
