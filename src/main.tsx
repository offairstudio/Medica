import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { applyFont, currentFont } from "./lib/font";
import { applyLocaleAttributes, currentLocale } from "./i18n/locale";
import { t } from "./i18n";

// גרסת הפונט והשפה שנבחרו במסך הכניסה חלות על כל המערכת
applyFont(currentFont());
applyLocaleAttributes(currentLocale());
document.title = t.ui.appTitle;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
