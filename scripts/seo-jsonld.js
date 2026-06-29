/*
 * Machine-readable page metadata for AI agents / search engines.
 *
 * Injects schema.org JSON-LD into <head> — invisible to users, but readable by
 * crawlers and LLM agents. Two parts, both sourced from existing page data so
 * authors don't maintain a parallel copy:
 *   - description: from page metadata (`summary` if present, else `description`)
 *   - FAQ: built from the page's existing FAQ block(s) (.accordion-faq)
 *
 * No visible DOM is added; only a <script type="application/ld+json"> tag.
 */

import { getMetadata } from './aem.js';

/** Collapse whitespace and trim; FAQ answers may contain <br> and newlines. */
function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

/**
 * Extract Q&A pairs from FAQ blocks. After decoration each item is
 * <details><summary>Q</summary><div class="accordion-faq-item-body">A</div></details>;
 * before decoration it's nested <div><div>Q</div><div>A</div></div>. Support both
 * so this works regardless of decoration timing.
 * @param {Document} doc
 * @returns {Array<{q:string,a:string}>}
 */
function extractFaqs(doc) {
  const faqs = [];
  doc.querySelectorAll('.accordion-faq').forEach((block) => {
    const items = block.querySelectorAll('.accordion-faq-item');
    if (items.length) {
      items.forEach((item) => {
        const q = clean(item.querySelector('summary')?.textContent);
        const a = clean(item.querySelector('.accordion-faq-item-body')?.textContent);
        if (q && a) faqs.push({ q, a });
      });
    } else {
      // undecorated shape: direct child rows of two cells
      [...block.children].forEach((row) => {
        const cells = row.children;
        if (cells.length >= 2) {
          const q = clean(cells[0].textContent);
          const a = clean(cells[1].textContent);
          if (q && a) faqs.push({ q, a });
        }
      });
    }
  });
  return faqs;
}

/** Append a JSON-LD script tag to <head>. */
function addJsonLd(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Build and inject the page's AI-agent JSON-LD.
 * Safe to call once per page after the FAQ block exists in the DOM.
 * @param {Document} [doc=document]
 */
export default function injectAgentMetadata(doc = document) {
  // Summary → schema.org Article-style description (authors set `summary` meta,
  // falling back to the standard `description`).
  const summary = clean(getMetadata('summary', doc) || getMetadata('description', doc));
  if (summary) {
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: clean(doc.title),
      description: summary,
      url: window.location.href,
      inLanguage: doc.documentElement.lang || 'en',
    });
  }

  // FAQ → schema.org FAQPage, reusing the existing on-page FAQ block.
  const faqs = extractFaqs(doc);
  if (faqs.length) {
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    });
  }
}
