// utils.js
import { push } from 'svelte-spa-router';
import { clearLocalStorage } from './storageService.js';

export function redirectToLogin(message = '') {
  if (message) alert(message);
  push('/login');
}

export function confirmAction(message) {
  return confirm(message);
}

export function notify(message) {
  alert(message); //
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
}

export function handleError(error) {
  console.error(error);
  alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
}

export function handleLogoutAndRedirect(message) {
  clearLocalStorage();
  redirectToLogin(message);
}

export async function confirmAndExecute(message, action) {
  if (confirmAction(message)) {
    try {
      return await action();
    } catch (error) {
      console.error('Action failed:', error);
      notify(error.message);
    }
  }
}

export async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Échec de la requête');
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
