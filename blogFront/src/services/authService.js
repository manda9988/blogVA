// authService.js
import { API_URL } from '../config/config.js';
import { clearLocalStorage, setLocalStorageItem } from './storageService.js';
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

// Ajout de la nouvelle fonction
export async function verifyTokenOnMount(token) {
  if (!token) return false;

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

export async function handleLogin(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Erreur de connexion');
      return null;
    }

    // Utiliser setLocalStorageItem pour définir les valeurs
    setLocalStorageItem('username', data.user.username);
    setLocalStorageItem('token', data.token);
    setLocalStorageItem('userId', data.user.id);
    setLocalStorageItem('role', data.user.role);

    return true; // Connexion réussie
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    alert('Erreur lors de la connexion. Veuillez réessayer.');
    return false;
  }
}
