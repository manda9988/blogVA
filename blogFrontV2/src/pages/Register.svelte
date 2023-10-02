<!-- Register.svelte -->
<script>
  let email = '';
  let username = '';
  let password = '';
  let confirmPassword = '';

  function handleRegister() {
    // Gérer la logique d'inscription ici
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // Envoie les données d'inscription au serveur
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
      <input id="password" type="password" bind:value={password} required />
    </div>
    <div class="input-group">
      <label for="confirmPassword">Confirmer le mot de passe</label>
      <input
        id="confirmPassword"
        type="password"
        bind:value={confirmPassword}
        required
      />
    </div>
    <button type="submit">S'inscrire</button>
  </form>
</div>
