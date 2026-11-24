import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRelatedArchivePayload, keepReadingPages, relatedArchivePages, isCurrentArchivePage, currentArchivePage, editionPages, isSameEdition, rankRelatedArchives, archiveThumbnail } from '../utils/archiveRecommendations.ts';
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

test('the page list keeps the page being read, which keep-reading leaves out', () => {
  const record = (newspaperId, pageNumber) => ({ ...API_RESULT[0], newspaperId, pageNumber });
  const records = [record('n2', 2), record(API_METADATA.newspaperId, 1), record('n2', 2), record('', 3)];
  const all = relatedArchivePages(records, API_METADATA);
  assert.deepEqual(all.map(page => page.id), ['n2', API_METADATA.newspaperId]);
  assert.deepEqual(all.map(page => isCurrentArchivePage(page, 'route-id', API_METADATA)), [false, true]);
  assert.equal(isCurrentArchivePage(all[0], 'n2', API_METADATA), true);
  assert.equal(isCurrentArchivePage(all[0], 'route-id', null), false);
  assert.deepEqual(keepReadingPages(records, API_METADATA, 'route-id').map(page => page.id), ['n2']);
});

test('the pane lists the page being read in page order among the other pages', () => {
  const others = keepReadingPages([item('p10', 10), item('p2', 2), item('p4', 4)], metadata, 'p3');
  const current = relatedArchivePages([item('p3', 3)], metadata)[0];
  assert.deepEqual(editionPages(others, current).map(page => page.pageNumber), ['2', '3', '4', '10']);
  assert.deepEqual(editionPages([...others, current], current).map(page => page.id), ['p2', 'p3', 'p4', 'p10']);
});

test('a page being read whose number is unknown leads the pane, ahead of other editions', () => {
  const others = keepReadingPages([item('other', 1, { publicationName: 'The Mirror' }), item('p2', 2)], metadata, 'route-id');
  const current = currentArchivePage('route-id', { ...metadata, fileType: 'PDF' });
  assert.deepEqual(current, { id: 'route-id', newspaperId: 'edition1', publicationName: 'Daily Graphic', publicationDate: '2026-11-13', pageNumber: '', thumbnailId: '', fileType: 'PDF', sameEdition: true });
  assert.deepEqual(editionPages(others, current).map(page => page.id), ['route-id', 'p2', 'other']);
});

test('the left pane uses the related-archived-content API and opens pages in the same reader', async () => {
  const { readFile } = await import('node:fs/promises');
  const read = path => readFile(new URL(path, import.meta.url), 'utf8');
  const pane = await read('../components/archives/ArchiveEditionPages.vue');
  const related = await read('../components/ArchivePageRecommendations.vue');
  const page = await read('../pages/archives/[id].vue');

  // Pane: data source, stale-response guard, in-app navigation, internal scrolling.
  assert.match(pane, /getRelatedArchivedContent\(buildRelatedArchivePayload\(currentId, metadata\)\)/);
  assert.match(pane, /keepReadingPages\(/);
  assert.doesNotMatch(pane, /publicationDate: date.value/);
  assert.match(pane, /request !== generation/);
  assert.match(pane, /failedThumbnails.add\(page.id\)/);
  assert.match(pane, /<NuxtLink\s+:to="`\/archives\/\$\{encodeURIComponent\(page.id\)\}`"/);
  assert.match(pane, /:aria-current="isCurrent\(page\) \? 'page' : undefined"/);
  assert.match(pane, /lg:overflow-y-auto/);
  assert.match(pane, /list.scrollBy\(/);
  assert.doesNotMatch(pane, /scrollIntoView/);

  // The list lives in the pane only; the section below the reader keeps the search matches.
  assert.match(related, /Related High-Ranking Results/);
  assert.match(related, /rankRelatedArchives\(props.cachedItems, props.currentId\).length < 3/);
  assert.doesNotMatch(related, /getRelatedArchivedContent|More pages from this edition/);

  // Page: pane beside the reader, one page instance for every archive, no window jump on a page change.
  assert.match(page, /<ArchiveEditionPages[\s\S]*?:current-id="archiveId"[\s\S]*?\/>[\s\S]*?<ArchiveDocumentViewer/);
  assert.match(page, /key: 'archive-detail'/);
  assert.match(page, /scrollToTop: \(to, from\) => to.name !== from.name/);
  assert.match(page, /<ArchiveDocumentViewer[\s\S]*?:key="archiveId"/);
  assert.match(page, /<ArchivePageRecommendations/);
  assert.match(page, /:query="appliedQuery"/);
});
