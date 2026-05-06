import { DATA_ROOT } from './config.js';

const withQuery = (path, query = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const suffix = params.toString();
  if (!suffix) return path;
  return `${path}?${suffix}`;
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class HttpError extends Error {
  constructor(status) {
    super(`Request failed: ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

const fetchWithTimeout = (url, { timeoutMs, signal }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs);
  const onAbort = () => controller.abort(signal?.reason);
  if (signal) signal.addEventListener('abort', onAbort, { once: true });
  return fetch(url, { cache: 'force-cache', signal: controller.signal }).finally(() => {
    clearTimeout(timeout);
    if (signal) signal.removeEventListener('abort', onAbort);
  });
};

const parseJsonResponse = async (response, url) => {
  if (!response.ok) throw new HttpError(response.status);
  try {
    return await response.json();
  } catch (error) {
    throw new TypeError(`Invalid JSON payload for ${url}: ${error instanceof Error ? error.message : 'parse error'}`);
  }
};

const isRetryableError = error => {
  return error instanceof HttpError
    ? error.status === 429 || error.status >= 500
    : !(error instanceof TypeError);
};

const assertValidNumberOption = (name, value, { integerOnly = false, min = 0 } = {}) => {
  const isNumber = typeof value === 'number' && Number.isFinite(value);
  if (!isNumber) throw new RangeError(`${name} must be a finite number`);
  if (integerOnly && !Number.isInteger(value)) throw new RangeError(`${name} must be an integer`);
  if (value < min) throw new RangeError(`${name} must be >= ${min}`);
};

export const json = async (path, query, options = {}) => {
  const { retries = 2, retryDelayMs = 250, timeoutMs = 4000, signal } = options;
  assertValidNumberOption('retries', retries, { integerOnly: true, min: 0 });
  assertValidNumberOption('retryDelayMs', retryDelayMs, { min: 0 });
  assertValidNumberOption('timeoutMs', timeoutMs, { min: 1 });
  const url = `${DATA_ROOT}${withQuery(path, query)}`;

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, { timeoutMs, signal });
      return await parseJsonResponse(response, url);
    } catch (error) {
      if (signal?.aborted) throw error;
      if (!isRetryableError(error)) throw error;
      if (attempt >= retries) throw error;
      attempt += 1;
      await wait(retryDelayMs * attempt);
    }
  }
  throw new Error('Unexpected network failure');
};

export const jsonAllPages = async (path, query = {}, options = {}) => {
  const { maxPages = 50 } = options;
  const first = await json(path, query);
  if (!Array.isArray(first?.items)) return first;
  const total = Number(first.count ?? first.items.length);
  const pageSize = Number(first.pageSize ?? first.items.length) || first.items.length || 1;
  if (!Number.isFinite(total) || !Number.isFinite(pageSize) || pageSize < 1) return first;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (!Number.isInteger(maxPages) || maxPages < 1) throw new RangeError('maxPages must be a positive integer');
  if (pages > maxPages) throw new RangeError(`Refusing to fetch ${pages} pages (max ${maxPages})`);
  if (pages <= 1) return first;

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => json(path, { ...query, page: index + 2, pageSize }))
  );
  const mergedItems = [first, ...rest].flatMap(payload => payload.items || []);
  return { ...first, items: mergedItems, page: 1, pageSize: mergedItems.length };
};
