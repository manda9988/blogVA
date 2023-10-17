// routes.js

// Importation des composants de pages pour les différentes routes
import Home from './pages/Home.svelte'; // Page d'accueil
import Publish from './pages/Publish.svelte'; // Page de publication d'articles
import Login from './pages/Login.svelte'; // Page de connexion
import Register from './pages/Register.svelte'; // Page d'inscription
import Account from './pages/Account.svelte'; // Page de compte utilisateur
import Article from './pages/Article.svelte'; // Page de visualisation d'un article
import Edit from './pages/Edit.svelte'; // Page de modification d'un article
import Error404 from './pages/Error404.svelte'; // Page d'erreur 404

/* 
  Définition des routes de l'application.
  Chaque route est associée à un composant spécifique qui sera rendu lorsque la route est activée.
  Par exemple, lorsque l'utilisateur accède à '/publish', le composant Publish est rendu.
*/
const routes = {
  '/': Home,
  '/publish': Publish,
  '/login': Login,
  '/register': Register,
  '/account': Account,
  '/article/:id': Article, // Route dynamique pour visualiser un article spécifique par ID
  '/edit/:id': Edit, // Route dynamique pour modifier un article spécifique par ID
  '*': Error404, // Route par défaut pour gérer les pages non trouvées (erreur 404)
};

// Code de débogage pour vérifier les routes définies et confirmer que le fichier est chargé
console.log('Defined routes:', routes);
console.log('Debug: Routes loaded');

// Exportation des routes pour être utilisées dans d'autres fichiers
export default routes;
