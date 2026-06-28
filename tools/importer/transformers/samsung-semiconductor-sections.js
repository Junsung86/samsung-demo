/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Samsung Semiconductor section breaks + section metadata.
 *
 * Driven by payload.template.sections (page-templates.json). For each section
 * (processed in reverse document order so earlier inserts don't shift later
 * targets):
 *   - if section.style is set, append a "Section Metadata" block after the
 *     section's top-level element
 *   - if the section is not the first and has content before it, insert an
 *     <hr> section break before the section's top-level element
 *
 * Section selectors come from the template (verified against cleaned.html:
 * .st-semi-* and .cm-semi-* grid-column classes on the page content sections).
 * Runs in afterTransform only.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve each section's anchor element in document order. Selectors are
  // POST-PARSE (block class or surviving default-content wrapper); duplicate
  // selectors (.columns-spec ×3, .cards-content ×2) are disambiguated by
  // consuming matches in order via a per-selector occurrence counter.
  const selectorCounters = {};
  const anchors = sections.map((section) => {
    if (!section || !section.selector) return null;
    const matches = element.querySelectorAll(section.selector);
    const idx = selectorCounters[section.selector] || 0;
    selectorCounters[section.selector] = idx + 1;
    return matches[idx] || null;
  });

  // Reverse order: inserting before/after a later section first keeps the
  // positions of earlier anchors valid.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const anchor = anchors[i];
    if (!anchor) continue;

    // Section Metadata block (only when a style is defined). Inserted at the
    // anchor's own sibling level so it sits with the section's content.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metaBlock);
    }

    // Section break before every non-first section that has content before it.
    if (i > 0 && anchor.previousElementSibling) {
      anchor.before(doc.createElement('hr'));
    }
  }
}
