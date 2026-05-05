/* Desert Pulse Festival - shared interactivity layer.
   Progressive enhancement: every page works without JS thanks to static fallbacks.
   Loads JSON from /data/API/json/. */
(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DATA = 'data/API/json/';
  const FESTIVAL_START = new Date('2026-04-17T10:00:00');

  /* ---------- theme ---------- */
  const savedTheme = localStorage.getItem('dpf-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-toggle-theme]');
    if (!btn) return;
    const next = root.dataset.theme === 'dawn' ? '' : 'dawn';
    if (next) root.dataset.theme = next; else delete root.dataset.theme;
    localStorage.setItem('dpf-theme', next);
    btn.textContent = next === 'dawn' ? 'Dusk' : 'Dawn';
  });
  const themeBtn = document.querySelector('[data-toggle-theme]');
  if (themeBtn) themeBtn.textContent = root.dataset.theme === 'dawn' ? 'Dusk' : 'Dawn';

  /* ---------- cursor spotlight ---------- */
  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
  }

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => en.isIntersecting && en.target.classList.add('in'));
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- countdown ---------- */
  const cd = document.querySelector('[data-countdown]');
  if (cd) {
    const tick = () => {
      const diff = FESTIVAL_START - new Date();
      if (diff <= 0) { cd.innerHTML = '<b>LIVE</b><span>see you in the desert</span>'; return; }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor(diff / 36e5) % 24;
      const m = Math.floor(diff / 6e4) % 60;
      const s = Math.floor(diff / 1e3) % 60;
      cd.innerHTML = `
        <div><b>${d}</b><span>days</span></div>
        <div><b>${h}</b><span>hours</span></div>
        <div><b>${m}</b><span>min</span></div>
        <div><b>${s}</b><span>sec</span></div>`;
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- data loader ---------- */
  const json = path => fetch(DATA + path).then(r => r.ok ? r.json() : Promise.reject(r.status));
  const safe = s => String(s).replace(/[<>&"]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;' }[c]));
  const fmtTime = iso => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dayLabel = iso => ({ '17':'Fri','18':'Sat','19':'Sun' }[iso.slice(8,10)] || iso.slice(0,10));

  const page = document.body.dataset.page;

  /* ---------- HOME: featured performers ---------- */
  if (page === 'home') {
    json('performers.json').then(d => {
      const slot = document.querySelector('[data-featured]');
      if (!slot) return;
      slot.innerHTML = d.items.slice(0, 6).map(p => `
        <article class="card reveal" data-genre="${safe(p.genre)}">
          <span class="tag">${safe(p.country)}</span>
          <h3>${safe(p.name)}</h3>
          <p class="meta">${safe(p.bio)}</p>
        </article>`).join('');
      slot.querySelectorAll('.reveal').forEach(el => io.observe(el));
    }).catch(() => {});
  }

  /* ---------- PROGRAMME: day tabs + venue chips + search ---------- */
  if (page === 'programme') {
    Promise.all([json('events.json'), json('performers.json'), json('venues.json')])
      .then(([ev, perfs, ven]) => {
        const pmap = Object.fromEntries(perfs.items.map(p => [p.id, p]));
        const vmap = Object.fromEntries(ven.items.map(v => [v.id, v]));
        const list = document.querySelector('[data-events]');
        if (!list) return;
        const state = { day: '17', venue: '', q: '' };
        const render = () => {
          const rows = ev.items.filter(e => e.start.slice(8,10) === state.day)
            .filter(e => !state.venue || e.venueId === state.venue)
            .filter(e => {
              if (!state.q) return true;
              const p = pmap[e.performerId];
              return (p?.name || '').toLowerCase().includes(state.q) ||
                     e.title.toLowerCase().includes(state.q);
            })
            .sort((a,b) => a.start.localeCompare(b.start));
          if (!rows.length) { list.innerHTML = '<p class="meta">No events match these filters.</p>'; return; }
          list.innerHTML = rows.map(e => {
            const p = pmap[e.performerId], v = vmap[e.venueId];
            return `<article class="card">
              <span class="tag">${safe(e.type)}</span>
              <h3>${safe(e.title)}</h3>
              <p class="meta"><time datetime="${e.start}">${fmtTime(e.start)}</time> &ndash;
                <time datetime="${e.end}">${fmtTime(e.end)}</time> &middot;
                ${safe(v?.name || e.venueId)} &middot; ${safe(p?.genre || '')}</p>
            </article>`;
          }).join('');
        };
        document.querySelectorAll('[data-day-btn]').forEach(b => {
          b.addEventListener('click', () => {
            state.day = b.dataset.dayBtn;
            document.querySelectorAll('[data-day-btn]').forEach(x => x.setAttribute('aria-pressed', x === b));
            render();
          });
        });
        const chips = document.querySelector('[data-venue-chips]');
        if (chips) {
          chips.innerHTML = '<button class="chip" aria-pressed="true" data-venue-btn="">All venues</button>' +
            ven.items.map(v => `<button class="chip" aria-pressed="false" data-venue-btn="${v.id}">${safe(v.name)}</button>`).join('');
          chips.addEventListener('click', e => {
            const b = e.target.closest('[data-venue-btn]'); if (!b) return;
            state.venue = b.dataset.venueBtn;
            chips.querySelectorAll('[data-venue-btn]').forEach(x => x.setAttribute('aria-pressed', x === b));
            render();
          });
        }
        const q = document.querySelector('[data-search]');
        if (q) q.addEventListener('input', () => { state.q = q.value.trim().toLowerCase(); render(); });
        render();
      }).catch(() => {});
  }

  /* ---------- PERFORMERS: search + genre chips + grid ---------- */
  if (page === 'performers') {
    json('performers.json').then(d => {
      const grid = document.querySelector('[data-performers]');
      if (!grid) return;
      const genres = [...new Set(d.items.map(p => p.genre))].sort();
      const chips = document.querySelector('[data-genre-chips]');
      if (chips) {
        chips.innerHTML = '<button class="chip" aria-pressed="true" data-genre-btn="">All</button>' +
          genres.map(g => `<button class="chip" aria-pressed="false" data-genre-btn="${safe(g)}">${safe(g)}</button>`).join('');
      }
      const state = { genre: '', q: '' };
      const render = () => {
        const rows = d.items
          .filter(p => !state.genre || p.genre === state.genre)
          .filter(p => !state.q || p.name.toLowerCase().includes(state.q) || p.country.toLowerCase().includes(state.q));
        grid.innerHTML = rows.length ? rows.map(p => `
          <article class="card" id="${p.id}" data-genre="${safe(p.genre)}">
            <span class="tag">${safe(p.country)}</span>
            <h3>${safe(p.name)}</h3>
            <details><summary>Bio</summary><p class="meta">${safe(p.bio)}</p></details>
          </article>`).join('') : '<p class="meta">No performers match.</p>';
      };
      if (chips) chips.addEventListener('click', e => {
        const b = e.target.closest('[data-genre-btn]'); if (!b) return;
        state.genre = b.dataset.genreBtn;
        chips.querySelectorAll('[data-genre-btn]').forEach(x => x.setAttribute('aria-pressed', x === b));
        render();
      });
      const q = document.querySelector('[data-search]');
      if (q) q.addEventListener('input', () => { state.q = q.value.trim().toLowerCase(); render(); });
      render();
    }).catch(() => {});
  }

  /* ---------- INFO: venues + checklist persistence ---------- */
  if (page === 'info') {
    json('venues.json').then(d => {
      const slot = document.querySelector('[data-venues]');
      if (!slot) return;
      slot.innerHTML = d.items.map(v => `
        <article class="card" id="${v.id}">
          <span class="tag">cap. ${v.capacity.toLocaleString()}</span>
          <h3>${safe(v.name)}</h3>
          <p class="meta">${safe(v.description)}</p>
          <address>${safe(v.area)}, Solara Desert Park, Arizona, USA</address>
        </article>`).join('');
    }).catch(() => {});
    document.querySelectorAll('.checklist input').forEach(cb => {
      const k = 'dpf-pack-' + cb.value;
      if (localStorage.getItem(k) === '1') cb.checked = true;
      cb.addEventListener('change', () => localStorage.setItem(k, cb.checked ? '1' : '0'));
    });
  }
})();
