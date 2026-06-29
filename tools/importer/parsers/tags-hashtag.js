/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tags-hashtag. Base block: tags-hashtag.
 * Source: https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-begins-shipment-of-industry-first-hbm4e-samples/
 * Instance selector: .AR02_article-detail-tag
 *
 * Block contract (see blocks/tags-hashtag/tags-hashtag.js):
 *   one row per tag, each cell holding the tag label (e.g. "#HBM4E").
 *   The block keeps the label text exactly as authored (it does NOT add the
 *   leading '#'), so the parser preserves the '#' as it appears in source.
 *
 * Source notes:
 *   tags -> button.AR02_article-detail-hashtag (text includes the leading '#')
 */
export default function parse(element, { document }) {
  const tagEls = Array.from(
    element.querySelectorAll('.AR02_article-detail-hashtag'),
  );

  const cells = [];
  tagEls.forEach((tag) => {
    const label = tag.textContent.replace(/\s+/g, ' ').trim();
    if (!label) return;
    const p = document.createElement('p');
    p.textContent = label;
    cells.push([p]);
  });

  // Empty-block guard: no tags -> drop the block.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tags-hashtag', cells });
  element.replaceWith(block);
}
