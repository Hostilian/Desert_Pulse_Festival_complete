export const safe = value => String(value).replaceAll(/[<>&"]/g, char => (
  { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[char]
));

export const fmtTime = iso => {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return '--:--';
  return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
export const dayLabel = iso => ({ '17': 'Fri', '18': 'Sat', '19': 'Sun' }[iso.slice(8, 10)] || iso.slice(0, 10));

export const debounce = (fn, wait = 120) => {
  let timer = 0;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};

export const setText = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};

export const renderError = (slot, message) => {
  if (slot) slot.innerHTML = `<p class="meta">${safe(message)}</p>`;
};

export const storageGet = key => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const storageSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const storageRemove = key => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const buildUrlFromParams = (pathname, search, next) => {
  const params = new URLSearchParams(search);
  Object.entries(next).forEach(([key, value]) => {
    const normalized = typeof value === 'string' ? value.trim() : value;
    const shouldKeep = (
      normalized === 0 ||
      normalized === '0' ||
      normalized === true ||
      normalized === false ||
      (typeof normalized === 'string' && normalized.length > 0) ||
      (typeof normalized === 'number' && Number.isFinite(normalized))
    );
    if (shouldKeep) params.set(key, String(normalized));
    else params.delete(key);
  });
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

export const updateUrl = next => {
  const nextUrl = buildUrlFromParams(location.pathname, location.search, next);
  history.replaceState(null, '', nextUrl);
};
