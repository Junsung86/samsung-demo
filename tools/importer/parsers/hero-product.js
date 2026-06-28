/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-product. Base block: hero.
 * Source: https://semiconductor.samsung.com/kr/dram/hbm/ (.st-semi-hero-carousel)
 * Block library structure (1 column, 3 rows):
 *   row1 = block name
 *   row2 = background image (optional)
 *   row3 = title (Heading) + optional subheading + optional CTA
 * Source notes: single hero slide inside a carousel. The slide title lives in
 *   `.CO06_hero-carousel-text h1.title` and is duplicated across responsive
 *   `.pc`/`.ta`/`.mo` child divs — extract one variant only. The background image
 *   is a `figure > picture > img.cover`. No subheading/CTA in current source.
 */
export default function parse(element, { document }) {
  // Scope to the first hero slide (avoid carousel duplicates / loop clones).
  const slide = element.querySelector('.CO06_hero-carousel-swiper-slide, .swiper-slide')
    || element;

  // --- Background image (row 2) ---
  const bgImage = slide.querySelector('figure picture img, picture img.cover, img.cover, picture img, img');

  // --- Title (row 3) ---
  // The h1 holds duplicated responsive copies (.pc/.ta/.mo). Build a clean
  // heading using the text of the first available copy.
  const titleEl = slide.querySelector('h1.title, h1, h2.title, .CO06_hero-carousel-text h1, .CO06_hero-carousel-text h2');
  let heading = null;
  if (titleEl) {
    const responsiveCopy = titleEl.querySelector('.pc, .ta, .mo');
    heading = document.createElement(titleEl.tagName.toLowerCase().startsWith('h') ? titleEl.tagName.toLowerCase() : 'h1');
    if (responsiveCopy) {
      // Preserve inline markup (e.g. <br>) from the chosen responsive copy.
      heading.innerHTML = responsiveCopy.innerHTML.trim();
    } else {
      heading.innerHTML = titleEl.innerHTML.trim();
    }
  }

  // --- Optional subheading ---
  const subEl = slide.querySelector('.desc, .CO06_hero-carousel-text .desc, .subtitle, [class*="subheadline"]');
  const subheading = subEl && subEl.textContent.trim() ? subEl : null;

  // --- Optional CTA(s) ---
  const ctaLinks = Array.from(
    slide.querySelectorAll('.CO06_hero-carousel-text a, a.button, a.cta'),
  ).filter((a) => a.textContent.trim());

  // Empty-block guard: nothing meaningful to render.
  if (!heading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional)
  if (bgImage) cells.push([bgImage]);

  // Row 3: title + optional subheading + optional CTA(s) — single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
