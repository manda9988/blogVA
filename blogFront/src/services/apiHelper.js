// apiHelper.js

import { confirmAction, notify } from './utils';

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  options.headers = options.headers || {};
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Échec de la requête');
    }

    // Vérifiez si la réponse a un contenu avant de tenter de le parser
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('Erreur lors de la fetchWithAuth:', error);
    throw error;
  }
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
