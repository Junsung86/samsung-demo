/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product
 * Base block: carousel
 * Source: https://www.samsung.com/uk/tvs/smart-tv/highlights/
 * Selector: .pd-g-lineup-compare section.lineup-compare
 * Generated: 2026-05-25
 *
 * Extracts product carousel slides from Samsung lineup-compare component.
 * Each slide has: product image, product title, description, screen sizes, and CTA link.
 * Target structure: one row per slide with [image | title + description + CTA].
 */
export default function parse(element, { document }) {
  // Find all slide items in the swiper wrapper
  const slides = Array.from(element.querySelectorAll('.lineup-compare__data-item'));

  const cells = [];

  slides.forEach((slide) => {
    // Extract product image (use .image__main for the full-quality image, fallback to any img in product-image)
    const productImage = slide.querySelector('.lineup-compare__product-image .image__main')
      || slide.querySelector('.lineup-compare__product-image img');

    // Extract product name/title from the name link
    const nameLink = slide.querySelector('.lineup-compare__product-name-link');

    // Extract overview description (first spec item text)
    const specItems = Array.from(slide.querySelectorAll('.lineup-compare__spec-item'));
    const overviewText = specItems.length > 0
      ? specItems[0].querySelector('.lineup-compare__spec-text')
      : null;

    // Extract screen size info (second spec item text)
    const screenSizeText = specItems.length > 1
      ? specItems[1].querySelector('.lineup-compare__spec-text')
      : null;

    // Extract CTA link
    const ctaLink = slide.querySelector('.lineup-compare__data-cta a.cta')
      || slide.querySelector('.lineup-compare__data-cta a');

    // Build image cell
    const imageCell = [];
    if (productImage) {
      imageCell.push(productImage);
    }

    // Build text cell: title (bold), description, screen sizes, CTA
    const textCell = [];

    if (nameLink) {
      // Create a bold element for the title
      const strong = document.createElement('strong');
      strong.textContent = nameLink.textContent.trim();
      textCell.push(strong);
    }

    if (overviewText) {
      const desc = document.createElement('p');
      desc.textContent = overviewText.textContent.trim();
      textCell.push(desc);
    }

    if (screenSizeText) {
      const sizes = document.createElement('p');
      sizes.textContent = `Screen sizes: ${screenSizeText.textContent.trim()}`;
      textCell.push(sizes);
    }

    if (ctaLink) {
      // Clone the CTA link to preserve href and text
      const link = document.createElement('a');
      link.href = ctaLink.href || ctaLink.getAttribute('href');
      link.textContent = ctaLink.textContent.trim();
      textCell.push(link);
    }

    // Each row is a slide: [image cell, text cell]
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
