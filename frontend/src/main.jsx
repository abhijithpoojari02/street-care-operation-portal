import React from "react";
import ReactDOM from "react-dom/client";
import 'leaflet/dist/leaflet.css';
import App from "./App";
import "./index.css";   // ⬅️ this MUST be here

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
