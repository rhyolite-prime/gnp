import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRelatedArchivePayload, keepReadingPages, isSameEdition, rankRelatedArchives, archiveThumbnail } from '../utils/archiveRecommendations.ts';
const metadata = { newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13' };
const item = (id, pageNumber, extra = {}) => ({ id, newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13', pageNumber, relevance: 0, ...extra });

test('keep-reading request sends the route id and publication date only', () => {
  const full = { ...metadata, fileType: 'IMAGE', hasAccess: true, tags: ['politics'] };
  assert.deepEqual(buildRelatedArchivePayload(' current ', full), { id: 'current', publicationDate: '2026-11-13' });
});
// Verbatim `result` of POST news-papers/get-related-archived-content: records carry no `id`.
const API_RESULT = [{
  fileType: 'IMAGE',
  newspaperId: '8d372f86-e003-437b-95bb-2e425578749f',
  pageNumber: 8,
  publicationDate: '1950-12-18',
  publicationName: 'Daily Graphic',
  tags: ['general-news', 'year-1950'],
  thumbnailId: 'https://res.cloudinary.com/pkdbucv7/image/upload/v1791274708/archive-thumbnails/thumb_8d372f86-e003-437b-95bb-2e425578749f_p1.jpg',
}];
const API_METADATA = { fileType: 'IMAGE', hasAccess: true, newspaperId: '060d665a-8b3e-4465-9a93-a3dd5cf07bb1', publicationDate: '1950-12-18', publicationName: 'Daily Graphic', tags: [] };
test('records without an id are kept and addressed by newspaperId', () => {
  const pages = keepReadingPages(API_RESULT, API_METADATA, 'route-id');
  assert.deepEqual(pages, [{ id: '8d372f86-e003-437b-95bb-2e425578749f', newspaperId: '8d372f86-e003-437b-95bb-2e425578749f', publicationName: 'Daily Graphic', publicationDate: '1950-12-18', pageNumber: '8', thumbnailId: API_RESULT[0].thumbnailId, fileType: 'IMAGE', sameEdition: true }]);
  assert.equal(archiveThumbnail(pages[0].thumbnailId), API_RESULT[0].thumbnailId);
});
test('records without an id drop the page being read, duplicates and unidentifiable entries', () => {
  const record = (newspaperId, pageNumber) => ({ ...API_RESULT[0], newspaperId, pageNumber });
  const records = [record('n10', 10), record(API_METADATA.newspaperId, 1), record('route-id', 5), record('n2', 2), record('n2', 2), record('', 3)];
  assert.deepEqual(keepReadingPages(records, API_METADATA, 'route-id').map(page => page.id), ['n2', 'n10']);
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
test('pages from another publication or date follow this edition and keep the API order', () => {
  const items = [item('other9', '9', { publicationDate: '1957-03-06' }), item('p4', '4', { newspaperId: 'own-id-4' }), item('other1', '1', { publicationName: 'The Mirror' }), item('p3', '3', { newspaperId: 'own-id-3' })];
  const pages = keepReadingPages(items, metadata, 'current');
  assert.deepEqual(pages.map(page => page.id), ['p3', 'p4', 'other9', 'other1']);
  assert.deepEqual(pages.map(page => page.sameEdition), [true, true, false, false]);
});
test('an edition is the same publication on the same day, whatever the newspaperId', () => {
  const loose = { newspaperId: 'another-page', publicationName: ' daily  GRAPHIC ', publicationDate: '2026-11-13T10:00:00Z' };
  assert.equal(isSameEdition(loose, metadata), true);
  assert.equal(isSameEdition({ ...loose, publicationName: 'The Mirror' }, metadata), false);
  assert.equal(isSameEdition({ ...loose, publicationDate: '2026-11-12' }, metadata), false);
  assert.equal(isSameEdition(loose, { ...metadata, publicationDate: '' }), false);
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
