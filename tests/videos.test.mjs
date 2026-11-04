// Run with: node --experimental-strip-types --test tests/videos.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeVideoUrl, parseVideoMetadata, parseVideoTags, getYoutubeEmbedUrl,
  formatVideoCount, formatVideoDate, formatVideoFileSize,
} from '../utils/latestVideos.ts';
import { getVideos, getVideoDetails } from '../services/newsPapers.ts';

const video = {
  id: '43a84878-9445-4e88-aeae-2428d48d622a',
  createdAt: '2026-11-01 15:00:29.513242',
  title: 'Elephants Dream',
  description: 'Two strangers explore a bizarre mechanical world in the first Blender open movie.',
  filePath: '[https://www.youtube.com/watch?v=TLkA0RELQ1g](https://www.youtube.com/watch?v=TLkA0RELQ1g)',
  thumbnailUrl: '[https://i.ytimg.com/vi/TLkA0RELQ1g/hqdefault.jpg](https://i.ytimg.com/vi/TLkA0RELQ1g/hqdefault.jpg)',
  metadata: '{"channel":"Blender","license":"CC-BY","language":"en","resolution":"1080p","youtube_id":"TLkA0RELQ1g"}',
  tags: '{animation,surreal,blender,open-movie,classic}',
  views: 25760, durationInMins: 11, fileSize: 136314880,
};

function response(data, pageNo = 1, totalPages = 1) {
  return { success: true, error: null, message: '', result: {
    data, pageNo, pageSize: 10, totalCount: data.length, totalPages,
    lowerBound: 1, upperBound: data.length,
  } };
}

test('normalizes the sample Markdown URLs and rejects unsafe/invalid URLs', () => {
  assert.equal(normalizeVideoUrl(video.thumbnailUrl), 'https://i.ytimg.com/vi/TLkA0RELQ1g/hqdefault.jpg');
  assert.equal(normalizeVideoUrl('https://example.com/image.jpg'), 'https://example.com/image.jpg');
  for (const invalid of [undefined, '', 'not a URL', 'javascript:alert(1)', 'data:text/html,hello']) {
    assert.equal(normalizeVideoUrl(invalid), '');
  }
});

test('parses stringified metadata and PostgreSQL-style tags', () => {
  assert.equal(parseVideoMetadata(video.metadata).channel, 'Blender');
  assert.deepEqual(parseVideoMetadata({ license: 'CC-BY' }), { license: 'CC-BY' });
  for (const invalid of ['{broken', 'null', '[]', '42', undefined]) {
    assert.deepEqual(parseVideoMetadata(invalid), {});
  }
  assert.deepEqual(parseVideoTags(video.tags), ['animation', 'surreal', 'blender', 'open-movie', 'classic']);
  assert.deepEqual(parseVideoTags('{"animation", "comedy"}'), ['animation', 'comedy']);
  assert.deepEqual(parseVideoTags(['animation', 'comedy']), ['animation', 'comedy']);
  assert.deepEqual(parseVideoTags('{}'), []);
  assert.deepEqual(parseVideoTags(null), []);
});

test('constructs the sample embed using metadata, with supported URL fallbacks', () => {
  assert.equal(getYoutubeEmbedUrl(video), 'https://www.youtube-nocookie.com/embed/TLkA0RELQ1g');
  for (const filePath of [video.filePath, 'https://youtu.be/TLkA0RELQ1g?t=5', 'https://www.youtube.com/embed/TLkA0RELQ1g', 'https://youtube.com/shorts/TLkA0RELQ1g']) {
    assert.equal(getYoutubeEmbedUrl({ ...video, metadata: '{broken', filePath }), 'https://www.youtube-nocookie.com/embed/TLkA0RELQ1g');
  }
  assert.equal(getYoutubeEmbedUrl({ ...video, metadata: '{"youtube_id":"Z4C82eyhwgU"}' }), 'https://www.youtube-nocookie.com/embed/Z4C82eyhwgU');
});

test('rejects arbitrary iframe sources and malformed IDs', () => {
  for (const filePath of ['https://evil.example/watch?v=TLkA0RELQ1g', 'https://youtube.com.evil.example/watch?v=TLkA0RELQ1g', 'https://youtube.com/watch?v=bad', 'javascript:alert(1)', '']) {
    assert.equal(getYoutubeEmbedUrl({ ...video, metadata: null, filePath }), null);
  }
  assert.equal(getYoutubeEmbedUrl({ ...video, metadata: '{"youtube_id":"bad<script>"}', filePath: '' }), null);
});

test('formats video statistics, file size, and API dates', () => {
  assert.equal(formatVideoCount(video.views), '25,760');
  assert.equal(formatVideoCount(undefined), '0');
  assert.equal(formatVideoFileSize(video.fileSize), '130 MB');
  assert.equal(formatVideoFileSize(undefined), 'Not specified');
  assert.equal(formatVideoDate(video.createdAt), 'November 1, 2026');
  assert.equal(formatVideoDate('broken'), 'Not specified');
});

test('catalogue service consumes the paginated result and sends pagination parameters', async () => {
  globalThis.httpClient = async (path, baseURL, options) => {
    assert.equal(path, 'news-papers/get-all-videos');
    assert.deepEqual(options.query, { pageNo: 2, pageSize: 4 });
    return response([video], 2, 2);
  };
  const page = await getVideos({ pageNo: 2, pageSize: 4 });
  assert.equal(page.data[0].id, video.id);
  assert.equal(page.totalPages, 2);
});

test('catalogue service reports failed or malformed responses', async () => {
  for (const result of [
    { success: false, message: 'Unavailable' },
    { success: true, result: [video] },
    { success: true, result: { data: null } },
    null,
  ]) {
    globalThis.httpClient = async () => result;
    await assert.rejects(getVideos());
  }
});

test('detail lookup calls the dedicated video details endpoint with the route id', async () => {
  const calls = [];
  globalThis.httpClient = async (path) => {
    calls.push(path);
    return { success: true, error: null, message: '', result: video };
  };
  assert.deepEqual(await getVideoDetails(video.id), video);
  assert.deepEqual(calls, [`news-papers/get-video-details/${video.id}`]);
});

test('detail lookup treats a missing video as not found without throwing', async () => {
  globalThis.httpClient = async (path) => {
    const error = new Error('Not Found');
    error.statusCode = 404;
    throw error;
  };
  assert.equal(await getVideoDetails(video.id), null);

  // Empty ids never reach the API.
  let called = false;
  globalThis.httpClient = async () => { called = true; return null; };
  assert.equal(await getVideoDetails(''), null);
  assert.equal(await getVideoDetails(undefined), null);
  assert.equal(called, false);
});

test('detail lookup reports an unsuccessful or empty envelope as not found', async () => {
  for (const result of [{ success: false, message: 'Gone' }, { success: true, result: null }, null]) {
    globalThis.httpClient = async () => result;
    assert.equal(await getVideoDetails(video.id), null);
  }
});

test('detail lookup preserves API errors rather than treating them as missing videos', async () => {
  globalThis.httpClient = async () => { throw new Error('Network error'); };
  await assert.rejects(getVideoDetails(video.id), /Network error/);
});
