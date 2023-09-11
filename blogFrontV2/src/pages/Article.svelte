<!-- Article.svelte -->
<script lang="ts">
  import { params } from 'svelte-spa-router';

  interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    imageurl: string; // Attention au nom correct du champ
  }

  let id: string;
  let article: Article;
  let isLoading = true;

  params.subscribe(($params) => {
    console.log("Params received:", $params);

    if ($params && $params.id) {
      id = $params.id;
      loadData().then(() => {
        isLoading = false;
      });
    } else {
      console.error("ID not provided");
      isLoading = false;
    }
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
</script>

{#if isLoading}
  <div>Loading...</div>
{:else}
  <div class="article-container">
    <h2>{article?.title}</h2>
    <p>Catégorie : {article?.category}</p>
    <div class="article-details">
      {#if article?.imageurl} <!-- Attention au nom correct du champ -->
        <div class="article-image-container">
          <img src={`http://localhost:3002${article?.imageurl}`} alt={article?.title} class="article-image" /> <!-- Attention au nom correct du champ -->
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
