import React, { useEffect, useMemo, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { isNull } from "lodash";
import { Props } from "../types";
import { MarketplaceAppContext } from "../contexts/MarketplaceAppContext";

const MarketplaceAppProvider: React.FC = function ({ children }) {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<any>({});
  const [appConfig, setAppConfig] = useState<Props>({});

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSDK: any) => {
        await setAppSdk(appSDK);
        await appSDK?.location?.CustomField?.frame?.enableAutoResizing();
        const appSdkConfig = await appSDK?.getConfig();
        await setAppConfig(appSdkConfig);
      })
      .catch((error) => {
        const currentLocation = window?.location?.href;
        if (!currentLocation?.includes("selector-page"))
          console.error("Error: Contentstack Initialization", error);
        setFailed(true);
      });
  }, []);

  const contextValue = useMemo(
    () => ({ appSdk, appConfig, appFailed: failed }),
    [appSdk, appConfig, failed]
  );

  return (
    <MarketplaceAppContext.Provider value={contextValue}>
      {!failed && isNull(appSdk) ? <div>Loading...</div> : children}
    </MarketplaceAppContext.Provider>
  );
};

export default MarketplaceAppProvider;
