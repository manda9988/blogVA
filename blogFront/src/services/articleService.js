// articleService.js
import { API_URL } from '../config/config.js';
import { push } from 'svelte-spa-router';
import { confirmAction, notify } from './utils'; // Importez des fonctions utilitaires pour les interactions utilisateur

export async function loadArticles(token, userRole, userId) {
  const articlesEndpoint = `${API_URL}/articles${
    userRole !== 'admin' ? `?userId=${userId}` : ''
  }`;
  try {
    const res = await fetch(articlesEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load articles');
    return await res.json();
  } catch (error) {
    console.error('Failed to load articles:', error);
    throw error; // Renvoyez l'erreur pour une gestion plus personnalisée
  }
}

export async function deleteArticle(id, title, token) {
  if (
    confirmAction(`Êtes-vous sûr de vouloir supprimer l'article "${title}"?`)
  ) {
    try {
      const res = await fetch(`${API_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Échec de la suppression de l'article");
      notify(`L'article "${title}" a été supprimé.`); // Utilisez une méthode personnalisée pour les notifications
      return true;
    } catch (error) {
      console.error('Failed to delete article:', error);
      notify(error.message); // Notifiez l'utilisateur en cas d'erreur
      return false;
    }
  }
  return false;
}

export function editArticle(id) {
  if (confirmAction('Êtes-vous sûr de vouloir modifier cet article?')) {
    push(`/edit/${id}`);
  }
}

export async function getArticle(id) {
  try {
    const res = await fetch(`${API_URL}/articles/${id}`);
    if (!res.ok) throw new Error('Failed to load article');
    return await res.json();
  } catch (error) {
    console.error('Failed to load article:', error);
    throw error; // Renvoyez l'erreur pour une gestion plus personnalisée
  }
}

export async function updateArticle(article, file) {
  // Assurez-vous que cette fonction existe et est exportée
  const formData = new FormData();
  formData.append('title', article.title);
  formData.append('content', article.content);
  formData.append('category', article.category);
  if (file) formData.append('image', file);

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/articles/${article.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update article');
  }
  return response.json();
}
