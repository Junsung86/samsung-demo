import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Captioned article image for the news-article body.
 * Migrated from semiconductor.samsung.com/kr/news-events/news.
 *
 * Authored content:
 *   row 1: the image
 *   row 2: the caption text
 *
 * Renders a <figure> with an optimized <picture> and a <figcaption>.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const imgRow = rows[0];
  const captionRow = rows[1];

  const figure = document.createElement('figure');
  figure.className = 'article-image-figure';

  const img = imgRow ? imgRow.querySelector('img') : null;
  if (img) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1024' }]);
    figure.append(optimizedPic);
  }

  if (captionRow) {
    const text = captionRow.textContent.trim();
    if (text) {
      const cap = document.createElement('figcaption');
      cap.className = 'article-image-caption';
      cap.textContent = text;
      figure.append(cap);
    }
  }

  block.textContent = '';
  block.append(figure);
}
