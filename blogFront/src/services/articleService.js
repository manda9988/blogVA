// articleService.js

import { API_URL } from '../config/config.js';
import { push } from 'svelte-spa-router';
import { confirmAction, notify } from './utils';

// Fonction utilitaire pour exécuter les requêtes fetch
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');

  // Assurez-vous que options.headers existe, en le définissant comme un objet vide par défaut
  options.headers = options.headers || {};

  // Ajoutez l'en-tête d'autorisation aux en-têtes existants
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  // Tentez le fetch avec les options fournies et les en-têtes supplémentaires
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Échec de la requête');
  }
  return response.json();
}

// Fonction pour gérer les confirmations et les notifications
function handleActionConfirmation(message, action) {
  if (confirmAction(message)) {
    try {
      action();
    } catch (error) {
      console.error('Action failed:', error);
      notify(error.message);
    }
  }
}

// Fonctions API réutilisables
export async function loadArticles(userRole, userId) {
  return fetchWithAuth(
    `${API_URL}/articles${userRole !== 'admin' ? `?userId=${userId}` : ''}`,
  );
}

export async function deleteArticle(id, title) {
  let isDeleted = false; // Ajouté: variable pour suivre l'état de suppression
  handleActionConfirmation(
    `Êtes-vous sûr de vouloir supprimer l'article "${title}"?`,
    async () => {
      await fetchWithAuth(`${API_URL}/articles/${id}`, { method: 'DELETE' });
      notify(`L'article "${title}" a été supprimé.`);
      isDeleted = true; // Modifié: Mettre à jour si l'article est supprimé
    },
  );
  return isDeleted; // Ajouté: retourner l'état de suppression
}

export function editArticle(id) {
  handleActionConfirmation(
    'Êtes-vous sûr de vouloir modifier cet article?',
    () => {
      push(`/edit/${id}`);
    },
  );
}

export async function getArticle(id) {
  return fetchWithAuth(`${API_URL}/articles/${id}`);
}

export async function updateArticle(article, file) {
  const formData = new FormData();
  formData.append('title', article.title);
  formData.append('content', article.content);
  formData.append('category', article.category);
  if (file) formData.append('image', file);

  return fetchWithAuth(`${API_URL}/articles/${article.id}`, {
    method: 'PUT',
    body: formData,
  });
}

export async function publishArticle(title, content, category, file) {
  handleActionConfirmation(
    'Êtes-vous sûr de vouloir publier cet article ?',
    async () => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      if (file) formData.append('image', file);

      const data = await fetchWithAuth(`${API_URL}/articles`, {
        method: 'POST',
        body: formData,
      });
      window.location.href = '/';
      return data;
    },
  );
}
