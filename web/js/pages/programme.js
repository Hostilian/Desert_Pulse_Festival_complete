import { jsonAllPages } from '../api.js';
import { DAYS } from '../config.js';
import { renderEventCard } from '../renderers.js';
import { dayLabel, debounce, renderError, setText, updateUrl, safe } from '../utils.js';

const normalizeEventItem = event => ({
  id: String(event?.id || ''),
  performerId: String(event?.performerId || ''),
  venueId: String(event?.venueId || ''),
  title: String(event?.title || ''),
  type: String(event?.type || ''),
  start: String(event?.start || ''),
  end: String(event?.end || '')
});

export const normalizeProgrammePayload = ({ events, performers, venues }) => {
  if (!Array.isArray(events?.items) || !Array.isArray(performers?.items) || !Array.isArray(venues?.items)) {
    throw new TypeError('Invalid programme payload');
  }
  return {
    eventItems: events.items.map(normalizeEventItem).filter(event => event.id && event.title && event.start),
    performerMap: Object.fromEntries(performers.items.map(performer => [performer.id, performer])),
    venueMap: Object.fromEntries(venues.items.map(venue => [venue.id, venue]))
  };
};

const buildState = params => ({
  day: DAYS.includes(params.get('day')) ? params.get('day') : '17',
  venue: params.get('venue') || '',
  q: (params.get('q') || '').toLowerCase()
});

const setDayTabSelection = (tabs, selectedDay) => {
  tabs.forEach(tab => {
    const selected = tab.dataset.dayBtn === selectedDay;
    tab.setAttribute('aria-selected', selected);
    tab.setAttribute('tabindex', selected ? '0' : '-1');
  });
};

const setVenueChipSelection = (chips, selectedVenue) => {
  chips?.querySelectorAll('[data-venue-btn]').forEach((chip, index) => {
    const selected = chip.dataset.venueBtn === selectedVenue || (!selectedVenue && index === 0);
    chip.setAttribute('aria-pressed', selected);
  });
};

const updatePanelLabel = dayTabs => {
  const active = dayTabs.find(tab => tab.getAttribute('aria-selected') === 'true');
  document.querySelector('#programme-panel')?.setAttribute('aria-labelledby', active?.id || 'prog-title');
};

const renderRows = ({ list, rows, performerMap, venueMap }) => {
  if (!rows.length) {
    list.innerHTML = '<p class="meta">No events match these filters. Try another day, venue, or search query.</p>';
    return;
  }
  list.innerHTML = rows.map(event => renderEventCard(event, performerMap[event.performerId], venueMap[event.venueId])).join('');
};

export const filterEvents = (items, performerMap, state) => (
  items
    .filter(event => event.start.length >= 10 && event.start.slice(8, 10) === state.day)
    .filter(event => !state.venue || event.venueId === state.venue)
    .filter(event => {
      if (!state.q) return true;
      const performer = performerMap[event.performerId];
      return (performer?.name || '').toLowerCase().includes(state.q) || event.title.toLowerCase().includes(state.q);
    })
    .sort((a, b) => a.start.localeCompare(b.start))
);

export const initProgrammePage = ({ reduceMotion }) => {
  const params = new URLSearchParams(location.search);
  Promise.all([jsonAllPages('events.json'), jsonAllPages('performers.json'), jsonAllPages('venues.json')])
    .then(([events, performers, venues]) => {
      const { eventItems, performerMap, venueMap } = normalizeProgrammePayload({ events, performers, venues });
      const list = document.querySelector('[data-events]');
      if (!list) return;

      const state = buildState(params);
      const dayTabs = [...document.querySelectorAll('[data-day-btn]')];
      const chips = document.querySelector('[data-venue-chips]');
      const search = document.querySelector('[data-search]');
      let currentRows = [];

      const render = () => {
        const rows = filterEvents(eventItems, performerMap, state);
        currentRows = rows;
        const dayText = dayLabel(`2026-04-${state.day}`);
        const venueText = state.venue ? `, ${venueMap[state.venue]?.name || state.venue}` : '';
        const queryText = state.q ? `, query "${state.q}"` : '';
        setText('[data-programme-status]', `${rows.length} events for ${dayText}${venueText}${queryText}.`);
        updateUrl({ day: state.day, venue: state.venue, q: state.q });
        renderRows({ list, rows, performerMap, venueMap });
      };

      const handleDayClick = button => {
        state.day = button.dataset.dayBtn || '17';
        setDayTabSelection(dayTabs, state.day);
        updatePanelLabel(dayTabs);
        render();
      };

      setDayTabSelection(dayTabs, state.day);
      updatePanelLabel(dayTabs);
      dayTabs.forEach(button => button.addEventListener('click', () => handleDayClick(button)));

      const tablist = dayTabs[0]?.closest('[role="tablist"]');
      if (tablist) {
        tablist.addEventListener('keydown', event => {
          const index = dayTabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
          if (index < 0) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextTab = dayTabs[(index + direction + dayTabs.length) % dayTabs.length];
            nextTab.click();
            nextTab.focus();
          }
        });
      }

      if (chips) {
        chips.innerHTML = '<button class="chip" aria-pressed="true" data-venue-btn="">All venues</button>' +
          venues.items.map(venue => `<button class="chip" aria-pressed="false" data-venue-btn="${venue.id}">${safe(venue.name)}</button>`).join('');
        setVenueChipSelection(chips, state.venue);
        chips.addEventListener('click', event => {
          const button = event.target.closest('[data-venue-btn]');
          if (!button) return;
          state.venue = button.dataset.venueBtn || '';
          setVenueChipSelection(chips, state.venue);
          render();
        });
      }

      if (search) {
        search.value = state.q;
        search.addEventListener('input', debounce(() => {
          state.q = search.value.trim().toLowerCase();
          render();
        }, 100));
      }

      document.querySelector('[data-clear-programme]')?.addEventListener('click', () => {
        state.day = '17';
        state.venue = '';
        state.q = '';
        if (search) search.value = '';
        setDayTabSelection(dayTabs, '17');
        setVenueChipSelection(chips, '');
        updatePanelLabel(dayTabs);
        render();
      });

      document.querySelector('[data-surprise-programme]')?.addEventListener('click', () => {
        if (!currentRows.length) return;
        const picked = currentRows[Math.trunc(Math.random() * currentRows.length)];
        const index = currentRows.findIndex(row => row.id === picked.id);
        const card = [...list.querySelectorAll('.card')][index];
        if (!card) return;
        list.querySelectorAll('.card').forEach(item => delete item.dataset.active);
        card.dataset.active = 'true';
        card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        setText('[data-programme-status]', `Surprise pick: ${picked.title}`);
      });

      render();
    })
    .catch(() => {
      renderError(document.querySelector('[data-events]'), 'Programme data could not be loaded right now.');
      setText('[data-programme-status]', 'Programme currently unavailable.');
    });
};
