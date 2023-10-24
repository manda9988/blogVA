<!-- src/lib/AutoLogout.svelte -->

<script>
  import { onMount, onDestroy } from 'svelte';
  import { push } from 'svelte-spa-router';

  let inactivityTimer;
  const LOGOUT_FLAG = 'autoLoggedOut'; // <-- Clé pour stocker l'indicateur dans le localStorage

  function resetInactivityTimer() {
    if (localStorage.getItem(LOGOUT_FLAG)) return; // <-- Si l'indicateur est présent, ne pas réinitialiser le timer
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutDueToInactivity, 10000); // 10000ms = 10 seconds for testing
  }

  function logoutDueToInactivity() {
    alert(
      "Vous avez été déconnecté en raison d'une inactivité de 10 secondes.",
    );
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.setItem(LOGOUT_FLAG, 'true'); // <-- Stocker l'indicateur dans le localStorage
    push('/login');
  }

  onMount(() => {
    resetInactivityTimer();
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('keypress', resetInactivityTimer);
  });

  onDestroy(() => {
    clearTimeout(inactivityTimer);
    window.removeEventListener('click', resetInactivityTimer);
    window.removeEventListener('keypress', resetInactivityTimer);
  });
</script>
