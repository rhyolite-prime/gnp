import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateOnboardingRegistration, INTERESTS_STORAGE_KEY, ONBOARDING_SEEN_KEY } from '../utils/onboarding.ts';

const valid = {
  fullName: '  Ama   Mensah ', email: ' ama@example.com ', phoneNumber: '+233 (24) 123-4567',
  interests: ['sports', 'banking', 'sports', 'unknown'], expressLoginRequested: false,
};

test('registration normalizes contact details and only accepts known interests', () => {
  assert.deepEqual(validateOnboardingRegistration(valid), {
    fullName: 'Ama Mensah', email: 'ama@example.com', phoneNumber: '+233241234567',
    interests: ['sports', 'banking'], expressLoginRequested: false,
  });
});

test('Express Login requires an explicit boolean opt-in', () => {
  for (const value of [undefined, null, 'true', 1, false]) {
    assert.equal(validateOnboardingRegistration({ ...valid, expressLoginRequested: value }).expressLoginRequested, false);
  }
  assert.equal(validateOnboardingRegistration({ ...valid, expressLoginRequested: true }).expressLoginRequested, true);
});

test('registration rejects invalid or missing required fields', () => {
  for (const value of [null, undefined, 'text', {}, { ...valid, fullName: 'A' }, { ...valid, fullName: 'a'.repeat(121) },
    { ...valid, email: 'ama@' }, { ...valid, phoneNumber: '123' }, { ...valid, phoneNumber: '+233abc1234567' },
    { ...valid, interests: [] }, { ...valid, interests: ['invalid'] }]) {
    assert.throws(() => validateOnboardingRegistration(value));
  }
});

test('interest persistence is shared with the interests page; first-visit marker is separate', async () => {
  const interests = await readFile(new URL('../pages/interests.vue', import.meta.url), 'utf8');
  assert.ok(interests.includes(INTERESTS_STORAGE_KEY));
  assert.notEqual(ONBOARDING_SEEN_KEY, INTERESTS_STORAGE_KEY);
});

test('landing wizard uses a focus-trapped dialog and never persists registration contact drafts', async () => {
  const wizard = await readFile(new URL('../components/InterestWelcomeWizard.vue', import.meta.url), 'utf8');
  assert.match(wizard, /from '@headlessui\/vue'/);
  assert.match(wizard, /seenThisSession/);
  assert.match(wizard, /!auth.isAuthenticated/);
  assert.match(wizard, /expressLoginRequested: false/);
  assert.match(wizard, /Browse my interests without registering/);
  assert.match(wizard, /\/account\?setupExpressLogin=1/);
  const writes = wizard.split('\n').filter(line => /(?:localStorage|sessionStorage)\.setItem/.test(line));
  assert.equal(writes.length, 2);
  assert.ok(writes.every(line => !/form\.|fullName|email|phoneNumber/.test(line)));
});

test('registration fails closed when its identity backend is unavailable', async () => {
  const endpoint = await readFile(new URL('../server/api/v1/onboarding/register.post.ts', import.meta.url), 'utf8');
  assert.match(endpoint, /statusCode: 503/);
  assert.match(endpoint, /!identity\?\.token \|\| !identity.userId/);
  assert.match(endpoint, /retry: 0/);
});

test('public width adjustment adds two pixels total and protects narrow viewport gutters', async () => {
  const css = await readFile(new URL('../assets/css/main.css', import.meta.url), 'utf8');
  assert.match(css, /max-width: calc\(80rem \+ 2px\)/);
  assert.match(css, /padding-left: calc\(1rem - 1px\)/);
  assert.match(css, /padding-right: calc\(2rem - 1px\)/);
});
