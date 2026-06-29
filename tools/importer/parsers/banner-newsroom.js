/* eslint-disable */
/* global WebImporter */
/**
 * Parser for banner-newsroom. Base block: banner-newsroom.
 * Source: https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-begins-shipment-of-industry-first-hbm4e-samples/
 * Instance selector: .AR02_article-detail-semiconstory-banner
 *
 * Block contract (see blocks/banner-newsroom/banner-newsroom.js):
 *   row 1: heading + supporting paragraph (text cell)
 *   row 2: the CTA link (outbound to the newsroom)
 *
 * Source notes:
 *   heading     -> .AR02_article-detail-semiconstory-banner-title
 *   description -> .AR02_article-detail-semiconstory-banner-description
 *   cta         -> a.AR02_article-detail-semiconstory-banner-cta
 *                  -> https://news.samsungsemiconductor.com/
 */
export default function parse(element, { document }) {
  const titleEl = element.querySelector('.AR02_article-detail-semiconstory-banner-title');
  const descEl = element.querySelector('.AR02_article-detail-semiconstory-banner-description');
  const ctaEl = element.querySelector(
    'a.AR02_article-detail-semiconstory-banner-cta, a[href]',
  );

  const titleText = titleEl ? titleEl.textContent.trim() : '';
  const descText = descEl ? descEl.textContent.trim() : '';

  // Empty-block guard.
  if (!titleText && !descText && !ctaEl) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: heading + supporting paragraph in a single text cell.
  const textCell = [];
  if (titleText) {
    const h = document.createElement('h2');
    h.textContent = titleText;
    textCell.push(h);
  }
  if (descText) {
    const p = document.createElement('p');
    p.textContent = descText;
    textCell.push(p);
  }
  cells.push([textCell.length ? textCell : '']);

  // Row 2: CTA link (preserve href + label).
  if (ctaEl && ctaEl.getAttribute('href')) {
    const a = document.createElement('a');
    a.setAttribute('href', ctaEl.getAttribute('href'));
    a.textContent = ctaEl.textContent.trim() || ctaEl.getAttribute('href');
    const p = document.createElement('p');
    p.appendChild(a);
    cells.push([p]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'banner-newsroom', cells });
  element.replaceWith(block);
}
