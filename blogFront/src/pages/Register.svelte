<!-- Register.svelte -->

<script>
  // Importation des fonctions nécessaires de Svelte et svelte-spa-router
  import { push } from 'svelte-spa-router';

  // Initialisation des variables pour le nom d'utilisateur, l'email, le mot de passe et la confirmation du mot de passe
  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';

  import { API_URL } from '../config/config.js';

  // Fonction pour gérer l'inscription
  async function handleRegister() {
    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      // Envoi des informations d'inscription au backend
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.errors.map((err) => err.msg).join('\n'));
        return;
      }

      alert('Inscription réussie!');
      push('/login'); // Redirection vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  }
</script>

<!-- Section d'inscription -->
<div class="register-container">
  <h2>S'inscrire</h2>
  <!-- Formulaire d'inscription -->
  <form on:submit|preventDefault={handleRegister}>
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

<!-- Ce fichier est le composant de la page d'inscription. Il contient un formulaire permettant à l'utilisateur de saisir son nom d'utilisateur, son adresse e-mail, son mot de passe et de confirmer son mot de passe pour s'inscrire. Une fois le formulaire soumis, les informations sont envoyées au backend pour enregistrement. -->
