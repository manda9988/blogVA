<!-- Login.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { verifyTokenOnMount, handleLogin } from '../services/authService.js';
  import { API_URL } from '../config/config.js';

  let email = '';
  let password = '';

  // Fonction pour vérifier si l'utilisateur est déjà connecté
  function checkIfAlreadyLoggedIn() {
    if (localStorage.getItem('username')) {
      alert("Vous êtes déjà connecté. Redirection vers la page d'accueil.");
      push('/');
    }
  }

  // Vérification lors du montage du composant
  onMount(async () => {
    checkIfAlreadyLoggedIn();

    // Utiliser la fonction déplacée
    const token = localStorage.getItem('token');
    if (token && !(await verifyTokenOnMount(token))) {
      push('/login');
    }
  });

  // Fonction pour gérer la connexion

  async function login() {
    const success = await handleLogin(email, password);
    if (success) {
      push('/account');
    }
  }

  // Fonction pour empêcher la navigation vers 'register' si le nombre maximal d'utilisateurs est atteint

  async function goToRegister() {
    const response = await fetch(`${API_URL}/users/count`);

    if (!response.ok) {
      console.error('Erreur lors de la requête au serveur:', response); // Log d'erreur
      alert("Erreur lors de la récupération du nombre d'utilisateurs.");
      return;
    }

    const data = await response.json();

    if (data.count >= 3) {
      alert(
        "La limite de 3 utilisateurs a été atteinte. L'inscription est actuellement désactivée.",
      );
      return;
    }

    push('/register');
  }
</script>

<!-- Section de connexion -->
<div class="login-container">
  <h2>Se connecter</h2>
  <!-- Formulaire de connexion -->
  <form on:submit|preventDefault={login}>
    <!-- Champ pour l'adresse e-mail -->
    <div class="input-group">
      <label for="email">Adresse e-mail</label>
      <input id="email" type="email" bind:value={email} required />
    </div>
    <!-- Champ pour le mot de passe -->
    <div class="input-group">
      <label for="password">Mot de passe</label>
      <input id="password" type="password" bind:value={password} required />
    </div>
    <!-- Bouton de connexion -->
    <div class="button-group">
      <button type="submit">Se connecter</button>
    </div>
  </form>
  <!-- Lien vers la page d'inscription -->
  <a href="/register" on:click|preventDefault={goToRegister}
    >Pas encore inscrit ? S'inscrire</a
  >
</div>
