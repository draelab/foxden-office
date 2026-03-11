import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./i18n";
import { App } from "./App";
import "./styles/globals.css";

// StrictMode disabled - causes double-mount that breaks WebSocket connection
createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
