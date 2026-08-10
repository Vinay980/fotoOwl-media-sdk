import React from "react";
import ReactDOM from "react-dom/client";

import { MediaProvider } from "@fotoowl/media-react";

import App from "./App.js";
import "./styles.css";

const apiKey =
  import.meta.env.VITE_PEXELS_API_KEY;

if (!apiKey) {
  console.warn(
    "VITE_PEXELS_API_KEY is not configured.",
  );
}

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <MediaProvider apiKey={apiKey ?? ""}>
      <App />
    </MediaProvider>
  </React.StrictMode>,
);