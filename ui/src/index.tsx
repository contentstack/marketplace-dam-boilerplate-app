/* Import React modules */
import React from "react";
import { createRoot } from "react-dom/client";
/* Import other node modules */
import reportWebVitals from "./reportWebVitals";
/* Import our modules */
import App from "./containers/App";
/* Import node module CSS */
/* Import our CSS */
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
