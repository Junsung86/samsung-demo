/*
 * Central localization (i18n) helper.
 *
 * Goal: keep UI strings out of block code so a single dictionary drives every
 * locale. Authors edit content in the source locale; code-level labels (button
 * text, ARIA labels, etc.) are translated once here and resolved at runtime by
 * the page's locale — derived from the URL path (/en/* → en, otherwise the
 * default 'kr'). Adding a locale = adding a column to the dictionary; no block
 * code changes needed.
 *
 * This does NOT translate authored body copy — that lives in the per-locale
 * content fragments. It centralizes the strings the decorators inject.
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

/* UI string dictionary. Each key maps to an object of locale → string.
   Add a new locale by adding its code to every entry. Keep keys stable;
   blocks reference these keys, not the literal text. */
const DICTIONARY = {
  'cards-content.loadMore': {
    kr: '더 보기',
    en: 'See more',
  },
};

/**
 * Look up a localized UI string by key.
 * Falls back to the default locale, then the key itself, so a missing
 * translation degrades gracefully instead of rendering blank.
 * @param {string} key dictionary key
 * @param {string} [locale=getLocale()] locale code
 * @returns {string}
 */
export function t(key, locale = getLocale()) {
  const entry = DICTIONARY[key];
  if (!entry) return key;
  return entry[locale] ?? entry[DEFAULT_LOCALE] ?? key;
}

/**
 * Resolve a locale-prefixed fragment path (nav, footer, …).
 * en → `/en{path}`; default locale → `{path}` (root).
 * @param {string} path e.g. '/nav' or '/footer'
 * @param {string} [locale=getLocale()]
 * @returns {string}
 */
export function localizedFragmentPath(path, locale = getLocale()) {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}
