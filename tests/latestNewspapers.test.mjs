// Run with: node --experimental-strip-types --test tests/latestNewspapers.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLocalDateKey,
  getNewspaperDateKey,
  findDailyGraphicEdition,
  getNewspaperDetailPath,
} from '../utils/latestNewspapers.ts';
import { getLatestNewsPapers } from '../services/newsPapers.ts';

const today = '2026-11-06';

// Exact projection supplied from news-papers/get-latest: no publicationName,
// publishedDate, or isPublished field, and a DG-prefixed title.
const apiEdition = {
  editionNumber: '23193',
  fileType: 0,
  id: '669ea40e-9c0b-444f-81e7-bc3b9776dc2d',
  isFree: false,
  price: '2.10',
  publicationDate: today,
  slug: 'dg-friday-november-6-2026',
  thumbnailId: '',
  title: 'DG Friday, November 6, 2026',
};

function paper(overrides = {}) {
  return {
    id: 'dg-2026-11-06',
    title: 'Daily Graphic — Fri, 06 Nov 2026',
    publicationName: 'Daily Graphic',
    publicationDate: `${today}T05:30:00`,
    publishedDate: today,
    isPublished: true,
    ...overrides,
  };
}

test('local date keys use the reader’s calendar day without UTC shifting', () => {
  assert.equal(getLocalDateKey(new Date(2026, 10, 6, 23, 30)), today);
  assert.equal(getLocalDateKey(new Date(2026, 0, 1, 0, 0)), '2026-01-01');
  assert.equal(getLocalDateKey(new Date('invalid')), '');
});

test('newspaper date keys preserve API calendar dates and timestamps', () => {
  assert.equal(getNewspaperDateKey(today), today);
  assert.equal(getNewspaperDateKey(`${today}T05:30:00Z`), today);
  assert.equal(getNewspaperDateKey(`${today} 05:30:00`), today);
  for (const value of [undefined, null, '', '06/11/2026', 'not-a-date']) {
    assert.equal(getNewspaperDateKey(value), '');
  }
});

test('selects today’s Daily Graphic from the latest feed, not another paper or day', () => {
  const match = paper();
  const feed = [
    paper({ id: 'gb-today', publicationName: 'Graphic Business' }),
    paper({ id: 'dg-yesterday', publicationDate: '2026-11-05T05:30:00', publishedDate: '2026-11-05' }),
    match,
    paper({ id: 'mirror-today', publicationName: 'The Mirror' }),
  ];
  assert.equal(findDailyGraphicEdition(feed, today), match);
  assert.equal(getNewspaperDetailPath(match.id), '/newspapers/dg-2026-11-06');
});

test('matches the exact get-latest DG response and builds its detail link', () => {
  assert.equal(findDailyGraphicEdition([apiEdition], today), apiEdition);
  assert.equal(
    getNewspaperDetailPath(apiEdition.id),
    '/newspapers/669ea40e-9c0b-444f-81e7-bc3b9776dc2d',
  );
  assert.equal(findDailyGraphicEdition([apiEdition], '2026-11-05'), null);
  assert.equal(findDailyGraphicEdition([apiEdition], '2026-11-07'), null);
});

test('recognizes DG title prefixes without matching longer unrelated prefixes', () => {
  for (const title of [
    'DG Friday, November 6, 2026',
    '  dg Friday, November 6, 2026  ',
    'DG-Friday, November 6, 2026',
    'DG: Friday, November 6, 2026',
    'DG',
  ]) {
    const edition = { ...apiEdition, title };
    assert.equal(findDailyGraphicEdition([edition], today), edition, title);
  }
  for (const title of ['DGB Friday', 'DGX Friday', 'DGraphics Friday', 'Junior DG', '', undefined]) {
    assert.equal(findDailyGraphicEdition([{ ...apiEdition, title }], today), null, String(title));
  }
});

test('selects today’s DG from a mixed latest feed without publication metadata', () => {
  const feed = [
    { ...apiEdition, id: 'business-today', title: 'GB Friday, November 6, 2026' },
    { ...apiEdition, id: 'dg-yesterday', title: 'DG Thursday, November 5, 2026', publicationDate: '2026-11-05' },
    apiEdition,
    { ...apiEdition, id: 'mirror-today', title: 'TM Friday, November 6, 2026' },
  ];
  assert.equal(findDailyGraphicEdition(feed, today), apiEdition);
});

test('matches publication names case-insensitively and falls back to publishedDate/title', () => {
  const byName = paper({ publicationName: '  daily graphic  ', publicationDate: undefined });
  assert.equal(findDailyGraphicEdition([byName], today), byName);

  const byTitle = paper({ publicationName: undefined, title: 'Daily Graphic — 06 Nov 2026' });
  assert.equal(findDailyGraphicEdition([byTitle], today), byTitle);
});

test('ignores unpublished, invalid, or non-matching editions and empty feeds', () => {
  const feed = [
    paper({ id: 'unpublished', isPublished: false }),
    paper({ id: '' }),
    paper({ id: 'other', publicationName: 'Junior Graphic', title: 'Junior Graphic' }),
    paper({ id: 'tomorrow', publicationDate: '2026-11-07T05:30:00', publishedDate: '2026-11-07' }),
  ];
  assert.equal(findDailyGraphicEdition(feed, today), null);
  assert.equal(findDailyGraphicEdition([], today), null);
  assert.equal(findDailyGraphicEdition(null, today), null);
  assert.equal(findDailyGraphicEdition([paper()], ''), null);
});

test('detail paths encode the newspaper id', () => {
  assert.equal(getNewspaperDetailPath(' edition/with spaces '), '/newspapers/edition%2Fwith%20spaces');
});

test('latest newspapers service requests the shared homepage page and preserves the DG projection', async () => {
  const result = { data: [apiEdition], pageNo: 1, totalCount: 1, totalPages: 1 };
  globalThis.httpClient = async (path, baseURL, options) => {
    assert.equal(path, 'news-papers/get-latest');
    assert.deepEqual(options.query, { pageNo: 1, pageSize: 12 });
    return { success: true, result };
  };
  const page = await getLatestNewsPapers({ pageNo: 1, pageSize: 12 });
  assert.equal(page, result);
  assert.equal(findDailyGraphicEdition(page.data, today), apiEdition);
});
