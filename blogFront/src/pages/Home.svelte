<!-- Home.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import AutoLogout from '../lib/AutoLogout.svelte';

  let articles = [];
  const API_URL = 'http://localhost:3002';
  let users = []; // Définir users dans la portée globale du script

  onMount(async () => {
    try {
      const resUsers = await fetch(`${API_URL}/users`);
      users = await resUsers.json();
      // console.log('Tous les utilisateurs:', users); // Débogage: Afficher tous les utilisateurs

      const resArticles = await fetch(`${API_URL}/articles`);
      const allArticles = await resArticles.json();
      // console.log('Tous les articles:', allArticles); // Débogage: Afficher tous les articles

      const userRole = localStorage.getItem('role');
      // console.log('Rôle de l’utilisateur:', userRole); // Débogage: Afficher le rôle de l'utilisateur

      if (!userRole || userRole === 'visitor') {
        // Visiteur non connecté : Ne voir que les articles de l'admin
        const adminUser = users.find((user) => user.role === 'admin');
        // console.log('Utilisateur admin:', adminUser); // Débogage: Afficher l'utilisateur admin

        if (adminUser) {
          articles = allArticles.filter(
            (article) => article.user_id === adminUser.id,
          );
          // console.log('Articles de l’admin:', articles); // Débogage: Afficher les articles de l'admin
        } else {
          console.error('Aucun utilisateur admin trouvé');
        }
      } else if (userRole === 'admin') {
        articles = allArticles;
      } else {
        const userId = parseInt(localStorage.getItem('userId'));
        // Utilise la variable users récupérée précédemment
        const adminUser = users.find((user) => user.role === 'admin');
        if (adminUser) {
          articles = allArticles.filter(
            (article) =>
              article.user_id === userId || article.user_id === adminUser.id,
          );
          // console.log('Articles visibles par l’utilisateur:', articles); // Débogage: Afficher les articles visibles par l'utilisateur
        } else {
          console.error('Aucun utilisateur admin trouvé');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  });

  // Fonction pour naviguer vers la page d'un article spécifique
  function navigateToArticle(id, event) {
    if (
      event.type === 'click' ||
      (event.type === 'keydown' && event.key === 'Enter')
    ) {
      push(`/article/${id}`);
    }
  }
</script>

<AutoLogout />

<!-- Section contenant la liste des articles -->
<section>
  <div class="article-grid">
    {#each articles as article}
      <div
        class="article-card"
        role="button"
        tabindex="0"
        on:click={(event) => navigateToArticle(article.id, event)}
        on:keydown={(event) => navigateToArticle(article.id, event)}
      >
        <div class="content-container">
          {#if article?.imageurl}
            <div class="image-container">
              <img
                src={`${API_URL}${article?.imageurl}`}
                alt={article?.title}
              />
            </div>
          {:else}
            <div class="image-container default-bg"></div>
          {/if}
          <div class="title">{article.title}</div>
          <div class="author">
            <span class="username">{article.username}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
