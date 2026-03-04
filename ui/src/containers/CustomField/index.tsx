/* Import React modules */
import React, { useCallback, useContext, useState, useEffect } from "react";
/* Import ContentStack modules */
import { Button, Tooltip } from "@contentstack/venus-components";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";
import CustomFieldUtils from "../../common/utils/CustomFieldUtils";
import AssetContainer from "./AssetContainer";
import rootConfig from "../../root_config/index";
import InfoMessage from "../../components/InfoMessage";
import AppFailed from "../../components/AppFailed";
import { MarketplaceAppContext } from "../../common/contexts/MarketplaceAppContext";
import CustomFieldContext from "../../common/contexts/CustomFieldContext";
import { TypeErrorFn } from "../../common/types";
import constants, { UI_LOCATIONS } from "../../common/constants";
import utils from "../../common/utils";
/* Import our CSS */
import "./styles.scss";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

/* If need to get any data from API then use makeAPIRequest function.
  Access it via MarketplaceAppContext:
  
  const { makeAPIRequest } = useContext(MarketplaceAppContext);
  
  Example usage:
  const response = await makeAPIRequest({
    queryParams: "param=value",
    headers: { "Content-Type": "application/json" },
    method: "GET",
    body: {}
  });
  const data = await response.json();
  
  Refer services/index.ts for more details and update 
  the API call there as per requirement. */

