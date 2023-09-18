<!-- Publish.svelte -->
<script>
  let title = '';
  let content = '';
  let category = '';
  let file;

  function handlePublish() {
    const isConfirmed = window.confirm(
      'Êtes-vous sûr de vouloir publier cet article ?',
    );
    if (isConfirmed) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('image', file);

      fetch('http://localhost:3002/articles', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Article publié:', data);
          // Rediriger vers la page d'accueil
          window.location.href = '/'; // Remplacez '/' par l'URL de votre page d'accueil si nécessaire
        });
    }
  }

  function handleFileChange(event) {
    file = event.target.files[0];
  }
</script>

<!-- HTML Code -->
<div class="publish-container">
  <h2>Publier un nouvel article</h2>

  <form on:submit|preventDefault={handlePublish}>
    <div class="input-group">
      <label for="title">Titre</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        required
        maxlength="18"
      />
    </div>

    <div class="input-group">
      <label for="category">Catégorie</label>
      <input
        id="category"
        type="text"
        bind:value={category}
        required
        maxlength="18"
      />
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
