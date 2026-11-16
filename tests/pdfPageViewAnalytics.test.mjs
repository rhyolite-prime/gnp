// Run with: node --test tests/pdfPageViewAnalytics.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import {
  createPdfPageViewTracker,
  normalizeEditionDate,
  resolveEngagementDeviceType,
} from '../utils/pdfPageViewTracker.ts';
import { updateUserEngagementMetrics } from '../services/newsPapers.ts';

const SAMPLE_NEWSPAPER = {
  id: '669ea40e-9c0b-444f-81e7-bc3b9776dc2d',
  uniqueId: 'ent-unique-998877',
  publicationId: 'pub-daily-graphic',
  publicationName: 'Daily Graphic',
  publicationDate: '2026-11-15T05:30:00Z',
  editionNumber: '23202',
  title: 'Daily Graphic — Sun, 15 Nov 2026',
};

test('records individual page view counts across initial open, turns, revisits, headline jumps, and scrubs', () => {
  let clockMs = Date.parse('2026-11-15T08:00:00.000Z');
  const tracker = createPdfPageViewTracker({
    sessionId: 'sess-001',
    now: () => clockMs,
  });

  tracker.setTotalPages(48);

  // Page 1 opened initially for 15s
  assert.equal(tracker.recordPageView(1, 'initial'), true);
  clockMs += 15_000;

  // Turn forward to Page 2 for 22s
  assert.equal(tracker.recordPageView(2, 'next'), true);
  clockMs += 22_000;

  // Turn back to Page 1 for 8s (second view of Page 1)
  assert.equal(tracker.recordPageView(1, 'previous'), true);
  clockMs += 8_000;

  // Jump via headline to Page 14 for 35s
  assert.equal(tracker.recordPageView(14, 'headline'), true);
  clockMs += 35_000;

  // Scrub progress bar to Page 6 for 10s
  assert.equal(tracker.recordPageView(6, 'scrub'), true);
  clockMs += 10_000;

  // Revisit Page 14 for 5s (second view of Page 14)
  assert.equal(tracker.recordPageView(14, 'jump'), true);
  clockMs += 5_000;

  assert.deepEqual(tracker.getPageViewCounts(), {
    '1': 2,
    '2': 1,
    '6': 1,
    '14': 2,
  });

  const payload = tracker.buildPayload({
    newspaper: SAMPLE_NEWSPAPER,
    uniqueId: 'route-unique-123',
    deviceType: 'web',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    viewport: { width: 1440, height: 900 },
    flushReason: 'unmount',
  });

  assert.ok(payload);
  assert.equal(payload.sessionId, 'sess-001');
  assert.equal(payload.newspaperId, SAMPLE_NEWSPAPER.id);
  assert.equal(payload.uniqueId, 'route-unique-123');
  assert.equal(payload.publicationId, 'pub-daily-graphic');
  assert.equal(payload.publicationName, 'Daily Graphic');
  assert.equal(payload.publicationDate, '2026-11-15');
  assert.equal(payload.editionNumber, '23202');
  assert.equal(payload.totalPages, 48);
  assert.equal(payload.pagesRead, 4); // pages 1, 2, 6, 14
  assert.equal(payload.totalPageViews, 6); // 2 + 1 + 1 + 2
  assert.equal(payload.readingProgress, 8.33); // (4 / 48) * 100
  assert.equal(payload.furthestPageReached, 14);
  assert.equal(payload.lastPageViewed, 14);
  assert.equal(payload.timeSpentSeconds, 95); // 15 + 22 + 8 + 35 + 10 + 5
  assert.equal(payload.deviceType, 'web');
  assert.deepEqual(payload.viewport, { width: 1440, height: 900 });
  assert.equal(payload.flushReason, 'unmount');
  assert.equal(payload.startedAt, '2026-11-15T08:00:00.000Z');
  assert.equal(payload.endedAt, '2026-11-15T08:01:35.000Z');

  assert.deepEqual(payload.pageViews, [
    {
      pageNumber: 1,
      viewCount: 2,
      timeSpentSeconds: 23, // 15 + 8
      firstViewedAt: '2026-11-15T08:00:00.000Z',
      lastViewedAt: '2026-11-15T08:00:37.000Z',
    },
    {
      pageNumber: 2,
      viewCount: 1,
      timeSpentSeconds: 22,
      firstViewedAt: '2026-11-15T08:00:15.000Z',
      lastViewedAt: '2026-11-15T08:00:15.000Z',
    },
    {
      pageNumber: 6,
      viewCount: 1,
      timeSpentSeconds: 10,
      firstViewedAt: '2026-11-15T08:01:20.000Z',
      lastViewedAt: '2026-11-15T08:01:20.000Z',
    },
    {
      pageNumber: 14,
      viewCount: 2,
      timeSpentSeconds: 40, // 35 + 5
      firstViewedAt: '2026-11-15T08:00:45.000Z',
      lastViewedAt: '2026-11-15T08:01:30.000Z',
    },
  ]);
});

