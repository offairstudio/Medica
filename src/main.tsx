import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { applyFont, currentFont } from "./lib/font";
import { applyLocaleAttributes, currentLocale } from "./i18n/locale";

// גרסת הפונט והשפה שנבחרו במסך הכניסה חלות על כל המערכת
applyFont(currentFont());
applyLocaleAttributes(currentLocale());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
