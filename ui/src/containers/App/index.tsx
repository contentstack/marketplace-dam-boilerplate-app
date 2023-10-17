/* Import React modules */
import React, { Suspense } from "react";
import { Navigate, HashRouter, Route, Routes } from "react-router-dom";
/* Import other node modules */
/* Import our modules */
import ErrorBoundary from "../../components/ErrorBoundary";
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
import ConfigLoader from "../../components/Loaders/ConfigLoader";
import CustomFieldLoader from "../../components/Loaders/CustomFieldLoader";
import SelectorPageLoader from "../../components/Loaders/SelectorPage";
/* Import our CSS */
import "./styles.scss";
import AppConfigProvider from "../../common/providers/AppConfigProvider";
import MarketplaceAppProvider from "../../common/providers/MarketplaceAppProvider";
import CustomFieldProvider from "../../common/providers/CustomFieldProvider";

const ConfigScreen = React.lazy(() => import("../ConfigScreen"));
const CustomField = React.lazy(() => import("../CustomField"));
const SelectorPage = React.lazy(() => import("../SelectorPage"));

/** HomeRedirectHandler - component to nandle redirect based on the window location pathname,
    as react Router does not identifies pathname if the app is rendered in an iframe.
*/
const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

const App: React.FC = function () {
  return (
    <div className="app">
      <ErrorBoundary>
        <HashRouter>
          {/* If the path is changed here,
              be sure to update the path for corresponding UI location
              in Update App API */
          /* Below list has all the possible UI paths\.
              Keep only the paths that are required for your app and
              remove the remaining paths and their source code also. */}
          <MarketplaceAppProvider>
            <Routes>
              <Route path="/" element={<HomeRedirectHandler />} />
              <Route
                path="/config"
                element={
                  <Suspense fallback={<ConfigLoader />}>
                    <AppConfigProvider>
                      <ConfigScreen />
                    </AppConfigProvider>
                  </Suspense>
                }
              />
              <Route
                path="/custom-field"
                element={
                  <Suspense fallback={<CustomFieldLoader />}>
                    <CustomFieldProvider>
                      <CustomField />
                    </CustomFieldProvider>
                  </Suspense>
                }
              />
              <Route
                path="/selector-page"
                element={
                  <Suspense fallback={<SelectorPageLoader />}>
                    <SelectorPage />
                  </Suspense>
                }
              />
            </Routes>
          </MarketplaceAppProvider>
        </HashRouter>
      </ErrorBoundary>
    </div>
  );
};

export default App;
