import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isEmpty } from "lodash";
import CustomFieldContext from "../contexts/CustomFieldContext";
import { TypeAsset, TypeSDKData } from "../types";
import rootConfig from "../../root_config";
import useAppLocation from "../hooks/useAppLocation";
import { MarketplaceAppContext } from "../contexts/MarketplaceAppContext";

declare global {
  interface Window {
    iframeRef: any;
  }
}

const CustomFieldProvider: React.FC = function ({ children }) {
  const { appConfig } = useContext(MarketplaceAppContext);
  // state for configuration
  const [state, setState] = React.useState<TypeSDKData>({
    config: {},
    contentTypeConfig: {},
    location: {},
    appSdkInitialized: false,
  });
  // state for filtered asset data which is to be rendered
  const [renderAssets, setRenderAssets] = useState<TypeAsset[]>([]);
  // state for selected assets received from selector page
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  // state for current locale
  const [currentLocale, setCurrentLocale] = useState<string>("");
  // unique param in the asset object
  const uniqueID = rootConfig?.damEnv?.ASSET_UNIQUE_ID || "id";

  const { location } = useAppLocation();

  const handleInitialLoad = async () => {
    if (location) {
      window.iframeRef = null;
      const contenttypeConfig = location?.fieldConfig;
      const initialData = location?.field?.getData();
      if (initialData?.length) {
        // set App's Custom Field Data
        setSelectedAssets(initialData);
      }
      setCurrentLocale(location?.entry?.locale);
      location?.frame?.enableAutoResizing();
      await setState({
        config: isEmpty(appConfig) ? {} : appConfig,
        contentTypeConfig: contenttypeConfig,
        location,
        appSdkInitialized: true,
      });
    }
  };

  useEffect(() => {
    handleInitialLoad();
  }, [location, appConfig]);

  // function to remove the assets when "delete" action is triggered
  const removeAsset = useCallback(
    (removedId: string) => {
      setSelectedAssets(
        selectedAssets?.filter((asset) => asset?.[uniqueID] !== removedId)
      );
    },
    [selectedAssets]
  );

  // rearrange the order of assets
  const setRearrangedAssets = useCallback(
    (assets: any[]) => {
      setSelectedAssets(
        assets?.map(
          (asset: any) =>
            selectedAssets?.filter(
              (item: any) => item?.[uniqueID] === asset?.id
            )?.[0]
        )
      );
    },
    [selectedAssets]
  );

  const StateContext = useMemo(
    () => ({
      renderAssets,
      setRenderAssets,
      selectedAssets,
      setSelectedAssets,
      removeAsset,
      uniqueID,
      setRearrangedAssets,
      state,
      currentLocale,
    }),
    [
      renderAssets,
      setRenderAssets,
      selectedAssets,
      setSelectedAssets,
      removeAsset,
      uniqueID,
      setRearrangedAssets,
      state,
      currentLocale,
    ]
  );

  return (
    <CustomFieldContext.Provider value={StateContext}>
      {children}
    </CustomFieldContext.Provider>
  );
};
export default CustomFieldProvider;
