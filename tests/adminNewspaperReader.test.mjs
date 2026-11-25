// Run with: node --experimental-strip-types --test tests/adminNewspaperReader.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('admin newspapers table context menu includes Read as Subscriber action and modal reader', async () => {
  const fileContent = await readFile(
    new URL('../pages/admin/content-management/newspapers.vue', import.meta.url),
    'utf8',
  );

  // Context menu item
  assert.match(fileContent, /Read as Subscriber/);
  assert.match(fileContent, /openSubscriberReader\(paper\)/);
  assert.match(fileContent, /BookOpenIcon/);

  // Reader Modal component and state
  assert.match(fileContent, /isReaderModalOpen/);
  assert.match(fileContent, /readingPaper/);
  assert.match(fileContent, /readerPdfUrl/);
  assert.match(fileContent, /<NewspaperReader/);
  assert.match(fileContent, /closeSubscriberReader/);
  assert.match(fileContent, /Subscriber Mode/);
  assert.match(fileContent, /\/newspapers\/\$\{encodeURIComponent\(readingPaper\.id\)\}\/open\?admin=1/);
});

test('middleware/basic-user-auth allows admins to access subscriber reading routes', async () => {
  const middlewareContent = await readFile(
    new URL('../middleware/basic-user-auth.ts', import.meta.url),
    'utf8',
  );

  assert.match(middlewareContent, /useAdminAuthStore/);
  assert.match(middlewareContent, /gnp-admin-user-identity/);
  assert.match(middlewareContent, /adminAuthStore\.accessToken \|\| adminCookie\.value/);
});

test('pages/newspapers/[id]/open.vue supports admin tokens and displays admin preview indicator', async () => {
  const openContent = await readFile(
    new URL('../pages/newspapers/[id]/open.vue', import.meta.url),
    'utf8',
  );

  assert.match(openContent, /useAdminAuthStore/);
  assert.match(openContent, /isAdminUser/);
  assert.match(openContent, /getAdminNewsPaperDetails/);
  assert.match(openContent, /Admin Subscriber Mode/);
});

test('server/api/pdf.get.ts supports admin fallback for reading publications', async () => {
  const pdfRouteContent = await readFile(
    new URL('../server/api/pdf.get.ts', import.meta.url),
    'utf8',
  );

  assert.match(pdfRouteContent, /admin\/get-newspaper-details/);
  assert.match(pdfRouteContent, /dev-preview/);
});