test('pauses dwell-time accrual while hidden and resumes without inflating page view counts', () => {
  let clockMs = Date.parse('2026-11-15T09:00:00.000Z');
  const tracker = createPdfPageViewTracker({
    sessionId: 'sess-pause',
    now: () => clockMs,
  });

  tracker.setTotalPages(24);
  tracker.recordPageView(1, 'initial');

  // Active reading for 12s
  clockMs += 12_000;
  tracker.pause();

  // Tab sits in the background for 10 minutes — must not count toward reading time
  clockMs += 600_000;
  tracker.resume();

  // Reader reads for another 8s on Page 1, then moves to Page 2 for 10s
  clockMs += 8_000;
  tracker.recordPageView(2, 'next');
  clockMs += 10_000;

  const payload = tracker.buildPayload({ newspaper: SAMPLE_NEWSPAPER });
  assert.ok(payload);
  assert.deepEqual(payload.pageViewCounts, { '1': 1, '2': 1 });
  assert.equal(payload.timeSpentSeconds, 30); // 12 + 8 + 10
  assert.equal(payload.pageViews[0].timeSpentSeconds, 20);
  assert.equal(payload.pageViews[1].timeSpentSeconds, 10);
});

test('rejects invalid or out-of-range page numbers and suppresses empty or unauthenticated payloads', () => {
  const tracker = createPdfPageViewTracker({ sessionId: 'sess-guard' });
  tracker.setTotalPages(16);

  // No pages viewed yet -> null payload and no unflushed activity
  assert.equal(tracker.hasUnflushedActivity(), false);
  assert.equal(tracker.buildPayload({ newspaper: SAMPLE_NEWSPAPER }), null);

  for (const invalid of [0, -1, 1.5, NaN, Infinity, 17, 999, null, undefined, '1']) {
    assert.equal(tracker.recordPageView(invalid), false, `Expected ${String(invalid)} to be rejected`);
  }

  assert.equal(tracker.hasUnflushedActivity(), false);
  assert.deepEqual(tracker.getPageViewCounts(), {});

  // Valid view, but missing newspaper.id -> null payload
  assert.equal(tracker.recordPageView(1, 'initial'), true);
  assert.equal(tracker.buildPayload({ newspaper: null }), null);
  assert.equal(tracker.buildPayload({ newspaper: { id: '   ' } }), null);
});

test('deduplicates repeated lifecycle flushes unless new page views occur', () => {
  const tracker = createPdfPageViewTracker({ sessionId: 'sess-dedupe' });
  tracker.setTotalPages(32);

  tracker.recordPageView(1, 'initial');
  tracker.recordPageView(2, 'next');
  assert.equal(tracker.hasUnflushedActivity(), true);

  // First flush (e.g. edition_switch or pagehide) marks state as flushed
  tracker.markFlushed();
  assert.equal(tracker.hasUnflushedActivity(), false);

  // Subsequent page view re-arms unflushed activity
  tracker.recordPageView(3, 'next');
  assert.equal(tracker.hasUnflushedActivity(), true);

  // Reset starts a brand-new session cleanly
  tracker.reset({ sessionId: 'sess-fresh' });
  assert.equal(tracker.sessionId, 'sess-fresh');
  assert.equal(tracker.hasUnflushedActivity(), false);
  assert.deepEqual(tracker.getPageViewCounts(), {});
});

