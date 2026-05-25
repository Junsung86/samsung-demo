/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Samsung UK site-wide cleanup.
 * Removes non-authorable elements (header, footer, navigation, popups, widgets).
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Layer popups / modals from GNB navigation (line 1798 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.nv00-gnb-v4__layer-popup-wrap']);

    // Floating navigation bar - sticky nav overlay (line 1996-1997 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.pd-g-floating-nav']);

    // Skip navigation links (line 71 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.skip-bar']);

    // Empty AEM "new section" paragraph containers (line 78 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.newpar.new.section']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Site header with GNB navigation (line 69 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['header#header']);

    // Global navigation (line 154 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['nav.nv00-gnb-v4']);

    // Site footer (line 2879 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['footer.footer']);

    // Bottom disclaimer container (line 2876 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.cod07-bottom-disclaimer-container']);

    // Stock alert popup (line 3300 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['.pd-get-stock-alert-popup']);

    // Go to Top floating button (line 3282 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['button.fab']);

    // Hidden inputs used for state/tracking (lines 1795-1797, 3298-3299 in cleaned.html)
    WebImporter.DOMUtils.remove(element, ['input[type="hidden"]', 'input:not([type])']);

    // Noscript elements and iframes
    WebImporter.DOMUtils.remove(element, ['noscript', 'iframe', 'link']);
  }
}
