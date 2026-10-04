/**
 * JjTech Dashboard - Contrôleur PlayStation 4
 * Navigation Manette (Gamepad API), Clavier, Carrousel et Exécution
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.module-card');
  const dots = document.querySelectorAll('.dot');
  const carouselTrack = document.getElementById('carousel-track');
  const searchInput = document.getElementById('module-search');
  const gamepadBadge = document.getElementById('gamepad-badge');
  const gamepadText = document.getElementById('gamepad-text');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  let activeIndex = 0;
  let lastGamepadButtonPress = 0;
  const GAMEPAD_DEBOUNCE_MS = 250;

  // Affichage Toast Notification
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastNotification._timer);
    toastNotification._timer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  // Mise à jour de la carte active
  function setActiveIndex(newIndex) {
    if (newIndex < 0) newIndex = cards.length - 1;
    if (newIndex >= cards.length) newIndex = 0;

    activeIndex = newIndex;

    cards.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add('active');
        card.focus();
        // Défilement automatique du carrousel pour centrer la carte
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        card.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  // Clic sur les cartes
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      setActiveIndex(idx);
      triggerAction(card.getAttribute('data-payload'), card.querySelector('.card-title')?.textContent);
    });
  });

  // Clic sur les points de pagination
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      setActiveIndex(idx);
    });
  });

  // Déclenchement de l'action d'un module
  function triggerAction(payloadId, title) {
    showToast(`Exécution : ${title || payloadId}...`);
    console.log(`[JjTech] Lancement du module : ${payloadId}`);

    // Pour GoldHEN, on scrolle vers le panneau exploit et on lance
    if (payloadId === 'goldhen') {
      const panel = document.getElementById('exploit-panel');
      const launchBtn = document.getElementById('exploit-launch-btn');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Auto-click le bouton de lancement après le scroll
        if (launchBtn && !launchBtn.disabled) {
          setTimeout(() => launchBtn.click(), 600);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // Navigation Clavier (Flèches gauche/droite, Entrée)
  // -------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (document.activeElement === searchInput) return;

    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      setActiveIndex(activeIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
      e.preventDefault();
      setActiveIndex(activeIndex - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const currentCard = cards[activeIndex];
      if (currentCard) {
        triggerAction(currentCard.getAttribute('data-payload'), currentCard.querySelector('.card-title')?.textContent);
      }
    }
  });

  // -------------------------------------------------------------
  // Recherche dynamique des modules
  // -------------------------------------------------------------
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let firstVisible = -1;

      cards.forEach((card, idx) => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
        const matches = title.includes(query) || desc.includes(query);

        card.style.display = matches ? 'flex' : 'none';
        if (matches && firstVisible === -1) firstVisible = idx;
      });

      if (firstVisible !== -1) {
        setActiveIndex(firstVisible);
      }
    });
  }

  // -------------------------------------------------------------
  // Gamepad API (Prise en charge de la manette PS4 / DualShock)
  // -------------------------------------------------------------
  let gamepadConnected = false;

  function updateGamepadStatus(connected) {
    gamepadConnected = connected;
    if (gamepadBadge && gamepadText) {
      if (connected) {
        gamepadText.textContent = 'Manette connectée';
        gamepadBadge.style.opacity = '1';
        gamepadBadge.querySelector('.badge-status-dot').style.backgroundColor = '#22c55e';
      } else {
        gamepadText.textContent = 'Manette en attente';
        gamepadBadge.style.opacity = '0.7';
        gamepadBadge.querySelector('.badge-status-dot').style.backgroundColor = '#94a3b8';
      }
    }
  }

  window.addEventListener('gamepadconnected', (e) => {
    updateGamepadStatus(true);
    showToast(`Manette détectée : ${e.gamepad.id.slice(0, 24)}`);
  });

  window.addEventListener('gamepaddisconnected', () => {
    updateGamepadStatus(false);
    showToast('Manette déconnectée.');
  });

  // Boucle de lecture Gamepad
  function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

    if (gp) {
      if (!gamepadConnected) updateGamepadStatus(true);

      const now = Date.now();
      if (now - lastGamepadButtonPress > GAMEPAD_DEBOUNCE_MS) {
        // D-Pad Gauche / Droite ou Stick Gauche
        const dpadLeft = gp.buttons[14]?.pressed || gp.axes[0] < -0.5;
        const dpadRight = gp.buttons[15]?.pressed || gp.axes[0] > 0.5;
        const l1 = gp.buttons[4]?.pressed;
        const r1 = gp.buttons[5]?.pressed;
        const cross = gp.buttons[0]?.pressed; // Bouton Croix (A)
        const circle = gp.buttons[1]?.pressed; // Bouton Rond (B)

        if (dpadRight || r1) {
          lastGamepadButtonPress = now;
          setActiveIndex(activeIndex + 1);
        } else if (dpadLeft || l1) {
          lastGamepadButtonPress = now;
          setActiveIndex(activeIndex - 1);
        } else if (cross) {
          lastGamepadButtonPress = now;
          const currentCard = cards[activeIndex];
          if (currentCard) {
            triggerAction(currentCard.getAttribute('data-payload'), currentCard.querySelector('.card-title')?.textContent);
          }
        } else if (circle) {
          lastGamepadButtonPress = now;
          showToast('Menu principal');
        }
      }
    } else {
      if (gamepadConnected) updateGamepadStatus(false);
    }

    requestAnimationFrame(pollGamepad);
  }

  pollGamepad();

  // -------------------------------------------------------------
  // Service Worker (Cache automatique hors-ligne)
  // -------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('[JjTech SW]', err);
    });
  }
});
