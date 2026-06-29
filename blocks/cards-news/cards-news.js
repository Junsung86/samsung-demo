import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Related-content news card grid.
 * Each row authored as: [ image ] [ title link + publish date ].
 * Decorated DOM: ul > li > (.cards-news-card-image + .cards-news-card-body).
 * The body holds the linked title and, below it, the publish date.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    // The last paragraph of the body is the publish date.
    const body = li.querySelector('.cards-news-card-body');
    if (body) {
      const paras = [...body.querySelectorAll(':scope > p')];
      const dateEl = paras[paras.length - 1];
      if (dateEl && !dateEl.querySelector('a')) dateEl.classList.add('cards-news-date');
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';

  // Pull the preceding "관련 컨텐츠" heading (emitted as default content in the
  // sibling wrapper) into the block, so the related sidebar — heading + cards —
  // is a single self-contained unit that can be placed in the right column.
  const wrapper = block.closest('.cards-news-wrapper');
  const prevWrap = wrapper && wrapper.previousElementSibling;
  if (prevWrap && prevWrap.classList.contains('default-content-wrapper')) {
    const heading = prevWrap.querySelector('h2, h3');
    if (heading) {
      heading.classList.add('cards-news-heading');
      block.append(heading);
      if (!prevWrap.textContent.trim()) prevWrap.remove();
    }
  }

  block.append(ul);
}
