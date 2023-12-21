<!-- src/lib/AutoLogout.svelte -->

<script>
  import { onMount, onDestroy } from 'svelte';
  import { push } from 'svelte-spa-router';

  let inactivityTimer;
  const LOGOUT_FLAG = 'autoLoggedOut';

  function resetInactivityTimer() {
    // Ajout d'une vérification pour s'assurer que l'utilisateur est connecté
    if (!localStorage.getItem('token')) {
      return; // Si aucun token n'est présent, l'utilisateur n'est pas connecté
    }

    if (localStorage.getItem(LOGOUT_FLAG)) return;

    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(logoutDueToInactivity, 6000000); // Réglé sur 1min (60 000 ms)
  }

  function logoutDueToInactivity() {
    // Encore une fois, vérifier si l'utilisateur est connecté avant de déconnecter
    if (localStorage.getItem('token')) {
      alert("Vous avez été déconnecté en raison d'une inactivité de 1 minute.");
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.setItem(LOGOUT_FLAG, 'true');
      push('/login');
    }
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
