import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./store/appStore.js";
import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from "./auth/authConfig.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthProvider authConfig={authConfig}>
  <Provider store={appStore}>
    <App />
  </Provider>
  </AuthProvider>
  // </StrictMode>
);
