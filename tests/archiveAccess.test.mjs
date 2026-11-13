// Run with: node --experimental-strip-types --test tests/archiveAccess.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  normalizeArchiveMetadata,
  toArchiveAccessState,
  formatArchiveFileType,
  isPdfArchive,
  buildArchiveDocumentUrl,
  formatArchivePublicationDate,
  pickRelatedArchives,
} from '../utils/archiveAccess.ts';

// Trimmed copy of the subscription/validate-archive-access/{id} response.
const API_PAYLOAD = {
  error: null,
  message: 'Archive access granted',
  result: {
    metadata: {
      fileType: 'IMAGE',
      hasAccess: true,
      newspaperId: '060d665a-8b3e-4465-9a93-a3dd5cf07bb1',
      publicationDate: '1950-12-18',
      publicationName: 'Daily Graphic',
      tags: ['Jean Stock', 'Accra', 'Gold Coast Regiment', 'boxing', 'year-1950'],
    },
  },
  success: true,
  targetUrl: '',
};

test('normalizes the documented archive access payload', () => {
  assert.deepEqual(normalizeArchiveMetadata(API_PAYLOAD.result.metadata), {
    fileType: 'IMAGE',
    hasAccess: true,
    newspaperId: '060d665a-8b3e-4465-9a93-a3dd5cf07bb1',
    publicationDate: '1950-12-18',
    publicationName: 'Daily Graphic',
    tags: ['Jean Stock', 'Accra', 'Gold Coast Regiment', 'boxing', 'year-1950'],
  });
});

test('flattens the envelope into page state and keeps hasAccess verbatim', () => {
  const state = toArchiveAccessState(API_PAYLOAD);
  assert.equal(state.success, true);
  assert.equal(state.message, 'Archive access granted');
  assert.equal(state.hasAccess, true);
  assert.equal(state.metadata.publicationName, 'Daily Graphic');

  const denied = toArchiveAccessState({
    ...API_PAYLOAD,
    message: 'Archive access denied',
    result: { metadata: { ...API_PAYLOAD.result.metadata, hasAccess: false } },
  });
  assert.equal(denied.success, true);
  assert.equal(denied.hasAccess, false);
  assert.equal(denied.metadata.publicationName, 'Daily Graphic');
});

test('anything other than a literal true falls back to the paywall', () => {
  const metadata = API_PAYLOAD.result.metadata;
  for (const hasAccess of [false, 'true', 1, null, undefined]) {
    const state = toArchiveAccessState({ success: true, result: { metadata: { ...metadata, hasAccess } } });
    assert.equal(state.hasAccess, false, `hasAccess=${JSON.stringify(hasAccess)}`);
  }
});

test('tolerates failed envelopes, missing results and junk input', () => {
  for (const payload of [
    null,
    undefined,
    {},
    { success: false, message: 'Unauthorized', result: null },
    { success: true, result: null },
    { success: true, result: { metadata: null } },
    'not-an-object',
  ]) {
    const state = toArchiveAccessState(payload);
    assert.equal(state.hasAccess, false, JSON.stringify(payload));
    assert.equal(state.metadata, null, JSON.stringify(payload));
  }

  // A 401 envelope is a "no access" answer, not a crash.
  const failed = toArchiveAccessState({ success: false, message: 'Unauthorized', result: null });
  assert.equal(failed.success, false);
  assert.equal(failed.message, 'Unauthorized');
});

test('metadata without id or publication name is discarded', () => {
  assert.equal(normalizeArchiveMetadata({ hasAccess: true }), null);
  assert.equal(normalizeArchiveMetadata({ tags: ['a'] }), null);
  assert.equal(normalizeArchiveMetadata(null), null);

  // One of them is enough.
  const onlyId = normalizeArchiveMetadata({ newspaperId: 'id-1' });
  assert.equal(onlyId.newspaperId, 'id-1');
  assert.equal(onlyId.publicationName, '');
  assert.deepEqual(onlyId.tags, []);
  // Missing file type is treated as a PDF asset.
  assert.equal(onlyId.fileType, 'PDF');
});

