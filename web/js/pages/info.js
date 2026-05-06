import { json } from '../api.js';
import { PACK_CHECKLIST_VERSION } from '../config.js';
import { renderVenueCard } from '../renderers.js';
import { renderError, setText, storageGet, storageRemove, storageSet } from '../utils.js';

const withPackKey = value => `dpf-pack-${PACK_CHECKLIST_VERSION}-${value}`;

export const initInfoPage = () => {
  json('venues.json')
    .then(data => {
      const slot = document.querySelector('[data-venues]');
      if (!slot) return;
      if (!Array.isArray(data?.items)) throw new Error('Invalid venues payload');
      slot.innerHTML = data.items.map(renderVenueCard).join('');
    })
    .catch(() => {
      renderError(document.querySelector('[data-venues]'), 'Venue information is temporarily unavailable.');
    });

  const checks = [...document.querySelectorAll('.checklist input')];
  const updatePack = () => {
    const done = checks.filter(check => check.checked).length;
    setText('[data-pack-progress]', `${done}/${checks.length} packed`);
  };

  checks.forEach(check => {
    const key = withPackKey(check.value);
    if (storageGet(key) === '1') check.checked = true;
    check.addEventListener('change', () => {
      storageSet(key, check.checked ? '1' : '0');
      updatePack();
    });
  });
  updatePack();

  document.querySelector('[data-clear-pack]')?.addEventListener('click', () => {
    checks.forEach(check => {
      check.checked = false;
      storageRemove(withPackKey(check.value));
    });
    updatePack();
  });
};
