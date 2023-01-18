import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@contentstack/venus-components";
import utils from "../../common/utils";
import "./style.scss";
import localeTexts from "../../common/locale/en-us/index";
import rootConfig from "../../root_config";
import WarningMessage from "../../components/WarningMessage";

let isScriptLoaded: any = false;

const SelectorPage: React.FC<any> = function ({
  closeModal,
  customFieldConfig,
  handleAssets,
  selectedAssetIds,
  componentType,
}) {
  // state of isError flag
  const [isErrorPresent, setIsErrorPresent] = React.useState<boolean>(false);
  // state for warning text to be used when error
  const [warningText, setWarningText] = useState<string>(
    localeTexts.Warnings.incorrectConfig
  );
  const damContainer = useRef(null);

  // function to check null or missing values of config
  const checkConfigValues = (configParams: any) => {
    const configFieldsLength = rootConfig?.damEnv?.CONFIG_FIELDS?.length;
    for (let i = 0; i < configFieldsLength; i += 1) {
      if (!configParams[rootConfig?.damEnv?.CONFIG_FIELDS?.[i]]) {
        return true;
      }
    }
    return false;
  };

  // function to set error
  const setError = (
    isError: boolean = false,
    errorText: string = localeTexts.Warnings.incorrectConfig
  ) => {
    setIsErrorPresent(isError);
    if (errorText) setWarningText(errorText);
  };

  const successFn = (assets: any[]) => {
    if (componentType !== "modal") {
      window.opener.postMessage(
        {
          message: "add",
          selectedAssets: assets,
          type: rootConfig?.damEnv?.DAM_APP_NAME,
        },
        process.env.REACT_APP_UI_URL || "*"
      );
      window.close();
    } else {
      handleAssets(assets);
      closeModal();
    }
  };

  const closeFn = () => {
    if (componentType !== "modal") {
      window.close();
    } else {
      closeModal();
    }
  };

  // function to load dam script and mount component
  const compactViewImplementation = async (
    configParams: any,
    selectedIds: string[]
  ) => {
    if (rootConfig?.damEnv?.IS_DAM_SCRIPT) {
      isScriptLoaded = await utils.loadDAMScript(
        rootConfig?.damEnv?.DAM_SCRIPT_URL as string
      );
      if (isScriptLoaded === true) {
        // condition's for checking config variable's
        if (checkConfigValues(configParams)) {
          setIsErrorPresent(true);
          return;
        }
        setIsErrorPresent(false);
        rootConfig?.openComptactView?.(
          configParams,
          selectedIds,
          successFn,
          closeFn,
          {
            containerRef: damContainer,
            containerClass: "selector_container",
            containerId: "selector_container",
          },
          setError
        );
      }
    }
  };

  const handleMessage = (event: MessageEvent) => {
    const { data } = event;
    if (data?.config) {
      if (
        data?.message === "init" &&
        data?.type === rootConfig?.damEnv?.DAM_APP_NAME
      ) {
        compactViewImplementation(data?.config, data?.selectedIds);
      }
    }
  };

  useEffect(() => {
    if (
      customFieldConfig &&
      Object.keys(customFieldConfig)?.length &&
      selectedAssetIds
    ) {
      compactViewImplementation(customFieldConfig, selectedAssetIds);
    } else {
      const { opener: windowOpener } = window;
      if (windowOpener) {
        window.addEventListener("message", handleMessage, false);
        windowOpener.postMessage(
          { message: "openedReady" },
          process.env.REACT_APP_UI_URL || "*"
        );
        window.addEventListener("beforeunload", () => {
          windowOpener.postMessage(
            { message: "close" },
            process.env.REACT_APP_UI_URL || "*"
          );
        });
      }
    }
  }, []);

  return (
    <div
      className={`selector-page-wrapper ${componentType}-page-wrapper`}
      data-testid="selector-wrapper"
    >
      <div
        className="selector-page-header flex FullPage_Modal_Header"
        data-testid="selector-header"
      >
        <div>
          <div
            className="selector-page-header-image"
            data-testid="selector-logo"
          >
            <img
              src={rootConfig?.damEnv?.SELECTOR_PAGE_LOGO}
              alt={`${localeTexts.SelectorPage.title} Logo`}
            />
          </div>
          <span data-testid="selector-title">
            {localeTexts.SelectorPage.title}
          </span>
        </div>

        {componentType === "modal" && (
          <Icon
            icon="Cancel"
            size="small"
            hover
            hoverType="secondary"
            className="cancel-icon"
            onClick={closeModal}
            data-testid="selector-cancel-icon"
          />
        )}
      </div>
      <div
        className={`selector_container mt-30 mr-20 ml-20 mb-20 ${componentType}_selector_container`}
        id="selector_container"
        data-testid="selector-container"
        ref={damContainer}
      >
        {isErrorPresent ? (
          <div className="info-wrapper" data-testid="warning-component">
            <WarningMessage content={warningText} />
          </div>
        ) : (
          // eslint-disable-next-line
          <>
            {rootConfig?.damEnv?.IS_DAM_SCRIPT ? (
              // If Compact view script avaialble
              // eslint-disable-next-line
              <></>
            ) : (
              // If there is no script custom component will be added
              rootConfig?.customComponent?.(
                customFieldConfig,
                setError,
                successFn,
                closeFn
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SelectorPage;
