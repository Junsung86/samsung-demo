/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import articleHeaderParser from './parsers/article-header.js';
import articleImageParser from './parsers/article-image.js';
import tagsHashtagParser from './parsers/tags-hashtag.js';
import bannerNewsroomParser from './parsers/banner-newsroom.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/samsung-semiconductor-cleanup.js';
import sectionsTransformer from './transformers/samsung-semiconductor-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'news-article',
  description: 'Samsung Semiconductor news article page: eyebrow category, title, publish date, social-share buttons, rich-text body with inline images and captions, hashtags, newsroom CTA banner, and a related-content grid of article cards.',
  urls: [
    'https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-begins-shipment-of-industry-first-hbm4e-samples/',
  ],
  blocks: [
    {
      name: 'article-header',
      instances: ['section.AR02_article-header__header'],
    },
    {
      name: 'article-image',
      instances: ['.st-semi-article-detail_image-desktop:has(.st-semi-article-detail_image-caption)'],
    },
    {
      name: 'tags-hashtag',
      instances: ['.AR02_article-detail-tag'],
    },
    {
      name: 'banner-newsroom',
      instances: ['.AR02_article-detail-semiconstory-banner'],
    },
    {
      name: 'cards-news',
      instances: ['.ar-semi-related-content'],
    },
  ],
  // Section selectors are POST-PARSE and POST-FLATTEN: after the cleanup
  // transformer hoists the article content up to main, each section anchor is a
  // top-level sibling. Block sections match their resulting block class; the
  // article body matches its surviving rich-text wrapper. style is null except
  // the newsroom banner ("accent"); this project's aem.js does not process
  // Section Metadata blocks, so backgrounds are handled in CSS during design.
  // The sections transformer still inserts <hr> section breaks at these anchors.
  sections: [
    { id: 's1', name: 'Article Header', selector: '.article-header', style: null, blocks: ['article-header'], defaultContent: [] },
    { id: 's2', name: 'Article Body', selector: '.AR02_article-detail', style: null, blocks: ['article-image'], defaultContent: ['.AR02_article-detail'] },
    { id: 's3', name: 'Hashtags', selector: '.tags-hashtag', style: null, blocks: ['tags-hashtag'], defaultContent: [] },
    { id: 's4', name: 'Newsroom CTA Banner', selector: '.banner-newsroom', style: null, blocks: ['banner-newsroom'], defaultContent: [] },
    { id: 's5', name: 'Related Content', selector: '.cards-news', style: null, blocks: ['cards-news'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'article-header': articleHeaderParser,
  'article-image': articleImageParser,
  'tags-hashtag': tagsHashtagParser,
  'banner-newsroom': bannerNewsroomParser,
  'cards-news': cardsNewsParser,
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '').replace(/^\/(us|kr)\b/, '/en'),
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
