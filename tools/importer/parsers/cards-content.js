/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-content. Base block: cards.
 * Source: https://semiconductor.samsung.com/kr/dram/hbm/
 * Instances:
 *   - Applications grid (.st-semi-4-column): cards = image + title + description, wrapped in a link.
 *   - Related content grid (.cm-semi-related-content-all): cards = image + category + title + hashtag links.
 * Block library structure (2 columns):
 *   row1 = block name
 *   each subsequent row = [image cell, text cell (title / description / CTA / links)]
 * Source notes:
 *   - Applications item `.CO08_4-column__card-item`: `figure picture img`; link
 *     `a.CO08_4-column__card-item-desc-box` holds `strong` title + `p` text.
 *   - Related item `.CO31_related-content-grid-item`: `.CO31_related-content-grid-thum img`;
 *     anchor wraps eyebrow `.CO31_related-content-grid-eyebrow` + title
 *     `.CO31_related-content-grid-title`; hashtag links in `.CO31_related-content-grid-tags a`.
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Applications cards (.st-semi-4-column) ---
  const appItems = Array.from(element.querySelectorAll('.CO08_4-column__card-item'));
  appItems.forEach((item) => {
    const image = item.querySelector('figure picture img, figure img, img');
    const link = item.querySelector('a.CO08_4-column__card-item-desc-box, a[href]');
    const titleEl = item.querySelector('.CO08_4-column__card-item-desc-title');
    const textEl = item.querySelector('.CO08_4-column__card-item-desc-text');

    const textCell = [];
    if (titleEl && titleEl.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = titleEl.textContent.trim();
      textCell.push(h);
    }
    if (textEl && textEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = textEl.textContent.trim();
      textCell.push(p);
    }
    // Turn the card link into an explicit CTA link.
    if (link && link.getAttribute('href')) {
      const cta = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = (titleEl && titleEl.textContent.trim()) || link.textContent.trim() || '더 알아보기';
      cta.appendChild(a);
      textCell.push(cta);
    }

    if (image || textCell.length) {
      cells.push([image || '', textCell.length ? textCell : '']);
    }
  });

  // --- Related content cards (.cm-semi-related-content-all) ---
  const relItems = Array.from(element.querySelectorAll('.CO31_related-content-grid-item'));
  relItems.forEach((item) => {
    const image = item.querySelector('.CO31_related-content-grid-thum img, img');
    const mainLink = item.querySelector('.CO31_related-content-grid-desc a[href]');
    const eyebrow = item.querySelector('.CO31_related-content-grid-eyebrow');
    const titleEl = item.querySelector('.CO31_related-content-grid-title');
    const tagLinks = Array.from(item.querySelectorAll('.CO31_related-content-grid-tags a[href]'));

    const textCell = [];
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textCell.push(p);
    }
    // Title as a linked heading (links to the article).
    if (titleEl && titleEl.textContent.trim()) {
      const h = document.createElement('h3');
      if (mainLink && mainLink.getAttribute('href')) {
        const a = document.createElement('a');
        a.setAttribute('href', mainLink.getAttribute('href'));
        a.textContent = titleEl.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = titleEl.textContent.trim();
      }
      textCell.push(h);
    }
    // Hashtag links.
    if (tagLinks.length) {
      const tagsP = document.createElement('p');
      tagLinks.forEach((t, idx) => {
        const a = document.createElement('a');
        a.setAttribute('href', t.getAttribute('href'));
        a.textContent = t.textContent.trim();
        tagsP.appendChild(a);
        if (idx < tagLinks.length - 1) tagsP.appendChild(document.createTextNode(' '));
      });
      textCell.push(tagsP);
    }

    if (image || textCell.length) {
      cells.push([image || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-content', cells });

  // Preserve the section heading ("HBM 응용처" / "관련 컨텐츠") as default content
  // before the cards block. The source renders it outside the card grid, so it
  // would otherwise be dropped when the block replaces `element`. Emitting it as
  // a sibling <h2> keeps the heading AND gives the section-break <hr> a text
  // anchor (html2md drops an <hr> wedged directly between two block tables).
  const headingEl = element.querySelector(
    '.CO08_4-column__headline, .CO31_related-content_headline',
  );
  const headingText = headingEl ? headingEl.textContent.trim() : '';

  const frag = document.createDocumentFragment();
  if (headingText) {
    const h = document.createElement('h2');
    h.textContent = headingText;
    frag.appendChild(h);
  }
  frag.appendChild(block);
  element.replaceWith(frag);
}
