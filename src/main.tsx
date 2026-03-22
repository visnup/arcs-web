import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { nanoid } from "nanoid/non-secure";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const url = new URL(window.location.toString());
if (!url.searchParams.has("room")) {
  url.searchParams.set("room", nanoid());
  window.location.href = url.toString();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <SpeedInsights />
    <Analytics />
  </StrictMode>,
);
