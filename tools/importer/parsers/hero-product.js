/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product
 * Base block: hero
 * Source: https://www.samsung.com/uk/tvs/smart-tv/highlights/
 * Generated: 2026-05-25
 *
 * Extracts a hero banner with background image, heading, optional description,
 * and optional CTA from Samsung feature-benefit-full-bleed sections.
 */
export default function parse(element, { document }) {
  // Extract background/hero image - use the main (high-res) image, fallback to any img
  const image = element.querySelector('img.image__main, img.responsive-img, .st-feature-benefit-full-bleed__figure img');

  // Extract heading - h2 with specific class, fallback to any heading
  const heading = element.querySelector('h2.st-feature-benefit-full-bleed__title, h1.st-feature-benefit-full-bleed__title, .st-feature-benefit-full-bleed__title, h1, h2');

  // Extract description/subtitle (optional in this instance)
  const description = element.querySelector('.st-feature-benefit-full-bleed__sub-title, .st-feature-benefit-full-bleed__description, p.st-feature-benefit-full-bleed__text');

  // Extract CTA links (optional in this instance)
  const ctaLinks = Array.from(element.querySelectorAll('.st-feature-benefit-full-bleed__cta a, .st-feature-benefit-full-bleed__content-area a.cta, .st-feature-benefit-full-bleed__content-area a[class*="btn"]'));

  // Build cells array matching the block library structure:
  // Row 1: image, Row 2: heading, Row 3: description (optional), Row 4: CTA (optional)
  const cells = [];

  // Row 1: Background image
  if (image) {
    cells.push([image]);
  }

  // Row 2: Heading (content cell with heading, optional description, optional CTAs)
  const contentCell = [];
  if (heading) {
    contentCell.push(heading);
  }
  if (description) {
    contentCell.push(description);
  }
  if (ctaLinks.length > 0) {
    contentCell.push(...ctaLinks);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
