<script>
  let title = '';
  let content = '';
  let category = '';
  let file;

  function handlePublish() {
    // Logique de publication
  }

  function handleFileChange(event) {
    file = event.target.files[0];
  }
</script>

<div class="publish-container">
  <h2>Publier un nouvel article</h2>

  <form on:submit|preventDefault={handlePublish}>
    <div class="input-group">
      <label for="title">Titre</label>
      <input id="title" type="text" bind:value={title} required />
    </div>

    <div class="input-group">
      <label for="category">Catégorie</label>
      <input id="category" type="text" bind:value={category} required />
    </div>

    <div class="input-group">
      <label for="content">Contenu</label>
      <textarea id="content" bind:value={content} required></textarea>
    </div>

    <div class="input-group">
      <label for="image">Image de l'article</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        on:change={handleFileChange}
      />
    </div>

    <button type="submit">Publier</button>
  </form>
</div>
