/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base block: cards (news variant).
 * Source: https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-begins-shipment-of-industry-first-hbm4e-samples/
 * Instance selector: .ar-semi-related-content
 *
 * Block library convention (Cards, 2 columns):
 *   row 1 = block name
 *   each subsequent row = [ image cell (mandatory), text cell ]
 *   text cell = title (heading) + below it the publish date (<time>).
 *
 * Block contract (see blocks/cards-news/cards-news.js):
 *   one row per card; cell 1 = thumbnail image; cell 2 = title link + date paragraph.
 *
 * Source notes:
 *   The selector element (.ar-semi-related-content) is an empty AJAX container
 *   on the rendered page. The actual related-article cards are rendered in
 *   `.AR02_related-sticky-contents` (the source duplicates the list across a
 *   desktop and a sticky <ul>, so we read only the FIRST list to avoid dupes).
 *   Per card:
 *     thumbnail -> .AR02_related-sticky-contents--item-thum img
 *     title     -> a.AR02_related-sticky-contents--item-title (href + text)
 *     date      -> .AR02_related-sticky-contents--item-time time
 *
 * The "관련 컨텐츠" heading is default content: emit it as a sibling <h2> before
 * the block (same pattern as cards-content) so the section-break <hr> has a
 * text anchor and the heading is preserved.
 */
export default function parse(element, { document }) {
  const sticky = document.querySelector('.AR02_related-sticky-contents');
  const list = sticky
    ? sticky.querySelector('.AR02_related-sticky-contents--list')
    : null;

  // Fallback: if the sticky list isn't present, try cards inside the element.
  const scope = list || element;
  const items = Array.from(
    scope.querySelectorAll('.AR02_related-sticky-contents--item'),
  );

  const cells = [];
  items.forEach((item) => {
    const image = item.querySelector(
      '.AR02_related-sticky-contents--item-thum img, img',
    );
    const titleLink = item.querySelector(
      'a.AR02_related-sticky-contents--item-title, .AR02_related-sticky-contents--item-info a[href]',
    );
    const timeEl = item.querySelector(
      '.AR02_related-sticky-contents--item-time time, time',
    );

    const textCell = [];
    if (titleLink && titleLink.getAttribute('href')) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.setAttribute('href', titleLink.getAttribute('href'));
      a.textContent = titleLink.textContent.trim();
      h.appendChild(a);
      textCell.push(h);
    }
    if (timeEl && timeEl.textContent.trim()) {
      const time = document.createElement('time');
      time.textContent = timeEl.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(time);
      textCell.push(p);
    }

    if (image || textCell.length) {
      cells.push([image || '', textCell.length ? textCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });

  // Preserve the section heading ("관련 컨텐츠") as default content before the
  // cards block. The source renders it outside the card grid, so emit it as a
  // sibling <h2> — this keeps the heading AND gives the section-break <hr> a
  // text anchor (html2md drops an <hr> wedged directly between two block tables).
  // The related section's visible heading on the source is "관련 컨텐츠". The
  // sticky widget exposes only an English "Related contents" title, and the
  // matched element contains an unrelated "관련 뉴스" heading, so neither is a
  // reliable source — emit the verified visible heading directly.
  const headingText = '관련 컨텐츠';

  const frag = document.createDocumentFragment();
  if (headingText) {
    const h = document.createElement('h2');
    h.textContent = headingText;
    frag.appendChild(h);
  }
  frag.appendChild(block);
  element.replaceWith(frag);
}
