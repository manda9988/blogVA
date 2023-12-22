<!-- Login.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  let email = '';
  let password = '';
  import { API_URL } from '../config/config.js';
  const LOGOUT_FLAG = 'autoLoggedOut'; // <-- Ajout de la constante

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

    // Vérification de la validité du token
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch(`${API_URL}/users/verifyToken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        push('/login');
      }
    }
  });

  // Fonction pour gérer la connexion
  async function handleLogin() {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Erreur de connexion');
        return;
      }

      localStorage.setItem('username', data.user.username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('role', data.user.role);
      localStorage.removeItem(LOGOUT_FLAG); // <-- Ajout de cette ligne pour réinitialiser l'indicateur
      push('/account');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur lors de la connexion. Veuillez réessayer.');
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
  <form on:submit|preventDefault={handleLogin}>
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
