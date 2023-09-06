<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  

  let articles = [];

  onMount(async () => {

    const res = await fetch('http://localhost:3002/articles');
    articles = await res.json();
      console.log(articles);  // Ajoutez cette ligne

  });

  function navigateToArticle(id, event) {
    if (
      event.type === 'click' ||
      (event.type === 'keydown' && event.key === 'Enter')
    ) {
      push(`/article/${id}`);
    }
  }
</script>

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
        {article.title}
      </div>
    {/each}
  </div>
</section>
