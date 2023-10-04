// routes.js
import Home from './pages/Home.svelte';
import Publish from './pages/Publish.svelte';
import Login from './pages/Login.svelte';
import Register from './pages/Register.svelte';
import Account from './pages/Account.svelte';
import Article from './pages/Article.svelte';
import Edit from './pages/Edit.svelte';
import Error404 from './pages/Error404.svelte';

const routes = {
  '/': Home,
  '/publish': Publish,
  '/login': Login,
  '/register': Register,
  '/account': Account,
  '/article/:id': Article,
  '/edit/:id': Edit,
  '*': Error404,
};

console.log('Defined routes:', routes);
console.log('Debug: Routes loaded');

export default routes;
