/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-spec. Base block: columns.
 * Source: https://semiconductor.samsung.com/kr/dram/hbm/ (.st-semi-feature-spec)
 * Used by HBM4 / HBM3E / HBM3 feature-spec sections.
 * Block library structure (2 columns):
 *   row1 = block name
 *   row2 = two cells: [text column (heading + description + spec list + CTA), product image]
 * Source notes:
 *   - Title `.CO56_Feature-spec-title` (h2) with duplicated .pc-only/.ta-only/.mo-only spans.
 *   - Description `.CO56_Feature-spec-description`.
 *   - Product image `.CO56_Feature-spec-image-wrap picture img`.
 *   - Spec items `.CO56_Feature-spec-item`: icon img + h4 `.CO56_Feature-spec-name` + p `.CO56_Feature-spec-desc`.
 *   - CTA `.CO56_Feature-spec-button-wrap a`.
 *   - Image position varies visually per section (left for HBM3E); EDS columns variant
 *     handles layout, so text is always cell1 and product image is always cell2.
 */
export default function parse(element, { document }) {
  // --- Heading (dedupe responsive copies) ---
  const titleEl = element.querySelector('.CO56_Feature-spec-title, h2');
  let heading = null;
  if (titleEl) {
    const copy = titleEl.querySelector('.pc-only, .ta-only, .mo-only');
    heading = document.createElement('h2');
    heading.textContent = (copy ? copy.textContent : titleEl.textContent).trim();
  }

  // --- Description ---
  const descEl = element.querySelector('.CO56_Feature-spec-description');
  let description = null;
  if (descEl && descEl.textContent.trim()) {
    description = document.createElement('p');
    description.textContent = descEl.textContent.trim();
  }

  // --- Product image (column 2) ---
  const productImage = element.querySelector('.CO56_Feature-spec-image-wrap picture img, .CO56_Feature-spec-image-wrap img');

  // --- Spec list: icon + label + value per item ---
  const items = Array.from(element.querySelectorAll('.CO56_Feature-spec-item'));
  let specList = null;
  if (items.length) {
    specList = document.createElement('ul');
    items.forEach((item) => {
      const icon = item.querySelector('.CO56_Feature-spec-image-area img, img');
      const name = item.querySelector('.CO56_Feature-spec-name');
      const value = item.querySelector('.CO56_Feature-spec-desc');
      const li = document.createElement('li');
      if (icon) li.appendChild(icon);
      if (name && name.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = name.textContent.trim();
        li.appendChild(strong);
        li.appendChild(document.createTextNode(': '));
      }
      if (value && value.textContent.trim()) {
        li.appendChild(document.createTextNode(value.textContent.trim()));
      }
      specList.appendChild(li);
    });
  }

  // --- CTA ---
  const cta = element.querySelector('.CO56_Feature-spec-button-wrap a[href], a.ui-btn[href]');

  // Empty-block guard
  if (!heading && !description && !specList && !productImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Column 1: text column content (heading + description + spec list + CTA)
  const textCell = [];
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  if (specList) textCell.push(specList);
  if (cta) textCell.push(cta);

  // Column 2: product image (pad with empty string if missing to keep 2 columns)
  const imageCell = productImage || '';

  const cells = [
    [textCell, imageCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-spec', cells });
  element.replaceWith(block);
}
