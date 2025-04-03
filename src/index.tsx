import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Use createRoot for React 18 and render the app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
