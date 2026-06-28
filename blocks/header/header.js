// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 1025px)');

/**
 * Fetch the nav fragment. Localhost / aem up serves it at /content/nav.plain.html;
 * DA/EDS production resolves via the nav metadata path.
 */
async function fetchNav(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok && navPath) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return null;
  const tmp = document.createElement('div');
  tmp.innerHTML = await resp.text();
  // Nav images use paths relative to the nav fragment (/content/). Rebase them to
  // absolute so they resolve regardless of the current page URL.
  tmp.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('/')) {
      img.setAttribute('src', `/content/${src}`);
    }
  });
  return tmp;
}

/** Close every open top-level dropdown. */
function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
    const btn = li.querySelector(':scope > button');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  if (expanded) closeAllDropdowns(nav);
}

export default async function decorate(block) {
  const navPath = '/content/nav';
  const fragment = await fetchNav(navPath);
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';

  const sectionEls = [...fragment.children].filter((c) => c.tagName === 'DIV');
  const [brandEl, sectionsEl, toolsEl] = sectionEls;

  // --- Brand ---
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandEl) brand.append(...brandEl.childNodes);

  // --- Sections (top-level dropdowns) ---
  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  if (sectionsEl) sections.append(...sectionsEl.childNodes);

  // Each top-level <li> with a nested <ul> becomes a click-triggered dropdown.
  sections.querySelectorAll(':scope > ul > li').forEach((li) => {
    const panel = li.querySelector(':scope > ul');
    if (!panel) return;
    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');

    const trigger = li.querySelector(':scope > a');
    const label = trigger ? trigger.textContent.trim() : '';
    const triggerBtn = document.createElement('button');
    triggerBtn.type = 'button';
    triggerBtn.textContent = label;
    triggerBtn.setAttribute('aria-haspopup', 'true');
    triggerBtn.setAttribute('aria-expanded', 'false');
    li.insertBefore(triggerBtn, li.firstChild);
    if (trigger) trigger.remove();

    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = li.getAttribute('aria-expanded') === 'true';
      closeAllDropdowns(nav);
      li.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      triggerBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });

    // Group labels inside the panel: <li> without an <a> are section headings.
    panel.querySelectorAll(':scope > li').forEach((sub) => {
      if (!sub.querySelector(':scope > a')) sub.classList.add('nav-group-label');
    });
  });

  // --- Tools (search, language) ---
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (toolsEl) tools.append(...toolsEl.childNodes);

  // --- Hamburger (mobile) ---
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>';
  hamburger.querySelector('button').addEventListener('click', () => toggleMenu(nav));

  nav.append(hamburger, brand, sections, tools);
  nav.setAttribute('aria-expanded', 'false');

  // Close dropdowns on outside click / Escape.
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllDropdowns(nav);
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeAllDropdowns(nav);
      if (!isDesktop.matches) toggleMenu(nav, true);
    }
  });

  // Reset state when crossing the desktop/mobile breakpoint.
  isDesktop.addEventListener('change', () => {
    closeAllDropdowns(nav);
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
