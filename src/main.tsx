import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HashRouter } from "react-router-dom";
import Loader from "./common/components/Loader.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    {/* <React.StrictMode> */}
    <App />
    <Loader />
    {/* </React.StrictMode> */}
  </HashRouter>
);
