import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

try {
  history.scrollRestoration = "manual";
} catch {
  /* ignore */
}
initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
