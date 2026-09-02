import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { applyFont, currentFont } from "./lib/font";

// גרסת הפונט שנבחרה במסך הכניסה חלה על כל המערכת
applyFont(currentFont());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
