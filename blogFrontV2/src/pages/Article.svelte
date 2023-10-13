<!-- Article.svelte -->
<script lang="ts">
  import { params } from 'svelte-spa-router';
  import { onMount } from 'svelte';

  interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    imageurl: string; // Attention au nom correct du champ
    username: string; // Champ pour le nom de l'auteur
    published_date: string; // Au lieu de 'date'
  }

  let id: string;
  let article: Article;
  let isLoading = true;

  onMount(() => {
    console.log('Component mounted'); // Debug log

    const unsubscribe = params.subscribe(($params) => {
      console.log('Params received:', $params);

      if ($params && $params.id) {
        id = $params.id;
        loadData().then(() => {
          isLoading = false;
        });
      } else {
        console.error('ID not provided');
        isLoading = false;
      }
    });

    return unsubscribe; // Se désabonner lorsque le composant est démonté
  });

  async function loadData() {
    const res = await fetch(`http://localhost:3002/articles/${id}`);
    if (res.ok) {
      article = await res.json();
      console.log("Données de l'article :", article);
      console.log("URL de l'image :", article?.imageurl); // Attention au nom correct du champ
    } else {
      console.error('Failed to load article');
      isLoading = false;
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
</script>

{#if isLoading}
  <div>Loading...</div>
{:else}
  <div class="article-container">
    <h2>{article?.title}</h2>
    <p>{article?.username}</p>
    <p>{article?.category}</p>
    <p>{article ? formatDate(article.published_date) : ''}</p>

    <div class="article-details">
      {#if article?.imageurl}
        <!-- Attention au nom correct du champ -->
        <div class="article-image-container">
          <img
            src={`http://localhost:3002${article?.imageurl}`}
            alt={article?.title}
            class="article-image"
          />
          <!-- Attention au nom correct du champ -->
        </div>
      {:else}
        <div class="article-image-container default-bg"></div>
      {/if}
      <div class="article-content">
        {article?.content}
      </div>
    </div>
  </div>
{/if}
