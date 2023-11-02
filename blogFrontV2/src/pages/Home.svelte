<!-- Home.svelte -->

<script>
  // Importation des fonctions nécessaires de Svelte et svelte-spa-router
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import AutoLogout from '../lib/AutoLogout.svelte'; // <-- Ajout de l'importation

  // Initialisation d'un tableau vide pour stocker les articles
  let articles = [];

  // Fonction exécutée lors du montage du composant
  onMount(async () => {
    // Récupération des articles depuis le backend
    const res = await fetch('http://localhost:3002/articles');
    articles = await res.json();
  });

  // Fonction pour naviguer vers la page d'un article spécifique
  function navigateToArticle(id, event) {
    if (
      event.type === 'click' ||
      (event.type === 'keydown' && event.key === 'Enter')
    ) {
      console.log('Navigating to Article with ID:', id); // MODIFICATION: Log pour confirmer la navigation
      push(`/article/${id}`);
    }
  }
</script>

<AutoLogout />
<!-- <-- Ajout du composant AutoLogout -->

<!-- Section contenant la liste des articles -->
<section>
  <div class="article-grid">
    <!-- Boucle pour afficher chaque article -->
    {#each articles as article}
      <div
        class="article-card"
        role="button"
        tabindex="0"
        on:click={(event) => navigateToArticle(article.id, event)}
        on:keydown={(event) => navigateToArticle(article.id, event)}
      >
        <div class="content-container">
          <!-- Affichage de l'image de l'article si elle existe -->
          {#if article?.imageurl}
            <div class="image-container">
              <img
                src={`http://localhost:3002${article?.imageurl}`}
                alt={article?.title}
              />
            </div>
            <!-- Affichage d'une image par défaut si l'article n'a pas d'image -->
          {:else}
            <div class="image-container default-bg"></div>
          {/if}
          <!-- Titre et auteur de l'article -->
          <div class="title">{article.title}</div>
          <div class="author">Par {article.username}</div>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- Ce fichier est le composant de la page d'accueil de l'application. Il affiche une liste d'articles récupérés depuis le backend. Chaque article est affiché sous forme de carte, et un clic sur une carte redirige l'utilisateur vers la page de l'article correspondant. -->
