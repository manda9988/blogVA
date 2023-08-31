// src/main.js

// Importez main.scss au lieu de app.css
import "./styles/main.scss";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