test('normalizes edition dates and classifies mobile, tablet, and web devices accurately', () => {
  assert.equal(normalizeEditionDate('2026-11-15T05:30:00Z'), '2026-11-15');
  assert.equal(normalizeEditionDate('2026-11-15 05:30:00'), '2026-11-15');
  assert.equal(normalizeEditionDate('  2026-11-15  '), '2026-11-15');
  assert.equal(normalizeEditionDate(''), '');
  assert.equal(normalizeEditionDate(null), '');

  // User-Agent driven classifications (including iPad & Android tablets)
  assert.equal(
    resolveEngagementDeviceType({
      viewportWidth: 1180,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15',
    }),
    'tablet',
  );
  assert.equal(
    resolveEngagementDeviceType({
      viewportWidth: 1280,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel Tablet) AppleWebKit/537.36',
    }),
    'tablet',
  );
  assert.equal(
    resolveEngagementDeviceType({
      viewportWidth: 390,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) Mobile/15E148',
    }),
    'mobile',
  );
  assert.equal(
    resolveEngagementDeviceType({
      viewportWidth: 412,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 Mobile Safari/537.36',
    }),
    'mobile',
  );

  // Viewport fallback when UA is generic desktop
  const desktopUa = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130.0.0.0';
  assert.equal(resolveEngagementDeviceType({ viewportWidth: 640, userAgent: desktopUa }), 'mobile');
  assert.equal(resolveEngagementDeviceType({ viewportWidth: 900, userAgent: desktopUa }), 'tablet');
  assert.equal(resolveEngagementDeviceType({ viewportWidth: 1440, userAgent: desktopUa }), 'web');
});

