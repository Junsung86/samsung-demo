export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const title = rows[0];
  const links = rows[1];
  const cta = rows[2];

  if (title) title.classList.add('sub-nav-title');
  if (links) links.classList.add('sub-nav-links');
  if (cta) cta.classList.add('sub-nav-cta');

  if (links) {
    const items = links.querySelectorAll('a');
    if (items.length > 0) {
      items[0].classList.add('active');
    }
  }
}
