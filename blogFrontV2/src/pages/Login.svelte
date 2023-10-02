<!-- Login.svelte -->
<script>
  import { push } from 'svelte-spa-router'; // Utilisez push de svelte-spa-router pour la navigation
  let email = '';
  let password = '';

  function handleLogin() {
    // Gérer la logique de connexion ici
  }

  function handleLogout() {
    // Gérer la logique de déconnexion ici
  }

  function goToRegister() {
    push('/register'); // Naviguer vers la page d'inscription
  }
</script>

<div class="login-container">
  <h2>Se connecter</h2>
  <form on:submit|preventDefault={handleLogin}>
    <div class="input-group">
      <label for="email">Adresse e-mail</label>
      <input id="email" type="email" bind:value={email} required />
    </div>
    <div class="input-group">
      <label for="password">Mot de passe</label>
      <input id="password" type="password" bind:value={password} required />
    </div>

    <div class="button-group">
      <button type="submit">Se connecter</button>
      <button on:click={handleLogout}>Déconnexion</button>
    </div>
  </form>

  <a href="/register" on:click|preventDefault={goToRegister}
    >Pas encore inscrit ? S'inscrire</a
  >
</div>
