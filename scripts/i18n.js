/*
 * Central localization (i18n) helper.
 *
 * UI strings (button labels, ARIA text, etc. that block code injects) are
 * managed as CONTENT in a per-locale placeholders sheet, edited by authors in
 * Document Authoring — no code change needed to add/adjust a translation.
 * The bundled DICTIONARY below is only a build-time fallback so the UI never
 * renders blank if a sheet or key is missing.
 *
 * Locale is derived from the URL path (/en/* → en, otherwise the default 'kr').
 * Adding a locale = adding its placeholders sheet (+ a path rule in getLocale).
 *
 * This does NOT translate authored body copy — that lives in the per-locale
 * content fragments. It centralizes the strings the decorators inject.
 *
 * Sheet contract: `{locale}/placeholders.json` (root for the default locale),
 * an EDS sheet with two columns Key | Value, e.g.
 *   Key                    | Value
 *   cards-content.loadMore | 더 보기
 */

export const DEFAULT_LOCALE = 'kr';

/**
 * Resolve the active locale from the current path.
 * /en/... or /content/en/... → 'en'; everything else → DEFAULT_LOCALE.
 * @param {string} [pathname=window.location.pathname]
 * @returns {string} locale code
 */
export function getLocale(pathname = window.location.pathname) {
  if (/^\/(content\/)?en(\/|$)/.test(pathname)) return 'en';
  return DEFAULT_LOCALE;
}

/* Build-time fallback dictionary. Authors override these via the placeholders
   sheet; this only guarantees a non-empty label when the sheet is unavailable.
   Keep keys stable; blocks reference these keys, not the literal text. */
const DICTIONARY = {
  'cards-content.loadMore': {
    kr: '더 보기',
    en: 'See more',
  },
};

/**
 * Resolve a locale-prefixed fragment/sheet path.
 * en → `/en{path}`; default locale → `{path}` (root).
 * @param {string} path e.g. '/nav', '/footer', '/placeholders'
 * @param {string} [locale=getLocale()]
 * @returns {string}
 */
export function localizedFragmentPath(path, locale = getLocale()) {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

/* Cache of locale → { key: value } loaded from placeholders sheets. */
const placeholders = {};

/**
 * Normalize an EDS sheet row to [key, value]. Columns are typically
 * `Key`/`Value` but we accept any first/second column case-insensitively.
 * @param {object} row
 * @returns {[string, string]|null}
 */
function rowToEntry(row) {
  const key = row.Key ?? row.key ?? row.KEY;
  const value = row.Value ?? row.value ?? row.VALUE ?? row.Text ?? row.text;
  if (key == null || value == null) return null;
  return [String(key).trim(), String(value)];
}

/**
 * Load the placeholders sheet for a locale into the cache (once).
 * Localhost / aem up serves content under /content/, so try that first,
 * then the site-root path that DA/EDS production uses. Failures are swallowed
 * — t() then falls back to the bundled dictionary.
 * @param {string} [locale=getLocale()]
 * @returns {Promise<object>} the locale's key→value map (possibly empty)
 */
export async function loadPlaceholders(locale = getLocale()) {
  if (placeholders[locale]) return placeholders[locale];
  const map = {};
  const path = `${localizedFragmentPath('/placeholders', locale)}.json`;
  try {
    let resp = await fetch(`/content${path}`);
    if (!resp.ok) resp = await fetch(path);
    if (resp.ok) {
      const json = await resp.json();
      (json.data || []).forEach((row) => {
        const entry = rowToEntry(row);
        if (entry) [, map[entry[0]]] = [entry[0], entry[1]];
      });
    }
  } catch (e) {
    // sheet unavailable — rely on the bundled dictionary fallback
  }
  placeholders[locale] = map;
  return map;
}

/**
 * Look up a localized UI string by key.
 * Resolution order: placeholders sheet (content) → bundled dictionary →
 * default-locale dictionary → the key itself, so a missing translation
 * degrades gracefully instead of rendering blank.
 *
 * Synchronous: call `loadPlaceholders()` once during page load (see
 * scripts.js) so the sheet is cached before blocks decorate.
 * @param {string} key dictionary key
 * @param {string} [locale=getLocale()] locale code
 * @returns {string}
 */
export function t(key, locale = getLocale()) {
  const fromSheet = placeholders[locale]?.[key];
  if (fromSheet != null) return fromSheet;
  const entry = DICTIONARY[key];
  if (!entry) return key;
  return entry[locale] ?? entry[DEFAULT_LOCALE] ?? key;
}
