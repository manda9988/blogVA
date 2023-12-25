<!-- Account.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import AutoLogout from '../lib/AutoLogout.svelte';
  import { API_URL } from '../config/config.js';

  let articles = [];
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  onMount(() => {
    verifyAccess();
    loadArticles();
  });

  async function verifyAccess() {
    if (!username || !token) {
      redirectToLogin('Veuillez vous connecter pour accéder à cette page.');
    }

    const response = await fetch(`${API_URL}/users/verifyToken`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      clearLocalStorage();
      redirectToLogin();
    }
  }

  async function loadArticles() {
    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    let articlesEndpoint = `${API_URL}/articles${
      userRole !== 'admin' ? `?userId=${userId}` : ''
    }`;

    try {
      const res = await fetch(articlesEndpoint);
      articles = await res.json();
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  }

  async function editArticle(id) {
    if (confirm('Êtes-vous sûr de vouloir modifier cet article?')) {
      push(`/edit/${id}`);
    }
  }

  async function deleteArticle(id, title) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article ${title}?`)) {
      try {
        const res = await fetch(`${API_URL}/articles/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          articles = articles.filter((article) => article.id !== id);
        } else {
          alert("Échec de la suppression de l'article.");
        }
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  }

  function handleLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      logoutWithoutConfirmation();
    }
  }

  function logoutWithoutConfirmation() {
    clearLocalStorage();
    push('/');
  }

  async function handleUnsubscribe() {
    if (
      confirm(
        'Êtes-vous sûr de vouloir vous désinscrire ? Cette action est irréversible.',
      )
    ) {
      try {
        const res = await fetch(`${API_URL}/users/${username}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          logoutWithoutConfirmation();
        } else {
          const data = await res.json();
          alert(data.error || 'Erreur lors de la désinscription');
        }
      } catch (error) {
        console.error('Failed to unsubscribe:', error);
      }
    }
  }

  function clearLocalStorage() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  function redirectToLogin(message = '') {
    if (message) alert(message);
    push('/login');
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
