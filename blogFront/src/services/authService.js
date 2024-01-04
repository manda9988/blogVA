// authService.js
import { API_URL } from '../config/config.js';
import { setLocalStorageItem, getLocalStorageItem } from './storageService.js';
import {
  redirectToLogin,
  handleError,
  handleLogoutAndRedirect,
} from './utils.js';
import { fetchWithAuthToken } from './apiHelper.js';

export async function verifyPublishAccess(userId, role) {
  if (!userId || isNaN(parseInt(userId))) {
    redirectToLogin('Vous devez être connecté pour accéder à cette page.');
    return false;
  }

  try {
    const data = await fetchWithAuthToken(
      `${API_URL}/articles/countByUser/${userId}`,
    );
    const articleLimit = role === 'admin' ? 4 : 1;

    if (data.count >= articleLimit) {
      alert(`Vous êtes limité à ${articleLimit} articles.`);
      redirectToLogin();
      return false;
    }
    return true;
  } catch (error) {
    handleError(error);
    return false;
  }
}

export async function verifyAccess() {
  const userId = getLocalStorageItem('userId');
  const token = getLocalStorageItem('token');

  if (!userId || !token) {
    redirectToLogin('Vous devez être connecté pour accéder à cette page.');
    return false;
  }

  try {
    await fetchWithAuthToken(`${API_URL}/users/verifyToken`);
    return true;
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
      await fetchWithAuthToken(`${API_URL}/users/${username}`, {
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
    await fetchWithAuthToken(`${API_URL}/users/verifyToken`);
  } catch (error) {
    handleLogoutAndRedirect();
    return false;
  }
  return true;
}

export async function handleLogin(email, password) {
  try {
    const data = await fetchWithAuthToken(`${API_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setLocalStorageItem('username', data.user.username);
    setLocalStorageItem('token', data.token);
    setLocalStorageItem('userId', data.user.id);
    setLocalStorageItem('role', data.user.role);

    return true;
  } catch (error) {
    handleError(error);
    return false;
  }
}

export async function handleRegister(username, email, password) {
  try {
    const response = await fetchWithAuthToken(`${API_URL}/users/register`, {
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
