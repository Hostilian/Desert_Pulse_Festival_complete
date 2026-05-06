import { fmtTime, safe } from './utils.js';

const safeCapacity = value => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 'n/a';
  return numeric.toLocaleString();
};

export const renderPerformerCard = performer => `
  <article class="card" id="${safe(performer.id)}" data-genre="${safe(performer.genre)}">
    <span class="tag">${safe(performer.country)}</span>
    <h3>${safe(performer.name)}</h3>
    <details><summary>Bio</summary><p class="meta">${safe(performer.bio)}</p></details>
  </article>`;

export const renderVenueCard = venue => `
  <article class="card" id="${safe(venue.id)}">
    <span class="tag">cap. ${safeCapacity(venue.capacity)}</span>
    <h3>${safe(venue.name)}</h3>
    <p class="meta">${safe(venue.description)}</p>
    <address>${safe(venue.area)}, Solara Desert Park, Arizona, USA</address>
  </article>`;

export const renderEventCard = (event, performer, venue) => `<article class="card">
  <span class="tag">${safe(event.type)}</span>
  <h3>${safe(event.title)}</h3>
  <p class="meta"><time datetime="${safe(event.start)}">${fmtTime(event.start)}</time> &ndash;
    <time datetime="${safe(event.end)}">${fmtTime(event.end)}</time> &middot;
    ${safe(venue?.name || event.venueId)} &middot; ${safe(performer?.genre || '')} &middot; ${safe(performer?.name || '')}</p>
</article>`;
