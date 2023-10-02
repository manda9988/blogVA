<!-- Login.svelte
<script>
  let emailLogin = '';
  let passwordLogin = '';
  let emailRegister = '';
  let usernameRegister = '';
  let passwordRegister = '';
  let confirmPasswordRegister = '';

  function handleLogin() {
    // Gérer la logique de connexion ici
  }

  function handleRegister() {
    // Gérer la logique d'inscription ici
    if (passwordRegister !== confirmPasswordRegister) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // Envoie les données d'inscription au serveur
  }
</script>

<div class="auth-container">
  <div class="login-container">
    <h2>Se connecter</h2>
    <form on:submit|preventDefault={handleLogin}>
      <div class="input-group">
        <label for="emailLogin">Adresse e-mail</label>
        <input id="emailLogin" type="email" bind:value={emailLogin} required />
      </div>
      <div class="input-group">
        <label for="passwordLogin">Mot de passe</label>
        <input
          id="passwordLogin"
          type="password"
          bind:value={passwordLogin}
          required
        />
      </div>
      <button type="submit">Se connecter</button>
    </form>
  </div>

  <div class="register-container">
    <h2>S'inscrire</h2>
    <form on:submit|preventDefault={handleRegister}>
      <div class="input-group">
        <label for="usernameRegister">Nom d'utilisateur</label>
        <input
          id="usernameRegister"
          type="text"
          bind:value={usernameRegister}
          required
        />
      </div>
      <div class="input-group">
        <label for="emailRegister">Adresse e-mail</label>
        <input
          id="emailRegister"
          type="email"
          bind:value={emailRegister}
          required
        />
      </div>
      <div class="input-group">
        <label for="passwordRegister">Mot de passe</label>
        <input
          id="passwordRegister"
          type="password"
          bind:value={passwordRegister}
          required
        />
      </div>
      <div class="input-group">
        <label for="confirmPasswordRegister">Confirmer le mot de passe</label>
        <input
          id="confirmPasswordRegister"
          type="password"
          bind:value={confirmPasswordRegister}
          required
        />
      </div>
      <button type="submit">S'inscrire</button>
    </form>
  </div>
</div> -->
