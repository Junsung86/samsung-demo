/*
 * json-ld block
 * Lets authors add or override page schema.org JSON-LD directly in content.
 * Each row holds one JSON object (or array of objects) as raw text; parsing
 * and <head> injection happens in scripts/seo-jsonld.js before this block's
 * own JS runs, so the block just needs to disappear from the rendered page.
 */

export default function decorate(block) {
  block.remove();
}
