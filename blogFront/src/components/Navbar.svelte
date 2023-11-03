<!-- src/components/Navbar.svelte -->

<!-- 
  Composant de barre de navigation de l'application.
  Cette barre de navigation contient des liens vers différentes pages de l'application.
  Elle utilise le store 'location' de 'svelte-spa-router' pour déterminer la route actuelle 
  et mettre en évidence le lien correspondant.
-->

<script>
  // Importation du store 'location' de 'svelte-spa-router'
  import { location } from 'svelte-spa-router';
</script>

<nav>
  <ul>
    <!-- Lien vers la page d'accueil -->
    <li>
      <a href="/#" aria-label="Accueil" class:active={$location === '/'}
        >Accueil</a
      >
    </li>

    <!-- Lien vers la page de publication d'articles -->
    <li>
      <a
        href="/#/publish"
        aria-label="Publier"
        class:active={$location === '/publish'}>Publish</a
      >
    </li>

    <!-- Lien vers la page de connexion -->
    <li>
      <a
        href="/#/login"
        aria-label="Se connecter"
        class:active={$location === '/login'}>Login</a
      >
    </li>

    <!-- Lien vers la page de compte utilisateur -->
    <li>
      <a
        href="/#/account"
        aria-label="Compte"
        class:active={$location === '/account'}>Compte</a
      >
    </li>
  </ul>
</nav>
