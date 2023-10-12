import React from "react";
import { Props } from "../types";

export type MarketplaceAppContextType = {
  appSdk: any;
  appConfig: Props;
};

export const MarketplaceAppContext =
  React.createContext<MarketplaceAppContextType>({
    appSdk: {},
    appConfig: {},
  });
