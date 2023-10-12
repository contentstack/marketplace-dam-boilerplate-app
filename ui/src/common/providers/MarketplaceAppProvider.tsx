import React, { useEffect, useMemo, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import { isNull } from "lodash";
import { Props } from "../types";
import AppFailed from "../../components/AppFailed";
import { MarketplaceAppContext } from "../contexts/MarketplaceAppContext";

const MarketplaceAppProvider: React.FC = function ({ children }) {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<any>({});
  const [appConfig, setConfig] = useState<Props>({});

  // Initialize the SDK and track analytics event
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSDK: any) => {
        setAppSdk(appSDK);
        await appSDK?.location?.CustomField?.frame?.enableAutoResizing();
        const appSdkConfig = await appSDK?.getConfig();
        setConfig(appSdkConfig);
      })
      .catch((error) => {
        console.info("Error inside ", error);
        setFailed(true);
      });
  }, []);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  if (failed) {
    return <AppFailed />;
  }

  const contextValue = useMemo(
    () => ({ appSdk, appConfig }),
    [appSdk, appConfig]
  );

  return (
    <MarketplaceAppContext.Provider value={contextValue}>
      {children}
    </MarketplaceAppContext.Provider>
  );
};

export default MarketplaceAppProvider;
