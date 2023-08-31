import Home from './pages/Home.svelte';
import Publish from './pages/Publish.svelte';
import Login from './pages/Login.svelte';

const routes = {
  '/': Home,
  '/publish': Publish,
  '/login': Login,
};

export default routes;
