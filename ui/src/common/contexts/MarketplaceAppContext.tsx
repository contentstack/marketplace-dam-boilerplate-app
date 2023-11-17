import React from "react";
import { Props } from "../types";

export type MarketplaceAppContextType = {
  appSdk: any;
  appConfig: Props;
  appFailed: boolean;
};

export const MarketplaceAppContext =
  React.createContext<MarketplaceAppContextType>({
    appSdk: {},
    appConfig: {},
    appFailed: false,
  });
