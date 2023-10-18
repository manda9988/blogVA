<!-- Edit.svelte -->

<script lang="ts">
  // Importation des fonctions nécessaires de Svelte et svelte-spa-router
  import { params } from 'svelte-spa-router';
  import { onMount } from 'svelte';

  // Définition de l'interface pour un article
  interface Article {
    id: number;
    title: string;
    content: string;
    category: string;
    imageurl: string;
  }

  // Initialisation des variables pour l'article et son chargement
  let id: string;
  let article: Article = {
    id: 0,
    title: '',
    content: '',
    category: '',
    imageurl: '',
  };
  let isLoading = true;
  let file; // Variable pour stocker le fichier image

  // Fonction exécutée lors du montage du composant
  onMount(() => {
    console.log('Edit Component Mounted');

    // Souscription aux paramètres pour obtenir l'ID de l'article
    const unsubscribe = params.subscribe(($params) => {
      console.log('Received Params:', $params);

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

    return () => {
      unsubscribe(); // Se désabonner lorsque le composant est démonté
    };
  });

  // Fonction pour charger les données de l'article
  async function loadData() {
    try {
      console.log(`Loading data for article ID: ${id}`);
      const res = await fetch(`http://localhost:3002/articles/${id}`);
      if (!res.ok) throw new Error('Failed to load article');
      article = await res.json();
      console.log('Article Data Loaded:', article);
    } catch (error) {
      console.error('Error Loading Data:', error);
      isLoading = false;
    }
  }

  // Fonction pour gérer la modification de l'article
  function handleEdit() {
    const isConfirmed = confirm(
      'Êtes-vous sûr de vouloir sauvegarder les modifications?',
    );
    if (!isConfirmed) return;

    const formData = new FormData();
    formData.append('title', article.title);
    formData.append('content', article.content);
    formData.append('category', article.category);
    if (file) formData.append('image', file); // Ajoutez le fichier image seulement s'il est présent

    fetch(`http://localhost:3002/articles/${id}`, {
      method: 'PUT',
      body: formData, // Utilisez FormData ici
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Fonction pour gérer le changement de fichier
  function handleFileChange(event) {
    file = event.target.files[0]; // Stockez le fichier dans la variable
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
              : `http://localhost:3002${article.imageurl}`}
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

<!-- Ce fichier est le composant de la page d'édition d'article. Il fournit un formulaire permettant à l'utilisateur de modifier les détails d'un article existant, y compris son titre, sa catégorie, son contenu et son image. Une fois les modifications effectuées, l'utilisateur peut sauvegarder les changements, qui sont ensuite envoyés au backend pour mise à jour. -->
