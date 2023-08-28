<!-- src/components/NavBar.svelte -->

<script>
  // JavaScript pour la navigation, si nécessaire
</script>

<style lang="scss">
  nav {
    ul {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        display: inline;
        margin-right: 15px;

        a {
          text-decoration: none;
          color: black;
        }
      }
    }
  }
</style>

<nav>
  <ul>
    <li><a href="#/">Accueil</a></li>
    <li><a href="#/a-propos">À propos</a></li>
    <li><a href="#/contact">Contact</a></li>
    <li><a href="#/publier">Publier</a></li>
    <li><a href="#/se-connecter">Se connecter</a></li>
  </ul>
</nav>
