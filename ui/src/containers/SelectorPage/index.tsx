import React, { useEffect, useState, useRef } from "react";
import SelectorPageUtils from "../../common/utils/SelectorPageUtils";
import localeTexts from "../../common/locale/en-us/index";
import rootConfig from "../../root_config";
import WarningMessage from "../../components/WarningMessage";
import "./style.scss";

let isScriptLoaded: any = false;
let url: string = "";

const SelectorPage: React.FC<any> = function () {
  // config in selector page
  const [config, setConfig] = useState<any>();
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
    window.opener.postMessage(
      {
        message: "add",
        selectedAssets: assets,
        type: rootConfig?.damEnv?.DAM_APP_NAME,
      },
      url
    );
    window.close();
  };

  const closeFn = () => window.close();

  // function to load dam script and mount component
  const compactViewImplementation = async (
    configParams: any,
    selectedIds: string[]
  ) => {
    if (rootConfig?.damEnv?.IS_DAM_SCRIPT) {
      isScriptLoaded = await SelectorPageUtils.loadDAMScript(
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
        setConfig(data?.config);
        compactViewImplementation(data?.config, data?.selectedIds);
      }
    }
  };

  useEffect(() => {
    const { opener: windowOpener } = window;
    if (windowOpener) {
      const queryString = window.location.href
        ?.split("?")?.[1]
        ?.split("=")?.[1];

      let postMessageUrl: string;
      switch (queryString) {
        case "NA":
          postMessageUrl = process.env.REACT_APP_UI_URL_NA ?? "";
          break;
        case "EU":
          postMessageUrl = process.env.REACT_APP_UI_URL_EU ?? "";
          break;
        case "AZURE_NA":
          postMessageUrl = process.env.REACT_APP_UI_URL_AZURE_NA ?? "";
          break;
        case "CUSTOM-FIELD":
          postMessageUrl = process.env.REACT_APP_CUSTOM_FIELD_URL ?? "";
          break;
        default:
          postMessageUrl = process.env.REACT_APP_UI_URL_AZURE_EU ?? "";
      }
      url = postMessageUrl;
      window.addEventListener("message", handleMessage, false);
      windowOpener.postMessage({ message: "openedReady" }, postMessageUrl);
      window.addEventListener("beforeunload", () => {
        windowOpener.postMessage({ message: "close" }, postMessageUrl);
      });
    }
  }, []);

  return (
    <div className="selector-page-wrapper" data-testid="selector-wrapper">
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
      </div>
      <div
        className="selector_container mt-30 mr-20 ml-20 mb-20"
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
              rootConfig?.customSelectorComponent?.(
                config,
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
