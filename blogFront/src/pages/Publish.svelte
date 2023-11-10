<!-- Publish.svelte -->
<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import AutoLogout from '../lib/AutoLogout.svelte';

  let title = '';
  let content = '';
  let category = '';
  let file;

  onMount(async () => {
    if (!localStorage.getItem('username')) {
      alert('Veuillez vous connecter pour accéder à cette page.');
      push('/login');
    } else {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      // Modification: Ajout de la logique pour vérifier le nombre d'articles pour les administrateurs
      const response = await fetch(
        `http://localhost:3002/articles/countByUser/${userId}`,
      );
      const data = await response.json();

      // Modification: Fixe la limite à 1 pour les utilisateurs réguliers et à 2 pour les administrateurs
      const articleLimit = role === 'admin' ? 2 : 1;

      if (data.count >= articleLimit) {
        alert(`Vous êtes limité à ${articleLimit} articles.`);
        push('/'); // Redirige vers la page d'accueil si la limite est atteinte
      }
    }
  });

  function handlePublish() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert(
        "Votre session a expiré ou vous n'êtes pas connecté. Veuillez vous reconnecter.",
      );
      push('/login');
      return;
    }

    const isConfirmed = window.confirm(
      'Êtes-vous sûr de vouloir publier cet article ?',
    );
    if (isConfirmed) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('image', file);

      fetch('http://localhost:3002/articles', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Article publié:', data);
          window.location.href = '/';
        });
    }
  }

  function handleFileChange(event) {
    file = event.target.files[0];
  }
</script>

<AutoLogout />
<!-- <-- Ajout du composant AutoLogout -->

<!-- Section pour la publication d'un nouvel article -->
<div class="publish-container">
  <h2>Publier un nouvel article</h2>

  <!-- Formulaire de publication -->
  <form on:submit|preventDefault={handlePublish}>
    <!-- Champ pour le titre de l'article -->
    <div class="input-group">
      <label for="title">Titre</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        required
        maxlength="14"
      />
    </div>

    <!-- Champ pour la catégorie de l'article -->
    <div class="input-group">
      <label for="category">Catégorie</label>
      <input
        id="category"
        type="text"
        bind:value={category}
        required
        maxlength="14"
      />
    </div>

    <!-- Champ pour le contenu de l'article -->
    <div class="input-group">
      <label for="content">Contenu</label>
      <textarea id="content" bind:value={content} required></textarea>
    </div>

    <!-- Champ pour l'image de l'article -->
    <div class="input-group">
      <label for="image">Image de l'article</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        on:change={handleFileChange}
      />
    </div>

    <!-- Bouton pour publier l'article -->
    <button type="submit">Publier</button>
  </form>
</div>

<!-- Ce fichier est le composant de la page de publication d'un nouvel article. Il contient un formulaire permettant à l'utilisateur de saisir le titre, le contenu, la catégorie et l'image de l'article. Une fois le formulaire soumis, l'article est envoyé au backend pour être enregistré. -->
