<!-- Navbar.svelte -->

<script>
  import { location } from 'svelte-spa-router'; // Importez le store location
</script>

<nav>
  <ul>
    <li>
      <!-- Utilisez la classe conditionnelle pour vérifier la route actuelle -->
      <a href="/#" aria-label="Accueil" class:active={$location === '/'}
        >Accueil</a
      >
    </li>
    <li>
      <a
        href="/#/publish"
        aria-label="Publier"
        class:active={$location === '/publish'}>Publish</a
      >
    </li>
    <li>
      <a
        href="/#/login"
        aria-label="Se connecter"
        class:active={$location === '/login'}>Login</a
      >
    </li>
    <li>
      <a
        href="/#/account"
        aria-label="Compte"
        class:active={$location === '/account'}>Compte</a
      >
    </li>
  </ul>
</nav>
