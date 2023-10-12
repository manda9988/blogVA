<!-- Login.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  let email = '';
  let password = '';
  const API_URL = 'http://localhost:3002';

  function checkIfAlreadyLoggedIn() {
    if (localStorage.getItem('username')) {
      alert("Vous êtes déjà connecté. Redirection vers la page d'accueil.");
      push('/');
    }
  }

  onMount(async () => {
    checkIfAlreadyLoggedIn();

    // Vérifiez la validité du token
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch(`${API_URL}/verifyToken`, {
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
      localStorage.setItem('token', data.token); // Ajout du token dans le localStorage
      localStorage.setItem('userId', data.user.id); // Nouvelle ligne ajoutée

      console.log('Token stocké:', localStorage.getItem('token')); // Log pour vérifier le token stocké
      push('/account');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur lors de la connexion. Veuillez réessayer.');
    }
  }

  function goToRegister() {
    push('/register');
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
    </div>
  </form>

  <a href="/register" on:click|preventDefault={goToRegister}
    >Pas encore inscrit ? S'inscrire</a
  >
</div>
