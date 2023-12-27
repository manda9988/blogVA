<!-- Register.svelte -->

<script>
  // Importation des fonctions nécessaires de Svelte et svelte-spa-router
  import { push } from 'svelte-spa-router';
  import { API_URL } from '../config/config.js';
  import { handleRegister } from '../services/authService.js';

  // Initialisation des variables pour le nom d'utilisateur, l'email, le mot de passe et la confirmation du mot de passe
  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';

  // Fonction pour gérer l'inscription
  async function register() {
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    const success = await handleRegister(username, email, password);
    if (success) {
      push('/login'); // Redirection vers la page de connexion
    }
  }
</script>

<!-- Section d'inscription -->
<div class="register-container">
  <h2>S'inscrire</h2>
  <!-- Formulaire d'inscription -->
  <form on:submit|preventDefault={register}>
    <!-- Champ pour le nom d'utilisateur -->
    <div class="input-group">
      <label for="username">Nom d'utilisateur</label>
      <input id="username" type="text" bind:value={username} required />
    </div>
    <!-- Champ pour l'adresse e-mail -->
    <div class="input-group">
      <label for="email">Adresse e-mail</label>
      <input id="email" type="email" bind:value={email} required />
    </div>
    <!-- Champ pour le mot de passe -->
    <div class="input-group">
      <label for="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        autocomplete="new-password"
      />
    </div>
    <!-- Champ pour la confirmation du mot de passe -->
    <div class="input-group">
      <label for="confirmPassword">Confirmer le mot de passe</label>
      <input
        id="confirmPassword"
        type="password"
        bind:value={confirmPassword}
        required
        autocomplete="new-password"
      />
    </div>
    <!-- Bouton d'inscription -->
    <button type="submit">S'inscrire</button>
  </form>
</div>