test('updateUserEngagementMetrics sends keepalive bearer POST via captured transport and falls back to gnpUserHttpClient', async () => {
  const tracker = createPdfPageViewTracker({
    sessionId: 'sess-service',
    now: () => Date.parse('2026-11-15T10:00:00.000Z'),
  });
  tracker.setTotalPages(20);
  tracker.recordPageView(1, 'initial');
  tracker.recordPageView(5, 'headline');

  const payload = tracker.buildPayload({
    newspaper: SAMPLE_NEWSPAPER,
    uniqueId: 'ent-777',
    deviceType: 'mobile',
    userAgent: 'TestAgent/1.0',
    flushReason: 'pagehide',
  });

  const originalFetch = globalThis.fetch;
  const fetchCalls = [];
  globalThis.fetch = async (url, options) => {
    fetchCalls.push({ url, options });
    return new Response(JSON.stringify({ success: true, result: {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const ok = await updateUserEngagementMetrics(payload, {
      apiBase: 'https://api.example/api/v1/',
      accessToken: 'jwt-token-123',
      keepalive: true,
    });
    assert.equal(ok, true);
    assert.equal(fetchCalls.length, 1);
    assert.equal(fetchCalls[0].url, 'https://api.example/api/v1/news-papers/update-user-engagement');
    assert.equal(fetchCalls[0].options.method, 'POST');
    assert.equal(fetchCalls[0].options.keepalive, true);
    assert.equal(fetchCalls[0].options.headers.Authorization, 'Bearer jwt-token-123');
    assert.equal(fetchCalls[0].options.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(fetchCalls[0].options.body), payload);

    // 204 empty-body tolerance
    globalThis.fetch = async () => new Response(null, { status: 204 });
    assert.equal(
      await updateUserEngagementMetrics(payload, { apiBase: 'https://api.example/api/v1' }),
      true,
    );

    // Non-2xx failure
    globalThis.fetch = async () => new Response('Server error', { status: 500 });
    assert.equal(
      await updateUserEngagementMetrics(payload, { apiBase: 'https://api.example/api/v1/' }),
      false,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }

  // Fallback path when transport is omitted
  let clientArgs = null;
  globalThis.gnpUserHttpClient = async (path, baseURL, options) => {
    clientArgs = { path, baseURL, options };
    return { success: true, result: {} };
  };

  const fallbackOk = await updateUserEngagementMetrics(payload);
  assert.equal(fallbackOk, true);
  assert.equal(clientArgs.path, 'news-papers/update-user-engagement');
  assert.equal(clientArgs.options.method, 'post');
  assert.equal(clientArgs.options.body, payload);
});

test('NewspaperReader and open.vue are instrumented end-to-end for per-page view tracking', async () => {
  const readerSource = await readFile(
    new URL('../components/NewspaperReader.vue', import.meta.url),
    'utf8',
  );
  const openPageSource = await readFile(
    new URL('../pages/newspapers/[id]/open.vue', import.meta.url),
    'utf8',
  );

  // NewspaperReader emits document-loaded and page-view on navigation, not on zoom/resize
  assert.match(readerSource, /defineEmits\(\['document-loaded',\s*'page-view'\]\)/);
  assert.match(readerSource, /emit\('document-loaded',\s*\{\s*totalPages:\s*pdfDoc\.numPages\s*\}\)/);
  assert.match(readerSource, /notifyPageView\(1,\s*null,\s*'initial'\)/);
  assert.match(readerSource, /notifyPageView\(target,\s*previousPage,\s*dir\s*>\s*0\s*\?\s*'next'\s*:\s*'previous'\)/);
  assert.match(readerSource, /notifyPageView\(target,\s*previousPage,\s*trigger\)/);
  assert.match(readerSource, /jumpTo\(article\.page,\s*'headline'\)/);
  assert.match(readerSource, /jumpTo\(target,\s*'scrub'\)/);

  // open.vue wires NewspaperReader events to createPdfPageViewTracker and flushes on exit
  assert.match(openPageSource, /@document-loaded="handleDocumentLoaded"/);
  assert.match(openPageSource, /@page-view="handlePageView"/);
  assert.match(openPageSource, /createPdfPageViewTracker\(/);
  assert.match(openPageSource, /flushEngagementMetrics\('edition_switch'\)/);
  assert.match(openPageSource, /flushEngagementMetrics\('pagehide'\)/);
  assert.match(openPageSource, /flushEngagementMetrics\('unmount'\)/);
  assert.match(openPageSource, /keepalive:\s*true/);
});

test('pdf.get.ts streams PDF bytes and tracks initial open with consistent deviceType classification', async () => {
  const source = await readFile(new URL('../server/api/pdf.get.ts', import.meta.url), 'utf8');
  const stripped = stripTypeScriptTypes(
    source.replace(/^import[\s\S]*?from ['"][^'"]+['"];?\n/gm, ''),
  ).replace('export default ', 'const __handler = ');

  const makeHandler = new Function(
    'deps',
    `const { createHash, fs, path, getHeaders, defineEventHandler, getQuery, createError, useRuntimeConfig, setHeader, fetch, console } = deps; ${stripped}\nreturn __handler;`,
  );

  for (const [ua, expectedDevice] of [
    ['Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X)', 'tablet'],
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) Mobile/15E148', 'mobile'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'web'],
  ]) {
    const calls = [];
    const uniquePaperId = `np-test-${expectedDevice}-${Date.now()}`;
    const handler = makeHandler({
      createHash,
      fs: {
        readFile: () => Promise.reject(new Error('cache miss')),
        writeFile: () => Promise.resolve(),
      },
      path,
      getHeaders: (event) => event.headers,
      defineEventHandler: (fn) => fn,
      getQuery: (event) => event.query,
      createError: (opts) => Object.assign(new Error(opts.statusMessage), opts),
      useRuntimeConfig: () => ({ public: { proxyApiBaseURL: 'https://api.example/api/v1/' } }),
      setHeader: (event, k, v) => {
        (event.responseHeaders ||= {})[k] = v;
      },
      console: { log: () => {}, error: () => {} },
      fetch: async (url, options) => {
        calls.push({ url, options });
        if (url.endsWith('subscription/grant-newspaper-access')) {
          return new Response(
            JSON.stringify({
              success: true,
              result: { id: uniquePaperId, fileType: 'pdf', publicationId: 'pub-1' },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url.includes('g3/get-file/gnp-master-documents/')) {
          return new Response('%PDF-1.7-bytes', { status: 200 });
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      },
    });

    const jwtPayload = Buffer.from(
      JSON.stringify({ sub: 'usr-42', email: 'reader@example.com' }),
    ).toString('base64url');
    const event = {
      query: { uniqueId: 'ent-unique-42', accessToken: `h.${jwtPayload}.s` },
      headers: { 'user-agent': ua },
      context: {},
    };

    const result = await handler(event);
    assert.equal(result.toString(), '%PDF-1.7-bytes');
    assert.equal(event.responseHeaders['Content-Type'], 'application/pdf');

    const trackCall = calls.find((c) => c.url.endsWith('news-papers/track-user-engagement'));
    assert.ok(trackCall);
    const trackedBody = JSON.parse(trackCall.options.body);
    assert.equal(trackedBody.newspaperId, uniquePaperId);
    assert.equal(trackedBody.deviceType, expectedDevice);
    assert.equal(trackedBody.userAgent, ua);
  }
});

