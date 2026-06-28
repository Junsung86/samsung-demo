export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-spec-${cols.length}-cols`);

  // Alternate image side: every 2nd columns-spec block within the same
  // section gets the image on the left (matches the source "reverse" instances).
  // Each block is wrapped in its own .columns-spec-wrapper, so scope the
  // lookup to the enclosing section and count all columns-spec blocks.
  const scope = block.closest('.section') || block.ownerDocument;
  const allSpecs = [...scope.querySelectorAll('.columns-spec')];
  const indexAmongSpecs = allSpecs.indexOf(block);
  if (indexAmongSpecs % 2 === 1) {
    block.classList.add('columns-spec-reverse');
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-spec-img-col');
        }
      }
    });
  });

  // Restructure each spec list item into: icon + (name / value).
  // Authored markup per item: <picture>/<img> <strong>Label</strong>: value
  block.querySelectorAll('ul > li').forEach((li) => {
    const icon = li.querySelector('picture') || li.querySelector('img');
    const label = li.querySelector('strong');
    if (!label) return;

    // The value is the text following the label, e.g. ": 36 GB" -> "36 GB"
    let valueText = '';
    let node = label.nextSibling;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) valueText += node.textContent;
      else valueText += node.textContent || '';
      const next = node.nextSibling;
      node.remove();
      node = next;
    }
    valueText = valueText.replace(/^\s*[::]\s*/, '').trim();

    const text = document.createElement('div');
    text.className = 'columns-spec-item-text';

    const name = document.createElement('span');
    name.className = 'columns-spec-item-name';
    name.textContent = label.textContent.trim();

    const value = document.createElement('span');
    value.className = 'columns-spec-item-value';
    value.textContent = valueText;

    text.append(name, value);

    li.textContent = '';
    if (icon) {
      icon.classList.add('columns-spec-item-icon');
      li.append(icon);
    }
    li.append(text);
  });
}
