// utils.js
import { push } from 'svelte-spa-router';

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
