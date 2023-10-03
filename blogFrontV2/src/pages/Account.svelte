<!-- Account.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  let articles = [];
  let username = localStorage.getItem('username'); // Récupérez le username

  onMount(async () => {
    const res = await fetch('http://localhost:3002/articles');
    articles = await res.json();
  });

  function editArticle(id) {
    const confirmEdit = window.confirm(
      'Êtes-vous sûr de vouloir modifier cet article?',
    );
    if (confirmEdit) {
      push(`/edit/${id}`);
    }
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

  function handleLogout() {
    localStorage.removeItem('username');
    push('/login');
  }

  async function handleUnsubscribe() {
    const confirmUnsubscribe = window.confirm(
      'Êtes-vous sûr de vouloir vous désinscrire ? Cette action est irréversible.',
    );
    if (confirmUnsubscribe) {
      // Ici, vous devrez faire une requête pour supprimer l'utilisateur de la base de données
      // Après avoir supprimé l'utilisateur, déconnectez-le
      handleLogout();
    }
  }
</script>

<div class="account-container">
  <h2>Bonjour {username}</h2>

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
  <div class="account-buttons">
    <button on:click={handleLogout}>Déconnexion</button>
    <button on:click={handleUnsubscribe}>Se désinscrire</button>
  </div>
</div>
