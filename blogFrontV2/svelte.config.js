// svelte.config.js

// Importation de vitePreprocess du plugin Svelte pour Vite
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/* 
  Configuration de Svelte pour l'application.
  Cette configuration spécifie comment Svelte doit traiter les fichiers avant leur compilation.
  - vitePreprocess est utilisé pour traiter les fichiers Svelte en fonction de la configuration de Vite.
*/

export default {
  // Consultez https://svelte.dev/docs#compile-time-svelte-preprocess
  // pour plus d'informations sur les préprocesseurs
  preprocess: vitePreprocess(),
};
