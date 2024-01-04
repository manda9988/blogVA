// apiHelper.js

import { confirmAction, notify, handleResponse } from './utils';
import { getLocalStorageItem } from './storageService.js';

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

export async function fetchWithAuthToken(url, options = {}) {
  const token = getLocalStorageItem('token');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erreur de serveur');
  }
  return response.json();
}
