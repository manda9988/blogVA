<script lang="ts">
  import { onMount } from 'svelte';
  import { params } from 'svelte-spa-router';
  import type { Readable } from 'svelte/store';

  let id: string = ($params as Record<string, string>).id;  // Utilisation de l'assertion de type ici
  let article;

  onMount(async () => {
    const res = await fetch(`http://localhost:3002/articles/${id}`);
    article = await res.json();
  });
</script>


<div class="article-container">
  <h2>{article?.title}</h2>
  <p>Catégorie : {article?.category}</p>
  <div class="article-details">
    {#if article?.imageUrl}
      <div class="article-image-container">
        <img src={article?.imageUrl} alt={article?.title} class="article-image" />
      </div>
    {/if}
    <div class="article-content">
      {article?.content}
    </div>
  </div>
</div>
