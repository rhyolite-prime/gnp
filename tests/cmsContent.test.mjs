// Run with: node --experimental-strip-types --test tests/cmsContent.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  mergeDiscoverCmsWithFeed,
  resolveRememberWhenSlideLink,
  sanitizeCmsUrl,
  toDiscoverFeedItem,
  validateDiscoverCmsPayload,
  validateRememberWhenSlidePayload,
} from '../utils/cmsContent.ts';
import {
  createDiscoverCmsRecord,
  createRememberWhenSlideRecord,
  deleteDiscoverCmsRecord,
  deleteRememberWhenSlideRecord,
  listDiscoverCms,
  listRememberWhenCms,
  patchDiscoverCmsStatus,
  patchRememberWhenSlideStatus,
  reorderDiscoverCmsRecords,
  reorderRememberWhenSlides,
  resetCmsStore,
  updateDiscoverCmsRecord,
  updateDiscoverCmsSettings,
  updateRememberWhenSettings,
  updateRememberWhenSlideRecord,
} from '../server/utils/cmsStore.ts';
import {
  createDiscoverCmsItem,
  createRememberWhenSlide,
  fetchDiscoverCms,
  fetchRememberWhenCms,
} from '../services/cms.ts';

test('validateDiscoverCmsPayload validates fields and blocks unsafe URLs', () => {
  const invalidTitle = validateDiscoverCmsPayload({ title: '   ', kind: 'story' });
  assert.equal(invalidTitle.valid, false);

  const unsafeImg = validateDiscoverCmsPayload({
    title: 'Story',
    kind: 'story',
    image: 'javascript:alert(1)',
  });
  assert.equal(unsafeImg.valid, false);

  const unsafeHref = validateDiscoverCmsPayload({
    title: 'Story',
    kind: 'story',
    href: 'data:text/html,<script>',
  });
  assert.equal(unsafeHref.valid, false);

  const valid = validateDiscoverCmsPayload({
    title: '<b>Ghana Budget</b> Brief',
    kind: 'video',
    excerpt: '<p>Key fiscal takeaways</p>',
    image: '/images/explore-newspapers.jpg',
    href: '/videos/v1',
    videoUrl: 'https://www.youtube.com/watch?v=TLkA0RELQ1g',
    topics: ['Business', 'Banking', 'business'],
    accessTier: 'public',
    status: 'published',
    pinned: true,
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.data?.title, 'Ghana Budget Brief');
  assert.equal(valid.data?.excerpt, 'Key fiscal takeaways');
  assert.deepEqual(valid.data?.topics, ['Business', 'Banking']);
  assert.equal(valid.data?.pinned, true);
  assert.ok(valid.data?.publishedAt);
});

test('toDiscoverFeedItem and mergeDiscoverCmsWithFeed prioritize pinned items and exclude expired/draft items', () => {
  const now = Date.parse('2026-11-24T12:00:00Z');
  const cmsItems = [
    {
      id: 'd1',
      kind: 'story',
      title: 'Regular CMS story',
      excerpt: 'Summary',
      body: 'Body',
      image: '/images/explore-newspapers.jpg',
      href: '/more/stories',
      source: 'Graphic',
      date: '2026-11-24',
      topics: ['Sports'],
      accessTier: 'public',
      videoUrl: '',
      linkedEntityId: '',
      pinned: false,
      displayOrder: 1,
      status: 'published',
      publishedAt: '2026-11-24T08:00:00Z',
      expiresAt: null,
      createdAt: '2026-11-24T08:00:00Z',
      updatedAt: '2026-11-24T08:00:00Z',
    },
    {
      id: 'd2',
      kind: 'video',
      title: 'Pinned Banking Video',
      excerpt: 'Watch now',
      body: '',
      image: '/images/explore-partners.jpg',
      href: '/videos/v2',
      source: 'GNP Video',
      date: '2026-11-24',
      topics: ['Banking'],
      accessTier: 'public',
      videoUrl: 'https://youtu.be/TLkA0RELQ1g',
      linkedEntityId: 'v2',
      pinned: true,
      displayOrder: 2,
      status: 'published',
      publishedAt: '2026-11-24T08:00:00Z',
      expiresAt: null,
      createdAt: '2026-11-24T08:00:00Z',
      updatedAt: '2026-11-24T08:00:00Z',
    },
    {
      id: 'd3',
      kind: 'story',
      title: 'Expired Story',
      excerpt: 'Old',
      body: '',
      image: '',
      href: '',
      source: 'Graphic',
      date: '2026-11-01',
      topics: [],
      accessTier: 'public',
      videoUrl: '',
      linkedEntityId: '',
      pinned: true,
      displayOrder: 1,
      status: 'published',
      publishedAt: '2026-11-01T08:00:00Z',
      expiresAt: '2026-11-10T00:00:00Z',
      createdAt: '2026-11-01T08:00:00Z',
      updatedAt: '2026-11-01T08:00:00Z',
    },
    {
      id: 'd4',
      kind: 'story',
      title: 'Draft Story',
      excerpt: 'Not live',
      body: '',
      image: '',
      href: '',
      source: 'Graphic',
      date: '2026-11-24',
      topics: [],
      accessTier: 'public',
      videoUrl: '',
      linkedEntityId: '',
      pinned: false,
      displayOrder: 1,
      status: 'draft',
      publishedAt: null,
      expiresAt: null,
      createdAt: '2026-11-24T08:00:00Z',
      updatedAt: '2026-11-24T08:00:00Z',
    },
  ];

  const feedItem = toDiscoverFeedItem(cmsItems[1]);
  assert.equal(feedItem.videoEmbed, 'https://www.youtube-nocookie.com/embed/TLkA0RELQ1g');

  const merged = mergeDiscoverCmsWithFeed(
    cmsItems,
    [{ key: 'newspaper:n1', kind: 'newspaper', title: 'Live Paper', excerpt: '', image: '', href: '/newspapers/n1', source: 'Daily Graphic', date: '2026-11-24', topics: [], preferred: false }],
    ['banking'],
    { prioritizePinned: true, nowMs: now },
  );

  assert.deepEqual(merged.map(i => i.key), ['cms:video:d2', 'cms:story:d1', 'newspaper:n1']);
  assert.equal(merged[0]?.preferred, true);
  assert.equal(merged[0]?.reason, 'Banking');
});

test('validateRememberWhenSlidePayload and link resolution enforce safe inputs', () => {
  assert.equal(validateRememberWhenSlidePayload({ label: '', date: '2026-01-01', headline: 'Hi' }).valid, false);
  assert.equal(validateRememberWhenSlidePayload({ label: 'Test', date: 'bad-date', headline: 'Hi' }).valid, false);
  assert.equal(validateRememberWhenSlidePayload({ label: 'Test', date: '2026-01-01', headline: '', archiveId: '' }).valid, false);
  assert.equal(validateRememberWhenSlidePayload({ label: 'Test', date: '2026-01-01', headline: 'Hi', ctaUrl: 'javascript:alert(1)' }).valid, false);

  const ok = validateRememberWhenSlidePayload({
    label: 'Independence Day 1957',
    date: '1957-03-06',
    publicationName: 'Daily Graphic',
    headline: 'Ghana attains independence',
    archiveId: 'arch/57',
    status: 'published',
  });
  assert.equal(ok.valid, true);
  assert.equal(resolveRememberWhenSlideLink({ archiveId: 'arch/57', ctaUrl: '/archives' }), '/archives/arch%2F57');
  assert.equal(resolveRememberWhenSlideLink({ archiveId: '', ctaUrl: 'https://graphicnewsplus.com/archives' }), 'https://graphicnewsplus.com/archives');
  assert.equal(sanitizeCmsUrl('//evil.com'), '');
});

test('cmsStore supports full Discover and Remember When CRUD, reorder, and config updates', () => {
  resetCmsStore();

  // Discover store CRUD
  const initialDiscover = listDiscoverCms();
  assert.ok(initialDiscover.items.length >= 3);

  const created = createDiscoverCmsRecord({
    kind: 'story',
    title: 'Editorial Pick',
    excerpt: 'Summary text',
    status: 'draft',
  });
  assert.equal(created.status, 'draft');

  const updated = updateDiscoverCmsRecord(created.id, { title: 'Updated Pick' });
  assert.equal(updated.title, 'Updated Pick');

  const published = patchDiscoverCmsStatus(created.id, { status: 'published', pinned: true });
  assert.equal(published.status, 'published');
  assert.equal(published.pinned, true);

  const reordered = reorderDiscoverCmsRecords([created.id, initialDiscover.items[0].id]);
  assert.equal(reordered[0].id, created.id);

  const discConfig = updateDiscoverCmsSettings({ heading: 'Curated', includeLiveCatalogue: false });
  assert.equal(discConfig.heading, 'Curated');
  assert.equal(discConfig.includeLiveCatalogue, false);

  assert.equal(deleteDiscoverCmsRecord(created.id), true);

  // Remember When store CRUD
  const initialRemember = listRememberWhenCms();
  assert.ok(initialRemember.slides.length >= 2);

  const slide = createRememberWhenSlideRecord({
    label: '10 years ago',
    date: '2016-11-24',
    publicationName: 'Daily Graphic',
    headline: 'Historic milestone',
    status: 'draft',
  });
  assert.equal(slide.status, 'draft');

  const updatedSlide = updateRememberWhenSlideRecord(slide.id, { headline: 'Updated milestone' });
  assert.equal(updatedSlide.headline, 'Updated milestone');

  const pubSlide = patchRememberWhenSlideStatus(slide.id, 'published');
  assert.equal(pubSlide.status, 'published');

  const reorderedSlides = reorderRememberWhenSlides([slide.id, initialRemember.slides[0].id]);
  assert.equal(reorderedSlides[0].id, slide.id);

  const remConfig = updateRememberWhenSettings({ title: 'Throwback', autoplayMs: 5000, fallbackToArchiveDates: false });
  assert.equal(remConfig.title, 'Throwback');
  assert.equal(remConfig.autoplayMs, 5000);
  assert.equal(remConfig.fallbackToArchiveDates, false);

  assert.equal(deleteRememberWhenSlideRecord(slide.id), true);
  resetCmsStore();
});

test('services/cms.ts calls the /api/v1/cms endpoints', async () => {
  const calls = [];
  globalThis.$fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return { success: true, result: { ok: true } };
  };

  await fetchDiscoverCms({ publishedOnly: true });
  await createDiscoverCmsItem({ title: 'Test', kind: 'story' });
  await fetchRememberWhenCms({ publishedOnly: true });
  await createRememberWhenSlide({ label: 'Today', date: '2026-11-24', headline: 'Headline' });

  assert.equal(calls[0].url, '/api/v1/cms/discover');
  assert.deepEqual(calls[0].options.query, { publishedOnly: true });
  assert.equal(calls[1].url, '/api/v1/cms/discover');
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(calls[2].url, '/api/v1/cms/remember-when');
  assert.equal(calls[3].url, '/api/v1/cms/remember-when');
  assert.equal(calls[3].options.method, 'POST');
});

