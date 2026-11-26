import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
