/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://semiconductor.samsung.com/kr/dram/hbm/ (.st-semi-accordion-list)
 * Block library structure (2 columns):
 *   row1 = block name
 *   each subsequent row = [title cell (question), content cell (answer)]
 * Source notes:
 *   - Each item is `.accordion-list`.
 *   - Question: `.accordion-trigger .accordion-title`.
 *   - Answer: inside `.accordion-panel`, the body text lives in
 *     `.CO44_text-block-description` with duplicated .pc-only/.ta-only/.mo-only copies —
 *     use the .pc-only copy to avoid triplicate content.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.accordion-list'));

  const cells = [];

  items.forEach((item) => {
    // --- Title (question) ---
    const titleEl = item.querySelector('.accordion-title, .accordion-trigger .accordion-titlewrap, .accordion-trigger');
    const titleCell = document.createElement('p');
    if (titleEl) titleCell.textContent = titleEl.textContent.trim();

    // --- Content (answer) ---
    const panel = item.querySelector('.accordion-panel');
    const contentCell = [];
    if (panel) {
      // Prefer the pc-only responsive copy of the description to avoid duplicates.
      const descCopies = Array.from(panel.querySelectorAll('.CO44_text-block-description'));
      const pcCopy = descCopies.find((d) => d.classList.contains('pc-only')) || descCopies[0];
      if (pcCopy) {
        Array.from(pcCopy.children).forEach((child) => contentCell.push(child));
        if (!contentCell.length && pcCopy.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = pcCopy.textContent.trim();
          contentCell.push(p);
        }
      } else if (panel.textContent.trim()) {
        // Fallback: capture the panel text directly.
        const p = document.createElement('p');
        p.textContent = panel.textContent.trim();
        contentCell.push(p);
      }
    }

    // Only add a row if there is a question (and ideally an answer).
    if (titleCell.textContent || contentCell.length) {
      cells.push([titleCell, contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard: no accordion items found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
