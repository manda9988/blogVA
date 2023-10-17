// vite.config.js

// Importation des modules nécessaires pour la configuration de Vite
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

/* 
  Configuration de Vite pour l'application.
  Cette configuration spécifie comment Vite doit construire et servir l'application.
  - Le plugin Svelte est ajouté pour permettre à Vite de traiter les fichiers Svelte.
  - sveltePreprocess est utilisé pour traiter les fichiers Svelte avant leur compilation.
  - Les options de construction spécifient comment les fichiers doivent être empaquetés et servis.
*/

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        /* options */
      }),
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]', // Spécifie le format des noms de fichiers pour les actifs
      },
    },
  },
});
