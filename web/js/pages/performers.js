import { jsonAllPages } from '../api.js';
import { renderPerformerCard } from '../renderers.js';
import { debounce, renderError, setText, updateUrl, safe } from '../utils.js';

const normalizePerformerItem = performer => ({
  id: String(performer?.id || ''),
  genre: String(performer?.genre || ''),
  name: String(performer?.name || ''),
  country: String(performer?.country || ''),
  bio: String(performer?.bio || '')
});

export const normalizePerformersPayload = data => {
  if (!Array.isArray(data?.items)) throw new TypeError('Invalid performers payload');
  return data.items.map(normalizePerformerItem).filter(performer => performer.id && performer.name);
};

export const filterPerformers = (items, state) => (
  items
    .filter(performer => !state.genre || performer.genre === state.genre)
    .filter(performer => !state.q || performer.name.toLowerCase().includes(state.q) || performer.country.toLowerCase().includes(state.q))
);

export const initPerformersPage = () => {
  const params = new URLSearchParams(location.search);
  jsonAllPages('performers.json')
    .then(data => {
      const grid = document.querySelector('[data-performers]');
      if (!grid) return;
      const items = normalizePerformersPayload(data);
      const genres = [...new Set(items.map(performer => performer.genre).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));
      const chips = document.querySelector('[data-genre-chips]');
      if (chips) {
        chips.innerHTML = '<button class="chip" aria-pressed="true" data-genre-btn="">All</button>' +
          genres.map(genre => `<button class="chip" aria-pressed="false" data-genre-btn="${safe(genre)}">${safe(genre)}</button>`).join('');
      }
      const state = { genre: params.get('genre') || '', q: (params.get('q') || '').toLowerCase() };
      let currentRows = [];
      const render = () => {
        const rows = filterPerformers(items, state);
        currentRows = rows;
        const genreText = state.genre ? ` in ${state.genre}` : '';
        const queryText = state.q ? ` matching "${state.q}"` : '';
        setText('[data-performer-status]', `${rows.length} performers shown${genreText}${queryText}.`);
        updateUrl({ genre: state.genre, q: state.q });
        grid.innerHTML = rows.length ? rows.map(renderPerformerCard).join('') : '<p class="meta">No performers match.</p>';
      };

      const genreStats = document.querySelector('[data-genre-stats]');
      if (genreStats) {
        const counts = [...items.reduce((map, performer) => map.set(performer.genre, (map.get(performer.genre) || 0) + 1), new Map()).entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);
        genreStats.innerHTML = counts.map(([genre, count]) => `<span class="pill">${safe(genre)}: ${count}</span>`).join('');
      }

      chips?.addEventListener('click', event => {
        const button = event.target.closest('[data-genre-btn]');
        if (!button) return;
        state.genre = button.dataset.genreBtn;
        chips.querySelectorAll('[data-genre-btn]').forEach(chip => chip.setAttribute('aria-pressed', chip === button));
        render();
      });

      const search = document.querySelector('[data-search]');
      if (search) {
        search.value = state.q;
        search.addEventListener('input', debounce(() => {
          state.q = search.value.trim().toLowerCase();
          render();
        }, 100));
      }

      chips?.querySelectorAll('[data-genre-btn]').forEach(chip => chip.setAttribute('aria-pressed', chip.dataset.genreBtn === state.genre));

      document.querySelector('[data-clear-performers]')?.addEventListener('click', () => {
        state.genre = '';
        state.q = '';
        if (search) search.value = '';
        chips?.querySelectorAll('[data-genre-btn]').forEach((chip, index) => chip.setAttribute('aria-pressed', index === 0));
        render();
      });

      document.querySelector('[data-shuffle-performers]')?.addEventListener('click', () => {
        if (!currentRows.length) return;
        const shuffled = [...currentRows].sort(() => Math.random() - 0.5);
        grid.innerHTML = shuffled.map(renderPerformerCard).join('');
        const genreText = state.genre ? ` in ${state.genre}` : '';
        setText('[data-performer-status]', `Shuffled ${shuffled.length} performers${genreText}.`);
      });

      render();
    })
    .catch(() => {
      renderError(document.querySelector('[data-performers]'), 'Performer data could not be loaded right now.');
      setText('[data-performer-status]', 'Lineup currently unavailable.');
    });
};
