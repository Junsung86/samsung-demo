/**
 * Newsroom CTA banner for the news-article template.
 * Migrated from semiconductor.samsung.com/kr/news-events/news.
 *
 * Authored content:
 *   row 1: heading + supporting paragraph (text cell)
 *   row 2: the CTA link (outbound to the newsroom)
 *
 * Renders a full-width banner with the text on the left and the CTA on the right.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const textRow = rows[0];
  const ctaRow = rows[1];

  if (textRow) textRow.className = 'banner-newsroom-text';

  if (ctaRow) {
    ctaRow.className = 'banner-newsroom-cta';
    const link = ctaRow.querySelector('a');
    if (link) {
      link.classList.add('banner-newsroom-link');
      if (link.hostname && link.hostname !== window.location.hostname) {
        link.target = '_blank';
        link.rel = 'noopener';
      }
    }
  }
}
