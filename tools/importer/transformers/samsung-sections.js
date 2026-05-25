/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Samsung UK section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Sections with style:
 *   - section-1 (.pd-g-feature-benefit-full-bleed:first-of-type): style="dark"
 *   - section-13 (.pd-g-feature-benefit-full-bleed:nth-of-type(17)): style="grey"
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Process sections in reverse order to avoid DOM position shifts
  // affecting subsequent selector matches
  const reversedSections = [...sections].reverse();

  reversedSections.forEach((section, reverseIdx) => {
    const originalIdx = sections.length - 1 - reverseIdx;

    // Find the first element for this section using its selector(s)
    let sectionEl = null;
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }

    if (!sectionEl) return;

    // Add Section Metadata block if section has a style
    if (section.style) {
      // For sections with array selectors, find the last element to place metadata after
      let lastSectionEl = sectionEl;
      if (Array.isArray(section.selector) && section.selector.length > 1) {
        for (let i = section.selector.length - 1; i >= 0; i--) {
          const el = element.querySelector(section.selector[i]);
          if (el) {
            lastSectionEl = el;
            break;
          }
        }
      }

      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      lastSectionEl.after(metadataBlock);
    }

    // Insert <hr> before section if it's not the first section
    // and there is content before it
    if (originalIdx > 0) {
      const hr = doc.createElement('hr');
      sectionEl.before(hr);
    }
  });
}
