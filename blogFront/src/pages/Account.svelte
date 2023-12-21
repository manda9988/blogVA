<!-- Account.svelte -->
<script>
  // Importation des fonctions nécessaires de Svelte et svelte-spa-router
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import AutoLogout from '../lib/AutoLogout.svelte';

  let articles = [];
  let username = localStorage.getItem('username');
  const API_URL = 'http://localhost:3002';

  onMount(async () => {
    if (!username) {
      alert('Veuillez vous connecter pour accéder à cette page.');
      push('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      push('/login');
      return;
    }

    const response = await fetch(`${API_URL}/users/verifyToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      push('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role');

    let articlesEndpoint = `${API_URL}/articles`;
    if (userRole !== 'admin') {
      articlesEndpoint += `?userId=${userId}`;
    }

    const res = await fetch(articlesEndpoint);
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
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        articles = articles.filter((article) => article.id !== id);
      } else {
        alert("Échec de la suppression de l'article.");
      }
    }
  }

  // MODIFICATION: Fonction pour se déconnecter
  function handleLogout() {
    const confirmLogout = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter?',
    );
    if (confirmLogout) {
      logoutWithoutConfirmation();
    }
  }

  // MODIFICATION: Fonction pour se déconnecter sans confirmation
  function logoutWithoutConfirmation() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    push('/');
  }

  async function handleUnsubscribe() {
    const confirmUnsubscribe = window.confirm(
      'Êtes-vous sûr de vouloir vous désinscrire ? Cette action est irréversible.',
    );
    if (confirmUnsubscribe) {
      const res = await fetch(`${API_URL}/users/${username}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        logoutWithoutConfirmation();
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la désinscription');
      }
    }
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
