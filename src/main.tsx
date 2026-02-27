/**
 * ============================================
 * 🚀 MAIN ENTRY POINT — main.tsx
 * ============================================
 * 
 * This is where the entire app starts.
 * Think of it as the "ignition key" for your React app.
 * 
 * What it does:
 * 1. Finds the <div id="root"> in index.html
 * 2. Renders our <App /> component inside it
 * 3. Loads global CSS styles
 * 
 * HINT: You rarely need to change this file.
 */

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css"; // 🎨 Global styles (fonts, colors, Tailwind)

// Find the root element in index.html and render the app inside it
createRoot(document.getElementById("root")!).render(<App />);