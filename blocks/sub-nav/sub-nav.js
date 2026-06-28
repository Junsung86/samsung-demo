export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const title = rows[0];
  const links = rows[1];

  if (title) title.classList.add('sub-nav-title');
  if (links) links.classList.add('sub-nav-links');

  // Mark the tab matching the current page as active (fallback: first tab).
  if (links) {
    const items = [...links.querySelectorAll('a')];
    const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    const current = items.find((a) => {
      const href = (a.getAttribute('href') || '').replace(/\/$/, '');
      return href && (path === href || path.endsWith(href));
    });
    const active = current || items[0];
    if (active) active.classList.add('active');
  }
}
