/* Import React modules */
import React, { useCallback, useContext, useState } from "react";
/* Import ContentStack modules */
import { Button, Notification, Tooltip } from "@contentstack/venus-components";
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
import constants from "../../common/constants";
/* Import our CSS */
import "./styles.scss";

/* To add any labels / captions for fields or any inputs, use common/local/en-us/index.ts */

const CustomField: React.FC = function () {
  const { appFailed } = useContext(MarketplaceAppContext);
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
    const { config_label: configLabel, locale } = state?.contentTypeConfig;
    let finalConfigLabel =
      configLabel?.[0] ?? state?.config?.default_multi_config_key;
    if (locale?.[currentLocale]?.config_label?.length) {
      finalConfigLabel = locale?.[currentLocale]?.config_label?.[0];
    }
    return finalConfigLabel;
  };

  const getConfig = () => {
    const { config, contentTypeConfig } = state;
    // eslint-disable-next-line
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

      const finalContentTypeConfig = { ...contentTypeConfig };
      if (finalContentTypeConfig?.advanced)
        delete finalContentTypeConfig.advanced;
      if (finalContentTypeConfig?.config_label)
        delete finalContentTypeConfig.config_label;
      if (finalContentTypeConfig?.locale) delete finalContentTypeConfig.locale;

      return { config: finalConfig, contentTypeConfig: finalContentTypeConfig };
    }
    return { config, contentTypeConfig };
  };

  // save data of "selectedAssets" state in contentstack when updated
  React.useEffect(() => {
    if (Array.isArray(selectedAssets)) {
      setRenderAssets(rootConfig?.filterAssetData?.(selectedAssets));
      setSelectedAssetIds(
        (selectedAssets as any[])?.map((item: any) => item?.[uniqueID])
      );
      const finalConfig = getConfig();
      const assetsToSave =
        rootConfig?.modifyAssetsToSave?.(
          finalConfig?.config,
          finalConfig?.contentTypeConfig,
          selectedAssets
        ) ?? selectedAssets;
      state?.location?.field?.setData(assetsToSave);
    }
  }, [
    selectedAssets, // Your Custom Field State Data
  ]);

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
        Notification({
          displayContent: {
            error: {
              error_message:
                localeTexts.CustomFields.assetLimit.notificationMsg,
            },
          },
          notifyProps: {
            hideProgressBar: true,
          },
          type: "error",
        });
      }
      if (finalAssets?.length) {
        setSelectedAssets(finalAssets); // selectedAssets is array of assets selected in selectorpage
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

          Notification({
            displayContent: {
              error: {
                error_message: message,
              },
            },
            notifyProps: {
              autoClose: true,
              hideProgressBar: true,
            },
            type: "error",
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
    if (state?.appSdkInitialized && !selectorPageWindow) {
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
            w: 1500, // You Change These According To Your App
            h: 800, // You Change These According To Your App
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
                  content={localeTexts.CustomFields.assetLimit.btnTooltip}
                  position="top"
                  disabled={!(renderAssets?.length && isBtnDisable)}
                  style={constants.constantStyles.addBtnTooltip}
                >
                  <Button
                    buttonType="control"
                    className="add-asset-btn"
                    version="v2"
                    onClick={openDAMSelectorPage}
                    data-testid="add-btn"
                    disabled={renderAssets?.length && isBtnDisable}
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
