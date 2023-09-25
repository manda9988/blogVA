// routes.js
import Home from './pages/Home.svelte';
import Publish from './pages/Publish.svelte';
import Login from './pages/Login.svelte';
import Account from './pages/Account.svelte';
import Article from './pages/Article.svelte';
import Edit from './pages/Edit.svelte';
import Error404 from './pages/Error404.svelte'; // Nouvelle page d'erreur 404

const routes = {
  '/': Home,
  '/publish': Publish,
  '/login': Login,
  '/account': Account,
  '/article/:id': Article, // ":id" est un paramètre de route pour représenter l'ID de l'article
  '/edit/:id': Edit,
  '*': Error404, // Wildcard route pour capturer toutes les routes non définies
};

console.log('Defined routes:', routes);
console.log('Debug: Routes loaded');

export default routes;
