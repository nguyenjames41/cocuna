/* Cocuna landing — modal + audience toggle + redirect routing.
   No build step. Self-contained vanilla JS. */

(function () {
  'use strict';

  const MOTHER_URL = 'https://cocuna-mobile.vercel.app';
  const CLINIC_URL = 'https://cocuna.vercel.app';

  // ─── Audience toggle (also reads `?for=clinics` query) ────────────────
  const params = new URLSearchParams(window.location.search);
  const initialAudience = params.get('for') === 'clinics' ? 'clinics'
                        : params.get('for') === 'mothers' ? 'mothers'
                        : 'auto';
  setAudience(initialAudience);

  document.querySelectorAll('[data-audience-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-audience-target');
      setAudience(target);
      // Preserve URL so users can share the variant
      const next = new URLSearchParams(window.location.search);
      next.set('for', target);
      const newUrl = window.location.pathname + '?' + next.toString();
      window.history.replaceState({}, '', newUrl);
    });
  });

  function setAudience(value) {
    document.body.setAttribute('data-audience', value);
    document.querySelectorAll('[data-audience-target]').forEach(function (btn) {
      const isActive = btn.getAttribute('data-audience-target') === value;
      btn.classList.toggle('is-active', isActive);
    });
  }

  // ─── Modal open / close ──────────────────────────────────────────────
  const modal = document.getElementById('demoModal');

  function openModal(preselect) {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    // Focus the matching choice for keyboard users
    const focusTarget = preselect === 'clinic'
      ? modal.querySelector('.choice-clinic')
      : preselect === 'mother'
      ? modal.querySelector('.choice-mother')
      : modal.querySelector('.modal-close');
    if (focusTarget && focusTarget.focus) {
      setTimeout(function () { focusTarget.focus(); }, 50);
    }
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-demo]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const preselect = el.getAttribute('data-preselect');
      // If the page is already on the clinics variant and no explicit
      // preselect is set, hint the clinic card.
      const audienceHint = document.body.getAttribute('data-audience');
      openModal(preselect || (audienceHint === 'clinics' ? 'clinic' : null));
    });
  });

  document.querySelectorAll('[data-close-demo]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  // Click outside the modal card → close
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // ESC → close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // ─── Choice click → redirect ────────────────────────────────────────
  // The <a href> handles the navigation natively; we just record analytics
  // (console.log for the demo) and let the browser follow.
  document.querySelectorAll('.choice').forEach(function (choice) {
    choice.addEventListener('click', function (e) {
      const which = choice.getAttribute('data-choice');
      console.log('[cocuna] book-a-demo →', which);
      // Belt-and-suspenders: ensure the destination is right in case the
      // href ever drifts from the constants above.
      const href = which === 'mother' ? MOTHER_URL : CLINIC_URL;
      if (choice.getAttribute('href') !== href) {
        e.preventDefault();
        window.location.href = href;
      }
    });
  });
})();
