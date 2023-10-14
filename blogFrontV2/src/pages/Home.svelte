<!-- Home.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  let articles = [];

  onMount(async () => {
    const res = await fetch('http://localhost:3002/articles');
    articles = await res.json();
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

<!-- ... -->

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
                src={`http://localhost:3002${article?.imageurl}`}
                alt={article?.title}
              />
            </div>
          {:else}
            <div class="image-container default-bg"></div>
          {/if}
          <div class="title">{article.title}</div>
          <div class="author">Par {article.username}</div>
          <!-- Ligne ajoutée -->
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- ... -->
