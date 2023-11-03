<!-- Article.svelte -->

<script lang="ts">
  // Définition de l'interface pour params
  interface Params {
    id?: string; // Le '?' indique que la propriété est optionnelle
    [key: string]: any; // Pour d'autres propriétés potentielles
  }

  export let params: Params;

  // Importation des fonctions nécessaires de Svelte
  import { onMount } from 'svelte';
  import AutoLogout from '../lib/AutoLogout.svelte'; // <-- Ajout de l'importation

  // Définition de l'interface pour un article
  interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    imageurl: string;
    username: string;
    published_date: string;
  }

  // Initialisation des variables pour l'article et son chargement
  let id: string;
  let article: Article;
  let isLoading = true;

  // Fonction exécutée lors du montage du composant
  onMount(() => {
    console.log('Article component mounted');

    // MODIFICATION: Utilisez directement la prop params pour obtenir l'ID
    if (params && params.id) {
      id = params.id;
      loadData().then(() => {
        isLoading = false;
      });
    } else {
      console.error('ID not provided');
      isLoading = false;
    }
  });

  // Fonction pour charger les données de l'article
  async function loadData() {
    const res = await fetch(`http://localhost:3002/articles/${id}`);
    if (res.ok) {
      article = await res.json();
      console.log("Données de l'article :", article);
      console.log("URL de l'image :", article?.imageurl);
    } else {
      console.error('Failed to load article');
      isLoading = false;
    }
  }

  // Fonction pour formater la date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
</script>

<AutoLogout />
<!-- <-- Ajout du composant AutoLogout -->

<!-- Affichage de l'article -->
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
        <div class="article-image-container">
          <img
            src={`http://localhost:3002${article?.imageurl}`}
            alt={article?.title}
            class="article-image"
          />
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
