import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { CONTENT_CATEGORIES } from '../utils/contentCategories.ts';
import * as feed from '../utils/discoverFeed.ts';

// Exercise the loader with deterministic APIs, without Nuxt or network dependencies.
const source = await readFile(new URL('../composables/useDiscoverFeed.ts', import.meta.url), 'utf8');
const withoutImports = source.replace(/^import[\s\S]*?from ['"][^'"]+['"];?\n/gm, '');
const script = stripTypeScriptTypes(withoutImports).replace('export function useDiscoverFeed', 'function useDiscoverFeed');
const names = ['ref', 'computed', 'onBeforeUnmount', 'CONTENT_CATEGORIES', 'searchArchives', 'buildArchiveSearchRequest', 'getNewsPapers', 'getTopStories', 'getVideos', 'archiveFeedItem', 'newspaperFeedItem', 'storyFeedItem', 'videoFeedItem', 'personaliseFeedItem', 'mixDiscoverBatch', 'shuffleFeed'];
const build = new Function('dependencies', `const { ${names.join(', ')} } = dependencies;\n${script}\nreturn useDiscoverFeed();`);
const empty = () => ({ data: [], totalPages: 0 });
const paper = id => ({ id, title: id, categories: [], tags: [], isPublished: true });
function loader(overrides = {}) {
  return build({
    ref: value => ({ value }), computed: getter => ({ get value() { return getter(); } }), onBeforeUnmount: () => {},
    CONTENT_CATEGORIES, ...feed,
    buildArchiveSearchRequest: input => input,
    searchArchives: async () => empty(), getNewsPapers: async () => empty(), getVideos: async () => empty(), getTopStories: async () => [],
    ...overrides,
  });
}

test('loader advances each source independently and stops when its catalogue ends', async () => {
  const pages = [];
  const state = loader({ getNewsPapers: async ({ pageNo }) => { pages.push(pageNo); return { data: [paper(`p${pageNo}`)], totalPages: 2 }; } });
  await state.reset([]);
  assert.equal(state.items.value.length, 1);
  assert.equal(state.more.value, true);
  await state.loadMore();
  assert.deepEqual(pages, [1, 2]);
  assert.equal(state.items.value.length, 2);
  assert.equal(state.finished.value, true);
  await state.loadMore();
  assert.deepEqual(pages, [1, 2]);
});

test('partial failures keep other results and retry the failed source without skipping a page', async () => {
  const attempts = [];
  let fail = true;
  const state = loader({
    getVideos: async ({ pageNo }) => { attempts.push(pageNo); if (fail) throw new Error('Offline'); return { data: [{ id: 'v1', title: 'Video' }], totalPages: 1 }; },
    getNewsPapers: async () => ({ data: [paper('p1')], totalPages: 1 }),
  });
  await state.reset([]);
  assert.equal(state.items.value.length, 1);
  assert.equal(state.errors.value[0].id, 'videos');
  fail = false;
  await state.loadMore();
  assert.deepEqual(attempts, [1, 1]);
  assert.equal(state.errors.value.length, 0);
  assert.equal(state.items.value.length, 2);
});

test('requests at most two interest searches per batch and retains general exploration', async () => {
  const queries = [];
  const state = loader({ searchArchives: async ({ query }) => { queries.push(query || ''); return empty(); } });
  await state.reset(CONTENT_CATEGORIES.map(item => item.id));
  assert.equal(queries.filter(Boolean).length, 2);
  assert.ok(queries.includes(''));
  assert.equal(state.more.value, true);
});

test('a shuffle ignores late responses from its previous session', async () => {
  let resolveOld;
  let calls = 0;
  const state = loader({ getNewsPapers: async () => {
    calls++;
    if (calls === 1) return new Promise(resolve => { resolveOld = resolve; });
    return { data: [paper('current')], totalPages: 1 };
  } });
  const old = state.reset([]);
  await state.reset([]);
  resolveOld({ data: [paper('stale')], totalPages: 1 });
  await old;
  assert.deepEqual(state.items.value.map(item => item.key), ['newspaper:current']);
  assert.equal(state.loading.value, false);
});

test('simultaneous load triggers do not issue duplicate page requests', async () => {
  let resolve;
  let calls = 0;
  const state = loader({ getNewsPapers: async () => { calls++; return new Promise(done => { resolve = done; }); } });
  const first = state.reset([]);
  await state.loadMore();
  assert.equal(calls, 1);
  resolve(empty());
  await first;
});
