import React from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "./providers/AuthProvider";
import { App } from "./App";

import "./main.css";

createRoot(document.getElementById("main")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