test('admin navigation and public components are wired to the Discover and Remember When CMS', async () => {
  const adminLayout = await readFile(new URL('../layouts/admin.vue', import.meta.url), 'utf8');
  assert.match(adminLayout, /\/admin\/content-management\/discover/);
  assert.match(adminLayout, /\/admin\/content-management\/remember-when/);

  const discoverAdmin = await readFile(new URL('../pages/admin/content-management/discover.vue', import.meta.url), 'utf8');
  assert.match(discoverAdmin, /fetchDiscoverCms/);
  assert.match(discoverAdmin, /createDiscoverCmsItem/);

  const rememberAdmin = await readFile(new URL('../pages/admin/content-management/remember-when.vue', import.meta.url), 'utf8');
  assert.match(rememberAdmin, /fetchRememberWhenCms/);
  assert.match(rememberAdmin, /createRememberWhenSlide/);

  const discoverPage = await readFile(new URL('../pages/discover.vue', import.meta.url), 'utf8');
  assert.match(discoverPage, /fetchDiscoverCms/);
  assert.match(discoverPage, /mergeDiscoverCmsWithFeed/);

  const rememberSlider = await readFile(new URL('../components/RememberWhenSlider.vue', import.meta.url), 'utf8');
  assert.match(rememberSlider, /fetchRememberWhenCms/);
  assert.match(rememberSlider, /memoryDates/);
});
