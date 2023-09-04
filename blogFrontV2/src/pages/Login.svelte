<script>
  let email = '';
  let password = '';
  function handleLogin() {
    // Gérer la logique de connexion ici
  }
</script>

<!-- Contenu principal -->
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
    <button type="submit">Se connecter</button>
  </form>
  <!-- <div class="extra-links">
    <a href="#forgot-password">Mot de passe oublié?</a>
    <a href="#register">Pas encore inscrit? S'inscrire</a>
  </div> -->
</div>
