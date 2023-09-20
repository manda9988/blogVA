<!-- Account.svelte -->
<script>
  import { onMount } from 'svelte';

  let articles = [];

  onMount(async () => {
    const res = await fetch('http://localhost:3002/articles');
    articles = await res.json();
  });

  function editArticle(id) {
    alert(`Modifier l'article avec l'ID: ${id}`);
  }

  async function deleteArticle(id, title) {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'article ${title}?`,
    );
    if (confirmDelete) {
      const res = await fetch(`http://localhost:3002/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        articles = articles.filter((article) => article.id !== id);
      } else {
        alert("Échec de la suppression de l'article.");
      }
    }
  }
</script>

<div class="account-container">
  <h2>Mon compte</h2>

  <table class="article-table">
    <thead>
      <tr>
        <th class="col-id">ID</th>
        <th class="col-title">Titre</th>
        <th class="col-category">Catégorie</th>
        <th class="col-actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each articles as article}
        <tr>
          <td class="col-id">{article.id}</td>
          <td class="col-title">{article.title}</td>
          <td class="col-category">{article.category}</td>
          <td class="col-actions">
            <div class="action-buttons">
              <button
                class="edit-button"
                on:click={() => editArticle(article.id)}>Modifier</button
              >
              <button
                class="delete-button"
                on:click={() => deleteArticle(article.id, article.title)}
                >Supprimer</button
              >
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
