import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRelatedArchivePayload, keepReadingPages, isSameEdition, rankRelatedArchives, archiveThumbnail } from '../utils/archiveRecommendations.ts';
const metadata = { newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13' };
const item = (id, pageNumber, extra = {}) => ({ id, newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13', pageNumber, relevance: 0, ...extra });

test('keep-reading request describes the archive page being read', () => {
  const full = { ...metadata, fileType: 'IMAGE', hasAccess: true, tags: ['politics'] };
  assert.deepEqual(buildRelatedArchivePayload(' current ', full), { id: 'current', newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13', fileType: 'IMAGE', tags: ['politics'] });
  assert.deepEqual(buildRelatedArchivePayload('current', { ...metadata, tags: undefined }).tags, []);
});
test('keep-reading pages exclude the current page and duplicates and sort page numbers numerically', () => {
  const items = [item('p10', '10'), item('current', '1'), item('p2', 2), item('p2', '2'), item('', '3'), null, item('cover', '')];
  const pages = keepReadingPages(items, metadata, 'current');
  assert.deepEqual(pages.map(page => page.id), ['p2', 'p10', 'cover']);
  assert.deepEqual(pages[0], { id: 'p2', newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13', pageNumber: '2', thumbnailId: '', fileType: '', sameEdition: true });
});
test('keep-reading pages accept an array, a pagination envelope or a single record', () => {
  const ids = result => keepReadingPages(result, metadata, 'current').map(page => page.id);
  assert.deepEqual(ids([item('p2', '2')]), ['p2']);
  assert.deepEqual(ids({ data: [item('p2', '2'), item('p3', '3')], totalCount: 2 }), ['p2', 'p3']);
  assert.deepEqual(ids(item('p2', '2')), ['p2']);
  for (const empty of [undefined, null, '', {}, { data: null }, []]) assert.deepEqual(ids(empty), []);
});
test('pages from other editions follow this edition and keep the API order', () => {
  const items = [item('other9', '9', { newspaperId: 'edition2', publicationDate: '1957-03-06' }), item('p4', '4'), item('other1', '1', { newspaperId: 'edition3' }), item('p3', '3')];
  const pages = keepReadingPages(items, metadata, 'current');
  assert.deepEqual(pages.map(page => page.id), ['p3', 'p4', 'other9', 'other1']);
  assert.deepEqual(pages.map(page => page.sameEdition), [true, true, false, false]);
});
test('publication name/date fallback decides the edition when a record lacks an edition ID', () => {
  const loose = { newspaperId: '', publicationName: ' daily  GRAPHIC ', publicationDate: '2026-11-13T10:00:00Z' };
  assert.equal(isSameEdition(loose, metadata), true);
  assert.equal(isSameEdition({ ...loose, publicationName: 'The Mirror' }, metadata), false);
  assert.equal(isSameEdition(loose, { ...metadata, publicationDate: '' }), false);
  assert.equal(isSameEdition({ ...loose, newspaperId: 'edition2' }, metadata), false);
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

test('keep reading uses the related-archived-content API and related results keep the direct-link relevance fallback', async () => {
  const { readFile } = await import('node:fs/promises');
  const component = await readFile(new URL('../components/ArchivePageRecommendations.vue', import.meta.url), 'utf8');
  const page = await readFile(new URL('../pages/archives/[id].vue', import.meta.url), 'utf8');
  assert.match(component, /Related High-Ranking Results/);
  assert.match(component, /getRelatedArchivedContent\(buildRelatedArchivePayload\(props.currentId, props.metadata\)\)/);
  assert.match(component, /keepReadingPages\(result, props.metadata, props.currentId\)/);
  assert.doesNotMatch(component, /publicationDate: date.value/);
  assert.match(component, /rankRelatedArchives\(props.cachedItems, props.currentId\).length < 3/);
  assert.match(component, /request === generation/);
  assert.match(component, /failedThumbnails.add\(item.id\)/);
  assert.match(page, /<ArchivePageRecommendations/);
  assert.match(page, /:current-id="archiveId"/);
  assert.match(page, /:query="appliedQuery"/);
});
