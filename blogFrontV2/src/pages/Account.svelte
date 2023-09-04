<script>
  let articles = [
    { id: 1, title: 'Article 1', category: 'Technologie' },
    { id: 2, title: 'Article 2', category: 'Science' },
    // Ajoutez plus d'articles ici
  ];

  function editArticle(id) {
    // Code pour modifier l'article
    alert(`Modifier l'article avec l'ID: ${id}`);
  }

  function deleteArticle(id) {
    // Code pour supprimer l'article
    alert(`Supprimer l'article avec l'ID: ${id}`);
  }
</script>

<div class="account-container">
  <h2>Mon compte</h2>

  <table class="article-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Titre</th>
        <th>Catégorie</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each articles as article}
        <tr>
          <td>{article.id}</td>
          <td>{article.title}</td>
          <td>{article.category}</td>
          <td>
            <div class="action-buttons">
              <button
                class="edit-button"
                on:click={() => editArticle(article.id)}>Modifier</button
              >
              <button
                class="delete-button"
                on:click={() => deleteArticle(article.id)}>Supprimer</button
              >
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
