// articleService.js

import { API_URL } from '../config/config.js';
import { push } from 'svelte-spa-router';
import { notify, confirmAndExecute } from './utils';
import { fetchWithAuth, handleActionConfirmation } from './apiHelper';

export async function deleteArticle(id, title) {
  return confirmAndExecute(
    `Êtes-vous sûr de vouloir supprimer l'article "${title}"?`,
    async () => {
      await fetchWithAuth(`${API_URL}/articles/${id}`, { method: 'DELETE' });
      notify(`L'article "${title}" a été supprimé.`);
    },
  );
}

export function editArticle(id) {
  handleActionConfirmation(
    'Êtes-vous sûr de vouloir modifier cet article?',
    () => {
      push(`/edit/${id}`);
    },
  );
}

export async function loadArticles(userRole, userId) {
  return fetchWithAuth(
    `${API_URL}/articles${userRole !== 'admin' ? `?userId=${userId}` : ''}`,
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
