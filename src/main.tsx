import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initTelemetry } from "./services/telemetry";

// Initialise Application Insights (no-op when connection string is not set)
initTelemetry();

createRoot(document.getElementById("root")!).render(<App />);
