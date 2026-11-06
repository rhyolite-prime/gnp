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

test('latest newspapers service requests the shared homepage page and returns the paginated result', async () => {
  const result = { data: [paper()], pageNo: 1, totalCount: 1, totalPages: 1 };
  globalThis.httpClient = async (path, baseURL, options) => {
    assert.equal(path, 'news-papers/get-latest');
    assert.deepEqual(options.query, { pageNo: 1, pageSize: 12 });
    return { success: true, result };
  };
  assert.equal(await getLatestNewsPapers({ pageNo: 1, pageSize: 12 }), result);
});
