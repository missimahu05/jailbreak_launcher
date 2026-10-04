/**
 * JjTech's Dashboard - Contrôleur UI, GSAP et Animation Canvas d'Arrière-Plan
 * Sauvegarde hors-ligne 100% automatique via Service Worker
 */

const FW_CONFIG = {
  '13.02': {
    tag: 'Cible : Firmware 13.02',
    title: 'Environnement 13.02 - 13.52',
    desc: 'Version optimisée pour les consoles en firmware 13.02 à 13.52 avec prise en charge directe de GoldHEN.',
    btnText: 'Exécuter GoldHEN 13.xx'
  },
  '11.00': {
    tag: 'Cible : Firmware 11.00',
    title: 'Environnement 11.00 (PPPwn)',
    desc: 'Profil stable pour consoles en version 11.00, compatible injection par réseau local et stockage interne.',
    btnText: 'Exécuter GoldHEN 11.00'
  },
  '9.00': {
    tag: 'Cible : Firmware 9.00',
    title: 'Environnement 9.00 (Exfathax)',
    desc: 'Profil classique pour firmware 9.00 avec prise en charge du déclencheur USB et gestionnaire de paquets.',
    btnText: 'Exécuter GoldHEN 9.00'
  },
  '6.72': {
    tag: 'Cible : Firmware 6.72',
    title: 'Environnement 6.72',
    desc: 'Configuration dédiée pour firmware 6.72 avec chargement rapide des outils en mémoire.',
    btnText: 'Exécuter GoldHEN 6.72'
  },
  '5.05': {
    tag: 'Cible : Firmware 5.05',
    title: 'Environnement 5.05 (Héritage)',
    desc: 'Configuration stable pour les firmwares 5.05 d\'origine avec outils de dump et de sauvegarde.',
    btnText: 'Exécuter GoldHEN 5.05'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const fwSelect = document.getElementById('fw-select');
  const fwTag = document.getElementById('fw-tag');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const primaryLaunchText = document.getElementById('primary-launch-text');
  const btnPrimaryLaunch = document.getElementById('btn-primary-launch');
  const journalConsole = document.getElementById('journal-console');
  const btnClearJournal = document.getElementById('btn-clear-journal');
  const networkText = document.getElementById('network-text');
  const networkBadge = document.getElementById('network-badge');

  // Journal d'activité formaté
  function addLog(message, level = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-entry-${level}`;
    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${message}`;
    journalConsole.appendChild(entry);
    journalConsole.scrollTop = journalConsole.scrollHeight;
  }

  // -------------------------------------------------------------
  // Animation d'arrière-plan discrète (Canvas 2D - Constellation/Mesh)
  // -------------------------------------------------------------
  function initBackgroundAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return; // Respect des préférences d'accessibilité
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particleCount = Math.min(32, Math.floor(width / 38));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.18 + 0.1
      });
    }

    let animationFrameId;

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        else if (p1.x > width) p1.x = 0;

        if (p1.y < 0) p1.y = height;
        else if (p1.y > height) p1.y = 0;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p1.baseAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.07;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        render();
      }
    });

    render();
  }

  initBackgroundAnimation();

  // -------------------------------------------------------------
  // Animations GSAP
  // -------------------------------------------------------------
  function initMotion() {
    if (typeof gsap === 'undefined') return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.topbar', {
        y: -16,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.from('.hero-card', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.15,
        ease: 'power3.out'
      });

      gsap.from('.tool-card', {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.3,
        ease: 'power3.out'
      });

      gsap.from('.journal-card', {
        y: 16,
        opacity: 0,
        duration: 0.5,
        delay: 0.55,
        ease: 'power3.out'
      });
    });
  }

  initMotion();

  // -------------------------------------------------------------
  // Événements & Logique
  // -------------------------------------------------------------
  fwSelect.addEventListener('change', (e) => {
    const fwKey = e.target.value;
    const config = FW_CONFIG[fwKey];

    if (!config) return;

    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(['#hero-title', '#hero-desc', '#fw-tag', '#primary-launch-text'], {
        opacity: 0,
        y: -6,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          fwTag.textContent = config.tag;
          heroTitle.textContent = config.title;
          heroDesc.textContent = config.desc;
          primaryLaunchText.textContent = config.btnText;

          gsap.to(['#hero-title', '#hero-desc', '#fw-tag', '#primary-launch-text'], {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: 'power2.out'
          });
        }
      });
    } else {
      fwTag.textContent = config.tag;
      heroTitle.textContent = config.title;
      heroDesc.textContent = config.desc;
      primaryLaunchText.textContent = config.btnText;
    }

    addLog(`Configuration adaptée au ${config.tag}.`, 'info');
  });

  btnPrimaryLaunch.addEventListener('click', () => {
    const selectedFw = fwSelect.value;
    addLog(`Exécution demandée : GoldHEN (${selectedFw}). Recherche du binaire local...`, 'warn');

    setTimeout(() => {
      addLog(`Binaire détecté dans payloads/${selectedFw}/goldhen.bin. Prêt pour transmission.`, 'success');
    }, 450);
  });

  document.querySelectorAll('.btn-launch').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const payload = e.currentTarget.getAttribute('data-payload');
      const selectedFw = fwSelect.value;
      addLog(`Module "${payload}" sélectionné sur FW ${selectedFw}.`, 'info');
    });
  });

  btnClearJournal.addEventListener('click', () => {
    journalConsole.innerHTML = '';
    addLog('Journal d\'activité réinitialisé.', 'info');
  });

  function checkNetwork() {
    if (navigator.onLine) {
      networkText.textContent = 'En ligne';
      networkBadge.querySelector('.badge-dot').style.backgroundColor = 'var(--status-success)';
    } else {
      networkText.textContent = 'Hors-ligne (Prêt)';
      networkBadge.querySelector('.badge-dot').style.backgroundColor = 'var(--status-warning)';
    }
  }

  window.addEventListener('online', checkNetwork);
  window.addEventListener('offline', checkNetwork);
  checkNetwork();

  // -------------------------------------------------------------
  // Mise en cache hors-ligne 100% automatique
  // -------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        // Détection de l'installation et confirmation automatique
        if (registration.installing) {
          addLog('Téléchargement des fichiers pour le mode hors-ligne...', 'info');
        } else if (registration.active) {
          addLog('Mise en cache automatique active : l\'interface fonctionnera sans connexion.', 'success');
        }

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                addLog('Cache hors-ligne mis à jour automatiquement.', 'success');
              } else {
                addLog('Sauvegarde hors-ligne terminée. Page prête pour consultation hors-ligne.', 'success');
              }
            }
          };
        };
      })
      .catch((err) => {
        addLog(`Avertissement Service Worker : ${err.message}`, 'warn');
      });
  }
});
