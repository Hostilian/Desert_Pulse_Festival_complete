import { json, jsonAllPages } from '../api.js';
import { FEATURED_PERFORMERS_LIMIT } from '../config.js';
import { renderError, setText, safe } from '../utils.js';

const normalizePerformer = performer => ({
  id: String(performer?.id || ''),
  name: String(performer?.name || ''),
  genre: String(performer?.genre || ''),
  country: String(performer?.country || ''),
  bio: String(performer?.bio || '')
});

export const normalizeHomePayload = ({ performers, events, venues }) => {
  const performerItems = Array.isArray(performers?.items)
    ? performers.items.map(normalizePerformer).filter(performer => performer.id && performer.name)
    : [];
  const eventItems = Array.isArray(events?.items) ? events.items : [];
  const venueItems = Array.isArray(venues?.items) ? venues.items : [];
  return {
    performers: {
      items: performerItems,
      count: Number(performers?.count) || performerItems.length
    },
    events: {
      items: eventItems,
      count: Number(events?.count) || eventItems.length
    },
    venues: {
      items: venueItems,
      count: Number(venues?.count) || venueItems.length
    }
  };
};

export const initHomePage = ({ observeReveal }) => {
  Promise.all([jsonAllPages('performers.json'), jsonAllPages('events.json'), json('venues.json')])
    .then(([performersRaw, eventsRaw, venuesRaw]) => {
      const slot = document.querySelector('[data-featured]');
      if (!slot) return;
      const { performers, events, venues } = normalizeHomePayload({
        performers: performersRaw,
        events: eventsRaw,
        venues: venuesRaw
      });
      slot.innerHTML = performers.items.slice(0, FEATURED_PERFORMERS_LIMIT).map(performer => `
        <article class="card reveal" data-genre="${safe(performer.genre)}">
          <span class="tag">${safe(performer.country)}</span>
          <h3>${safe(performer.name)}</h3>
          <p class="meta">${safe(performer.bio)}</p>
        </article>`).join('');
      slot.querySelectorAll('.reveal').forEach(element => observeReveal(element));

      const pick = performers.items.length ? performers.items[Math.trunc(Math.random() * performers.items.length)] : null;
      if (pick) setText('[data-spotlight]', `${pick.name} (${pick.genre}, ${pick.country})`);

      const counts = document.querySelector('[data-live-counts]');
      if (counts) {
        counts.innerHTML = `<span class="pill">${performers.count} performers</span><span class="pill">${events.count} events</span><span class="pill">${venues.count} venues</span>`;
      }
    })
    .catch(() => {
      renderError(document.querySelector('[data-featured]'), 'Featured performers are temporarily unavailable.');
      setText('[data-live-counts]', 'Live dataset unavailable right now.');
    });
};
