import Home from './pages/Home.svelte';
import Publish from './pages/Publish.svelte';
import Login from './pages/Login.svelte';
import Account from './pages/Account.svelte';
import Article from './pages/Article.svelte';

const routes = {
  '/': Home,
  '/publish': Publish,
  '/login': Login,
  '/account': Account,
  '/article/:id': Article, // ":id" est un paramètre de route pour représenter l'ID de l'article
};

export default routes;
