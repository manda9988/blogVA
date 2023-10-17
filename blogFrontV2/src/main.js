// src/main.js

// Importation du fichier de style principal (main.scss) pour l'application
import './styles/main.scss';

// Importation du composant principal App de l'application
import App from './App.svelte';

/* 
  Initialisation du composant principal App.
  Le composant est rendu dans l'élément du DOM avec l'ID "app".
  C'est le point d'entrée de l'application où tout commence.
*/
const app = new App({
  target: document.getElementById('app'),
});

// Exportation de l'instance de l'application pour une utilisation éventuelle dans d'autres fichiers
export default app;

// Ce fichier est le point d'entrée de l'application Svelte. Il initialise le composant principal App et le rend dans l'élément du DOM avec l'ID "app". C'est ici que l'application commence à être exécutée.
