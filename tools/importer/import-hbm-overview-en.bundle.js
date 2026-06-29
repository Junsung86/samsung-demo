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

  // tools/importer/import-hbm-overview-en.js
  var import_hbm_overview_en_exports = {};
  __export(import_hbm_overview_en_exports, {
    default: () => import_hbm_overview_en_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document }) {
    const slide = element.querySelector(".CO06_hero-carousel-swiper-slide, .swiper-slide") || element;
    const bgImage = slide.querySelector("figure picture img, picture img.cover, img.cover, picture img, img");
    const titleEl = slide.querySelector("h1.title, h1, h2.title, .CO06_hero-carousel-text h1, .CO06_hero-carousel-text h2");
    let heading = null;
    if (titleEl) {
      const responsiveCopy = titleEl.querySelector(".pc, .ta, .mo");
      heading = document.createElement(titleEl.tagName.toLowerCase().startsWith("h") ? titleEl.tagName.toLowerCase() : "h1");
      if (responsiveCopy) {
        heading.innerHTML = responsiveCopy.innerHTML.trim();
      } else {
        heading.innerHTML = titleEl.innerHTML.trim();
      }
    }
    const subEl = slide.querySelector('.desc, .CO06_hero-carousel-text .desc, .subtitle, [class*="subheadline"]');
    const subheading = subEl && subEl.textContent.trim() ? subEl : null;
    const ctaLinks = Array.from(
      slide.querySelectorAll(".CO06_hero-carousel-text a, a.button, a.cta")
    ).filter((a) => a.textContent.trim());
    if (!heading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-spec.js
  function parse2(element, { document }) {
    const titleEl = element.querySelector(".CO56_Feature-spec-title, h2");
    let heading = null;
    if (titleEl) {
      const copy = titleEl.querySelector(".pc-only, .ta-only, .mo-only");
      heading = document.createElement("h2");
      heading.textContent = (copy ? copy.textContent : titleEl.textContent).trim();
    }
    const descEl = element.querySelector(".CO56_Feature-spec-description");
    let description = null;
    if (descEl && descEl.textContent.trim()) {
      description = document.createElement("p");
      description.textContent = descEl.textContent.trim();
    }
    const productImage = element.querySelector(".CO56_Feature-spec-image-wrap picture img, .CO56_Feature-spec-image-wrap img");
    const items = Array.from(element.querySelectorAll(".CO56_Feature-spec-item"));
    let specList = null;
    if (items.length) {
      specList = document.createElement("ul");
      items.forEach((item) => {
        const icon = item.querySelector(".CO56_Feature-spec-image-area img, img");
        const name = item.querySelector(".CO56_Feature-spec-name");
        const value = item.querySelector(".CO56_Feature-spec-desc");
        const li = document.createElement("li");
        if (icon) li.appendChild(icon);
        if (name && name.textContent.trim()) {
          const strong = document.createElement("strong");
          strong.textContent = name.textContent.trim();
          li.appendChild(strong);
          li.appendChild(document.createTextNode(": "));
        }
        if (value && value.textContent.trim()) {
          li.appendChild(document.createTextNode(value.textContent.trim()));
        }
        specList.appendChild(li);
      });
    }
    const cta = element.querySelector(".CO56_Feature-spec-button-wrap a[href], a.ui-btn[href]");
    if (!heading && !description && !specList && !productImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (specList) textCell.push(specList);
    if (cta) textCell.push(cta);
    const imageCell = productImage || "";
    const cells = [
      [textCell, imageCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-spec", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse3(element, { document }) {
    const items = Array.from(element.querySelectorAll(".accordion-list"));
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".accordion-title, .accordion-trigger .accordion-titlewrap, .accordion-trigger");
      const titleCell = document.createElement("p");
      if (titleEl) titleCell.textContent = titleEl.textContent.trim();
      const panel = item.querySelector(".accordion-panel");
      const contentCell = [];
      if (panel) {
        const descCopies = Array.from(panel.querySelectorAll(".CO44_text-block-description"));
        const pcCopy = descCopies.find((d) => d.classList.contains("pc-only")) || descCopies[0];
        if (pcCopy) {
          Array.from(pcCopy.children).forEach((child) => contentCell.push(child));
          if (!contentCell.length && pcCopy.textContent.trim()) {
            const p = document.createElement("p");
            p.textContent = pcCopy.textContent.trim();
            contentCell.push(p);
          }
        } else if (panel.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = panel.textContent.trim();
          contentCell.push(p);
        }
      }
      if (titleCell.textContent || contentCell.length) {
        cells.push([titleCell, contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-content.js
  function parse4(element, { document }) {
    const cells = [];
    const appItems = Array.from(element.querySelectorAll(".CO08_4-column__card-item"));
    appItems.forEach((item) => {
      const image = item.querySelector("figure picture img, figure img, img");
      const link = item.querySelector("a.CO08_4-column__card-item-desc-box, a[href]");
      const titleEl = item.querySelector(".CO08_4-column__card-item-desc-title");
      const textEl = item.querySelector(".CO08_4-column__card-item-desc-text");
      const textCell = [];
      if (titleEl && titleEl.textContent.trim()) {
        const h = document.createElement("h3");
        h.textContent = titleEl.textContent.trim();
        textCell.push(h);
      }
      if (textEl && textEl.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = textEl.textContent.trim();
        textCell.push(p);
      }
      if (link && link.getAttribute("href")) {
        const cta = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = titleEl && titleEl.textContent.trim() || link.textContent.trim() || "\uB354 \uC54C\uC544\uBCF4\uAE30";
        cta.appendChild(a);
        textCell.push(cta);
      }
      if (image || textCell.length) {
        cells.push([image || "", textCell.length ? textCell : ""]);
      }
    });
    const relItems = Array.from(element.querySelectorAll(".CO31_related-content-grid-item"));
    relItems.forEach((item) => {
      const image = item.querySelector(".CO31_related-content-grid-thum img, img");
      const mainLink = item.querySelector(".CO31_related-content-grid-desc a[href]");
      const eyebrow = item.querySelector(".CO31_related-content-grid-eyebrow");
      const titleEl = item.querySelector(".CO31_related-content-grid-title");
      const tagLinks = Array.from(item.querySelectorAll(".CO31_related-content-grid-tags a[href]"));
      const textCell = [];
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textCell.push(p);
      }
      if (titleEl && titleEl.textContent.trim()) {
        const h = document.createElement("h3");
        if (mainLink && mainLink.getAttribute("href")) {
          const a = document.createElement("a");
          a.setAttribute("href", mainLink.getAttribute("href"));
          a.textContent = titleEl.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = titleEl.textContent.trim();
        }
        textCell.push(h);
      }
      if (tagLinks.length) {
        const tagsP = document.createElement("p");
        tagLinks.forEach((t, idx) => {
          const a = document.createElement("a");
          a.setAttribute("href", t.getAttribute("href"));
          a.textContent = t.textContent.trim();
          tagsP.appendChild(a);
          if (idx < tagLinks.length - 1) tagsP.appendChild(document.createTextNode(" "));
        });
        textCell.push(tagsP);
      }
      if (image || textCell.length) {
        cells.push([image || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-content", cells });
    const headingEl = element.querySelector(
      ".CO08_4-column__headline, .CO31_related-content_headline"
    );
    const headingText = headingEl ? headingEl.textContent.trim() : "";
    const frag = document.createDocumentFragment();
    if (headingText) {
      const h = document.createElement("h2");
      h.textContent = headingText;
      frag.appendChild(h);
    }
    frag.appendChild(block);
    element.replaceWith(frag);
  }

  // tools/importer/transformers/samsung-semiconductor-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const richBody = element.querySelector(
        ".st-semi-article-detail_text-cont.rich-text, .AR02_article-detail"
      );
      if (richBody) {
        richBody.querySelectorAll("sup").forEach((sup) => {
          const txt = sup.textContent.trim();
          sup.replaceWith(sup.ownerDocument.createTextNode(txt));
        });
      }
      const relGrid = element.querySelector(".CO31_related-content-grid");
      if (relGrid && relGrid.querySelectorAll(".CO31_related-content-grid-item").length <= 3) {
        const doc = element.ownerDocument;
        const moreCards = [
          {
            href: "/kr/dram/hbm/hbm3e/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/dram/hbm3e/desktop-thumbimage-hbm3e-article.png?$ORIGIN_PNG$",
            alt: "HBM3E | DRAM",
            eyebrow: "DRAM",
            title: "HBM3E | DRAM",
            tags: [["DRAM", "/kr/hashtag/?searchvalue=DRAM"], ["HBM", "/kr/hashtag/?searchvalue=HBM"]]
          },
          {
            href: "/kr/news-events/tech-blog/samsung-highlights-the-importance-of-open-collaboration-in-the-ai-era-with-energy-efficient-data-center-infrastructure-and-memory-solutions/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/ocp-article-4x3.png?$ORIGIN_PNG$",
            alt: "\uC0BC\uC131\uC804\uC790, \uC804\uB825 \uD6A8\uC728\uC744 \uADF9\uB300\uD654\uD55C \uB370\uC774\uD130\uC13C\uD130 \uC778\uD504\uB77C \uBC0F \uBA54\uBAA8\uB9AC \uC194\uB8E8\uC158",
            eyebrow: "\uD14C\uD06C \uBE14\uB85C\uADF8",
            title: "\uC0BC\uC131\uC804\uC790, \uC804\uB825 \uD6A8\uC728\uC744 \uADF9\uB300\uD654\uD55C \uB370\uC774\uD130\uC13C\uD130 \uC778\uD504\uB77C \uBC0F \uBA54\uBAA8\uB9AC \uC194\uB8E8\uC158\uC744 \uD1B5\uD574 AI \uC2DC\uB300\uC758 \uC624\uD508 \uD611\uC5C5 \uC911\uC694\uC131 \uAC15\uC870\uD558\uB2E4",
            tags: [["OCP APAC", "/kr/hashtag/?searchvalue=OCP%20APAC"], ["Datacenter", "/kr/hashtag/?searchvalue=Datacenter"], ["\uC11C\uBC84", "/kr/hashtag/?searchvalue=%EC%84%9C%EB%B2%84"], ["HPC", "/kr/hashtag/?searchvalue=HPC"], ["HBM", "/kr/hashtag/?searchvalue=HBM"], ["HBM3E", "/kr/hashtag/?searchvalue=HBM3E"]]
          },
          {
            href: "/kr/news-events/tech-blog/the-perfect-harmony-created-by-samsung-hbm-powering-the-ai-era/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/hbm3e-4x3-3.png?$ORIGIN_PNG$",
            alt: "[\uC778\uD130\uBDF0] AI \uC2DC\uB300 \uC0BC\uC131\uC804\uC790 HBM\uC774 \uB9CC\uB4E4\uC5B4 \uB0B4\uB294 \uC644\uBCBD\uD55C \uD558\uBAA8\uB2C8",
            eyebrow: "\uD14C\uD06C \uBE14\uB85C\uADF8",
            title: "[\uC778\uD130\uBDF0] AI \uC2DC\uB300 \uC0BC\uC131\uC804\uC790 HBM\uC774 \uB9CC\uB4E4\uC5B4 \uB0B4\uB294 \uC644\uBCBD\uD55C \uD558\uBAA8\uB2C8",
            tags: [["HBM", "/kr/hashtag/?searchvalue=HBM"], ["DRAM", "/kr/hashtag/?searchvalue=DRAM"], ["HBM3E", "/kr/hashtag/?searchvalue=HBM3E"]]
          },
          {
            href: "/kr/news-events/tech-blog/harnessing-the-ai-era-with-breakthrough-memory-solutions/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/th-shaping-future-technologies-4x3@2x.png?$ORIGIN_PNG$",
            alt: "[\uAE30\uACE0\uBB38] AI \uC2DC\uB300, \uCD5C\uC801 \uBA54\uBAA8\uB9AC \uC194\uB8E8\uC158\uC73C\uB85C \uBBF8\uB798 \uAE30\uC220\uC744 \uADF8\uB9AC\uB2E4",
            eyebrow: "\uD14C\uD06C \uBE14\uB85C\uADF8",
            title: "[\uAE30\uACE0\uBB38] AI \uC2DC\uB300, \uCD5C\uC801 \uBA54\uBAA8\uB9AC \uC194\uB8E8\uC158\uC73C\uB85C \uBBF8\uB798 \uAE30\uC220\uC744 \uADF8\uB9AC\uB2E4",
            tags: [["AI", "/kr/hashtag/?searchvalue=AI"], ["\uC624\uD1A0\uBAA8\uD2F0\uBE0C", "/kr/hashtag/?searchvalue=%EC%98%A4%ED%86%A0%EB%AA%A8%ED%8B%B0%EB%B8%8C"], ["CMM", "/kr/hashtag/?searchvalue=CMM"], ["HBM", "/kr/hashtag/?searchvalue=HBM"], ["PIM", "/kr/hashtag/?searchvalue=PIM"]]
          },
          {
            href: "/kr/news-events/tech-blog/shaping-future-technologies-in-23-how-samsung-semiconductor-served-businesses-in-2023/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/th-endofyear-01-newsroom-landing-4x3.png?$ORIGIN_PNG$",
            alt: "2023\uB144 \uC0C8\uB86D\uAC8C \uC5F4\uB9B0 \uAE30\uC220 \uD2B8\uB80C\uB4DC: \uC0BC\uC131\uC804\uC790 \uBC18\uB3C4\uCCB4\uAC00 \uD568\uAED8\uD55C \uD601\uC2E0\uC758 \uC5EC\uC815",
            eyebrow: "\uD14C\uD06C \uBE14\uB85C\uADF8",
            title: "2023\uB144 \uC0C8\uB86D\uAC8C \uC5F4\uB9B0 \uAE30\uC220 \uD2B8\uB80C\uB4DC: \uC0BC\uC131\uC804\uC790 \uBC18\uB3C4\uCCB4\uAC00 \uD568\uAED8\uD55C \uD601\uC2E0\uC758 \uC5EC\uC815",
            tags: [["AI", "/kr/hashtag/?searchvalue=AI"], ["HPC", "/kr/hashtag/?searchvalue=HPC"], ["HBM", "/kr/hashtag/?searchvalue=HBM"], ["CXL", "/kr/hashtag/?searchvalue=CXL"], ["\uBA54\uBAA8\uB9AC", "/kr/hashtag/?searchvalue=%EB%A9%94%EB%AA%A8%EB%A6%AC"], ["LPCAMM", "/kr/hashtag/?searchvalue=LPCAMM"]]
          },
          {
            href: "/kr/news-events/tech-blog/redefining-the-focus-of-automobile-design/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/th-auto-search-4x3_2x.png?$ORIGIN_PNG$",
            alt: "\uC790\uB3D9\uCC28 \uC124\uACC4\uC758 \uD575\uC2EC\uC744 \uC7AC\uC815\uB9BD\uD558\uB2E4",
            eyebrow: "\uD14C\uD06C \uBE14\uB85C\uADF8",
            title: "\uC790\uB3D9\uCC28 \uC124\uACC4\uC758 \uD575\uC2EC\uC744 \uC7AC\uC815\uB9BD\uD558\uB2E4",
            tags: [["\uC624\uD1A0\uBAA8\uD2F0\uBE0C", "/kr/hashtag/?searchvalue=%EC%98%A4%ED%86%A0%EB%AA%A8%ED%8B%B0%EB%B8%8C"], ["Software Defined Vehicle", "/kr/hashtag/?searchvalue=Software%20Defined%20Vehicle"], ["Robotaxi", "/kr/hashtag/?searchvalue=Robotaxi"], ["ADAS", "/kr/hashtag/?searchvalue=ADAS"], ["HBM", "/kr/hashtag/?searchvalue=HBM"]]
          },
          {
            href: "/kr/news-events/news/samsung-electronics-holds-memory-tech-day-2023-unveiling-new-innovations-to-lead-the-hyperscale-ai-era/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/news/th_memory-techday-2023_4x3_624_468_.png?$ORIGIN_PNG$",
            alt: "\uC0BC\uC131\uC804\uC790, \uBBF8\uAD6D \uC2E4\uB9AC\uCF58\uBC38\uB9AC\uC11C '\uC0BC\uC131 \uBA54\uBAA8\uB9AC \uD14C\uD06C \uB370\uC774 2023' \uAC1C\uCD5C",
            eyebrow: "\uB274\uC2A4",
            title: "\uC0BC\uC131\uC804\uC790, \uBBF8\uAD6D \uC2E4\uB9AC\uCF58\uBC38\uB9AC\uC11C '\uC0BC\uC131 \uBA54\uBAA8\uB9AC \uD14C\uD06C \uB370\uC774 2023' \uAC1C\uCD5C",
            tags: [["\uD14C\uD06C\uB370\uC774", "/kr/hashtag/?searchvalue=%ED%85%8C%ED%81%AC%EB%8D%B0%EC%9D%B4"], ["AI", "/kr/hashtag/?searchvalue=AI"], ["Auto", "/kr/hashtag/?searchvalue=Auto"], ["HBM", "/kr/hashtag/?searchvalue=HBM"], ["\uBA54\uBAA8\uB9AC", "/kr/hashtag/?searchvalue=%EB%A9%94%EB%AA%A8%EB%A6%AC"]]
          },
          {
            href: "/kr/news-events/tech-blog/hbm-pim-cutting-edge-memory-technology-to-accelerate-next-generation-ai/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/hbm-pim-cutting-edge-memory-technology-to-accelerate-next-generation-ai-search.png?$ORIGIN_PNG$",
            alt: "HBM-PIM: \uCC28\uC138\uB300 AI\uB97C \uAC00\uC18D\uD654\uD558\uB294 \uCD5C\uCCA8\uB2E8 \uBA54\uBAA8\uB9AC \uAE30\uC220",
            eyebrow: "\uD14C\uD06C \uBE14\uB85C\uADF8",
            title: "HBM-PIM: \uCC28\uC138\uB300 AI\uB97C \uAC00\uC18D\uD654\uD558\uB294 \uCD5C\uCCA8\uB2E8 \uBA54\uBAA8\uB9AC \uAE30\uC220",
            tags: [["AI", "/kr/hashtag/?searchvalue=AI"], ["Semiconductor", "/kr/hashtag/?searchvalue=Semiconductor"], ["PIM", "/kr/hashtag/?searchvalue=PIM"], ["HBM-PIM", "/kr/hashtag/?searchvalue=HBM-PIM"], ["HBM", "/kr/hashtag/?searchvalue=HBM"], ["ChatGPT", "/kr/hashtag/?searchvalue=ChatGPT"], ["\uAE30\uC220", "/kr/hashtag/?searchvalue=%EA%B8%B0%EC%88%A0"]]
          },
          {
            href: "/kr/news-events/tech-blog/high-performance-computing-the-applications-of-the-future-and-samsung-foundrys-safe-ip-solutions/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/high-performance-computing-the-applications-of-the-future_thumb.png?$ORIGIN_PNG$",
            alt: "\uACE0\uC131\uB2A5 \uCEF4\uD4E8\uD305, \uCC28\uC138\uB300 \uC751\uC6A9\uCC98 \uADF8\uB9AC\uACE0 Foundry \uC0AC\uC5C5\uBD80\uC758 SAFE IP \uC194\uB8E8\uC158",
            eyebrow: "\uD14C\uD06C \uBE14\uB85C\uADF8",
            title: "\uACE0\uC131\uB2A5 \uCEF4\uD4E8\uD305, \uCC28\uC138\uB300 \uC751\uC6A9\uCC98 \uADF8\uB9AC\uACE0 Foundry \uC0AC\uC5C5\uBD80\uC758 SAFE IP \uC194\uB8E8\uC158",
            tags: [["Foundry", "/kr/hashtag/?searchvalue=Foundry"], ["SAFE \uD3EC\uB7FC", "/kr/hashtag/?searchvalue=SAFE%20%ED%8F%AC%EB%9F%BC"], ["Security", "/kr/hashtag/?searchvalue=Security"], ["DRAM", "/kr/hashtag/?searchvalue=DRAM"], ["hbm", "/kr/hashtag/?searchvalue=hbm"], ["3\uB098\uB178", "/kr/hashtag/?searchvalue=3%EB%82%98%EB%85%B8"]]
          },
          {
            href: "/kr/dram/hbm/hbm3/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/dram/hbm3/desktop-thumbimage-hbm3-article.png?$ORIGIN_PNG$",
            alt: "HBM3 | DRAM",
            eyebrow: "DRAM",
            title: "HBM3 | DRAM",
            tags: [["DRAM", "/kr/hashtag/?searchvalue=DRAM"], ["HBM", "/kr/hashtag/?searchvalue=HBM"]]
          },
          {
            href: "/kr/news-events/news/samsung-brings-in-memory-processing-power-to-wider-range-of-applications/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor-kr/newsroom/news/samsung-brings-in-memory-processing-power-to-wider-range-of-applications_thumbnail_01.png?$ORIGIN_PNG$",
            alt: "\uC0BC\uC131\uC804\uC790, \uC778\uACF5\uC9C0\uB2A5 \uD0D1\uC7AC \uBA54\uBAA8\uB9AC \uC81C\uD488\uAD70 \uD655\uB300",
            eyebrow: "\uB274\uC2A4",
            title: "\uC0BC\uC131\uC804\uC790, \uC778\uACF5\uC9C0\uB2A5 \uD0D1\uC7AC \uBA54\uBAA8\uB9AC \uC81C\uD488\uAD70 \uD655\uB300",
            tags: [["DRAM", "/kr/hashtag/?searchvalue=DRAM"], ["HBM", "/kr/hashtag/?searchvalue=HBM"], ["HBM2 Aquabolt", "/kr/hashtag/?searchvalue=HBM2%20Aquabolt"], ["PIM", "/kr/hashtag/?searchvalue=PIM"]]
          },
          {
            href: "/kr/news-events/news/samsung-electronics-to-boost-investment-in-logic-chip-businesses-to-krw-171-trillion-by-2030/",
            img: "https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/news/manufacturing-02_thumbnail.png?$ORIGIN_PNG$",
            alt: "\uC0BC\uC131\uC804\uC790, 2030\uB144\uAE4C\uC9C0 \uB85C\uC9C1 \uCE69 \uC0AC\uC5C5 \uD22C\uC790 \uC608\uC0B0\uC744 171\uC870\uC6D0\uC73C\uB85C \uD655\uB300",
            eyebrow: "\uB274\uC2A4",
            title: "\uC0BC\uC131\uC804\uC790, 2030\uB144\uAE4C\uC9C0 \uB85C\uC9C1 \uCE69 \uC0AC\uC5C5 \uD22C\uC790 \uC608\uC0B0\uC744 171\uC870\uC6D0\uC73C\uB85C \uD655\uB300",
            tags: [["AI", "/kr/hashtag/?searchvalue=AI"], ["Foundry", "/kr/hashtag/?searchvalue=Foundry"], ["5G", "/kr/hashtag/?searchvalue=5G"], ["DRAM", "/kr/hashtag/?searchvalue=DRAM"], ["HBM", "/kr/hashtag/?searchvalue=HBM"], ["PC & \uAC8C\uC774\uBC0D", "/kr/hashtag/?searchvalue=PC%20%26%20%EA%B2%8C%EC%9D%B4%EB%B0%8D"]]
          }
        ];
        moreCards.forEach((card) => {
          const li = doc.createElement("li");
          li.className = "CO31_related-content-grid-item";
          const desc = doc.createElement("div");
          desc.className = "CO31_related-content-grid-desc";
          const a = doc.createElement("a");
          a.setAttribute("href", card.href);
          const thumb = doc.createElement("div");
          thumb.className = "CO31_related-content-grid-thum";
          const img = doc.createElement("img");
          img.setAttribute("src", card.img);
          img.setAttribute("alt", card.alt);
          thumb.appendChild(img);
          const eyebrow = doc.createElement("div");
          eyebrow.className = "CO31_related-content-grid-eyebrow";
          eyebrow.textContent = card.eyebrow;
          const title = doc.createElement("div");
          title.className = "CO31_related-content-grid-title";
          title.textContent = card.title;
          a.append(thumb, eyebrow, title);
          desc.appendChild(a);
          const tagsWrap = doc.createElement("div");
          tagsWrap.className = "CO31_related-content-grid-tags";
          card.tags.forEach(([label, href]) => {
            const ta = doc.createElement("a");
            ta.setAttribute("href", href);
            ta.textContent = label;
            tagsWrap.appendChild(ta);
          });
          li.append(desc, tagsWrap);
          relGrid.appendChild(li);
        });
      }
      WebImporter.DOMUtils.remove(element, [
        "#cookie_component",
        "#cookie_component_emea",
        ".CO11_cookie"
      ]);
      element.querySelectorAll(
        'img[src*="t.co/"], img[src*="analytics.twitter.com"], img[src*="adsct"]'
      ).forEach((img) => {
        const pic = img.closest("picture");
        (pic || img).remove();
      });
      WebImporter.DOMUtils.remove(element, [
        ".ta-only",
        ".mo-only"
      ]);
      if (element.querySelector(".st-semi-article-detail_image-desktop")) {
        WebImporter.DOMUtils.remove(element, [".st-semi-article-detail_image-mobile"]);
      }
    }
    if (hookName === TransformHook.afterTransform) {
      if (element.querySelector(".st-semi-lnb") || element.querySelector(".st-semi-hero-carousel, .hero-product")) {
        const doc = element.ownerDocument;
        const srcUrl = payload && payload.url || payload && payload.params && payload.params.originalURL || "";
        const isKr = /\/kr\//.test(srcUrl);
        const base = isKr ? "/kr/dram" : "/dram";
        const overviewLabel = isKr ? "\uAC1C\uC694" : "Overview";
        const labelWrap = doc.createElement("div");
        const catLink = doc.createElement("a");
        catLink.setAttribute("href", `${base}/`);
        catLink.textContent = "DRAM";
        const cur = doc.createElement("span");
        cur.textContent = "HBM";
        labelWrap.append(catLink, doc.createTextNode(" / "), cur);
        const tabsWrap = doc.createElement("div");
        const tabList = doc.createElement("ul");
        [
          [overviewLabel, `${base}/hbm/`],
          ["HBM4", `${base}/hbm/hbm4/`],
          ["HBM3E", `${base}/hbm/hbm3e/`],
          ["HBM3", `${base}/hbm/hbm3/`]
        ].forEach(([label, href]) => {
          const li = doc.createElement("li");
          const link = doc.createElement("a");
          link.setAttribute("href", href);
          link.textContent = label;
          li.appendChild(link);
          tabList.appendChild(li);
        });
        tabsWrap.appendChild(tabList);
        const subNav = WebImporter.Blocks.createBlock(doc, {
          name: "sub-nav",
          cells: [[labelWrap], [tabsWrap]]
        });
        element.insertBefore(subNav, element.firstChild ? element.firstChild.nextSibling : null);
      }
      WebImporter.DOMUtils.remove(element, [
        "#topSection",
        "#skipnavi",
        ".gnb_wrapper",
        "header#menu",
        ".cm-semi-static-content",
        "#cm-semi-breadcrumb",
        "section.static-content",
        "footer.CO05_footer",
        "#cm-semi-contactus-tobe",
        // In-page local sub-navigation (개요/HBM4/HBM3E/HBM3 tab links). This is
        // page navigation chrome, not authorable content. Verified: .st-semi-lnb.
        ".st-semi-lnb"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#article-video-popup",
        ".fab-area",
        ".AR02_article-header-sns",
        ".AR02_related-sticky-contents",
        ".AR02_related-fixed-whats-next-check",
        ".AR02_related-fixed-whats-next",
        ".ar-semi-three-column-links"
      ]);
      const shellHeader = element.querySelector(":scope > header");
      if (shellHeader) shellHeader.remove();
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "iframe",
        "link",
        "script"
      ]);
      const rootContainer = element.querySelector("#root-container");
      if (rootContainer) {
        const articleHeader = element.querySelector("#articleheader");
        if (articleHeader) {
          const norm = (s) => (s || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
          const findBlockTable = (name) => {
            const want = norm(name);
            return [...element.querySelectorAll("table")].find((t) => {
              const cell = t.querySelector("tr > th, tr > td");
              return cell && norm(cell.textContent).startsWith(want);
            });
          };
          const headerBlock = findBlockTable("article-header");
          const articleDetail = element.querySelector(".AR02_article-detail");
          const tagsBlock = findBlockTable("tags-hashtag");
          const bannerBlock = findBlockTable("banner-newsroom");
          const cardsBlock = findBlockTable("cards-news");
          const ordered = [];
          if (headerBlock) ordered.push(headerBlock);
          if (articleDetail) ordered.push(articleDetail);
          if (tagsBlock) ordered.push(tagsBlock);
          if (bannerBlock) ordered.push(bannerBlock);
          if (cardsBlock) {
            const prev = cardsBlock.previousElementSibling;
            if (prev && /^H[1-6]$/.test(prev.tagName)) ordered.push(prev);
            ordered.push(cardsBlock);
          }
          ordered.forEach((sectionRoot) => {
            if (sectionRoot && rootContainer.contains(sectionRoot)) {
              element.insertBefore(sectionRoot, rootContainer);
            }
          });
          rootContainer.remove();
          element.querySelectorAll(":scope > div").forEach((div) => {
            const hasContent = div.textContent.trim() || div.querySelector("img, picture, iframe, ul, table");
            if (!div.id && !div.className && !hasContent) {
              div.remove();
            }
          });
        } else {
          const anchorBlock = element.querySelector(".hero-product, .st-semi-hero-carousel");
          const grid = anchorBlock ? anchorBlock.parentElement : null;
          if (grid && rootContainer.contains(grid)) {
            while (grid.firstChild) {
              element.insertBefore(grid.firstChild, rootContainer);
            }
            rootContainer.remove();
          }
        }
      }
      WebImporter.DOMUtils.remove(element, [
        ".st-semi-margin",
        ".cm-semi-static-content"
      ]);
    }
  }

  // tools/importer/transformers/samsung-semiconductor-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument;
    const toTopLevel = (el) => {
      let node = el;
      while (node && node.parentElement && node.parentElement !== element) {
        node = node.parentElement;
      }
      return node && node.parentElement === element ? node : null;
    };
    const selectorCounters = {};
    const anchors = sections.map((section) => {
      if (!section || !section.selector) return null;
      const matches = element.querySelectorAll(section.selector);
      const idx = selectorCounters[section.selector] || 0;
      selectorCounters[section.selector] = idx + 1;
      return toTopLevel(matches[idx] || null);
    });
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const anchor = anchors[i];
      if (!anchor) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metaBlock);
      }
      if (i > 0 && anchor.previousElementSibling) {
        anchor.before(doc.createElement("hr"));
      }
    }
  }

  // tools/importer/import-hbm-overview-en.js
  var PAGE_TEMPLATE = {
    name: "hbm-overview",
    description: "Samsung HBM product overview page: hero, intro text, three feature-spec product sections (HBM4/HBM3E/HBM3), FAQ accordion, applications cards, related content, disclaimer.",
    urls: [
      "https://semiconductor.samsung.com/kr/dram/hbm/"
    ],
    blocks: [
      {
        name: "hero-product",
        instances: [".st-semi-hero-carousel"]
      },
      {
        name: "columns-spec",
        instances: [".st-semi-feature-spec"]
      },
      {
        name: "accordion-faq",
        instances: [".st-semi-accordion-list"]
      },
      {
        name: "cards-content",
        instances: [".st-semi-4-column", ".cm-semi-related-content-all"]
      }
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
      { id: "s1", name: "Hero", selector: ".hero-product", style: null, blocks: ["hero-product"], defaultContent: [] },
      { id: "s2", name: "Intro", selector: ".st-semi-text-block", style: null, blocks: [], defaultContent: [".st-semi-text-block"] },
      { id: "s3", name: "HBM4 Spec", selector: ".columns-spec", style: null, blocks: ["columns-spec"], defaultContent: [] },
      { id: "s4", name: "HBM3E Spec", selector: ".columns-spec", style: null, blocks: ["columns-spec"], defaultContent: [] },
      { id: "s5", name: "HBM3 Spec", selector: ".columns-spec", style: null, blocks: ["columns-spec"], defaultContent: [] },
      { id: "s6", name: "FAQ", selector: ".st-semi-text-block", style: null, blocks: ["accordion-faq"], defaultContent: [".st-semi-text-block"] },
      { id: "s7", name: "Applications", selector: ".cards-content", style: null, blocks: ["cards-content"], defaultContent: [] },
      { id: "s8", name: "Related Content", selector: ".cards-content", style: null, blocks: ["cards-content"], defaultContent: [] },
      { id: "s9", name: "Disclaimer", selector: ".st-semi-text-block", style: null, blocks: [], defaultContent: [".st-semi-text-block"] }
    ]
  };
  var parsers = {
    "hero-product": parse,
    "columns-spec": parse2,
    "accordion-faq": parse3,
    "cards-content": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
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
  var import_hbm_overview_en_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "").replace(/^\/(us|kr)\b/, "/en")
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
  return __toCommonJS(import_hbm_overview_en_exports);
})();
