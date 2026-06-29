/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Samsung Semiconductor site-wide cleanup.
 *
 * Removes non-authorable global chrome so the import contains only the
 * page-level authorable content that lives under #root-container. The
 * header/GNB navigation, breadcrumb, footer, contact-us widget and cookie
 * consent are migrated by separate navigation/footer skills, so they must
 * not appear in the imported content.
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // News-article rich-text body: trademark/footnote lines wrap a superscript
    // mid-sentence (e.g. "* NVM Express<sup>®</sup> 및 NVMe<sup>®</sup>는 …상표입니다.").
    // html2md splits the text at each <sup> boundary, scattering one sentence
    // across several <p>. Replace each <sup> with its inline text (wrapped in
    // parens for footnote markers) so the whole line survives as ONE paragraph.
    const richBody = element.querySelector(
      '.st-semi-article-detail_text-cont.rich-text, .AR02_article-detail',
    );
    if (richBody) {
      richBody.querySelectorAll('sup').forEach((sup) => {
        const txt = sup.textContent.trim();
        // Registered/trademark glyphs stay inline as-is; numeric/footnote markers
        // are kept but not turned into a block. Either way, flatten to a text node.
        sup.replaceWith(sup.ownerDocument.createTextNode(txt));
      });
    }

    // Inject the related-content cards that the source loads dynamically via the
    // "더 보기" (load more) button. They are NOT in the scraped HTML, so we add them
    // to the .CO31_related-content-grid before the cards-content parser runs. The
    // source reveals 3 cards per click for up to 4 clicks (3 initial + 12 = 15 total),
    // so we inject the full 12-card set here. Image URLs use the absolute Samsung CDN
    // paths (same as the source cards), so the importer's adjustImageUrls leaves them intact.
    const relGrid = element.querySelector('.CO31_related-content-grid');
    if (relGrid && relGrid.querySelectorAll('.CO31_related-content-grid-item').length <= 3) {
      const doc = element.ownerDocument;
      const moreCards = [
        {
          href: '/kr/dram/hbm/hbm3e/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/dram/hbm3e/desktop-thumbimage-hbm3e-article.png?$ORIGIN_PNG$',
          alt: 'HBM3E | DRAM',
          eyebrow: 'DRAM',
          title: 'HBM3E | DRAM',
          tags: [['DRAM', '/kr/hashtag/?searchvalue=DRAM'], ['HBM', '/kr/hashtag/?searchvalue=HBM']],
        },
        {
          href: '/kr/news-events/tech-blog/samsung-highlights-the-importance-of-open-collaboration-in-the-ai-era-with-energy-efficient-data-center-infrastructure-and-memory-solutions/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/ocp-article-4x3.png?$ORIGIN_PNG$',
          alt: '삼성전자, 전력 효율을 극대화한 데이터센터 인프라 및 메모리 솔루션',
          eyebrow: '테크 블로그',
          title: '삼성전자, 전력 효율을 극대화한 데이터센터 인프라 및 메모리 솔루션을 통해 AI 시대의 오픈 협업 중요성 강조하다',
          tags: [['OCP APAC', '/kr/hashtag/?searchvalue=OCP%20APAC'], ['Datacenter', '/kr/hashtag/?searchvalue=Datacenter'], ['서버', '/kr/hashtag/?searchvalue=%EC%84%9C%EB%B2%84'], ['HPC', '/kr/hashtag/?searchvalue=HPC'], ['HBM', '/kr/hashtag/?searchvalue=HBM'], ['HBM3E', '/kr/hashtag/?searchvalue=HBM3E']],
        },
        {
          href: '/kr/news-events/tech-blog/the-perfect-harmony-created-by-samsung-hbm-powering-the-ai-era/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/hbm3e-4x3-3.png?$ORIGIN_PNG$',
          alt: '[인터뷰] AI 시대 삼성전자 HBM이 만들어 내는 완벽한 하모니',
          eyebrow: '테크 블로그',
          title: '[인터뷰] AI 시대 삼성전자 HBM이 만들어 내는 완벽한 하모니',
          tags: [['HBM', '/kr/hashtag/?searchvalue=HBM'], ['DRAM', '/kr/hashtag/?searchvalue=DRAM'], ['HBM3E', '/kr/hashtag/?searchvalue=HBM3E']],
        },
        {
          href: '/kr/news-events/tech-blog/harnessing-the-ai-era-with-breakthrough-memory-solutions/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/th-shaping-future-technologies-4x3@2x.png?$ORIGIN_PNG$',
          alt: '[기고문] AI 시대, 최적 메모리 솔루션으로 미래 기술을 그리다',
          eyebrow: '테크 블로그',
          title: '[기고문] AI 시대, 최적 메모리 솔루션으로 미래 기술을 그리다',
          tags: [['AI', '/kr/hashtag/?searchvalue=AI'], ['오토모티브', '/kr/hashtag/?searchvalue=%EC%98%A4%ED%86%A0%EB%AA%A8%ED%8B%B0%EB%B8%8C'], ['CMM', '/kr/hashtag/?searchvalue=CMM'], ['HBM', '/kr/hashtag/?searchvalue=HBM'], ['PIM', '/kr/hashtag/?searchvalue=PIM']],
        },
        {
          href: '/kr/news-events/tech-blog/shaping-future-technologies-in-23-how-samsung-semiconductor-served-businesses-in-2023/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/th-endofyear-01-newsroom-landing-4x3.png?$ORIGIN_PNG$',
          alt: '2023년 새롭게 열린 기술 트렌드: 삼성전자 반도체가 함께한 혁신의 여정',
          eyebrow: '테크 블로그',
          title: '2023년 새롭게 열린 기술 트렌드: 삼성전자 반도체가 함께한 혁신의 여정',
          tags: [['AI', '/kr/hashtag/?searchvalue=AI'], ['HPC', '/kr/hashtag/?searchvalue=HPC'], ['HBM', '/kr/hashtag/?searchvalue=HBM'], ['CXL', '/kr/hashtag/?searchvalue=CXL'], ['메모리', '/kr/hashtag/?searchvalue=%EB%A9%94%EB%AA%A8%EB%A6%AC'], ['LPCAMM', '/kr/hashtag/?searchvalue=LPCAMM']],
        },
        {
          href: '/kr/news-events/tech-blog/redefining-the-focus-of-automobile-design/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/th-auto-search-4x3_2x.png?$ORIGIN_PNG$',
          alt: '자동차 설계의 핵심을 재정립하다',
          eyebrow: '테크 블로그',
          title: '자동차 설계의 핵심을 재정립하다',
          tags: [['오토모티브', '/kr/hashtag/?searchvalue=%EC%98%A4%ED%86%A0%EB%AA%A8%ED%8B%B0%EB%B8%8C'], ['Software Defined Vehicle', '/kr/hashtag/?searchvalue=Software%20Defined%20Vehicle'], ['Robotaxi', '/kr/hashtag/?searchvalue=Robotaxi'], ['ADAS', '/kr/hashtag/?searchvalue=ADAS'], ['HBM', '/kr/hashtag/?searchvalue=HBM']],
        },
        {
          href: '/kr/news-events/news/samsung-electronics-holds-memory-tech-day-2023-unveiling-new-innovations-to-lead-the-hyperscale-ai-era/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/news/th_memory-techday-2023_4x3_624_468_.png?$ORIGIN_PNG$',
          alt: "삼성전자, 미국 실리콘밸리서 '삼성 메모리 테크 데이 2023' 개최",
          eyebrow: '뉴스',
          title: "삼성전자, 미국 실리콘밸리서 '삼성 메모리 테크 데이 2023' 개최",
          tags: [['테크데이', '/kr/hashtag/?searchvalue=%ED%85%8C%ED%81%AC%EB%8D%B0%EC%9D%B4'], ['AI', '/kr/hashtag/?searchvalue=AI'], ['Auto', '/kr/hashtag/?searchvalue=Auto'], ['HBM', '/kr/hashtag/?searchvalue=HBM'], ['메모리', '/kr/hashtag/?searchvalue=%EB%A9%94%EB%AA%A8%EB%A6%AC']],
        },
        {
          href: '/kr/news-events/tech-blog/hbm-pim-cutting-edge-memory-technology-to-accelerate-next-generation-ai/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/hbm-pim-cutting-edge-memory-technology-to-accelerate-next-generation-ai-search.png?$ORIGIN_PNG$',
          alt: 'HBM-PIM: 차세대 AI를 가속화하는 최첨단 메모리 기술',
          eyebrow: '테크 블로그',
          title: 'HBM-PIM: 차세대 AI를 가속화하는 최첨단 메모리 기술',
          tags: [['AI', '/kr/hashtag/?searchvalue=AI'], ['Semiconductor', '/kr/hashtag/?searchvalue=Semiconductor'], ['PIM', '/kr/hashtag/?searchvalue=PIM'], ['HBM-PIM', '/kr/hashtag/?searchvalue=HBM-PIM'], ['HBM', '/kr/hashtag/?searchvalue=HBM'], ['ChatGPT', '/kr/hashtag/?searchvalue=ChatGPT'], ['기술', '/kr/hashtag/?searchvalue=%EA%B8%B0%EC%88%A0']],
        },
        {
          href: '/kr/news-events/tech-blog/high-performance-computing-the-applications-of-the-future-and-samsung-foundrys-safe-ip-solutions/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/tech-blog/high-performance-computing-the-applications-of-the-future_thumb.png?$ORIGIN_PNG$',
          alt: '고성능 컴퓨팅, 차세대 응용처 그리고 Foundry 사업부의 SAFE IP 솔루션',
          eyebrow: '테크 블로그',
          title: '고성능 컴퓨팅, 차세대 응용처 그리고 Foundry 사업부의 SAFE IP 솔루션',
          tags: [['Foundry', '/kr/hashtag/?searchvalue=Foundry'], ['SAFE 포럼', '/kr/hashtag/?searchvalue=SAFE%20%ED%8F%AC%EB%9F%BC'], ['Security', '/kr/hashtag/?searchvalue=Security'], ['DRAM', '/kr/hashtag/?searchvalue=DRAM'], ['hbm', '/kr/hashtag/?searchvalue=hbm'], ['3나노', '/kr/hashtag/?searchvalue=3%EB%82%98%EB%85%B8']],
        },
        {
          href: '/kr/dram/hbm/hbm3/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/products/dram/hbm3/desktop-thumbimage-hbm3-article.png?$ORIGIN_PNG$',
          alt: 'HBM3 | DRAM',
          eyebrow: 'DRAM',
          title: 'HBM3 | DRAM',
          tags: [['DRAM', '/kr/hashtag/?searchvalue=DRAM'], ['HBM', '/kr/hashtag/?searchvalue=HBM']],
        },
        {
          href: '/kr/news-events/news/samsung-brings-in-memory-processing-power-to-wider-range-of-applications/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor-kr/newsroom/news/samsung-brings-in-memory-processing-power-to-wider-range-of-applications_thumbnail_01.png?$ORIGIN_PNG$',
          alt: '삼성전자, 인공지능 탑재 메모리 제품군 확대',
          eyebrow: '뉴스',
          title: '삼성전자, 인공지능 탑재 메모리 제품군 확대',
          tags: [['DRAM', '/kr/hashtag/?searchvalue=DRAM'], ['HBM', '/kr/hashtag/?searchvalue=HBM'], ['HBM2 Aquabolt', '/kr/hashtag/?searchvalue=HBM2%20Aquabolt'], ['PIM', '/kr/hashtag/?searchvalue=PIM']],
        },
        {
          href: '/kr/news-events/news/samsung-electronics-to-boost-investment-in-logic-chip-businesses-to-krw-171-trillion-by-2030/',
          img: 'https://image.semiconductor.samsung.com/image/samsung/p6/semiconductor/newsroom/news/manufacturing-02_thumbnail.png?$ORIGIN_PNG$',
          alt: '삼성전자, 2030년까지 로직 칩 사업 투자 예산을 171조원으로 확대',
          eyebrow: '뉴스',
          title: '삼성전자, 2030년까지 로직 칩 사업 투자 예산을 171조원으로 확대',
          tags: [['AI', '/kr/hashtag/?searchvalue=AI'], ['Foundry', '/kr/hashtag/?searchvalue=Foundry'], ['5G', '/kr/hashtag/?searchvalue=5G'], ['DRAM', '/kr/hashtag/?searchvalue=DRAM'], ['HBM', '/kr/hashtag/?searchvalue=HBM'], ['PC & 게이밍', '/kr/hashtag/?searchvalue=PC%20%26%20%EA%B2%8C%EC%9D%B4%EB%B0%8D']],
        },
      ];
      moreCards.forEach((card) => {
        const li = doc.createElement('li');
        li.className = 'CO31_related-content-grid-item';
        const desc = doc.createElement('div');
        desc.className = 'CO31_related-content-grid-desc';
        const a = doc.createElement('a');
        a.setAttribute('href', card.href);
        const thumb = doc.createElement('div');
        thumb.className = 'CO31_related-content-grid-thum';
        const img = doc.createElement('img');
        img.setAttribute('src', card.img);
        img.setAttribute('alt', card.alt);
        thumb.appendChild(img);
        const eyebrow = doc.createElement('div');
        eyebrow.className = 'CO31_related-content-grid-eyebrow';
        eyebrow.textContent = card.eyebrow;
        const title = doc.createElement('div');
        title.className = 'CO31_related-content-grid-title';
        title.textContent = card.title;
        a.append(thumb, eyebrow, title);
        desc.appendChild(a);
        const tagsWrap = doc.createElement('div');
        tagsWrap.className = 'CO31_related-content-grid-tags';
        card.tags.forEach(([label, href]) => {
          const ta = doc.createElement('a');
          ta.setAttribute('href', href);
          ta.textContent = label;
          tagsWrap.appendChild(ta);
        });
        li.append(desc, tagsWrap);
        relGrid.appendChild(li);
      });
    }

    // Cookie/consent + locale popups. Removed before block parsing so they never
    // interfere with block matching. Verified in cleaned.html:
    // - #cookie_component         : Korean cookie consent component
    // - #cookie_component_emea    : English EMEA cookie banner (.CO35_Cookie_EMEA)
    // - .CO11_cookie              : country/region selection popup near #topSection
    //                               ("Select your country or region")
    WebImporter.DOMUtils.remove(element, [
      '#cookie_component',
      '#cookie_component_emea',
      '.CO11_cookie',
    ]);

    // Twitter/X analytics tracking pixels embedded as <img> (t.co, analytics.twitter.com,
    // adsct beacons). Removed BEFORE parsing so their long, special-char query strings
    // can't leak into / corrupt block table cells (e.g. the FAQ accordion).
    element.querySelectorAll(
      'img[src*="t.co/"], img[src*="analytics.twitter.com"], img[src*="adsct"]',
    ).forEach((img) => {
      const pic = img.closest('picture');
      (pic || img).remove();
    });

    // Responsive duplicate copies: Samsung markup renders the SAME text three times
    // as .pc-only / .ta-only / .mo-only siblings (one per breakpoint). Keep .pc-only
    // and drop the tablet/mobile copies so default content and block cells aren't
    // triplicated. Removed BEFORE parsing so block parsers also see a single copy.
    WebImporter.DOMUtils.remove(element, [
      '.ta-only',
      '.mo-only',
    ]);

    // News-article (AR02) body images: each inline figure is rendered TWICE, as a
    // .st-semi-article-detail_image-desktop copy AND a .st-semi-article-detail_image-mobile
    // copy (responsive duplicates, verified in cleaned.html lines 2073/2079, 2088/2096…).
    // Keep the DESKTOP copy and drop the MOBILE copy so the article-image parser and the
    // default-content body see a single image per figure (analogous to .ta-only/.mo-only
    // above). Removed BEFORE parsing. Guard on the desktop class so this never affects
    // hbm-overview, which has no such markup.
    if (element.querySelector('.st-semi-article-detail_image-desktop')) {
      WebImporter.DOMUtils.remove(element, ['.st-semi-article-detail_image-mobile']);
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // (Breadcrump intentionally NOT preserved — per user request the top
    // 홈 / DRAM / HBM breadcrumb is dropped; the LNB tab bar below carries the
    // DRAM / HBM context instead.)

    // --- Add the LNB tab menu (local sub-navigation) ---
    // Source .st-semi-lnb is a client-side-hydrated component: "DRAM / HBM" label +
    // tab links (개요/HBM4/HBM3E/HBM3) on a black bar above the hero. The links are
    // NOT in the scraped HTML (JS-rendered), so we build them from the known fixed
    // set and emit a .sub-nav block. The sub-nav block JS/CSS render the dark tab bar
    // and mark the current tab.
    if (element.querySelector('.st-semi-lnb') || element.querySelector('.st-semi-hero-carousel, .hero-product')) {
      const doc = element.ownerDocument;
      // Locale-aware: English global pages (/us/, /en/) use English labels and
      // root-relative hrefs; Korean (/kr/) uses Korean labels and /kr/ hrefs.
      const srcUrl = (payload && payload.url) || (payload && payload.params && payload.params.originalURL) || '';
      const isKr = /\/kr\//.test(srcUrl);
      const base = isKr ? '/kr/dram' : '/dram';
      const overviewLabel = isKr ? '개요' : 'Overview';

      // Label group: DRAM (link) / HBM (current section).
      const labelWrap = doc.createElement('div');
      const catLink = doc.createElement('a');
      catLink.setAttribute('href', `${base}/`);
      catLink.textContent = 'DRAM';
      const cur = doc.createElement('span');
      cur.textContent = 'HBM';
      labelWrap.append(catLink, doc.createTextNode(' / '), cur);

      // Tab links (fixed for the HBM section).
      const tabsWrap = doc.createElement('div');
      const tabList = doc.createElement('ul');
      [
        [overviewLabel, `${base}/hbm/`],
        ['HBM4', `${base}/hbm/hbm4/`],
        ['HBM3E', `${base}/hbm/hbm3e/`],
        ['HBM3', `${base}/hbm/hbm3/`],
      ].forEach(([label, href]) => {
        const li = doc.createElement('li');
        const link = doc.createElement('a');
        link.setAttribute('href', href);
        link.textContent = label;
        li.appendChild(link);
        tabList.appendChild(li);
      });
      tabsWrap.appendChild(tabList);

      // Emit as an EDS block table so md2da renders <div class="sub-nav">.
      // A plain <div class="sub-nav"> would be flattened by html2md.
      const subNav = WebImporter.Blocks.createBlock(doc, {
        name: 'sub-nav',
        cells: [[labelWrap], [tabsWrap]],
      });
      // Insert just after the breadcrumb (top of content, above the hero).
      element.insertBefore(subNav, element.firstChild ? element.firstChild.nextSibling : null);
    }

    // Non-authorable global chrome (all selectors verified in cleaned.html):
    // - #topSection / #skipnavi : skip-nav + top placeholder (lines 2, 5)
    // - .gnb_wrapper            : global GNB navigation wrapper (line 68)
    // - header#menu.CO04_gnb     : GNB header inside the wrapper (line 69)
    // - body > header           : input-only shell header before #root-container (line 1943)
    // - .cm-semi-static-content : body-level static block containing breadcrumb,
    //                             footer and contact-us (line 3085)
    // - #cm-semi-breadcrumb     : breadcrumb nav (line 3129)
    // - section.static-content  : static footer content section (line 3086)
    // - footer.CO05_footer      : site footer (line 3149)
    // - #cm-semi-contactus-tobe : contact-us widget (line 3677)
    WebImporter.DOMUtils.remove(element, [
      '#topSection',
      '#skipnavi',
      '.gnb_wrapper',
      'header#menu',
      '.cm-semi-static-content',
      '#cm-semi-breadcrumb',
      'section.static-content',
      'footer.CO05_footer',
      '#cm-semi-contactus-tobe',
      // In-page local sub-navigation (개요/HBM4/HBM3E/HBM3 tab links). This is
      // page navigation chrome, not authorable content. Verified: .st-semi-lnb.
      '.st-semi-lnb',
    ]);

    // --- News-article (AR02) non-authorable chrome + widgets ---
    // These selectors are AR02 article-specific (verified in cleaned.html) and are
    // absent from hbm-overview, so removing them only affects the news page:
    // - #article-video-popup          : hidden YouTube video popup overlay (line 2004)
    // - .fab-area                      : floating scroll-to-top button (line 1994)
    // - .AR02_article-header-sns       : social-share button row; the article-header
    //                                    block regenerates share controls, so the
    //                                    scraped JS-driven row is chrome (line 1971)
    // - .AR02_related-sticky-contents  : sticky sidebar "related contents" widget,
    //                                    both mobile + pc copies (lines 2223/2260)
    // - .AR02_related-fixed-whats-next-check / .AR02_related-fixed-whats-next :
    //                                    floating "next article" overlay (lines 2276/2278)
    // - .ar-semi-three-column-links    : empty secondary nav/link grid column (line 2358)
    // The authorable related content lives in .ar-semi-related-content (preserved).
    WebImporter.DOMUtils.remove(element, [
      '#article-video-popup',
      '.fab-area',
      '.AR02_article-header-sns',
      '.AR02_related-sticky-contents',
      '.AR02_related-fixed-whats-next-check',
      '.AR02_related-fixed-whats-next',
      '.ar-semi-three-column-links',
    ]);

    // body > header is an input-only shell (runMode/serviceDomain/etc.) that sits
    // before #root-container. Remove it explicitly without touching header#menu
    // (already removed above) or any in-content headings.
    const shellHeader = element.querySelector(':scope > header');
    if (shellHeader) shellHeader.remove();

    // Safe leftover/non-authorable element removal.
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'iframe',
      'link',
      'script',
    ]);

    // --- Flatten the AEM grid so content sections become top-level children of main ---
    // Every page section lives ~7 levels deep inside one shared .aem-Grid inside
    // #root-container. EDS section breaks (<hr>) only delimit real sections when each
    // section is a direct child of main, so hoist the content grid's children up to
    // main (in place of #root-container) and drop empty spacer columns. The sections
    // transformer (runs next, same hook) then inserts <hr>/Section Metadata between
    // these now top-level siblings.
    const rootContainer = element.querySelector('#root-container');
    if (rootContainer) {
      // News-article (AR02) layout: there is no hero, so the hbm-overview anchor
      // (.hero-product/.st-semi-hero-carousel) does not exist and the generic
      // grid-child hoist below cannot fire. The authorable sections also sit at
      // mixed depths: the article header section, rich-text body, hashtags and
      // newsroom banner are nested inside #articleheader > … > .AR02_article-detail,
      // while the related-content grid lives in a sibling .cm-semi-container. Hoist
      // each section root to be a direct child of main, in document order, so the
      // sections transformer can place <hr>/Section Metadata between them.
      // Guarded on #articleheader so this branch never runs for hbm-overview.
      const articleHeader = element.querySelector('#articleheader');
      if (articleHeader) {
        // NOTE: parsers run BEFORE this afterTransform hook, so the source
        // elements have already been REPLACED by their block tables. A block
        // produced by WebImporter.Blocks.createBlock is a <table> whose first
        // cell text is the block name (e.g. "article-header"). So we locate each
        // block by that header-cell text, NOT by the original AR02 selector and
        // NOT by a class (the tables carry no class).
        // Match tolerantly: WebImporter.Blocks.createBlock may render the header
        // cell as "article-header", "Article Header", "Article-Header", etc.
        // Normalize both sides by stripping non-alphanumerics and lowercasing.
        const norm = (s) => (s || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
        const findBlockTable = (name) => {
          const want = norm(name);
          return [...element.querySelectorAll('table')].find((t) => {
            const cell = t.querySelector('tr > th, tr > td');
            return cell && norm(cell.textContent).startsWith(want);
          });
        };

        const headerBlock = findBlockTable('article-header');
        // The rich-text body wrapper (.AR02_article-detail) is NOT replaced by a
        // parser (only its 2 captioned images became article-image tables), so it
        // is hoisted as-is and carries the body prose + footnote + inline images.
        const articleDetail = element.querySelector('.AR02_article-detail');
        const tagsBlock = findBlockTable('tags-hashtag');
        const bannerBlock = findBlockTable('banner-newsroom');
        const cardsBlock = findBlockTable('cards-news');

        // Build the ordered list of section roots (document order). insertBefore
        // moves each node to just before #root-container, so inserting in order
        // yields the same order as top-level main children.
        const ordered = [];
        if (headerBlock) ordered.push(headerBlock);
        if (articleDetail) ordered.push(articleDetail);
        if (tagsBlock) ordered.push(tagsBlock);
        if (bannerBlock) ordered.push(bannerBlock);
        if (cardsBlock) {
          // The cards-news parser emits the "관련 컨텐츠" heading as a sibling
          // <h2>/<h3> right before the block — keep it grouped in this section.
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

        // Remove any leftover empty/structural top-level <div> (e.g. an injected,
        // absolutely-positioned tooltip overlay div that scripts append to the DOM).
        // Only drop direct children of main that have no id, no class, and no text/img —
        // i.e. not one of the hoisted section roots above.
        element.querySelectorAll(':scope > div').forEach((div) => {
          const hasContent = div.textContent.trim() || div.querySelector('img, picture, iframe, ul, table');
          if (!div.id && !div.className && !hasContent) {
            div.remove();
          }
        });
      } else {
        const anchorBlock = element.querySelector('.hero-product, .st-semi-hero-carousel');
        const grid = anchorBlock ? anchorBlock.parentElement : null;
        if (grid && rootContainer.contains(grid)) {
          while (grid.firstChild) {
            element.insertBefore(grid.firstChild, rootContainer);
          }
          rootContainer.remove();
        }
      }
    }

    // Empty spacer columns would otherwise become empty sections.
    WebImporter.DOMUtils.remove(element, [
      '.st-semi-margin',
      '.cm-semi-static-content',
    ]);
  }
}
