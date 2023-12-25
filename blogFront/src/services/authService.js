// authService.js
import { API_URL } from '../config/config.js';
import { clearLocalStorage } from './storageService.js';
import { redirectToLogin } from './utils.js';

export async function verifyAccess(token, username) {
  if (!username || !token) {
    redirectToLogin('Veuillez vous connecter pour accéder à cette page.');
    return false;
  }

  const response = await fetch(`${API_URL}/users/verifyToken`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    clearLocalStorage();
    redirectToLogin();
    return false;
  }
  return true;
}

export async function handleUnsubscribe(username, token) {
  if (
    confirm(
      'Êtes-vous sûr de vouloir vous désinscrire ? Cette action est irréversible.',
    )
  ) {
    try {
      const res = await fetch(`${API_URL}/users/${username}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        clearLocalStorage();
        redirectToLogin('Votre compte a été désinscrit avec succès.');
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la désinscription');
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }
}
