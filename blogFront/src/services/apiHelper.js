// apiHelper.js

import { confirmAction, notify } from './utils';

// Nouvelle fonction pour traiter la réponse
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Échec de la requête');
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
  const response = await fetch(url, { ...options, headers: options.headers });
  return handleResponse(response);
}

export function handleActionConfirmation(message, action) {
  if (confirmAction(message)) {
    try {
      action();
    } catch (error) {
      console.error('Action failed:', error);
      notify(error.message);
    }
  }
}
