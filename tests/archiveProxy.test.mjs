import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { archiveAssetType, toArchiveAccessState } from '../utils/archiveAccess.ts';

const source = await readFile(new URL('../server/api/archive-file.get.ts', import.meta.url), 'utf8');
const stripped = stripTypeScriptTypes(source.replace(/^import[\s\S]*?from ['"][^'"]+['"];?\n/gm, '')).replace('export default ', 'return ');
const makeProxy = new Function('dependencies', `const { defineEventHandler, getQuery, getHeader, getCookie, setHeader, createError, archiveAssetType, useRuntimeConfig, fetch } = dependencies; ${stripped}`);
function proxy(fetch) {
  return makeProxy({
    defineEventHandler: handler => handler, getQuery: event => event.query,
    getHeader: (event, key) => event.headers?.[key], getCookie: event => event.cookie,
    setHeader: (event, key, value) => { (event.responseHeaders ||= {})[key] = value; },
    createError: options => Object.assign(new Error(options.statusMessage), options), archiveAssetType,
    useRuntimeConfig: () => ({ public: { proxyApiBaseURL: 'https://api.example/api/v1/' } }), fetch,
  });
}
const grant = (fileType, hasAccess = true) => new Response(JSON.stringify({ success: true, result: { metadata: { fileType, hasAccess, newspaperId: 'parent-edition' } } }), { headers: { 'Content-Type': 'application/json' } });

test('archive proxy fetches typed image/PDF assets with current bearer authentication', async () => {
  for (const [type, extension, mime] of [['IMAGE', 'jpg', 'image/jpeg'], ['PDF', 'pdf', 'application/pdf']]) {
    const calls = [];
    const handler = proxy(async (url, options) => {
      calls.push({ url, options });
      return calls.length === 1 ? grant(type) : new Response('asset-bytes');
    });
    const event = { query: { archiveId: 'archive-page', fileType: type }, headers: { authorization: 'Bearer current-token' } };
    const bytes = await handler(event);
    assert.equal(bytes.toString(), 'asset-bytes');
    assert.match(calls[0].url, /validate-archive-access\/archive-page$/);
    assert.equal(calls[1].url, `https://api.example/api/v1/g3/get-archived-file/gnp-master-documents/archive-page.${extension}`);
    assert.ok(calls.every(call => call.options.headers.Authorization === 'Bearer current-token'));
    assert.equal(event.responseHeaders['Content-Type'], mime);
    assert.equal(event.responseHeaders['Cache-Control'], 'private, no-store');
  }
});

test('proxy supports cookie authentication, never trusts a caller-supplied extension over metadata', async () => {
  let calls = 0;
  const handler = proxy(async (url, options) => {
    calls++;
    assert.equal(options.headers.Authorization, 'Bearer cookie-token');
    return grant('PDF');
  });
  await assert.rejects(handler({ query: { archiveId: 'id', fileType: 'IMAGE' }, cookie: 'cookie-token' }), { statusCode: 409 });
  assert.equal(calls, 1);
});

test('missing auth, traversal, denied grants and expired sessions never fetch a file', async () => {
  let calls = 0;
  const handler = proxy(async () => { calls++; return grant('PDF', false); });
  await assert.rejects(handler({ query: { archiveId: 'id', fileType: 'PDF' } }), { statusCode: 401 });
  await assert.rejects(handler({ query: { archiveId: '../id', fileType: 'PDF' }, cookie: 'token' }), { statusCode: 400 });
  await assert.rejects(handler({ query: { archiveId: 'id', fileType: 'PDF' }, cookie: 'token' }), { statusCode: 403 });
  assert.equal(calls, 1);
  const expired = proxy(async () => new Response('', { status: 401 }));
  await assert.rejects(expired({ query: { archiveId: 'id', fileType: 'PDF' }, cookie: 'expired' }), { statusCode: 401 });
});

test('storage 404 is preserved and unsupported authoritative types fail closed', async () => {
  let calls = 0;
  const missing = proxy(async () => ++calls === 1 ? grant('PDF') : new Response('', { status: 404 }));
  await assert.rejects(missing({ query: { archiveId: 'id', fileType: 'PDF' }, cookie: 'token' }), { statusCode: 404 });
  const unsupported = proxy(async () => grant('TEXT'));
  await assert.rejects(unsupported({ query: { archiveId: 'id', fileType: 'PDF' }, cookie: 'token' }), { statusCode: 415 });
});

test('async-data validation uses its captured token, not a stale implicit auth composable', async () => {
  const service = await readFile(new URL('../services/userSubscription.ts', import.meta.url), 'utf8');
  const code = stripTypeScriptTypes(service.replace(/^import[\s\S]*?from ['"][^'"]+['"];?\n/gm, '')).replace(/export async function/g, 'async function');
  const make = new Function('$fetch', 'gnpUserHttpClient', 'toArchiveAccessState', `${code}; return validateArchiveAccess;`);
  let captured;
  const validate = make(async (url, options) => {
    captured = options;
    return { success: true, result: { metadata: { fileType: 'PDF', hasAccess: true, newspaperId: 'edition' } } };
  }, () => { throw new Error('Must not use stale shared auth'); }, toArchiveAccessState);
  const state = await validate('archive-page', { accessToken: 'fresh-token', apiBase: 'https://api.example/api/v1/' });
  assert.equal(state.hasAccess, true);
  assert.equal(captured.headers.Authorization, 'Bearer fresh-token');
  assert.equal(captured.baseURL, 'https://api.example/api/v1/');
  const page = await readFile(new URL('../pages/archives/[id].vue', import.meta.url), 'utf8');
  assert.match(page, /server: false/);
  assert.match(page, /watch: \[accessToken\]/);
  assert.match(page, /getCachedData: \(\) => undefined/);
  assert.match(page, /token === accessToken.value/);
});
