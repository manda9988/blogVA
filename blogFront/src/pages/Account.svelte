<!-- Account.svelte -->
<script>
  import { onMount } from 'svelte';
  import AutoLogout from '../lib/AutoLogout.svelte';
  import { verifyAccess, handleUnsubscribe } from '../services/authService.js';
  import {
    loadArticles,
    deleteArticle,
    editArticle,
  } from '../services/articleService.js';
  import {
    clearLocalStorage,
    getLocalStorageItem,
  } from '../services/storageService.js';
  import { confirmAction, redirectToLogin } from '../services/utils.js';

  let articles = [];
  const username = getLocalStorageItem('username');
  const token = getLocalStorageItem('token');

  onMount(async () => {
    if (await verifyAccess(token, username)) {
      articles = await loadArticles(
        getLocalStorageItem('role'),
        getLocalStorageItem('userId'),
      );
    }
  });

  async function handleEditArticle(id) {
    editArticle(id);
  }

  async function handleDeleteArticle(id, title) {
    const isDeleted = await deleteArticle(id, title); // Enlever le token de l'appel
    if (isDeleted) {
      // Ajouté: Vérifier si l'article a été supprimé
      articles = articles.filter((article) => article.id !== id);
    }
  }

  function handleLogout() {
    if (confirmAction('Êtes-vous sûr de vouloir vous déconnecter?')) {
      clearLocalStorage();
      redirectToLogin();
    }
  }

  async function handleUnsubscribeRequest() {
    await handleUnsubscribe(username, token);
  }
</script>

<AutoLogout />

<!-- Section du compte utilisateur -->
<div class="account-container">
  <h2>Bonjour {username}✌️😊</h2>

  <table class="article-table">
    <thead>
      <tr>
        <th class="col-author">Auteur</th>
        <th class="col-title">Titre</th>
        <th class="col-category">Catégorie</th>
        <th class="col-actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each articles as article}
        <tr>
          <td class="col-author">{article.username}</td>
          <td class="col-title">{article.title}</td>
          <td class="col-category">{article.category}</td>
          <td class="col-actions">
            <div class="action-buttons">
              <button
                class="edit-button"
                on:click={() => handleEditArticle(article.id)}>Modifier</button
              >
              <button
                class="delete-button"
                on:click={() => handleDeleteArticle(article.id, article.title)}
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
    <button on:click={handleUnsubscribeRequest}>Se désinscrire</button>
  </div>
</div>
