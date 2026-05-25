/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductParser from './parsers/hero-product.js';
import carouselProductParser from './parsers/carousel-product.js';

// TRANSFORMER IMPORTS
import samsungCleanupTransformer from './transformers/samsung-cleanup.js';
import samsungSectionsTransformer from './transformers/samsung-sections.js';
import samsungDmImagesTransformer from './transformers/samsung-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-product': heroProductParser,
  'carousel-product': carouselProductParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  samsungCleanupTransformer,
  samsungSectionsTransformer,
  samsungDmImagesTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'smart-tv-highlights',
  description: 'Samsung Smart TV highlights landing page showcasing key smart TV features and capabilities',
  urls: ['https://www.samsung.com/uk/tvs/smart-tv/highlights/'],
  blocks: [
    {
      name: 'hero-product',
      instances: ['.pd-g-feature-benefit-full-bleed:first-of-type section.st-feature-benefit-full-bleed'],
    },
    {
      name: 'carousel-product',
      instances: ['.pd-g-lineup-compare section.lineup-compare'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Hero / Key Visual', selector: '.pd-g-feature-benefit-full-bleed:first-of-type', style: 'dark', blocks: ['hero-product'], defaultContent: [] },
    { id: 'section-2', name: 'Manifesto / Introduction', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(2)', style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__sub-title'] },
    { id: 'section-3', name: 'All Your Entertainment', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(3)', style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title'] },
    { id: 'section-4', name: 'Samsung Tizen OS', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(4)', style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta'] },
    { id: 'section-5', name: 'Free Channels', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(5)', style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title'] },
    { id: 'section-6', name: 'Endless Free Content', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(6)', style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta'] },
    { id: 'section-7', name: 'Entertainment for Every Day', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(7)', style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title'] },
    { id: 'section-8', name: 'Samsung TV Plus Detail', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(8)', style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta'] },
    { id: 'section-9', name: 'Smart Home', selector: ['.pd-g-feature-benefit-full-bleed:nth-of-type(9)', '.pd-g-feature-benefit-full-bleed:nth-of-type(10)'], style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta'] },
    { id: 'section-10', name: 'Connect Phone', selector: ['.pd-g-feature-benefit-full-bleed:nth-of-type(11)', '.pd-g-feature-benefit-full-bleed:nth-of-type(12)'], style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta'] },
    { id: 'section-11', name: 'Apple TV and AirPlay', selector: ['.pd-g-feature-benefit-full-bleed:nth-of-type(13)', '.pd-g-feature-benefit-full-bleed:nth-of-type(14)'], style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta'] },
    { id: 'section-12', name: 'SolarCell Remote', selector: ['.pd-g-feature-benefit-full-bleed:nth-of-type(15)', '.pd-g-feature-benefit-full-bleed:nth-of-type(16)'], style: null, blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__figure img', '.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta'] },
    { id: 'section-13', name: 'Help Me Choose', selector: '.pd-g-feature-benefit-full-bleed:nth-of-type(17)', style: 'grey', blocks: [], defaultContent: ['.st-feature-benefit-full-bleed__title', '.st-feature-benefit-full-bleed__sub-title', '.st-feature-benefit-full-bleed__cta', '.st-feature-benefit-full-bleed__figure img'] },
    { id: 'section-14', name: 'Explore Smart TVs', selector: ['.pd-g-feature-benefit', '.pd-g-lineup-compare'], style: null, blocks: ['carousel-product'], defaultContent: ['.st-feature-benefit__title'] },
    { id: 'section-15', name: 'Discover More Navigation', selector: '.st-feature-benefit-full-bleed:last-of-type', style: null, blocks: [], defaultContent: ['h2', 'ul li a'] },
    { id: 'section-16', name: 'Samsung Account', selector: '.pd-g-feature-benefit-full-bleed:last-of-type', style: null, blocks: [], defaultContent: ['h2', 'p', 'img'] },
  ],
};

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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
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

    // 4. Execute afterTransform transformers (section breaks, DM images)
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
