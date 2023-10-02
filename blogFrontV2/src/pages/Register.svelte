<!-- Register.svelte -->
<script>
  import { onMount } from 'svelte';

  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';

  const API_URL = 'http://localhost:3002'; // Assurez-vous que c'est le bon port

  onMount(() => {
    // Initialisations si nécessaire
  });

  async function handleRegister() {
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json(); // Parse l'erreur en JSON
        // Affiche un message d'erreur basé sur la réponse du serveur
        alert(error.errors.map((err) => err.msg).join('\n'));
        return;
      }

      alert('Inscription réussie!');
      // Redirection si nécessaire
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  }
</script>

<div class="register-container">
  <h2>S'inscrire</h2>
  <form on:submit|preventDefault={handleRegister}>
    <div class="input-group">
      <label for="username">Nom d'utilisateur</label>
      <input id="username" type="text" bind:value={username} required />
    </div>
    <div class="input-group">
      <label for="email">Adresse e-mail</label>
      <input id="email" type="email" bind:value={email} required />
    </div>
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
    <button type="submit">S'inscrire</button>
  </form>
</div>
