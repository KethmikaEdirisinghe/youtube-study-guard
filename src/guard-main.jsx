import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import StudyGuard from "./study-guard/StudyGuard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StudyGuard />
  </StrictMode>
);