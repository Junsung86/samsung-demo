import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-content-card-image';
      else div.className = 'cards-content-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // "더 보기" (load more): related-content instance shows 3 cards initially and
  // reveals 3 more per click, matching the source (3 + up to 4×3 = 15 total). The
  // button is removed once every card is visible.
  const VISIBLE = 3;
  const STEP = 3;
  const items = [...ul.children];
  if (items.length > VISIBLE) {
    block.classList.add('cards-content-collapsed');
    items.forEach((li, i) => {
      if (i >= VISIBLE) li.classList.add('cards-content-hidden');
    });

    const moreWrap = document.createElement('div');
    moreWrap.className = 'cards-content-more';
    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'cards-content-more-btn';
    const isEn = /^\/(content\/)?en(\/|$)/.test(window.location.pathname);
    moreBtn.textContent = isEn ? 'See more' : '더 보기';
    moreBtn.addEventListener('click', () => {
      const hidden = items.filter((li) => li.classList.contains('cards-content-hidden'));
      hidden.slice(0, STEP).forEach((li) => li.classList.remove('cards-content-hidden'));
      if (!items.some((li) => li.classList.contains('cards-content-hidden'))) {
        block.classList.remove('cards-content-collapsed');
        moreWrap.remove();
      }
    });
    moreWrap.append(moreBtn);
    block.append(moreWrap);
  }
}
