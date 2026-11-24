// Run with: node --experimental-strip-types --test tests/archiveThumbnails.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getArchiveThumbnail } from '../services/archives.ts';

test('getArchiveThumbnail fetches g3/get-file/archive-thumbnails/{fileId}.jpg as a blob and caches the object URL', async () => {
  const calls = [];
  globalThis.gnpUserHttpClient = async (path, baseURL, options) => {
    calls.push({ path, baseURL, options });
    return new Blob(['fake-jpeg-bytes'], { type: 'image/jpeg' });
  };

  const url1 = await getArchiveThumbnail('archive-item-1');
  assert.match(url1, /^blob:/);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, 'g3/get-file/archive-thumbnails/archive-item-1.jpg');
  assert.deepEqual(calls[0].options, { responseType: 'blob' });

  // Subsequent call hits the in-memory cache without another network call.
  const url2 = await getArchiveThumbnail('archive-item-1');
  assert.equal(url2, url1);
  assert.equal(calls.length, 1);

  // forceReload revokes the cached URL and fetches a fresh blob.
  const url3 = await getArchiveThumbnail('archive-item-1', true);
  assert.match(url3, /^blob:/);
  assert.notEqual(url3, url1);
  assert.equal(calls.length, 2);
});

test('getArchiveThumbnail deduplicates concurrent requests for the same fileId', async () => {
  let calls = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });

  globalThis.gnpUserHttpClient = async (path) => {
    calls += 1;
    assert.equal(path, 'g3/get-file/archive-thumbnails/concurrent-id.jpg');
    await gate;
    return new Blob(['jpeg'], { type: 'image/jpeg' });
  };

  const p1 = getArchiveThumbnail('concurrent-id');
  const p2 = getArchiveThumbnail('concurrent-id');
  release();

  const [u1, u2] = await Promise.all([p1, p2]);
  assert.match(u1, /^blob:/);
  assert.equal(u1, u2);
  assert.equal(calls, 1);
});

test('getArchiveThumbnail returns empty string for invalid ids, non-image responses, and errors', async () => {
  let calls = 0;
  globalThis.gnpUserHttpClient = async () => {
    calls += 1;
    return new Blob(['{"error":"not found"}'], { type: 'application/json' });
  };

  assert.equal(await getArchiveThumbnail(''), '');
  assert.equal(await getArchiveThumbnail('   '), '');
  assert.equal(calls, 0);

  // JSON or empty blob responses are rejected and not cached.
  assert.equal(await getArchiveThumbnail('bad-json'), '');
  globalThis.gnpUserHttpClient = async () => new Blob([], { type: 'image/jpeg' });
  assert.equal(await getArchiveThumbnail('empty-blob'), '');

  // Network/HTTP errors degrade to empty string.
  globalThis.gnpUserHttpClient = async () => {
    throw new Error('404 Not Found');
  };
  assert.equal(await getArchiveThumbnail('missing-id'), '');

  // Next attempt after a failure still retries the network.
  globalThis.gnpUserHttpClient = async () => new Blob(['recovered'], { type: 'image/jpeg' });
  assert.match(await getArchiveThumbnail('missing-id'), /^blob:/);
});

test('pages/archives/index.vue loads archive search result thumbnails via getArchiveThumbnail(item.id)', async () => {
  const page = await readFile(new URL('../pages/archives/index.vue', import.meta.url), 'utf8');
  assert.match(page, /getArchiveThumbnail/);
  assert.match(page, /loadArchiveThumbnail\(item\.id\)/);
  assert.match(page, /thumbnailUrls\[item\.id\]/);
  assert.doesNotMatch(page, /item\.thumbnailId/);
});
