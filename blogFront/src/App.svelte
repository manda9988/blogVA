<!-- src/App.svelte -->

<script>
  // Importation des modules nécessaires
  import Router from 'svelte-spa-router'; // Routeur pour les applications monopages Svelte
  import routes from './routes'; // Importation des routes définies dans le fichier routes.js

  // Importation des composants
  import Header from './components/Header.svelte'; // Composant d'en-tête
  import Navbar from './components/Navbar.svelte'; // Composant de barre de navigation
  import Footer from './components/Footer.svelte'; // Composant de pied de page

  // Code de débogage pour vérifier que le composant App est chargé
  // console.log('Debug: App component loaded');
</script>

<!-- Structure principale de l'application -->
<main class="main-container">
  <!-- En-tête de l'application -->
  <Header />

  <!-- Barre de navigation -->
  <Navbar />

  <!-- Conteneur du routeur où les vues des différentes routes seront rendues -->
  <div class="router-container">
    <Router {routes} />
  </div>

  <!-- Pied de page de l'application -->
  <Footer />
</main>

<!-- 
  Ce fichier est le composant principal de l'application Svelte. 
  Il structure l'application en incluant l'en-tête, la barre de navigation, 
  le conteneur du routeur (où les différentes vues seront rendues en fonction de la route actuelle) 
  et le pied de page.
-->
