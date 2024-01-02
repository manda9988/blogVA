<!-- Publish.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { verifyPublishAccess } from '../services/authService.js';
  import { publishArticle } from '../services/articleService.js';

  let title = '';
  let content = '';
  let category = '';
  let file;

  onMount(async () => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    // Utiliser verifyPublishAccess pour vérifier les permissions et les limites
    // Ajout pour le débogage :
    console.log(`UserID: ${userId}, Role: ${role}`);
    if (!(await verifyPublishAccess(userId, role))) {
      return; // Redirection déjà gérée dans verifyPublishAccess
    }
  });

  function handlePublish() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(
        "Votre session a expiré ou vous n'êtes pas connecté. Veuillez vous reconnecter.",
      );
      push('/login');
      return;
    }

    // Appel à la nouvelle fonction dans articleService.js
    publishArticle(title, content, category, file);
  }

  function handleFileChange(event) {
    file = event.target.files[0];
  }
</script>

<!-- Section pour la publication d'un nouvel article -->
<div class="publish-container">
  <h2>Publier un nouvel article</h2>

  <!-- Formulaire de publication -->
  <form on:submit|preventDefault={handlePublish}>
    <!-- Champ pour le titre de l'article -->
    <div class="input-group">
      <label for="title">Titre</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        required
        maxlength="14"
      />
    </div>

    <!-- Champ pour la catégorie de l'article -->
    <div class="input-group">
      <label for="category">Catégorie</label>
      <input
        id="category"
        type="text"
        bind:value={category}
        required
        maxlength="14"
      />
    </div>

    <!-- Champ pour le contenu de l'article -->
    <div class="input-group">
      <label for="content">Contenu</label>
      <textarea id="content" bind:value={content} required></textarea>
    </div>

    <!-- Champ pour l'image de l'article -->
    <div class="input-group">
      <label for="image">Image de l'article</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        on:change={handleFileChange}
      />
    </div>

    <!-- Bouton pour publier l'article -->
    <button type="submit">Publier</button>
  </form>
</div>
