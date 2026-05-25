/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-smart-tv-highlights.js
  var import_smart_tv_highlights_exports = {};
  __export(import_smart_tv_highlights_exports, {
    default: () => import_smart_tv_highlights_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document }) {
    const image = element.querySelector("img.image__main, img.responsive-img, .st-feature-benefit-full-bleed__figure img");
    const heading = element.querySelector("h2.st-feature-benefit-full-bleed__title, h1.st-feature-benefit-full-bleed__title, .st-feature-benefit-full-bleed__title, h1, h2");
    const description = element.querySelector(".st-feature-benefit-full-bleed__sub-title, .st-feature-benefit-full-bleed__description, p.st-feature-benefit-full-bleed__text");
    const ctaLinks = Array.from(element.querySelectorAll('.st-feature-benefit-full-bleed__cta a, .st-feature-benefit-full-bleed__content-area a.cta, .st-feature-benefit-full-bleed__content-area a[class*="btn"]'));
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (description) {
      contentCell.push(description);
    }
    if (ctaLinks.length > 0) {
      contentCell.push(...ctaLinks);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse2(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".lineup-compare__data-item"));
    const cells = [];
    slides.forEach((slide) => {
      const productImage = slide.querySelector(".lineup-compare__product-image .image__main") || slide.querySelector(".lineup-compare__product-image img");
      const nameLink = slide.querySelector(".lineup-compare__product-name-link");
      const specItems = Array.from(slide.querySelectorAll(".lineup-compare__spec-item"));
      const overviewText = specItems.length > 0 ? specItems[0].querySelector(".lineup-compare__spec-text") : null;
      const screenSizeText = specItems.length > 1 ? specItems[1].querySelector(".lineup-compare__spec-text") : null;
      const ctaLink = slide.querySelector(".lineup-compare__data-cta a.cta") || slide.querySelector(".lineup-compare__data-cta a");
      const imageCell = [];
      if (productImage) {
        imageCell.push(productImage);
      }
      const textCell = [];
      if (nameLink) {
        const strong = document.createElement("strong");
        strong.textContent = nameLink.textContent.trim();
        textCell.push(strong);
      }
      if (overviewText) {
        const desc = document.createElement("p");
        desc.textContent = overviewText.textContent.trim();
        textCell.push(desc);
      }
      if (screenSizeText) {
        const sizes = document.createElement("p");
        sizes.textContent = `Screen sizes: ${screenSizeText.textContent.trim()}`;
        textCell.push(sizes);
      }
      if (ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.href || ctaLink.getAttribute("href");
        link.textContent = ctaLink.textContent.trim();
        textCell.push(link);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/samsung-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".nv00-gnb-v4__layer-popup-wrap"]);
      WebImporter.DOMUtils.remove(element, [".pd-g-floating-nav"]);
      WebImporter.DOMUtils.remove(element, [".skip-bar"]);
      WebImporter.DOMUtils.remove(element, [".newpar.new.section"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header#header"]);
      WebImporter.DOMUtils.remove(element, ["nav.nv00-gnb-v4"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer"]);
      WebImporter.DOMUtils.remove(element, [".cod07-bottom-disclaimer-container"]);
      WebImporter.DOMUtils.remove(element, [".pd-get-stock-alert-popup"]);
      WebImporter.DOMUtils.remove(element, ["button.fab"]);
      WebImporter.DOMUtils.remove(element, ['input[type="hidden"]', "input:not([type])"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "iframe", "link"]);
    }
  }

  // tools/importer/transformers/samsung-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument;
    const reversedSections = [...sections].reverse();
    reversedSections.forEach((section, reverseIdx) => {
      const originalIdx = sections.length - 1 - reverseIdx;
      let sectionEl = null;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) return;
      if (section.style) {
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
          name: "Section Metadata",
          cells: { style: section.style }
        });
        lastSectionEl.after(metadataBlock);
      }
      if (originalIdx > 0) {
        const hr = doc.createElement("hr");
        sectionEl.before(hr);
      }
    });
  }

  // tools/importer/transformers/samsung-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-smart-tv-highlights.js
  var parsers = {
    "hero-product": parse,
    "carousel-product": parse2
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "smart-tv-highlights",
    description: "Samsung Smart TV highlights landing page showcasing key smart TV features and capabilities",
    urls: ["https://www.samsung.com/uk/tvs/smart-tv/highlights/"],
    blocks: [
      {
        name: "hero-product",
        instances: [".pd-g-feature-benefit-full-bleed:first-of-type section.st-feature-benefit-full-bleed"]
      },
      {
        name: "carousel-product",
        instances: [".pd-g-lineup-compare section.lineup-compare"]
      }
    ],
    sections: [
      { id: "section-1", name: "Hero / Key Visual", selector: ".pd-g-feature-benefit-full-bleed:first-of-type", style: "dark", blocks: ["hero-product"], defaultContent: [] },
      { id: "section-2", name: "Manifesto / Introduction", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(2)", style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__sub-title"] },
      { id: "section-3", name: "All Your Entertainment", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(3)", style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title"] },
      { id: "section-4", name: "Samsung Tizen OS", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(4)", style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta"] },
      { id: "section-5", name: "Free Channels", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(5)", style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title"] },
      { id: "section-6", name: "Endless Free Content", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(6)", style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta"] },
      { id: "section-7", name: "Entertainment for Every Day", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(7)", style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title"] },
      { id: "section-8", name: "Samsung TV Plus Detail", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(8)", style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta"] },
      { id: "section-9", name: "Smart Home", selector: [".pd-g-feature-benefit-full-bleed:nth-of-type(9)", ".pd-g-feature-benefit-full-bleed:nth-of-type(10)"], style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta"] },
      { id: "section-10", name: "Connect Phone", selector: [".pd-g-feature-benefit-full-bleed:nth-of-type(11)", ".pd-g-feature-benefit-full-bleed:nth-of-type(12)"], style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta"] },
      { id: "section-11", name: "Apple TV and AirPlay", selector: [".pd-g-feature-benefit-full-bleed:nth-of-type(13)", ".pd-g-feature-benefit-full-bleed:nth-of-type(14)"], style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta"] },
      { id: "section-12", name: "SolarCell Remote", selector: [".pd-g-feature-benefit-full-bleed:nth-of-type(15)", ".pd-g-feature-benefit-full-bleed:nth-of-type(16)"], style: null, blocks: [], defaultContent: [".st-feature-benefit-full-bleed__figure img", ".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta"] },
      { id: "section-13", name: "Help Me Choose", selector: ".pd-g-feature-benefit-full-bleed:nth-of-type(17)", style: "grey", blocks: [], defaultContent: [".st-feature-benefit-full-bleed__title", ".st-feature-benefit-full-bleed__sub-title", ".st-feature-benefit-full-bleed__cta", ".st-feature-benefit-full-bleed__figure img"] },
      { id: "section-14", name: "Explore Smart TVs", selector: [".pd-g-feature-benefit", ".pd-g-lineup-compare"], style: null, blocks: ["carousel-product"], defaultContent: [".st-feature-benefit__title"] },
      { id: "section-15", name: "Discover More Navigation", selector: ".st-feature-benefit-full-bleed:last-of-type", style: null, blocks: [], defaultContent: ["h2", "ul li a"] },
      { id: "section-16", name: "Samsung Account", selector: ".pd-g-feature-benefit-full-bleed:last-of-type", style: null, blocks: [], defaultContent: ["h2", "p", "img"] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_smart_tv_highlights_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_smart_tv_highlights_exports);
})();
