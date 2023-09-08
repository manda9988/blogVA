<!-- src/App.svelte -->

<script>
  import Router from 'svelte-spa-router';
  import routes from './routes';

  import Header from './components/Header.svelte';
  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';

  // Votre code de débogage
  console.log("Debug: App component loaded");
</script>

<main class="main-container">
  <Header />
  <Navbar />
  <div class="router-container">
    <Router {routes} />
  </div>
  <Footer />
</main>
