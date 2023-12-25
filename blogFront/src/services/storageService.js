// storageService.js

export function clearLocalStorage() {
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
}

export function getLocalStorageItem(item) {
  return localStorage.getItem(item);
}

export function setLocalStorageItem(key, value) {
  localStorage.setItem(key, value);
}
