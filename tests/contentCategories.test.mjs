import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CONTENT_CATEGORIES, contentTopic, normalizeContentSelection } from '../utils/contentCategories.ts';

test('all requested categories have unique notification topics and search terms', () => {
  assert.equal(CONTENT_CATEGORIES.length, 21);
  assert.equal(new Set(CONTENT_CATEGORIES.map(item => item.id)).size, 21);
  assert.equal(new Set(CONTENT_CATEGORIES.map(item => contentTopic(item.id))).size, 21);
  for (const item of CONTENT_CATEGORIES) {
    assert.ok(item.query.trim());
    assert.ok(item.label.trim());
    assert.match(contentTopic(item.id), /^content_[a-z_]+$/);
  }
  assert.ok(CONTENT_CATEGORIES.some(item => item.id === 'vacancy'));
  assert.ok(CONTENT_CATEGORIES.some(item => item.id === 'we_are_hiring'));
});

test('stored interests discard invalid values and duplicates', () => {
  assert.deepEqual(normalizeContentSelection(['sports', 'unknown', 12, 'sports', 'banking']), ['sports', 'banking']);
  for (const input of [null, {}, 'sports', undefined]) assert.deepEqual(normalizeContentSelection(input), []);
});

test('category browsing uses the existing protected reader and not a new content bypass', async () => {
  const page = await readFile(new URL('../pages/interests.vue', import.meta.url), 'utf8');
  assert.match(page, /searchArchives\(buildArchiveSearchRequest/);
  assert.match(page, /\/archives\/\$\{encodeURIComponent\(item.id\)\}/);
  assert.match(page, /setTopicPreferences/);
  assert.match(page, /filter\(topic => !topic.startsWith\('content_'\)\)/);
});

test('empty topic preferences do not opt a reader into every notification', async () => {
  const server = await readFile(new URL('../server/utils/pushDispatchStore.ts', import.meta.url), 'utf8');
  const client = await readFile(new URL('../composables/usePushNotifications.ts', import.meta.url), 'utf8');
  assert.match(server, /if \(!sub.topics\?\.includes\(normalizedCategory\)\) return false/);
  assert.match(client, /if \(!store.subscribedTopics.includes\(category\)\)/);
});
