/**
 * Hashtag pill row for the news-article template.
 * Migrated from semiconductor.samsung.com/kr/news-events/news.
 *
 * Authored content: one row per tag, each cell holding the tag label
 * (e.g. "#HBM4E"). Rendered as a horizontal list of pill chips.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'tags-hashtag-list';

  [...block.children].forEach((row) => {
    const label = row.textContent.trim();
    if (!label) return;
    const li = document.createElement('li');
    const link = row.querySelector('a');
    const chip = document.createElement(link ? 'a' : 'span');
    chip.className = 'tags-hashtag-chip';
    if (link) {
      chip.href = link.href;
    }
    chip.textContent = label;
    li.append(chip);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
