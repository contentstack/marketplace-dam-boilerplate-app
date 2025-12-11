import React from "react";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { GenericObjectType } from "@contentstack/app-sdk/dist/src/types/common.types";
import { LocaleType } from "../types";

export type MarketplaceAppContextType = {
  appSdk: UiLocation | null;
  appConfig: GenericObjectType;
  appFailed: boolean;
  localesByBranch: Record<string, LocaleType[]>; // Branch-specific locales
  getDataFromAPI: (data?: any) => Promise<any>;
  fetchLocalesForBranch: (branch: string) => Promise<void>;
  getLocalesForBranch: (branch: string) => LocaleType[];
  isBranchLoading: (branch: string) => boolean;
};

export const MarketplaceAppContext =
  React.createContext<MarketplaceAppContextType>({
    appSdk: null,
    appConfig: {},
    appFailed: false,
    localesByBranch: {},
    getDataFromAPI: async () => ({} as Response),
    fetchLocalesForBranch: async () => { },
    getLocalesForBranch: () => [],
    isBranchLoading: () => false,
  });
