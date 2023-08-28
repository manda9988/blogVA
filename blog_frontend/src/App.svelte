<!-- src/App.svelte -->

<script>
  import Header from './components/Header.svelte';
  import NavBar from './components/NavBar.svelte';
  import Footer from './components/Footer.svelte';
  // Le reste de votre code JavaScript ici
</script>

<style lang="scss">
  // Écrivez vos styles SASS ici
  // Par exemple
  main {
    background-color: #f4f4f4;

    section {
      padding: 1em;
    }
  }
</style>

<Header />
<!-- Utilisez le composant Header ici -->
<NavBar />
<!-- Utilisez le composant NavBar ici -->
<main>
  <section>
    <!-- Grille d'articles -->
  </section>
</main>
<Footer />
