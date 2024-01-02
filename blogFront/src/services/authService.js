// authService.js
import { API_URL } from '../config/config.js';
import {
  clearLocalStorage,
  setLocalStorageItem,
  getLocalStorageItem,
} from './storageService.js';
import { redirectToLogin } from './utils.js';

// Modification 1: Fonction utilitaire pour les requêtes fetch avec authentification
async function fetchWithAuth(url, options = {}) {
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

// Modification 2: Gestion centralisée des erreurs et des redirections
function handleError(error) {
  console.error(error);
  alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
}

function handleLogoutAndRedirect(message) {
  clearLocalStorage();
  redirectToLogin(message);
}

export async function verifyPublishAccess(userId, role) {
  // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
  if (!userId || isNaN(parseInt(userId))) {
    redirectToLogin('Vous devez être connecté pour accéder à cette page.');
    return false;
  }

  try {
    const data = await fetchWithAuth(
      `${API_URL}/articles/countByUser/${userId}`,
    );
    const articleLimit = role === 'admin' ? 4 : 1;

    if (data.count >= articleLimit) {
      alert(`Vous êtes limité à ${articleLimit} articles.`);
      redirectToLogin();
      return false;
    }
    return true; // L'utilisateur est autorisé à publier
  } catch (error) {
    handleError(error);
    return false;
  }
}

export async function verifyAccess() {
  const userId = getLocalStorageItem('userId');
  const token = getLocalStorageItem('token');

  // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
  if (!userId || !token) {
    redirectToLogin('Vous devez être connecté pour accéder à cette page.');
    return false;
  }

  try {
    await fetchWithAuth(`${API_URL}/users/verifyToken`);
    return true; // L'utilisateur est connecté
  } catch (error) {
    handleLogoutAndRedirect();
    return false;
  }
}

export async function handleUnsubscribe(username, token) {
  if (
    confirm(
      'Êtes-vous sûr de vouloir vous désinscrire ? Cette action est irréversible.',
    )
  ) {
    try {
      await fetchWithAuth(`${API_URL}/users/${username}`, {
        method: 'DELETE',
      });
      handleLogoutAndRedirect('Votre compte a été désinscrit avec succès.');
    } catch (error) {
      handleError(error);
    }
  }
}

export async function verifyTokenOnMount(token) {
  if (!token) return false;

  try {
    await fetchWithAuth(`${API_URL}/users/verifyToken`);
  } catch (error) {
    handleLogoutAndRedirect();
    return false;
  }
  return true;
}

export async function handleLogin(email, password) {
  try {
    const data = await fetchWithAuth(`${API_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Définir les éléments dans le localStorage
    setLocalStorageItem('username', data.user.username);
    setLocalStorageItem('token', data.token);
    setLocalStorageItem('userId', data.user.id);
    setLocalStorageItem('role', data.user.role);

    return true; // Connexion réussie
  } catch (error) {
    handleError(error);
    return false;
  }
}

export async function handleRegister(username, email, password) {
  try {
    const response = await fetchWithAuth(`${API_URL}/users/register`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    alert('Inscription réussie!');
    return true;
  } catch (error) {
    handleError(error);
    return false;
  }
}
