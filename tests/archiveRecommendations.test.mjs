import test from 'node:test';
import assert from 'node:assert/strict';
import { sameEditionPages, rankRelatedArchives, archiveThumbnail } from '../utils/archiveRecommendations.ts';
const metadata = { newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13' };
const item = (id, pageNumber, extra = {}) => ({ id, newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13', pageNumber, relevance: 0, ...extra });

test('edition pages filter date, publication and edition, exclude current and sort page numbers numerically', () => {
  const items = [item('p10', 10), item('current', 1), item('p2', 2), item('p2', 2), item('old', 3, { publicationDate: '2026-11-12' }), item('otherpub', 4, { publicationName: 'The Mirror' }), item('otheredition', 5, { newspaperId: 'edition2' })];
  assert.deepEqual(sameEditionPages(items, metadata, 'current').map(item => item.id), ['p2', 'p10']);
});
test('publication name/date fallback works when a result lacks an edition ID', () => {
  const items = [item('p1', 1, { newspaperId: '', publicationName: ' daily  GRAPHIC ', publicationDate: '2026-11-13T10:00:00Z' })];
  assert.equal(sameEditionPages(items, metadata, '').length, 1);
  assert.equal(sameEditionPages(items, { ...metadata, publicationDate: '' }, '').length, 0);
});
test('related hits exclude the current page, deduplicate by best score and rank by relevance', () => {
  const items = [item('low', 1, { relevance: 0.2 }), item('high', 2, { relevance: 0.95 }), item('low', 1, { relevance: 0.8 }), item('current', 3, { relevance: 1 })];
  const ranked = rankRelatedArchives(items, 'current');
  assert.deepEqual(ranked.map(item => item.id), ['high', 'low']);
  assert.equal(ranked[1].relevance, 0.8);
  assert.equal(rankRelatedArchives(items, 'current', 1).length, 1);
  assert.deepEqual(rankRelatedArchives([], 'current'), []);
});
test('thumbnails support imported URL wrappers and local assets without executable protocols', () => {
  assert.equal(archiveThumbnail('[scan](https://example.com/page.jpg)'), 'https://example.com/page.jpg');
  assert.equal(archiveThumbnail('/images/page.jpg'), '/images/page.jpg');
  assert.equal(archiveThumbnail('javascript:alert(1)'), '');
  assert.equal(archiveThumbnail('//example.com/scan.jpg'), '');
});

test('detail recommendations retain independent date pagination and direct-link relevance fallback', async () => {
  const { readFile } = await import('node:fs/promises');
  const component = await readFile(new URL('../components/ArchivePageRecommendations.vue', import.meta.url), 'utf8');
  const page = await readFile(new URL('../pages/archives/[id].vue', import.meta.url), 'utf8');
  assert.match(component, /Related High-Ranking Results/);
  assert.match(component, /publicationDate: date.value/);
  assert.match(component, /page < result.totalPages/);
  assert.match(component, /rankRelatedArchives\(props.cachedItems, props.currentId\).length < 3/);
  assert.match(component, /request !== generation/);
  assert.match(component, /failedThumbnails.add\(item.id\)/);
  assert.match(page, /<ArchivePageRecommendations/);
  assert.match(page, /:query="appliedQuery"/);
});
