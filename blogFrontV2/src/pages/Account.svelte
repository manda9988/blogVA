<!-- Account.svelte -->

<script>
  // Importation des fonctions nécessaires de Svelte et svelte-spa-router
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import AutoLogout from '../lib/AutoLogout.svelte'; // <-- Ajout de l'importation

  // Initialisation des variables pour les articles et le nom d'utilisateur
  let articles = [];
  let username = localStorage.getItem('username');
  const API_URL = 'http://localhost:3002';

  // Fonction exécutée lors du montage du composant
  onMount(async () => {
    // Vérification si l'utilisateur est connecté
    if (!username) {
      alert('Veuillez vous connecter pour accéder à cette page.');
      push('/login');
      return;
    }

    // Vérification de la validité du token
    const token = localStorage.getItem('token');
    if (!token) {
      push('/login');
      return;
    }

    // Vérification du token avec le backend
    const response = await fetch(`${API_URL}/verifyToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Si le token n'est pas valide, déconnexion de l'utilisateur
    if (!response.ok) {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      push('/login');
      return;
    }

    // Récupération des articles de l'utilisateur
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role'); // Supposons que vous stockiez également le rôle de l'utilisateur dans le localStorage

    let articlesEndpoint = `${API_URL}/articles`;
    if (userRole !== 'admin') {
      articlesEndpoint += `?userId=${userId}`;
    }

    const res = await fetch(articlesEndpoint);
    articles = await res.json();
  });

  // Fonction pour éditer un article
  function editArticle(id) {
    const confirmEdit = window.confirm(
      'Êtes-vous sûr de vouloir modifier cet article?',
    );
    if (confirmEdit) {
      push(`/edit/${id}`); // Redirige vers la page d'édition
    }
  }

  // Fonction pour supprimer un article
  async function deleteArticle(id, title) {
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'article ${title}?`,
    );
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3002/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mettre à jour la liste des articles après suppression
      if (res.ok) {
        articles = articles.filter((article) => article.id !== id);
      } else {
        alert("Échec de la suppression de l'article.");
      }
    }
  }

  // Fonction pour se déconnecter
  function handleLogout() {
    const confirmLogout = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter?',
    );
    if (confirmLogout) {
      logoutWithoutConfirmation();
    }
  }

  // Fonction pour se déconnecter sans confirmation
  function logoutWithoutConfirmation() {
    localStorage.removeItem('username'); // Supprime le nom d'utilisateur du stockage local
    push('/'); // Redirige l'utilisateur vers la page d'accueil
  }

  // Fonction pour se désinscrire
  async function handleUnsubscribe() {
    const confirmUnsubscribe = window.confirm(
      'Êtes-vous sûr de vouloir vous désinscrire ? Cette action est irréversible.',
    );
    if (confirmUnsubscribe) {
      const res = await fetch(`http://localhost:3002/users/${username}`, {
        method: 'DELETE',
      });

      // Se déconnecter après désinscription
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
<!-- <-- Ajout du composant AutoLogout -->

<!-- Section du compte utilisateur -->
<div class="account-container">
  <h2>Bonjour {username}✌️😊</h2>

  <!-- Tableau des articles de l'utilisateur -->
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
  <!-- Boutons de déconnexion et de désinscription -->
  <div class="account-buttons">
    <button on:click={handleLogout}>Déconnexion</button>
    <button on:click={handleUnsubscribe}>Se désinscrire</button>
  </div>
</div>

<!-- Ce fichier est le composant de la page du compte utilisateur. Il affiche la liste des articles publiés par l'utilisateur avec des options pour éditer ou supprimer chaque article. Il offre également à l'utilisateur la possibilité de se déconnecter ou de se désinscrire. -->
