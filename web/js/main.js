import { FESTIVAL_START_ISO } from './config.js';
import { initHomePage } from './pages/home.js';
import { initInfoPage } from './pages/info.js';
import { initPerformersPage } from './pages/performers.js';
import { initProgrammePage } from './pages/programme.js';
import { storageGet, storageSet } from './utils.js';

const setupTheme = root => {
  const savedTheme = storageGet('dpf-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  const themeButton = document.querySelector('[data-toggle-theme]');
  if (!themeButton) return;
  themeButton.textContent = root.dataset.theme === 'dawn' ? 'Dusk' : 'Dawn';
  themeButton.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dawn' ? '' : 'dawn';
    if (nextTheme) root.dataset.theme = nextTheme;
    else delete root.dataset.theme;
    storageSet('dpf-theme', nextTheme);
    themeButton.textContent = nextTheme === 'dawn' ? 'Dusk' : 'Dawn';
  });
};

const setupSpotlight = (root, reduceMotion) => {
  if (reduceMotion || !matchMedia('(pointer:fine)').matches) return;
  addEventListener('pointermove', event => {
    root.style.setProperty('--mx', `${event.clientX}px`);
    root.style.setProperty('--my', `${event.clientY}px`);
  }, { passive: true });
};

const setupRevealObserver = () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  return element => observer.observe(element);
};

const setupCountdown = () => {
  const countdown = document.querySelector('[data-countdown]');
  if (!countdown) return;
  const status = document.querySelector('[data-countdown-status]');
  const festivalStartMs = new Date(FESTIVAL_START_ISO).getTime();
  let lastAnnouncedHours = null;
  const tick = () => {
    const diff = festivalStartMs - Date.now();
    if (diff <= 0) {
      countdown.innerHTML = '<b>LIVE</b><span>see you in the desert</span>';
      if (status?.textContent !== 'Festival is live now.') status.textContent = 'Festival is live now.';
      return;
    }
    const days = Math.floor(diff / 864e5);
    const hours = Math.floor(diff / 36e5) % 24;
    const minutes = Math.floor(diff / 6e4) % 60;
    const seconds = Math.floor(diff / 1e3) % 60;
    countdown.innerHTML = `<div><b>${days}</b><span>days</span></div><div><b>${hours}</b><span>hours</span></div><div><b>${minutes}</b><span>min</span></div><div><b>${seconds}</b><span>sec</span></div>`;
    const totalHours = Math.floor(diff / 36e5);
    if (status && totalHours !== lastAnnouncedHours) {
      lastAnnouncedHours = totalHours;
      status.textContent = `${days} days, ${hours} hours until festival start.`;
    }
  };
  tick();
  const intervalId = setInterval(tick, 1000);
  addEventListener('pagehide', () => clearInterval(intervalId), { once: true });
};

const setupSearchShortcut = () => {
  const search = document.querySelector('input[type="search"]');
  if (!search) return;
  document.addEventListener('keydown', event => {
    if (event.key === '/' && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    }
  });
};

const setupBackToTop = reduceMotion => {
  const button = document.createElement('button');
  button.className = 'to-top';
  button.type = 'button';
  button.textContent = 'Top';
  button.hidden = true;
  button.setAttribute('aria-label', 'Back to top');
  button.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  document.body.appendChild(button);
  addEventListener('scroll', () => {
    button.hidden = scrollY < 420;
  }, { passive: true });
};

const setupPrefetch = () => {
  document.querySelectorAll('a[href$=".html"]').forEach(anchor => {
    anchor.addEventListener('mouseenter', () => {
      const href = anchor.getAttribute('href');
      if (!href) return;
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }, { once: true, passive: true });
  });
};

const setupLayoutConsistency = () => {
  const page = document.body.dataset.page || 'home';
  const footer = document.querySelector('footer p');
  const footerMap = {
    home: 'Desert Pulse Festival - premium digital experience powered by validated XML and API data.',
    programme: 'Desert Pulse Festival - premium scheduling and discovery interface.',
    performers: 'Desert Pulse Festival - premium lineup discovery experience.',
    info: 'Desert Pulse Festival - premium planning and onsite readiness guide.'
  };
  if (footer) footer.textContent = footerMap[page] || footerMap.home;

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header.site nav a[href$=".html"]').forEach(link => {
    if (link.getAttribute('href') === path) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

export const initApp = () => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  setupTheme(root);
  setupSpotlight(root, reduceMotion);
  setupCountdown();
  setupSearchShortcut();
  setupBackToTop(reduceMotion);
  setupPrefetch();
  setupLayoutConsistency();

  const observeReveal = setupRevealObserver();
  const page = document.body.dataset.page;
  if (page === 'home') initHomePage({ observeReveal });
  if (page === 'programme') initProgrammePage({ reduceMotion });
  if (page === 'performers') initPerformersPage();
  if (page === 'info') initInfoPage();
};
