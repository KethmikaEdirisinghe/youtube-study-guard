import { createRoot } from "react-dom/client";
import StudyGuard from "./StudyGuard.jsx";

const rootElement = document.getElementById("study-guard-root");

createRoot(rootElement).render(
  <StudyGuard />
);