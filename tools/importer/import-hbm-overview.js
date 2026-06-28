/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductParser from './parsers/hero-product.js';
import columnsSpecParser from './parsers/columns-spec.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsContentParser from './parsers/cards-content.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/samsung-semiconductor-cleanup.js';
import sectionsTransformer from './transformers/samsung-semiconductor-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'hbm-overview',
  description: 'Samsung HBM product overview page: hero, intro text, three feature-spec product sections (HBM4/HBM3E/HBM3), FAQ accordion, applications cards, related content, disclaimer.',
  urls: [
    'https://semiconductor.samsung.com/kr/dram/hbm/',
  ],
  blocks: [
    {
      name: 'hero-product',
      instances: ['.st-semi-hero-carousel'],
    },
    {
      name: 'columns-spec',
      instances: ['.st-semi-feature-spec'],
    },
    {
      name: 'accordion-faq',
      instances: ['.st-semi-accordion-list'],
    },
    {
      name: 'cards-content',
      instances: ['.st-semi-4-column', '.cm-semi-related-content-all'],
    },
  ],
  // Section selectors are POST-PARSE and POST-FLATTEN: after the cleanup
  // transformer hoists the AEM grid's children up to main, each section's
  // anchor is a top-level sibling. Block sections match their resulting block
  // class; default-content sections match the surviving .st-semi-text-block
  // wrapper. Repeated selectors are resolved by occurrence order (in document
  // order) by the sections transformer:
  //   .st-semi-text-block : occ0 intro, occ1 FAQs heading, occ2 disclaimer
  //   .columns-spec       : occ0 HBM4, occ1 HBM3E, occ2 HBM3
  //   .cards-content      : occ0 applications, occ1 related
  // The FAQ section anchors to the "FAQs" heading text-block so the <hr> lands
  // before the heading and the accordion stays grouped in the same section.
  // style is null for all sections: this project's scripts/aem.js does not
  // process "Section Metadata" blocks (it would try to load section-metadata as
  // a block and 404). Section background styling is handled in the design phase
  // via CSS, not Section Metadata. The sections transformer still inserts <hr>
  // section breaks based on these anchors.
  sections: [
    { id: 's1', name: 'Hero', selector: '.hero-product', style: null, blocks: ['hero-product'], defaultContent: [] },
    { id: 's2', name: 'Intro', selector: '.st-semi-text-block', style: null, blocks: [], defaultContent: ['.st-semi-text-block'] },
    { id: 's3', name: 'HBM4 Spec', selector: '.columns-spec', style: null, blocks: ['columns-spec'], defaultContent: [] },
    { id: 's4', name: 'HBM3E Spec', selector: '.columns-spec', style: null, blocks: ['columns-spec'], defaultContent: [] },
    { id: 's5', name: 'HBM3 Spec', selector: '.columns-spec', style: null, blocks: ['columns-spec'], defaultContent: [] },
    { id: 's6', name: 'FAQ', selector: '.st-semi-text-block', style: null, blocks: ['accordion-faq'], defaultContent: ['.st-semi-text-block'] },
    { id: 's7', name: 'Applications', selector: '.cards-content', style: null, blocks: ['cards-content'], defaultContent: [] },
    { id: 's8', name: 'Related Content', selector: '.cards-content', style: null, blocks: ['cards-content'], defaultContent: [] },
    { id: 's9', name: 'Disclaimer', selector: '.st-semi-text-block', style: null, blocks: [], defaultContent: ['.st-semi-text-block'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-product': heroProductParser,
  'columns-spec': columnsSpecParser,
  'accordion-faq': accordionFaqParser,
  'cards-content': cardsContentParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
