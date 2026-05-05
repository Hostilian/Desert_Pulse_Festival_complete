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
  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };
  const params = new URLSearchParams(location.search);
  const updateUrl = next => {
    const p = new URLSearchParams(location.search);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    const q = p.toString();
    history.replaceState(null, '', `${location.pathname}${q ? `?${q}` : ''}`);
  };

  const page = document.body.dataset.page;

  /* ---------- HOME: featured performers ---------- */
  if (page === 'home') {
    Promise.all([json('performers.json'), json('events.json'), json('venues.json')]).then(([d, ev, ve]) => {
      const slot = document.querySelector('[data-featured]');
      if (!slot) return;
      slot.innerHTML = d.items.slice(0, 6).map(p => `
        <article class="card reveal" data-genre="${safe(p.genre)}">
          <span class="tag">${safe(p.country)}</span>
          <h3>${safe(p.name)}</h3>
          <p class="meta">${safe(p.bio)}</p>
        </article>`).join('');
      slot.querySelectorAll('.reveal').forEach(el => io.observe(el));
      const pick = d.items[(Math.random() * d.items.length) | 0];
      setText('[data-spotlight]', `${pick.name} (${pick.genre}, ${pick.country})`);
      const counts = document.querySelector('[data-live-counts]');
      if (counts) counts.innerHTML = `<span class="pill">${d.count || d.items.length} performers</span><span class="pill">${ev.count || ev.items.length} events</span><span class="pill">${ve.count || ve.items.length} venues</span>`;
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
        const state = {
          day: ['17', '18', '19'].includes(params.get('day')) ? params.get('day') : '17',
          venue: params.get('venue') || '',
          q: (params.get('q') || '').toLowerCase()
        };
        let currentRows = [];
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
          currentRows = rows;
          setText(
            '[data-programme-status]',
            `${rows.length} events for ${dayLabel(`2026-04-${state.day}`)}${state.venue ? `, ${vmap[state.venue]?.name || state.venue}` : ''}${state.q ? `, query "${state.q}"` : ''}.`
          );
          updateUrl({ day: state.day, venue: state.venue, q: state.q });
          if (!rows.length) { list.innerHTML = '<p class="meta">No events match these filters. Try another day, venue, or search query.</p>'; return; }
          list.innerHTML = rows.map(e => {
            const p = pmap[e.performerId], v = vmap[e.venueId];
            return `<article class="card">
              <span class="tag">${safe(e.type)}</span>
              <h3>${safe(e.title)}</h3>
              <p class="meta"><time datetime="${e.start}">${fmtTime(e.start)}</time> &ndash;
                <time datetime="${e.end}">${fmtTime(e.end)}</time> &middot;
                ${safe(v?.name || e.venueId)} &middot; ${safe(p?.genre || '')} &middot; ${safe(p?.name || '')}</p>
            </article>`;
          }).join('');
        };
        document.querySelectorAll('[data-day-btn]').forEach(b => {
          b.setAttribute('aria-pressed', b.dataset.dayBtn === state.day);
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
          chips.querySelectorAll('[data-venue-btn]').forEach(x => x.setAttribute('aria-pressed', x.dataset.venueBtn === state.venue));
          chips.addEventListener('click', e => {
            const b = e.target.closest('[data-venue-btn]'); if (!b) return;
            state.venue = b.dataset.venueBtn;
            chips.querySelectorAll('[data-venue-btn]').forEach(x => x.setAttribute('aria-pressed', x === b));
            render();
          });
        }
        const q = document.querySelector('[data-search]');
        if (q) {
          q.value = state.q;
          q.addEventListener('input', () => { state.q = q.value.trim().toLowerCase(); render(); });
        }
        const clear = document.querySelector('[data-clear-programme]');
        if (clear) clear.addEventListener('click', () => {
          state.day = '17'; state.venue = ''; state.q = '';
          document.querySelectorAll('[data-day-btn]').forEach(x => x.setAttribute('aria-pressed', x.dataset.dayBtn === '17'));
          const chipsEl = document.querySelector('[data-venue-chips]');
          if (chipsEl) chipsEl.querySelectorAll('[data-venue-btn]').forEach((x, i) => x.setAttribute('aria-pressed', i === 0));
          if (q) q.value = '';
          render();
        });
        const surprise = document.querySelector('[data-surprise-programme]');
        if (surprise) surprise.addEventListener('click', () => {
          if (!currentRows.length) return;
          const event = currentRows[(Math.random() * currentRows.length) | 0];
          const idx = currentRows.findIndex(x => x.id === event.id);
          const cards = [...list.querySelectorAll('.card')];
          const card = cards[idx];
          if (!card) return;
          cards.forEach(c => c.removeAttribute('data-active'));
          card.setAttribute('data-active', 'true');
          card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          setText('[data-programme-status]', `Surprise pick: ${event.title}`);
        });
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
      let currentRows = [];
      const render = () => {
        const rows = d.items
          .filter(p => !state.genre || p.genre === state.genre)
          .filter(p => !state.q || p.name.toLowerCase().includes(state.q) || p.country.toLowerCase().includes(state.q));
        currentRows = rows;
        setText('[data-performer-status]', `${rows.length} performers shown${state.genre ? ` in ${state.genre}` : ''}${state.q ? ` matching "${state.q}"` : ''}.`);
        updateUrl({ genre: state.genre, q: state.q });
        grid.innerHTML = rows.length ? rows.map(p => `
          <article class="card" id="${p.id}" data-genre="${safe(p.genre)}">
            <span class="tag">${safe(p.country)}</span>
            <h3>${safe(p.name)}</h3>
            <details><summary>Bio</summary><p class="meta">${safe(p.bio)}</p></details>
          </article>`).join('') : '<p class="meta">No performers match.</p>';
      };
      const genreStats = document.querySelector('[data-genre-stats]');
      if (genreStats) {
        const counts = [...d.items.reduce((m, p) => m.set(p.genre, (m.get(p.genre) || 0) + 1), new Map()).entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);
        genreStats.innerHTML = counts.map(([g, c]) => `<span class="pill">${safe(g)}: ${c}</span>`).join('');
      }
      if (chips) chips.addEventListener('click', e => {
        const b = e.target.closest('[data-genre-btn]'); if (!b) return;
        state.genre = b.dataset.genreBtn;
        chips.querySelectorAll('[data-genre-btn]').forEach(x => x.setAttribute('aria-pressed', x === b));
        render();
      });
      const q = document.querySelector('[data-search]');
      if (q) {
        state.genre = params.get('genre') || '';
        state.q = (params.get('q') || '').toLowerCase();
        q.value = state.q;
        q.addEventListener('input', () => { state.q = q.value.trim().toLowerCase(); render(); });
      }
      if (chips) chips.querySelectorAll('[data-genre-btn]').forEach(x => x.setAttribute('aria-pressed', x.dataset.genreBtn === state.genre));
      const clear = document.querySelector('[data-clear-performers]');
      if (clear) clear.addEventListener('click', () => {
        state.genre = ''; state.q = '';
        if (q) q.value = '';
        if (chips) chips.querySelectorAll('[data-genre-btn]').forEach((x, i) => x.setAttribute('aria-pressed', i === 0));
        render();
      });
      const shuffle = document.querySelector('[data-shuffle-performers]');
      if (shuffle) shuffle.addEventListener('click', () => {
        if (!currentRows.length) return;
        const shuffled = [...currentRows].sort(() => Math.random() - 0.5);
        grid.innerHTML = shuffled.map(p => `
          <article class="card" id="${p.id}" data-genre="${safe(p.genre)}">
            <span class="tag">${safe(p.country)}</span>
            <h3>${safe(p.name)}</h3>
            <details><summary>Bio</summary><p class="meta">${safe(p.bio)}</p></details>
          </article>`).join('');
        setText('[data-performer-status]', `Shuffled ${shuffled.length} performers${state.genre ? ` in ${state.genre}` : ''}.`);
      });
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
    const checks = [...document.querySelectorAll('.checklist input')];
    const updatePack = () => {
      const done = checks.filter(c => c.checked).length;
      setText('[data-pack-progress]', `${done}/${checks.length} packed`);
    };
    checks.forEach(cb => {
      const k = 'dpf-pack-' + cb.value;
      if (localStorage.getItem(k) === '1') cb.checked = true;
      cb.addEventListener('change', () => {
        localStorage.setItem(k, cb.checked ? '1' : '0');
        updatePack();
      });
    });
    updatePack();
    const clear = document.querySelector('[data-clear-pack]');
    if (clear) clear.addEventListener('click', () => {
      checks.forEach(c => {
        c.checked = false;
        localStorage.removeItem('dpf-pack-' + c.value);
      });
      updatePack();
    });
  }

  const search = document.querySelector('input[type="search"]');
  if (search) {
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
      }
    });
  }

  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.type = 'button';
  toTop.textContent = 'Top';
  toTop.hidden = true;
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  document.body.appendChild(toTop);
  addEventListener('scroll', () => { toTop.hidden = scrollY < 420; }, { passive: true });
})();
