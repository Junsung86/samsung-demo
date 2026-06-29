/* eslint-disable */
/* global WebImporter */
/**
 * Parser for article-image. Base block: article-image.
 * Source: https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-begins-shipment-of-industry-first-hbm4e-samples/
 * Instance selector: .st-semi-article-detail_image-desktop:has(.st-semi-article-detail_image-caption)
 *
 * Block contract (see blocks/article-image/article-image.js):
 *   row 1: the image
 *   row 2: the caption text
 *
 * Source notes:
 *   image   -> img (direct child of the image-desktop wrapper)
 *   caption -> .st-semi-article-detail_image-caption
 */
export default function parse(element, { document }) {
  const img = element.querySelector('img');
  const captionEl = element.querySelector('.st-semi-article-detail_image-caption');
  const captionText = captionEl ? captionEl.textContent.trim() : '';

  // Empty-block guard: nothing to render without an image.
  if (!img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: image (reference the element so src/alt are preserved).
  cells.push([img]);

  // Row 2: caption text.
  const cap = document.createElement('p');
  cap.textContent = captionText;
  cells.push([cap]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-image', cells });
  element.replaceWith(block);
}
