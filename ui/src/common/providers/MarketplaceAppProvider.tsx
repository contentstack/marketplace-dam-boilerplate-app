import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { GenericObjectType } from "@contentstack/app-sdk/dist/src/types/common.types";
import { isNull } from "lodash";
import { MarketplaceAppContext } from "../contexts/MarketplaceAppContext";
import getDataFromAPI from "../../services";
import { LocaleType } from "../types";
import { getCachedLocales, setCachedLocales } from "../utils/localeCache";

const MarketplaceAppProvider: React.FC = function ({ children }) {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<UiLocation | null>(null);
  const [appConfig, setAppConfig] = useState<GenericObjectType>({});
  const [localesByBranch, setLocalesByBranch] = useState<
    Record<string, LocaleType[]>
  >({});

  // Track in-flight requests to prevent duplicate API calls
  const inFlightRequestsRef = useRef<Map<string, Promise<LocaleType[]>>>(
    new Map()
  );

  // Function to fetch locales for a specific branch with caching
  const fetchLocalesForBranch = useCallback(
    async (branch: string) => {
      if (!appSdk || !branch) return;

      // Check if request is already in flight
      if (inFlightRequestsRef.current.has(branch)) {
        console.info(
          `!!!🚀 Request already in flight for branch "${branch}", waiting...`
        );
        await inFlightRequestsRef.current.get(branch);
        return;
      }

      // Check if already in state (in-memory cache) - fastest check first
      if (localesByBranch[branch]) {
        return;
      }

      // Check cache second
      const cachedLocales = getCachedLocales(branch);
      if (cachedLocales) {
        setLocalesByBranch((prev) => ({
          ...prev,
          [branch]: cachedLocales,
        }));
        return;
      }

      // Create new request
      const fetchPromise = (async () => {
        try {
          const stack: any = appSdk?.stack;
          const localesData = await stack?.getLocales(
            {},
            { headers: { branch } }
          );
          const fetchedLocales = localesData?.locales ?? [];

          // Update cache
          setCachedLocales(branch, fetchedLocales);

          // Update state
          setLocalesByBranch((prev) => ({
            ...prev,
            [branch]: fetchedLocales,
          }));

          return fetchedLocales;
        } catch (error) {
          console.error(
            `Error fetching locales for branch "${branch}":`,
            error
          );
          throw error;
        } finally {
          // Remove from in-flight requests
          inFlightRequestsRef.current.delete(branch);
        }
      })();

      // Store the promise
      inFlightRequestsRef.current.set(branch, fetchPromise);

      // Wait for the request
      await fetchPromise;
    },
    [appSdk, localesByBranch]
  );

  // Helper function to get locales for a specific branch
  const getLocalesForBranch = useCallback(
    (branch: string): LocaleType[] => localesByBranch[branch] ?? [],
    [localesByBranch]
  );

  // Initialize the SDK
  useEffect(() => {
    ContentstackAppSDK.init()
      .then(async (appSDK: UiLocation) => {
        await setAppSdk(appSDK);
        await appSDK?.location?.CustomField?.frame?.updateHeight(200);
        const appSdkConfig: GenericObjectType = await appSDK?.getConfig();
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
    () => ({
      appSdk,
      appConfig,
      appFailed: failed,
      localesByBranch,
      getDataFromAPI: getDataFromAPI as (data?: any) => Promise<any>,
      fetchLocalesForBranch,
      getLocalesForBranch,
    }),
    [
      appSdk,
      appConfig,
      failed,
      localesByBranch,
      fetchLocalesForBranch,
      getLocalesForBranch,
    ]
  );

  return (
    <MarketplaceAppContext.Provider value={contextValue}>
      {!failed && isNull(appSdk) ? <div>Loading...</div> : children}
    </MarketplaceAppContext.Provider>
  );
};

export default MarketplaceAppProvider;
