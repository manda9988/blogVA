<!-- Home.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import AutoLogout from '../lib/AutoLogout.svelte';

  let articles = [];
  import { API_URL } from '../config/config.js';

  onMount(async () => {
    try {
      const resArticles = await fetch(`${API_URL}/articles`);
      articles = await resArticles.json(); // Affecte tous les articles à la variable 'articles'
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
