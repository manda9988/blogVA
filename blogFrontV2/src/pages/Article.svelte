<!-- Article.svelte -->
<script>
  // On simule la récupération de ces données depuis une base de données ou autre
  let title = "Titre de l'article";
  let content = "Ceci est le contenu de l'article";
  let category = 'Technologie';
  let imageUrl = '/path/to/image.jpg'; // Remplacer par le chemin réel de l'image
</script>

<div class="article-container">
  <h2>{title}</h2>
  <p>Catégorie : {category}</p>

  <div class="article-details">
    <!-- Affiche l'image si elle existe -->
    {#if imageUrl}
      <div class="article-image-container">
        <img src={imageUrl} alt={title} class="article-image" />
      </div>
    {/if}

    <div class="article-content">
      {content}
    </div>
  </div>
</div>
