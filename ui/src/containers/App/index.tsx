/* Import React modules */
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
/* Import other node modules */
/* Import our modules */
import ErrorBoundary from "../../components/ErrorBoundary";
import ConfigScreen from "../ConfigScreen";
import CustomField from "../CustomField";
import SelectorPage from "../SelectorPage";
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";

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
          <Routes>
            <Route path="/config" element={<ConfigScreen />} />
            <Route path="/custom-field" element={<CustomField />} />
            <Route path="/selector-page" element={<SelectorPage />} />
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </div>
  );
};

export default App;
