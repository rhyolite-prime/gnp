import test from 'node:test';
import assert from 'node:assert/strict';
import {
  archiveFeedItem, newspaperFeedItem, videoFeedItem, storyFeedItem,
  personaliseFeedItem, mixDiscoverBatch, shuffleFeed, feedImage, feedText,
} from '../utils/discoverFeed.ts';

const item = (key, preferred = false) => ({ key, kind: 'archive', title: key, excerpt: '', image: '', href: '/archives/x', source: 'Test', date: '', topics: [], preferred });

test('discovery shuffles without mutating the source or losing items', () => {
  const source = ['a', 'b', 'c', 'd'];
  const result = shuffleFeed(source, () => 0);
  assert.deepEqual(source, ['a', 'b', 'c', 'd']);
  assert.notDeepEqual(result, source);
  assert.deepEqual([...result].sort(), source);
  assert.deepEqual(shuffleFeed([]), []);
});

test('mix interleaves two interests with one discovery while retaining all content', () => {
  const batch = [item('p1', true), item('p2', true), item('p3', true), item('p4', true), item('g1'), item('g2')];
  const result = mixDiscoverBatch(batch, new Set(), () => 0.5);
  assert.deepEqual(result.map(value => value.preferred), [true, true, false, true, true, false]);
  assert.equal(result.length, batch.length);
});

test('mix removes overlapping searches, keeps the preferred reason and never repeats loaded IDs', () => {
  const seen = new Set(['old']);
  const result = mixDiscoverBatch([item('old'), item('a'), { ...item('a', true), reason: 'Sports' }, item('b')], seen);
  assert.equal(result.length, 2);
  assert.equal(result.find(value => value.key === 'a').reason, 'Sports');
  assert.deepEqual(mixDiscoverBatch([item('a'), item('b'), item('old')], seen), []);
});

test('general-only and preferred-only feeds still return every unique item', () => {
  assert.equal(mixDiscoverBatch([item('a'), item('b')], new Set()).length, 2);
  assert.equal(mixDiscoverBatch([item('a', true), item('b', true)], new Set()).length, 2);
  assert.deepEqual(mixDiscoverBatch([], new Set()), []);
});

test('interests match keywords and metadata, not partial unrelated words', () => {
  assert.equal(personaliseFeedItem({ ...item('a'), topics: ['BANKING'] }, ['banking']).reason, 'Banking');
  assert.equal(personaliseFeedItem({ ...item('b'), title: 'The Oscars ceremony' }, ['cars']).preferred, false);
  assert.equal(personaliseFeedItem({ ...item('c'), title: 'Exchange rates today' }, ['exchange_rates']).preferred, true);
  assert.equal(personaliseFeedItem({ ...item('d'), title: 'Sports news' }, []).preferred, false);
});

test('images reject executable URLs and previews are plain text', () => {
  for (const value of ['javascript:alert(1)', 'data:image/svg+xml,unsafe', '//other.example/image.jpg', '/\\unsafe', null]) assert.equal(feedImage(value), '');
  assert.equal(feedImage('[image](https://example.com/photo.jpg)'), 'https://example.com/photo.jpg');
  assert.equal(feedImage('/images/explore-archives.jpg'), '/images/explore-archives.jpg');
  assert.equal(feedText('<p>News <em>today</em></p>'), 'News today');
});

test('content adapters keep canonical reader routes and dedupe namespaces', () => {
  const archive = archiveFeedItem({ id: 'same/id', snippet: 'Headline', publicationName: 'Daily Graphic', categories: [], tags: [], isFree: false });
  const newspaper = newspaperFeedItem({ id: 'same/id', title: 'Edition', categories: [], tags: [], isFree: false });
  assert.equal(archive.href, '/archives/same%2Fid');
  assert.equal(newspaper.href, '/newspapers/same%2Fid');
  assert.notEqual(archive.key, newspaper.key);
  assert.equal(archive.free, false);
});

test('videos only embed validated YouTube sources; stories only inline public-access content', () => {
  const video = videoFeedItem({ id: 'v1', title: 'Video', filePath: 'https://example.com/untrusted', tags: '{sports,business}' });
  assert.equal(video.href, '/videos/v1');
  assert.equal(video.videoEmbed, undefined);
  assert.deepEqual(video.topics, ['sports', 'business']);
  const publicStory = storyFeedItem({ id: 's1', attributes: { title: 'Story', access: 1, text: '<p>Body</p>', images: {}, tags: [] } });
  assert.equal(publicStory.body, 'Body');
  const paid = storyFeedItem({ id: 's2', attributes: { title: 'Paid', access: 2, text: 'Paid content', images: {}, tags: [] } });
  assert.equal(paid.body, undefined);
  assert.equal(paid.href, '/pricing');
});
