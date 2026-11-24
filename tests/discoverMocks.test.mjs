import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CONTENT_CATEGORIES } from '../utils/contentCategories.ts';
import { DISCOVER_MOCK_RECORDS, getDiscoverMockItems } from '../mocks/discover.ts';
import { mixDiscoverBatch, personaliseFeedItem } from '../utils/discoverFeed.ts';

test('sample catalogue covers every category and each content type with unique records', () => {
  assert.equal(DISCOVER_MOCK_RECORDS.length, 84);
  assert.equal(new Set(DISCOVER_MOCK_RECORDS.map(record => record.id)).size, 84);
  for (const category of CONTENT_CATEGORIES) {
    assert.deepEqual(DISCOVER_MOCK_RECORDS.filter(record => record.categoryId === category.id).map(record => record.contentType).sort(), ['archive', 'newspaper', 'story', 'video']);
  }
  for (const record of DISCOVER_MOCK_RECORDS) {
    assert.equal(record.isMock, true);
    assert.ok(record.body.includes('NOT A REAL NEWS REPORT OR OFFER'));
    assert.ok(record.publicationId);
    assert.ok(!Number.isNaN(Date.parse(record.publishedAt)));
    assert.ok(['public', 'subscriber'].includes(record.accessTier));
  }
});

test('sample cards have previews instead of fake paid-reader links or video streams', () => {
  for (const item of getDiscoverMockItems()) {
    assert.equal(item.mock, true);
    assert.equal(item.href, '');
    assert.ok(item.body);
    assert.equal(item.videoEmbed, undefined);
  }
});

test('sample feed retains preference boosting and finite deduplicated pagination', () => {
  const all = getDiscoverMockItems().map(item => personaliseFeedItem(item, ['banking']));
  const queue = mixDiscoverBatch(all, new Set(), () => 0.5);
  assert.ok(queue[0].preferred);
  assert.equal(queue[0].reason, 'Banking');
  const seen = new Set();
  let pages = 0;
  while (queue.length) {
    for (const item of queue.splice(0, 12)) { assert.ok(!seen.has(item.key)); seen.add(item.key); }
    pages++;
  }
  assert.equal(pages, 7);
  assert.equal(seen.size, 84);
});

test('Discover removes shuffle controls and exposes explicit sample/live modes and record inspection', async () => {
  const page = await readFile(new URL('../pages/discover.vue', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /shuffle again/i);
  assert.match(page, /route.query.source !== 'live'/);
  assert.match(page, /Fictional content, not live news/);
  assert.match(page, /Inspect sample backend record/);
  assert.match(page, /100dvh - 4rem/);
  assert.doesNotMatch(page, /min-height: 420px/);
});
