import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const papers = JSON.parse(fs.readFileSync(path.join(root, 'publications.json'), 'utf8'))
  .sort((a, b) => Number(b.year) - Number(a.year));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = item => {
  const url = new URL(item.url);
  if (url.protocol !== 'https:') throw new Error('Publication links must use HTTPS');
  return `<a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.label)} <span aria-hidden="true">↗</span></a>`;
};
const html = papers.map(paper => `<article class="paper" data-publication-type="${escape(paper.type)}" aria-labelledby="${escape(paper.id)}">
  <div class="paper-year mono">${escape(paper.year)}</div>
  <div class="paper-content"><div class="paper-meta"><span class="paper-venue">${escape(paper.venue)}</span><span class="paper-status ${paper.type === 'published' ? 'published' : ''}">${escape(paper.status)}</span></div>
  <h3 id="${escape(paper.id)}">${escape(paper.title)}</h3>
  <p class="paper-authors">${paper.authors.map(name => name === 'Yunlin Mao' ? `<strong>${escape(name)}</strong>` : escape(name)).join(', ')}</p>
  <p class="paper-summary">${escape(paper.summary)}</p><div class="paper-links">${paper.links.map(link).join('')}</div></div>
</article>`).join('\n');
const target = path.join(root, 'index.html');
const source = fs.readFileSync(target, 'utf8');
if (!source.includes('<!-- PUBLICATIONS:START -->')) throw new Error('Missing publications region');
fs.writeFileSync(target, source.replace(/<!-- PUBLICATIONS:START -->[\s\S]*?<!-- PUBLICATIONS:END -->/, `<!-- PUBLICATIONS:START -->\n${html}\n<!-- PUBLICATIONS:END -->`));
console.log(`Rendered ${papers.length} publications`);
