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

  // tools/importer/import-news-article-en.js
  var import_news_article_en_exports = {};
  __export(import_news_article_en_exports, {
    default: () => import_news_article_en_default
  });

  // tools/importer/parsers/article-header.js
  function parse(element, { document }) {
    const eyebrowEl = element.querySelector(".AR02_article-header__eyebrow");
    const titleEl = element.querySelector(".AR02_article-header__title, h1");
    const dateEl = element.querySelector(
      "time.AR02_article-header-page__header_time, time"
    );
    const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : "";
    const titleText = titleEl ? titleEl.textContent.trim() : "";
    const dateText = dateEl ? dateEl.textContent.trim() : "";
    if (!titleText && !eyebrowText) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const eyebrow = document.createElement("p");
    eyebrow.textContent = eyebrowText;
    cells.push([eyebrow]);
    const title = document.createElement("h1");
    title.textContent = titleText;
    cells.push([title]);
    const time = document.createElement("time");
    time.textContent = dateText;
    cells.push([time]);
    const block = WebImporter.Blocks.createBlock(document, { name: "article-header", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/article-image.js
  function parse2(element, { document }) {
    const img = element.querySelector("img");
    const captionEl = element.querySelector(".st-semi-article-detail_image-caption");
    const captionText = captionEl ? captionEl.textContent.trim() : "";
    if (!img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([img]);
    const cap = document.createElement("p");
    cap.textContent = captionText;
    cells.push([cap]);
    const block = WebImporter.Blocks.createBlock(document, { name: "article-image", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tags-hashtag.js
  function parse3(element, { document }) {
    const tagEls = Array.from(
      element.querySelectorAll(".AR02_article-detail-hashtag")
    );
    const cells = [];
    tagEls.forEach((tag) => {
      const label = tag.textContent.replace(/\s+/g, " ").trim();
      if (!label) return;
      const p = document.createElement("p");
      p.textContent = label;
      cells.push([p]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tags-hashtag", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/banner-newsroom.js
  function parse4(element, { document }) {
    const titleEl = element.querySelector(".AR02_article-detail-semiconstory-banner-title");
    const descEl = element.querySelector(".AR02_article-detail-semiconstory-banner-description");
    const ctaEl = element.querySelector(
      "a.AR02_article-detail-semiconstory-banner-cta, a[href]"
    );
    const titleText = titleEl ? titleEl.textContent.trim() : "";
    const descText = descEl ? descEl.textContent.trim() : "";
    if (!titleText && !descText && !ctaEl) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const textCell = [];
    if (titleText) {
      const h = document.createElement("h2");
      h.textContent = titleText;
      textCell.push(h);
    }
    if (descText) {
      const p = document.createElement("p");
      p.textContent = descText;
      textCell.push(p);
    }
    cells.push([textCell.length ? textCell : ""]);
    if (ctaEl && ctaEl.getAttribute("href")) {
      const a = document.createElement("a");
      a.setAttribute("href", ctaEl.getAttribute("href"));
      a.textContent = ctaEl.textContent.trim() || ctaEl.getAttribute("href");
      const p = document.createElement("p");
      p.appendChild(a);
      cells.push([p]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "banner-newsroom", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse5(element, { document }) {
    const sticky = document.querySelector(".AR02_related-sticky-contents");
    const list = sticky ? sticky.querySelector(".AR02_related-sticky-contents--list") : null;
    const scope = list || element;
    const items = Array.from(
      scope.querySelectorAll(".AR02_related-sticky-contents--item")
    );
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector(
        ".AR02_related-sticky-contents--item-thum img, img"
      );
      const titleLink = item.querySelector(
        "a.AR02_related-sticky-contents--item-title, .AR02_related-sticky-contents--item-info a[href]"
      );
      const timeEl = item.querySelector(
        ".AR02_related-sticky-contents--item-time time, time"
      );
      const textCell = [];
      if (titleLink && titleLink.getAttribute("href")) {
        const h = document.createElement("h3");
        const a = document.createElement("a");
        a.setAttribute("href", titleLink.getAttribute("href"));
        a.textContent = titleLink.textContent.trim();
        h.appendChild(a);
        textCell.push(h);
      }
      if (timeEl && timeEl.textContent.trim()) {
        const time = document.createElement("time");
        time.textContent = timeEl.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(time);
        textCell.push(p);
      }
      if (image || textCell.length) {
        cells.push([image || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    const headingText = "\uAD00\uB828 \uCEE8\uD150\uCE20";
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
        const labelWrap = doc.createElement("div");
        const catLink = doc.createElement("a");
        catLink.setAttribute("href", "/kr/dram/");
        catLink.textContent = "DRAM";
        const cur = doc.createElement("span");
        cur.textContent = "HBM";
        labelWrap.append(catLink, doc.createTextNode(" / "), cur);
        const tabsWrap = doc.createElement("div");
        const tabList = doc.createElement("ul");
        [
          ["\uAC1C\uC694", "/kr/dram/hbm/"],
          ["HBM4", "/kr/dram/hbm/hbm4/"],
          ["HBM3E", "/kr/dram/hbm/hbm3e/"],
          ["HBM3", "/kr/dram/hbm/hbm3/"]
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

  // tools/importer/import-news-article-en.js
  var PAGE_TEMPLATE = {
    name: "news-article",
    description: "Samsung Semiconductor news article page: eyebrow category, title, publish date, social-share buttons, rich-text body with inline images and captions, hashtags, newsroom CTA banner, and a related-content grid of article cards.",
    urls: [
      "https://semiconductor.samsung.com/kr/news-events/news/samsung-electronics-begins-shipment-of-industry-first-hbm4e-samples/"
    ],
    blocks: [
      {
        name: "article-header",
        instances: ["section.AR02_article-header__header"]
      },
      {
        name: "article-image",
        instances: [".st-semi-article-detail_image-desktop:has(.st-semi-article-detail_image-caption)"]
      },
      {
        name: "tags-hashtag",
        instances: [".AR02_article-detail-tag"]
      },
      {
        name: "banner-newsroom",
        instances: [".AR02_article-detail-semiconstory-banner"]
      },
      {
        name: "cards-news",
        instances: [".ar-semi-related-content"]
      }
    ],
    // Section selectors are POST-PARSE and POST-FLATTEN: after the cleanup
    // transformer hoists the article content up to main, each section anchor is a
    // top-level sibling. Block sections match their resulting block class; the
    // article body matches its surviving rich-text wrapper. style is null except
    // the newsroom banner ("accent"); this project's aem.js does not process
    // Section Metadata blocks, so backgrounds are handled in CSS during design.
    // The sections transformer still inserts <hr> section breaks at these anchors.
    sections: [
      { id: "s1", name: "Article Header", selector: ".article-header", style: null, blocks: ["article-header"], defaultContent: [] },
      { id: "s2", name: "Article Body", selector: ".AR02_article-detail", style: null, blocks: ["article-image"], defaultContent: [".AR02_article-detail"] },
      { id: "s3", name: "Hashtags", selector: ".tags-hashtag", style: null, blocks: ["tags-hashtag"], defaultContent: [] },
      { id: "s4", name: "Newsroom CTA Banner", selector: ".banner-newsroom", style: null, blocks: ["banner-newsroom"], defaultContent: [] },
      { id: "s5", name: "Related Content", selector: ".cards-news", style: null, blocks: ["cards-news"], defaultContent: [] }
    ]
  };
  var parsers = {
    "article-header": parse,
    "article-image": parse2,
    "tags-hashtag": parse3,
    "banner-newsroom": parse4,
    "cards-news": parse5
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
  var import_news_article_en_default = {
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
  return __toCommonJS(import_news_article_en_exports);
})();
