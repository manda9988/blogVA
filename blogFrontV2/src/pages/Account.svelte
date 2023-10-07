<!-- Account.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  let articles = [];
  let username = localStorage.getItem('username'); // Récupérez le username depuis le stockage local

  // Vérifiez si l'utilisateur est connecté dès que le composant est monté
  onMount(() => {
    if (!username) {
      alert('Veuillez vous connecter pour accéder à cette page.');
      push('/login');
    } else {
      // Si connecté, récupérez les articles
      fetch('http://localhost:3002/articles')
        .then((res) => res.json())
        .then((data) => (articles = data));
    }
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
      const res = await fetch(`http://localhost:3002/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Mettre à jour la liste des articles après suppression
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

      if (res.ok) {
        logoutWithoutConfirmation(); // Se déconnecter après désinscription
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la désinscription');
      }
    }
  }
</script>

<div class="account-container">
  <h2>Bonjour {username}✌️😊</h2>

  <table class="article-table">
    <thead>
      <tr>
        <th class="col-title">Titre</th>
        <th class="col-category">Catégorie</th>
        <th class="col-actions">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each articles as article}
        <tr>
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
