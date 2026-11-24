import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSeedEngagement,
  formatEngagementCount,
  formatCommentDate,
  sanitizeCommentText,
  validateComment,
  hashString,
} from '../utils/discoverEngagement.ts';
import {
  getOrCreateEngagement,
  recordItemView,
  recordItemLike,
  createItemComment,
  removeItemComment,
  recordCommentLike,
  resetEngagementStore,
} from '../server/utils/discoverEngagementStore.ts';

test('deterministic seed generation produces reproducible and varied values', () => {
  const seedA1 = generateSeedEngagement('archive:1957-03-06-dg', 1700000000000);
  const seedA2 = generateSeedEngagement('archive:1957-03-06-dg', 1700000000000);
  assert.equal(seedA1.views, seedA2.views);
  assert.equal(seedA1.likes, seedA2.likes);
  assert.equal(seedA1.commentsCount, seedA2.commentsCount);
  assert.deepEqual(seedA1.comments, seedA2.comments);

  const seedB = generateSeedEngagement('video:ghana-black-stars-highlights', 1700000000000);
  assert.notEqual(seedA1.views, seedB.views);
  assert.ok(seedA1.views > 0);
  assert.ok(seedA1.likes > 0);
  assert.ok(seedA1.commentsCount >= 2);
  assert.equal(seedA1.comments.length, seedA1.commentsCount);
});

test('hashString handles edge cases cleanly', () => {
  assert.equal(hashString(''), 0);
  assert.ok(hashString('test-key') > 0);
  assert.equal(hashString('test-key'), hashString('test-key'));
  assert.notEqual(hashString('test-key-1'), hashString('test-key-2'));
});

test('formatEngagementCount formats counts across magnitudes', () => {
  assert.equal(formatEngagementCount(0), '0');
  assert.equal(formatEngagementCount(-5), '0');
  assert.equal(formatEngagementCount(NaN), '0');
  assert.equal(formatEngagementCount(12), '12');
  assert.equal(formatEngagementCount(999), '999');
  assert.equal(formatEngagementCount(1000), '1k');
  assert.equal(formatEngagementCount(1200), '1.2k');
  assert.equal(formatEngagementCount(12500), '12k');
  assert.equal(formatEngagementCount(99999), '99k');
  assert.equal(formatEngagementCount(1000000), '1M');
  assert.equal(formatEngagementCount(2500000), '2.5M');
});

test('formatCommentDate outputs relative strings and handles invalid dates', () => {
  const now = 1700000000000;
  const thirtySecAgo = new Date(now - 30 * 1000).toISOString();
  const tenMinAgo = new Date(now - 10 * 60 * 1000).toISOString();
  const fiveHoursAgo = new Date(now - 5 * 3600 * 1000).toISOString();
  const threeDaysAgo = new Date(now - 3 * 86400 * 1000).toISOString();
  const oneMonthAgo = new Date(now - 30 * 86400 * 1000).toISOString();

  assert.equal(formatCommentDate(thirtySecAgo, now), 'Just now');
  assert.equal(formatCommentDate(tenMinAgo, now), '10m ago');
  assert.equal(formatCommentDate(fiveHoursAgo, now), '5h ago');
  assert.equal(formatCommentDate(threeDaysAgo, now), '3d ago');
  assert.ok(formatCommentDate(oneMonthAgo, now).length > 0);
  assert.equal(formatCommentDate('not-a-date', now), 'Recently');
});

test('sanitizeCommentText strips markup and collapses excess linebreaks', () => {
  assert.equal(sanitizeCommentText('<script>alert("xss")</script>Hello!'), 'alert("xss")Hello!');
  assert.equal(sanitizeCommentText('Line 1\n\n\n\n\nLine 2'), 'Line 1\n\nLine 2');
  assert.equal(sanitizeCommentText('   <p>Great story</p>   '), 'Great story');
  assert.equal(sanitizeCommentText(null), '');
});

test('validateComment verifies constraints on length and author', () => {
  assert.equal(validateComment('').valid, false);
  assert.equal(validateComment('   ').valid, false);
  assert.equal(validateComment('a').valid, false);
  assert.equal(validateComment('Good').valid, true);
  assert.equal(validateComment('Good', '').cleanAuthor, 'Guest Reader');
  assert.equal(validateComment('Good', 'Ama Mensah').cleanAuthor, 'Ama Mensah');
  assert.equal(validateComment('x'.repeat(501)).valid, false);
  assert.equal(validateComment('x'.repeat(500)).valid, true);
});

test('engagement store tracks views incrementally', () => {
  resetEngagementStore();
  const key = 'story:ghana-energy-transition-2026';
  const initial = getOrCreateEngagement(key);
  const initialViews = initial.views;

  const res1 = recordItemView(key);
  assert.equal(res1.views, initialViews + 1);

  const res2 = recordItemView(key);
  assert.equal(res2.views, initialViews + 2);
});

