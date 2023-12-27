<!-- Edit.svelte -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { updateArticle, getArticle } from '../services/articleService'; // Service pour les opérations sur les articles
  import { confirmAction } from '../services/utils'; // Utilisation d'une fonction utilitaire pour la confirmation
  import { API_URL } from '../config/config.js';

  export let params: { id?: string; [key: string]: any } = {};

  interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    imageurl: string;
  }

  let article: Article = {
    id: 0,
    title: '',
    content: '',
    category: '',
    imageurl: '',
  };
  let isLoading = true;
  let file: File | null = null;
  let errorMessage = '';

  onMount(async () => {
    if (params.id) {
      try {
        article = await getArticle(params.id);
      } catch (error) {
        errorMessage = error.message || 'Failed to load article';
      }
      isLoading = false;
    } else {
      errorMessage = 'Article ID not provided';
      isLoading = false;
    }
  });

  async function handleEdit() {
    if (
      !confirmAction('Êtes-vous sûr de vouloir sauvegarder les modifications?')
    )
      return;

    try {
      await updateArticle(article, file); // Utilisez le service pour mettre à jour l'article
      window.location.href = '/';
    } catch (error) {
      errorMessage = error.message || 'Error updating the article';
    }
  }

  function handleFileChange(event) {
    file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        article.imageurl = reader.result as string;
        article = { ...article };
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<!-- Affichage du formulaire de modification -->
{#if isLoading}
  <div>Loading...</div>
{:else}
  <div class="edit-container">
    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}
    <h2>Modifier l'article: {article.title}</h2>

    <form on:submit|preventDefault={handleEdit}>
      <div class="input-group">
        <label for="title">Titre</label>
        <input
          id="title"
          type="text"
          bind:value={article.title}
          required
          maxlength="14"
        />
      </div>

      <div class="input-group">
        <label for="category">Catégorie</label>
        <input
          id="category"
          type="text"
          bind:value={article.category}
          required
          maxlength="14"
        />
      </div>

      <div class="input-group">
        <label for="content">Contenu</label>
        <textarea id="content" bind:value={article.content} required></textarea>
      </div>

      <div class="input-group">
        {#if article.imageurl}
          <img
            src={article.imageurl.startsWith('data:')
              ? article.imageurl
              : `${API_URL}${article.imageurl}`}
            alt="Illustration de l'article"
            class="article-image"
          />
        {/if}
      </div>

      <div class="input-group">
        <label for="image">Changer l'image de l'article</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          on:change={handleFileChange}
        />
      </div>

      <button type="submit">Sauvegarder les modifications</button>
    </form>
  </div>
{/if}
