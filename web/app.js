import { initApp } from './js/main.js';

const renderFatalError = message => {
  const root = document.querySelector('main') || document.body;
  if (!root) return;
  const existing = document.querySelector('[data-fatal-alert]');
  if (existing) {
    existing.textContent = message;
    return;
  }
  const alert = document.createElement('p');
  alert.className = 'meta';
  alert.dataset.fatalAlert = 'true';
  alert.setAttribute('role', 'alert');
  alert.textContent = message;
  root.prepend(alert);
};

const handleFatal = error => {
  console.error(error);
  renderFatalError('The app encountered an unexpected issue. Please reload the page.');
};

addEventListener('error', event => handleFatal(event.error || event.message));
addEventListener('unhandledrejection', event => handleFatal(event.reason));

try {
  initApp();
} catch (error) {
  handleFatal(error);
}
