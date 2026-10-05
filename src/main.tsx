import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
// Gallery reset/navigation are explicit; reusable consumers import core.css only.
import "./generated/tokens.css";
import "./gallery.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
