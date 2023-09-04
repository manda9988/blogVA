<!-- Home.svelte -->
<script>
  import { push } from 'svelte-spa-router';

  function navigateToArticle(id, event) {
    // Gère le clic de la souris ou la touche "Entrée" du clavier
    if (
      event.type === 'click' ||
      (event.type === 'keydown' && event.key === 'Enter')
    ) {
      push(`/article/${id}`);
    }
  }
</script>

<section>
  <!-- <h2>Blog généraliste</h2> -->
  <div class="article-grid">
    <!-- Faire de la div .article-card cliquable pour naviguer vers la page Article avec un ID donné (par exemple, 1) -->
    <div
      class="article-card"
      role="button"
      tabindex="0"
      on:click={(event) => navigateToArticle(1, event)}
      on:keydown={(event) => navigateToArticle(1, event)}
    >
      <!-- Contenu de l'article 1 -->
    </div>
    <div
      class="article-card"
      role="button"
      tabindex="0"
      on:click={(event) => navigateToArticle(2, event)}
      on:keydown={(event) => navigateToArticle(2, event)}
    >
      <!-- Contenu de l'article 2 -->
    </div>
    <!-- ... autres cartes d'articles ... -->
    <!-- Vous pouvez remplir ces divs comme bon vous semble, éventuellement avec des données dynamiques -->
  </div>
</section>
