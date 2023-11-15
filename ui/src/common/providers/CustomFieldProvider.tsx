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
  // state to manage disable of "add button"
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  // unique param in the asset object
  const uniqueID = rootConfig?.damEnv?.ASSET_UNIQUE_ID || "id";

  const { location } = useAppLocation();

  // function to check and handle disable of "add assets" button
  const handleBtnDisable = (data: any[], max_limit?: number) => {
    const assetMaxLimit =
      max_limit ?? state?.contentTypeConfig?.advanced?.max_limit;
    if (data?.length < assetMaxLimit) {
      setIsBtnDisable(false);
    } else setIsBtnDisable(true);
  };

  const handleInitialLoad = async () => {
    if (location) {
      window.iframeRef = null;
      const contenttypeConfig = location?.fieldConfig;
      const initialData = location?.field?.getData();
      if (initialData?.length) {
        // set App's Custom Field Data
        setSelectedAssets(initialData);
        // check for saved data length and handling button disable state
        handleBtnDisable(initialData, contenttypeConfig?.advanced?.max_limit);
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
      const finalAssets = selectedAssets?.filter(
        (asset) => asset?.[uniqueID] !== removedId
      );
      setSelectedAssets(finalAssets);
      handleBtnDisable(finalAssets);
    },
    [selectedAssets, handleBtnDisable]
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
      handleBtnDisable,
      isBtnDisable,
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
      handleBtnDisable,
      isBtnDisable,
    ]
  );

  return (
    <CustomFieldContext.Provider value={StateContext}>
      {children}
    </CustomFieldContext.Provider>
  );
};
export default CustomFieldProvider;