test('tags accept an array, a single string, or nothing', () => {
  assert.deepEqual(normalizeArchiveMetadata({ newspaperId: 'n', tags: [' a ', '', 3] }).tags, ['a']);
  assert.deepEqual(normalizeArchiveMetadata({ newspaperId: 'n', tags: ' boxing ' }).tags, ['boxing']);
  assert.deepEqual(normalizeArchiveMetadata({ newspaperId: 'n', tags: null }).tags, []);
});

test('file type labels and the PDF/image decision', () => {
  assert.equal(formatArchiveFileType('IMAGE'), 'Image');
  assert.equal(formatArchiveFileType('pdf'), 'PDF');
  assert.equal(formatArchiveFileType('text'), 'Text');
  assert.equal(formatArchiveFileType(''), 'Document');
  assert.equal(formatArchiveFileType(null), 'Document');

  assert.equal(isPdfArchive('PDF'), true);
  assert.equal(isPdfArchive('pdf'), true);
  assert.equal(isPdfArchive(''), true);
  assert.equal(isPdfArchive('IMAGE'), false);
});

test('document URLs go through the server-side proxy and encode the token', () => {
  assert.equal(
    buildArchiveDocumentUrl('abc-123', 'header.payload.sig'),
    '/api/pdf?uniqueId=abc-123&accessToken=header.payload.sig',
  );
  assert.equal(
    buildArchiveDocumentUrl('a b', 'tok/en+1='),
    '/api/pdf?uniqueId=a%20b&accessToken=tok%2Fen%2B1%3D',
  );
  // No id → no URL, so the page never renders a broken reader.
  assert.equal(buildArchiveDocumentUrl('', 'token'), '');
  assert.equal(buildArchiveDocumentUrl(null, null), '');
});

test('publication dates render day-first without shifting the day', () => {
  assert.equal(formatArchivePublicationDate('1950-12-18'), '18 December 1950');
  assert.equal(formatArchivePublicationDate('1950-12-18T00:00:00Z'), '18 December 1950');
  assert.equal(formatArchivePublicationDate('unparseable'), 'unparseable');
  assert.equal(formatArchivePublicationDate(''), '');
});

test('related results skip the current document, dedupe and cap the list', () => {
  const items = [
    { id: 'current', publicationName: 'Daily Graphic' },
    { id: 'a', publicationName: 'Daily Graphic' },
    { id: 'a', publicationName: 'Daily Graphic' },
    { id: 'b', publicationName: 'The Mirror' },
    { id: 'c', publicationName: 'Graphic Sports' },
    { id: 'd', publicationName: 'Graphic Business' },
  ];

  assert.deepEqual(pickRelatedArchives(items, 'current').map((i) => i.id), ['a', 'b', 'c']);
  assert.deepEqual(pickRelatedArchives(items, 'current', 2).map((i) => i.id), ['a', 'b']);
  assert.deepEqual(pickRelatedArchives(items, 'a').map((i) => i.id), ['current', 'b', 'c']);
  assert.deepEqual(pickRelatedArchives(null, 'a'), []);
  assert.deepEqual(pickRelatedArchives(items, 'current', 0), []);
});

test('the archive access service is wired to subscription/validate-archive-access', async () => {
  // The service lives in `services/` and relies on Nuxt auto-imports, so it is
  // read rather than imported here; behaviour is covered by the pure helpers.
  const source = await readFile(new URL('../services/userSubscription.ts', import.meta.url), 'utf8');
  assert.match(source, /export async function validateArchiveAccess\(id: string\): Promise<ArchiveAccessState>/);
  assert.match(source, /subscription\/validate-archive-access\/\$\{encodeURIComponent\(archiveId\)\}/);
  // Failures never escape: the page must always receive a state object.
  assert.match(source, /catch \(error\) \{[\s\S]*?return toArchiveAccessState\(null\);/);
});
