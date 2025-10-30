import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProviderCustom } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProviderCustom>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--color-card)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-md)",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "0.95rem",
              },
              success: {
                style: {
                  background: "var(--color-success-bg)",
                  color: "var(--color-success)",
                  border: "1px solid var(--color-success)",
                },
                iconTheme: {
                  primary: "var(--color-success)",
                  secondary: "var(--color-card)",
                },
              },
              error: {
                style: {
                  background: "var(--color-error-bg)",
                  color: "var(--color-error)",
                  border: "1px solid var(--color-error)",
                },
                iconTheme: {
                  primary: "var(--color-error)",
                  secondary: "var(--color-card)",
                },
              },
            }}
          />
        </ThemeProviderCustom>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
