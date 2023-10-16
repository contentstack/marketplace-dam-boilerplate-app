import React, { useEffect, useMemo, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { isNull } from "lodash";
import { Props } from "../types";
import { MarketplaceAppContext } from "../contexts/MarketplaceAppContext";

const MarketplaceAppProvider: React.FC = function ({ children }) {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<any>({});
  const [appConfig, setConfig] = useState<Props>({});

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSDK: any) => {
        await setAppSdk(appSDK);
        await appSDK?.location?.CustomField?.frame?.enableAutoResizing();
        const appSdkConfig = await appSDK?.getConfig();
        await setConfig(appSdkConfig);
      })
      .catch((error) => {
        console.error("Error: Contentstack Initialization", error);
        setFailed(true);
      });
  }, []);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  const contextValue = useMemo(
    () => ({ appSdk, appConfig, appFailed: failed }),
    [appSdk, appConfig, failed]
  );

  return (
    <MarketplaceAppContext.Provider value={contextValue}>
      {children}
    </MarketplaceAppContext.Provider>
  );
};

export default MarketplaceAppProvider;
