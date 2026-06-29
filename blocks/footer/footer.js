/**
 * Fetch the footer fragment. Localhost / aem up serves it at /content/footer.plain.html;
 * DA/EDS production resolves via the footer metadata path.
 */
async function fetchFooter(footerPath) {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok && footerPath) resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return null;
  const tmp = document.createElement('div');
  tmp.innerHTML = await resp.text();
  // Local (aem up) serves the footer from /content/, so its `images/...` paths must
  // be rebased to /content/images/.... On DA/EDS the published fragment references
  // EDS-hosted media as `./media_<hash>...` relative to the site root, which already
  // resolves correctly — leave those untouched.
  tmp.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && src.startsWith('images/')) {
      img.setAttribute('src', `/content/${src}`);
    }
  });
  // Social/newsroom external links open in a new tab.
  tmp.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
  return tmp;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerPath = '/footer';
  const fragment = await fetchFooter(footerPath);
  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // Fragment sections, in order: [0] sitemap (multi-column link map),
  // [1] social/newsroom channels + accessibility mark, [2] legal links + copyright.
  const sections = [...fragment.children].filter((c) => c.tagName === 'DIV');
  const [sitemapEl, topEl, bottomEl] = sections;

  // Sitemap: a multi-column link map. Locally (aem up) each category column is a
  // nested <div>; on DA/EDS the plain-html pipeline flattens those wrappers, so the
  // category headings/lists land directly under the sitemap section. Rebuild the
  // columns from the category <h2> boundaries so both shapes render identically:
  // each <h2> starts a new column and collects following nodes until the next <h2>.
  const sitemap = document.createElement('div');
  sitemap.className = 'footer-sitemap';
  if (sitemapEl) {
    const nestedCols = [...sitemapEl.children].filter((c) => c.tagName === 'DIV' && c.querySelector('h2'));
    if (nestedCols.length) {
      // Local shape: explicit column <div>s.
      nestedCols.forEach((col) => {
        col.classList.add('footer-sitemap-col');
        sitemap.append(col);
      });
    } else {
      // Flattened shape: group sibling nodes under each <h2> into a column.
      let col = null;
      [...sitemapEl.childNodes].forEach((node) => {
        if (node.nodeType === 1 && node.tagName === 'H2') {
          col = document.createElement('div');
          col.className = 'footer-sitemap-col';
          sitemap.append(col);
        }
        if (col) col.append(node);
      });
    }
  }

  const top = document.createElement('div');
  top.className = 'footer-top';
  if (topEl) top.append(...topEl.childNodes);

  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  if (bottomEl) bottom.append(...bottomEl.childNodes);

  footer.append(sitemap, top, bottom);
  block.append(footer);
}
