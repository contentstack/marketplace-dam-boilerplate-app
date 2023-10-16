/* Import React modules */
import React, { useCallback, useRef, useState } from "react";
/* Import ContentStack modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { Button } from "@contentstack/venus-components";
/* Import our CSS */
import "./styles.scss";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";
import { TypeAsset, TypeSDKData } from "../../common/types";
import CustomFieldUtils from "../../common/utils/CustomFieldUtils";
import AssetContainer from "./AssetContainer";
import rootConfig from "../../root_config/index";
import WarningMessage from "../../components/WarningMessage";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

declare global {
  interface Window {
    iframeRef: any;
    postRobot: any;
  }
}

const CustomField: React.FC = function () {
  const ref = useRef(null);
  // state for configuration
  const [state, setState] = React.useState<TypeSDKData>({
    config: {},
    contentTypeConfig: {},
    location: {},
    appSdkInitialized: false,
  });
  // state for checking if error is present
  const [isError, setIsError] = React.useState<boolean>(false);
  // state for filtered asset data which is to be rendered
  const [renderAssets, setRenderAssets] = React.useState<TypeAsset[]>([]);
  // state for selected assets received from selector page
  const [selectedAssets, setSelectedAssets] = React.useState<any[]>([]);
  // state for selected asset Ids received from selector page
  const [selectedAssetIds, setSelectedAssetsIds] = useState<string[]>([]);
  // state for warning message to be displayed on error
  const [warningText, setWarningText] = useState<string>(
    localeTexts.Warnings.incorrectConfig
  );
  // state for current locale
  const [currentLocale, setCurrentLocale] = useState<string>("");
  // window variable for selector page
  let selectorPageWindow: any;
  // unique param in the asset object
  const uniqueID = rootConfig?.damEnv?.ASSET_UNIQUE_ID || "id";

  React.useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk: any) => {
        const config = await appSdk?.getConfig();
        const customFieldLocation = appSdk?.location?.CustomField;

        window.iframeRef = ref?.current;
        window.postRobot = appSdk?.postRobot;

        const contenttypeConfig = appSdk?.location?.CustomField?.fieldConfig;

        const initialData = customFieldLocation?.field?.getData();
        if (initialData?.length) {
          // set App's Custom Field Data
          setSelectedAssets(initialData);
        }

        setCurrentLocale(customFieldLocation?.entry?.locale);

        appSdk?.location?.CustomField?.frame?.enableAutoResizing();
        setState({
          config,
          contentTypeConfig: contenttypeConfig,
          location: appSdk?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error("appSdk initialization error", error);
      });
  }, []);

  // save data of "selectedAssets" state in contentstack when updated
  React.useEffect(() => {
    setRenderAssets(rootConfig?.filterAssetData?.(selectedAssets));
    setSelectedAssetsIds(selectedAssets?.map((item) => item?.[uniqueID]));
    state?.location?.CustomField?.field?.setData(selectedAssets);
  }, [
    selectedAssets, // Your Custom Field State Data
  ]);

  // returns final config values from app_config and custom_field_config
  const getConfig = () => {
    const configObj =
      rootConfig?.handleConfigtoSelectorPage?.(
        state?.config,
        state?.contentTypeConfig,
        currentLocale
      ) || {};

    if (Object.keys(configObj)?.length) return configObj;
    return state?.config;
  };

  // handle message event for selector window
  const handleMessage = (event: MessageEvent) => {
    if (selectorPageWindow) {
      const dataArr: Array<any> = rootConfig?.handleSelectorPageData?.(event);
      if (dataArr?.length) {
        setSelectedAssets(
          CustomFieldUtils.uniqBy([...selectedAssets, ...dataArr], uniqueID)
        ); // selectedAssets is array of assets selected in selectorpage
      }
    }
  };

  // function to set error
  const setError = (
    isErrorPresent: boolean = false,
    errorText: string = localeTexts.Warnings.incorrectConfig
  ) => {
    setIsError(isErrorPresent);
    if (errorText) setWarningText(errorText);
  };

  // function called on postmessage from selector page. used in "novalue" option
  const saveData = useCallback(
    (event: any) => {
      const { data } = event;
      if (data?.message === "openedReady") {
        event?.source?.postMessage(
          {
            message: "init",
            config: getConfig(),
            type: rootConfig.damEnv.DAM_APP_NAME,
            selectedIds: selectedAssetIds,
          },
          `${process.env.REACT_APP_CUSTOM_FIELD_URL}/#/selector-page`
        );
      } else if (
        data?.message === "add" &&
        data?.type === rootConfig.damEnv.DAM_APP_NAME &&
        data?.selectedAssets?.length
      ) {
        const assets = data?.selectedAssets;
        if (state?.config?.is_custom_json) {
          const keys = CustomFieldUtils.extractKeys(state?.config?.dam_keys);
          const assetData = CustomFieldUtils.getFilteredAssets(assets, keys);
          setSelectedAssets(
            CustomFieldUtils.uniqBy([...selectedAssets, ...assetData], uniqueID)
          );
        } else {
          setSelectedAssets(
            CustomFieldUtils.uniqBy([...selectedAssets, ...assets], uniqueID)
          );
        }
      }
    },
    [selectedAssets, state?.config]
  );

  // function called onClick of "add asset" button. Handles opening of modal and selector window
  const openDAMSelectorPage = useCallback(() => {
    if (state?.appSdkInitialized) {
      if (rootConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "novalue") {
        CustomFieldUtils.popupWindow({
          url: `${process.env.REACT_APP_CUSTOM_FIELD_URL}/#/selector-page?location=CUSTOM-FIELD`,
          title: localeTexts.SelectorPage.title,
          w: 1500,
          h: 800,
        });
        window.addEventListener("message", saveData, false);
      } else {
        if (rootConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "window") {
          rootConfig?.handleSelectorWindow?.(
            state?.config,
            state?.contentTypeConfig,
            setError
          );
        } else {
          const url = rootConfig?.getSelectorWindowUrl?.(
            state?.config,
            state?.contentTypeConfig
          );
          selectorPageWindow = CustomFieldUtils.popupWindow({
            url,
            title: `${localeTexts.SelectorPage.title}`,
            w: 1500, // You Change These According To Your App
            h: 800, // You Change These According To Your App
          });
        }
        window.addEventListener("message", handleMessage, false);
      }
    } else selectorPageWindow.focus();
  }, [
    state?.appSdkInitialized,
    state?.config,
    state?.contentTypeConfig,
    saveData,
  ]);

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

  return (
    <div className="field-extension-wrapper" ref={ref}>
      <div className="field-extension">
        {state.appSdkInitialized && (
          <div className="field-wrapper" data-testid="field-wrapper">
            {!isError ? (
              <>
                {renderAssets?.length ? (
                  <AssetContainer
                    assets={renderAssets}
                    removeAsset={removeAsset}
                    setRearrangedAssets={setRearrangedAssets}
                  />
                ) : (
                  <div className="no-asset" data-testid="noAsset-div">
                    {localeTexts.CustomFields.AssetNotAddedText}
                  </div>
                )}
                <Button
                  buttonType="control"
                  className="add-asset-btn"
                  version="v2"
                  onClick={openDAMSelectorPage}
                  data-testid="add-btn"
                >
                  {localeTexts.CustomFields.button.btnText}
                </Button>
              </>
            ) : (
              <div data-testid="warning-component">
                <WarningMessage content={warningText} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomField;
