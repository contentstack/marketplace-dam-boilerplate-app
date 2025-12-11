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

const MarketplaceAppProvider: React.FC = function ({ children }) {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<UiLocation | null>(null);
  const [appConfig, setAppConfig] = useState<GenericObjectType>({});
  const [localesByBranch, setLocalesByBranch] = useState<
    Record<string, LocaleType[]>
  >({});
  const [loadingBranches, setLoadingBranches] = useState<Set<string>>(
    new Set()
  );

  // prevent duplicate API calls
  const inFlightRequestsRef = useRef<Map<string, Promise<LocaleType[]>>>(
    new Map()
  );

  // Function to fetch locales for a specific branch
  const fetchLocalesForBranch = useCallback(
    async (branch: string) => {
      if (!appSdk || !branch) return;

      if (inFlightRequestsRef?.current?.has(branch)) {
        await inFlightRequestsRef?.current?.get(branch);
        return;
      }

      // Check if already in cache state
      if (localesByBranch?.[branch]) {
        return;
      }

      setLoadingBranches((prev) => new Set(prev)?.add(branch));

      // New request
      const fetchPromise = (async () => {
        try {
          const stack: any = appSdk?.stack;
          const localesData = await stack?.getLocales(
            {},
            { headers: { branch } }
          );
          const fetchedLocales = localesData?.locales ?? [];

          // Update cache state
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
          // Remove from requests queue 
          inFlightRequestsRef?.current?.delete(branch);
          setLoadingBranches((prev) => {
            const next = new Set(prev);
            next?.delete(branch);
            return next;
          });
        }
      })();

      inFlightRequestsRef?.current?.set(branch, fetchPromise);

      await fetchPromise;
    },
    [appSdk, localesByBranch]
  );

  // Helper function to get locales for a specific branch
  const getLocalesForBranch = useCallback(
    (branch: string): LocaleType[] => localesByBranch?.[branch] ?? [],
    [localesByBranch]
  );

  // Helper function to check if a branch is loading
  const isBranchLoading = useCallback(
    (branch: string): boolean => loadingBranches?.has(branch),
    [loadingBranches]
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
      isBranchLoading,
    }),
    [
      appSdk,
      appConfig,
      failed,
      localesByBranch,
      fetchLocalesForBranch,
      getLocalesForBranch,
      isBranchLoading,
    ]
  );

  return (
    <MarketplaceAppContext.Provider value={contextValue}>
      {!failed && isNull(appSdk) ? <div>Loading...</div> : children}
    </MarketplaceAppContext.Provider>
  );
};

export default MarketplaceAppProvider;