test('engagement store handles likes toggling per user', () => {
  resetEngagementStore();
  const key = 'newspaper:daily-graphic-today';
  const initial = getOrCreateEngagement(key, 'user-1');
  const baseLikes = initial.likes;
  assert.equal(initial.isLiked, false);

  // User 1 likes
  const likeRes1 = recordItemLike(key, 'user-1', true);
  assert.equal(likeRes1.likes, baseLikes + 1);
  assert.equal(likeRes1.isLiked, true);

  // Another user likes
  const likeRes2 = recordItemLike(key, 'user-2', true);
  assert.equal(likeRes2.likes, baseLikes + 2);

  // User 1 unlikes
  const unlikeRes1 = recordItemLike(key, 'user-1', false);
  assert.equal(unlikeRes1.likes, baseLikes + 1);
  assert.equal(unlikeRes1.isLiked, false);

  // Verify fetch returns correct isLiked for user 2
  const checkUser2 = getOrCreateEngagement(key, 'user-2');
  assert.equal(checkUser2.isLiked, true);
  const checkUser1 = getOrCreateEngagement(key, 'user-1');
  assert.equal(checkUser1.isLiked, false);
});

test('engagement store handles creating, liking, and deleting comments', () => {
  resetEngagementStore();
  const key = 'archive:indep-1957';
  const initial = getOrCreateEngagement(key, 'user-author');
  const baseCommentCount = initial.commentsCount;

  // Create comment
  const { comment, commentsCount } = createItemComment(key, {
    authorName: 'Kwame Nkrumah Jr.',
    content: 'Historic milestone that forever shaped our beloved motherland.',
    userId: 'user-author',
  });

  assert.equal(commentsCount, baseCommentCount + 1);
  assert.equal(comment.authorName, 'Kwame Nkrumah Jr.');
  assert.equal(comment.isCurrentUser, true);

  // Like comment
  const commentLike = recordCommentLike(key, comment.id, 'user-fan', true);
  assert.equal(commentLike.likes, 1);
  assert.equal(commentLike.isLiked, true);

  // Unlike comment
  const commentUnlike = recordCommentLike(key, comment.id, 'user-fan', false);
  assert.equal(commentUnlike.likes, 0);
  assert.equal(commentUnlike.isLiked, false);

  // Remove comment
  const deleteRes = removeItemComment(key, comment.id, 'user-author');
  assert.equal(deleteRes.success, true);
  assert.equal(deleteRes.commentsCount, baseCommentCount);
});

test('api handler handles engagement, view, and like requests', async () => {
  resetEngagementStore();
  const { readFile } = await import('node:fs/promises');
  const { stripTypeScriptTypes } = await import('node:module');

  const source = await readFile(new URL('../server/api/v1/discover/[...slug].ts', import.meta.url), 'utf8');
  const withoutImports = source.replace(/^import[\s\S]*?from ['"][^'"]+['"];?\n/gm, '');
  const stripped = stripTypeScriptTypes(withoutImports).replace('export default defineEventHandler', 'const __handler =');

  const store = await import('../server/utils/discoverEngagementStore.ts');

  const makeHandler = new Function(
    'deps',
    `const { defineEventHandler, getQuery, readBody, createError, getCookie, getHeader, getOrCreateEngagement, recordItemView, recordItemLike, createItemComment, removeItemComment, recordCommentLike } = deps;\n${stripped}\nreturn __handler;`,
  );

  const handler = makeHandler({
    defineEventHandler: (fn) => fn,
    getQuery: (event) => event.query || {},
    readBody: (event) => Promise.resolve(event.body || {}),
    createError: (err) => Object.assign(new Error(err.statusMessage), err),
    getCookie: (event, name) => event.cookies?.[name],
    getHeader: (event, name) => event.headers?.[name],
    ...store,
  });

  // Test GET engagement
  const res1 = await handler({
    method: 'GET',
    context: { params: { slug: ['engagement'] } },
    query: { key: 'newspaper:graphic-business' },
    headers: { 'x-user-id': 'test-user-99' },
  });
  assert.equal(res1.success, true);
  assert.equal(res1.data.itemKey, 'newspaper:graphic-business');

  // Test POST view
  const res2 = await handler({
    method: 'POST',
    context: { params: { slug: ['engagement', 'view'] } },
    body: { key: 'newspaper:graphic-business' },
  });
  assert.equal(res2.success, true);
  assert.equal(res2.views, res1.data.views + 1);

  // Test POST like
  const res3 = await handler({
    method: 'POST',
    context: { params: { slug: ['engagement', 'like'] } },
    body: { key: 'newspaper:graphic-business', liked: true },
    headers: { 'x-user-id': 'test-user-99' },
  });
  assert.equal(res3.success, true);
  assert.equal(res3.isLiked, true);

  // Test POST comment
  const res4 = await handler({
    method: 'POST',
    context: { params: { slug: ['comments'] } },
    body: {
      key: 'newspaper:graphic-business',
      authorName: 'Esi Doe',
      content: 'Excellent business reporting.',
    },
    headers: { 'x-user-id': 'test-user-99' },
  });
  assert.equal(res4.success, true);
  assert.equal(res4.comment.authorName, 'Esi Doe');
  assert.equal(res4.comment.content, 'Excellent business reporting.');
});