const CustomField: React.FC = function () {
  const { appFailed, appSdk, makeAPIRequest } = useContext(
    MarketplaceAppContext
  );
  const {
    renderAssets,
    setRenderAssets,
    selectedAssets,
    setSelectedAssets,
    uniqueID,
    state,
    currentLocale,
    handleBtnDisable,
    isBtnDisable,
  } = useContext(CustomFieldContext);

  // state for checking if error is present
  const [isError, setIsError] = React.useState<boolean>(false);
  // state for selected asset Ids received from selector page
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  // state for warning message to be displayed on error
  const [warningText, setWarningText] = useState<string>(
    localeTexts.Warnings.incorrectConfig
  );
  // window variable for selector page
  let selectorPageWindow: any;

  const getCurrentConfigLabel = () => {
    const { config, contentTypeConfig } = state;
    const branch = appSdk?.stack?.getCurrentBranch()?.uid;
    const locale = contentTypeConfig?.locale;
    // Priority order:
    // 1 : Custom Field Advanced Settings - Locale Specific
    if (locale?.[currentLocale]?.config_label?.length > 0) {
      return locale[currentLocale].config_label[0];
    }
    // 2 : Custom Field Advanced Settings - Default
    if (contentTypeConfig?.config_label?.length > 0) {
      return contentTypeConfig.config_label[0];
    }
    // 3 : Locale-Specific Config
    if (
      branch &&
      config?.config_rules?.[branch]?.locales?.[currentLocale]?.config_label
        ?.length > 0
    ) {
      return config.config_rules[branch].locales[currentLocale].config_label[0];
    }
    // 4 :  Branch-Specific Config
    if (branch && config?.config_rules?.[branch]?.config_label?.length > 0) {
      return config.config_rules[branch].config_label[0];
    }
    // 5. Main Default
    return config?.default_multi_config_key;
  };

  const getConfig = () => {
    const { config, contentTypeConfig } = state;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { multi_config_keys, default_multi_config_key } = config;
    if (Object.keys(multi_config_keys ?? {})?.length) {
      const finalConfigLabel = getCurrentConfigLabel();
      const multiConfig = multi_config_keys?.[finalConfigLabel] ?? {};

      let finalConfig = { ...config };
      if (default_multi_config_key) {
        finalConfig = {
          ...config,
          selected_config: {
            ...multiConfig,
          },
        };
        delete finalConfig.default_multi_config_key;
        delete finalConfig.multi_config_keys;
      }
      // Delete config_rules before sending to selector page
      delete finalConfig.config_rules;

      const finalContentTypeConfig = { ...contentTypeConfig };
      if (finalContentTypeConfig?.advanced)
        delete finalContentTypeConfig.advanced;
      if (finalContentTypeConfig?.config_label)
        delete finalContentTypeConfig.config_label;
      if (finalContentTypeConfig?.locale) delete finalContentTypeConfig.locale;

      return { config: finalConfig, contentTypeConfig: finalContentTypeConfig };
    }
    // Delete config_rules before sending to selector page (fallback case)
    const configWithoutRules = { ...config };
    delete configWithoutRules.config_rules;
    return { config: configWithoutRules, contentTypeConfig };
  };

  // save data of "selectedAssets" state in contentstack when updated
  React.useEffect(() => {
    if (Array.isArray(selectedAssets) && selectedAssets.length > 0) {
      // Fetch asset details from API for each selected asset
      const fetchAssetDetails = async () => {
        const finalConfig = getConfig();
        const assetPromises = selectedAssets.map(async (asset) => {
          try {
            const assetId = asset?.[uniqueID];
            if (!assetId) return asset;

            const response = await makeAPIRequest({
              queryParams: `mode=getAssetById&location=${
                UI_LOCATIONS.CUSTOM_FIELD
              }&assetId=${assetId}&config=${encodeURIComponent(
                JSON.stringify(finalConfig?.config)
              )}`,
              method: "GET",
            });
            const assetData = await response.json();
            // Merge API data with existing asset data
            return { ...asset, ...assetData };
          } catch (error) {
            console.error(`Error fetching asset ${asset?.[uniqueID]}:`, error);
            // Return original asset if API call fails
            return asset;
          }
        });

        const assetsWithDetails = await Promise.all(assetPromises);
        const filteredAssets = rootConfig?.filterAssetData?.(assetsWithDetails);
        setRenderAssets(filteredAssets);

        const assetIds = assetsWithDetails?.map(
          (item: any) => item?.[uniqueID]
        );
        setSelectedAssetIds(assetIds);

        const assetsToSave =
          rootConfig?.modifyAssetsToSave?.(
            finalConfig?.config,
            finalConfig?.contentTypeConfig,
            assetsWithDetails
          ) ?? assetsWithDetails;

        if (state?.location?.field) {
          state.location.field.setData(assetsToSave);
        }
      };

      fetchAssetDetails();
    } else if (Array.isArray(selectedAssets) && selectedAssets.length === 0) {
      // Handle empty assets
      setRenderAssets([]);
      setSelectedAssetIds([]);
      if (state?.location?.field) {
        state.location.field.setData([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssets]);

  const handleUniqueSelectedData = (dataArr: any[]) => {
    if (dataArr?.length) {
      let modifiedAssetsData = dataArr;
      if (Object.keys(state?.config?.multi_config_keys ?? {})?.length) {
        const configLabel = getCurrentConfigLabel();
        modifiedAssetsData = dataArr?.map((asset: any) => ({
          ...asset,
          cs_metadata: {
            config_label: configLabel,
          },
        }));
      }
      const assetLimit = state?.contentTypeConfig?.advanced?.max_limit;

      let finalAssets = CustomFieldUtils.uniqBy(
        [
          ...(Array.isArray(selectedAssets) ? selectedAssets : []),
          ...modifiedAssetsData,
        ],
        uniqueID
      );

      if (assetLimit && finalAssets?.length > assetLimit) {
        finalAssets = finalAssets?.slice(0, assetLimit);
        utils.toastMessage({
          type: "error",
          content: {
            error: {
              error_message:
                localeTexts.CustomFields.assetLimit.notificationMsg,
            },
          },
        });
      }
      if (finalAssets?.length) {
        setSelectedAssets(finalAssets);
        handleBtnDisable(
          finalAssets,
          state?.contentTypeConfig?.advanced?.max_limit
        );
      }
    }
  };

  // returns final config values from app_config and custom_field_config
  const getSelectorConfig = () => {
    const finalConfig = getConfig();
    const configObj =
      rootConfig?.handleConfigtoSelectorPage?.(
        finalConfig?.config,
        finalConfig?.contentTypeConfig,
        currentLocale
      ) ?? {};

    if (Object.keys(configObj)?.length) return configObj;
    return finalConfig?.config;
  };

  // handle message event for selector window
  const handleMessage = (event: MessageEvent) => {
    if (selectorPageWindow) {
      const dataArr: Array<any> = rootConfig?.handleSelectorPageData?.(event);
      handleUniqueSelectedData(dataArr);
    }
  };

  // function to set error
  const setError = ({
    isErr = false,
    errorText = localeTexts.Warnings.incorrectConfig,
  }: TypeErrorFn) => {
    setIsError(isErr);
    if (errorText) setWarningText(errorText);
  };

  // function called on postmessage from selector page. used in "novalue" and "authWindow" option
  const saveData = useCallback(
    (event: any) => {
      if (event?.origin !== process.env.REACT_APP_CUSTOM_FIELD_URL) return;

      const { data } = event;

      if (data?.message === "openedReady") {
        event?.source?.postMessage(
          {
            message: "init",
            config: getSelectorConfig(),
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
        const finalAssets = CustomFieldUtils.advancedFilters(
          data?.selectedAssets,
          state?.contentTypeConfig?.advanced
        );

        if (state?.config?.is_custom_json) {
          const keys = CustomFieldUtils.extractKeys(state?.config?.dam_keys);
          const assetData = CustomFieldUtils.getFilteredAssets(
            finalAssets?.acceptedAssets,
            keys
          );
          handleUniqueSelectedData(assetData);
        } else {
          handleUniqueSelectedData(finalAssets?.acceptedAssets);
        }

        if (finalAssets?.rejectedAssets?.length) {
          let message = `${localeTexts.CustomFields.assetValidation.errorStatement.replace(
            "$var",
            "Some Assets"
          )}`;

          if (rootConfig?.damEnv?.ADVANCED_ASSET_PARAMS?.ASSET_NAME) {
            const rejectedAssetNames = finalAssets?.rejectedAssets?.map(
              (asset: any) => {
                const assetFlatStructure = CustomFieldUtils.flatten(asset);
                return assetFlatStructure?.[
                  rootConfig?.damEnv?.ADVANCED_ASSET_PARAMS?.ASSET_NAME ?? ""
                ];
              }
            );
            message = `${localeTexts.CustomFields.assetValidation.errorStatement.replace(
              "$var",
              rejectedAssetNames?.map((item) => `"${item}"`)?.join(", ")
            )}`;
          }

          utils.toastMessage({
            type: "error",
            content: {
              error: {
                error_message: message,
              },
            },
          });
        }
      } else if (data?.message === "close") {
        window.removeEventListener("message", saveData, false);
        selectorPageWindow = undefined;
      }
    },
    [state?.config, handleUniqueSelectedData]
  );

  const handleSelectorOpen = () => {
    CustomFieldUtils.popupWindow({
      url: `${process.env.REACT_APP_CUSTOM_FIELD_URL}/#/selector-page?location=CUSTOM-FIELD`,
      title: localeTexts.SelectorPage.title,
      w: 1500,
      h: 800,
    });
    window.addEventListener("message", saveData, false);
  };

  // function called onClick of "add asset" button. Handles opening of modal and selector window
  const openDAMSelectorPage = useCallback(() => {
    const hasConfig = state?.config && Object.keys(state?.config)?.length;
    if (!hasConfig || !state?.appSdkInitialized) {
      return;
    }

    if (!selectorPageWindow) {
      const finalConfig = getConfig();

      if (rootConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "novalue") {
        handleSelectorOpen();
      } else if (rootConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "authWindow") {
        new Promise((resolve, reject) => {
          rootConfig?.handleAuthWindow?.(
            finalConfig?.config,
            finalConfig?.contentTypeConfig,
            resolve,
            reject
          );
        })
          .then(() => {
            handleSelectorOpen();
          })
          .catch((error) => {
            console.error("Error: Authentication Failed in Auth Window", error);
          });
      } else {
        if (rootConfig?.damEnv?.DIRECT_SELECTOR_PAGE === "window") {
          rootConfig?.handleSelectorWindow?.(
            finalConfig?.config,
            finalConfig?.contentTypeConfig,
            setError
          );
        } else {
          const url = rootConfig?.getSelectorWindowUrl?.(
            finalConfig?.config,
            finalConfig?.contentTypeConfig
          );
          selectorPageWindow = CustomFieldUtils.popupWindow({
            url,
            title: `${localeTexts.SelectorPage.title}`,
            w: 1500,
            h: 800,
          });
        }
        window.addEventListener("message", handleMessage, false);
      }
    } else selectorPageWindow?.focus();
  }, [
    state,
    state?.appSdkInitialized,
    state?.config,
    state?.contentTypeConfig,
    saveData,
    getConfig,
  ]);

  const [isConfigReady, setIsConfigReady] = useState(false);

  useEffect(() => {
    const hasConfig = state?.config && Object.keys(state?.config)?.length;
    const isReady = hasConfig && state?.appSdkInitialized;
    setIsConfigReady(isReady);
  }, [state?.config, state?.appSdkInitialized]);

  return (
    <div className="field-extension-wrapper">
      <div className="field-extension">
        {appFailed ? (
          <AppFailed />
        ) : (
          <div className="field-wrapper" data-testid="field-wrapper">
            {!isError ? (
              <>
                {renderAssets?.length ? (
                  <AssetContainer />
                ) : (
                  <div className="no-asset" data-testid="noAsset-div">
                    {localeTexts.CustomFields.AssetNotAddedText}
                  </div>
                )}
                <Tooltip
                  content={
                    !isConfigReady
                      ? localeTexts.CustomFields.button.loadingTooltip
                      : localeTexts.CustomFields.assetLimit.btnTooltip
                  }
                  position="top"
                  disabled={
                    !(renderAssets?.length && isBtnDisable) && isConfigReady
                  }
                  style={constants.constantStyles.addBtnTooltip}
                >
                  <Button
                    buttonType="control"
                    className="add-asset-btn"
                    version="v2"
                    onClick={openDAMSelectorPage}
                    data-testid="add-btn"
                    disabled={
                      !isConfigReady || (renderAssets?.length && isBtnDisable)
                    }
                  >
                    {localeTexts.CustomFields.button.btnText}
                  </Button>
                </Tooltip>
              </>
            ) : (
              <div data-testid="warning-component">
                <InfoMessage content={warningText} type="attention" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomField;
