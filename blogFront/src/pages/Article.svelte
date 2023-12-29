<!-- Article.svelte -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { getArticle } from '../services/articleService'; // Importez le service
  import { formatDate } from '../services/utils'; // Utilisez une fonction utilitaire pour la date
  import { API_URL } from '../config/config.js';

  export let params: { id?: string; [key: string]: any };

  interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    imageurl: string;
    username: string;
    published_date: string;
    modified_date?: string;
  }

  let article: Article;
  let isLoading = true;
  let errorMessage = ''; // Gérer les messages d'erreur

  onMount(async () => {
    if (params && params.id) {
      isLoading = true;
      try {
        article = await getArticle(params.id);
      } catch (error) {
        errorMessage = error.message || 'Failed to load article';
        console.error(errorMessage);
      }
      isLoading = false;
    } else {
      errorMessage = 'Article ID not provided';
      console.error(errorMessage);
      isLoading = false;
    }
  });
</script>

<div class="article-container">
  <div class="article-details">
    <h2>{article?.title}</h2>
    <div class="article-image-container">
      <img
        src={`${API_URL}${article?.imageurl}`}
        alt={article?.title}
        class="article-image"
      />
    </div>
    <div class="article-content">
      {article?.content}
    </div>
  </div>

  <div class="article-footer">
    Publié par <span class="highlighted">{article?.username}</span>, le
    <span class="highlighted"
      >{article ? formatDate(article.published_date) : ''}</span
    >.
    {#if article?.modified_date && article.modified_date !== article.published_date}
      Màj le <span class="highlighted">{formatDate(article.modified_date)}</span
      >.
    {/if}
    Catégorie: <span class="highlighted">{article?.category}</span>
  </div>
</div>
