// Run with: node --experimental-strip-types --test tests/subscriptionIdentity.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractSubscriptionIdentity,
  decodeGnpToken,
  getIdentityDisplayName,
  toBiometricUser,
} from '../utils/subscriptionIdentity.ts';
import { guestSubscription } from '../services/userSubscription.ts';

// base64url payloads of JWTs like the API mints (no signature check client-side).
const RICH_CLAIMS =
  'eyJzdWIiOiJ1c3ItMSIsInVzZXJJZCI6InVzci0xIiwidXNlcm5hbWUiOiJrd2FiZW5hX2kiLCJlbWFpbCI6ImtAZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJLd2FiZW5hIiwic3VyTmFtZSI6IkltaG90ZXAiLCJmdWxsTmFtZSI6Ikt3YWJlbmEgSW1ob3RlcCIsImV4cCI6MTkwMDAwMDAwMH0';
const SPARSE_CLAIMS = 'eyJmdWxsTmFtZSI6IkFtYSBTZXJ3YWEiLCJlbWFpbCI6ImFtYUBleGFtcGxlLmNvbSJ9';

const token = (payload = RICH_CLAIMS) => `header.${payload}.signature`;

// Shape of the response described for `subscription/guest`: the envelope is
// `success: false` but the result still carries the identity token.
const API_RESULT = {
  token: token(),
  paymentUrl: 'https://checkout.paystack.com/abc',
  reference: 'ref-1',
  userId: 'usr-1',
  username: 'kwabena_i',
  fullName: 'Kwabena Imhotep',
  email: 'k@example.com',
};

test('extracts the identity token and profile from the checkout result', () => {
  assert.deepEqual(extractSubscriptionIdentity(API_RESULT), {
    token: token(),
    userId: 'usr-1',
    username: 'kwabena_i',
    fullName: 'Kwabena Imhotep',
    email: 'k@example.com',
  });
});

test('falls back to the JWT claims when the result omits profile fields', () => {
  const identity = extractSubscriptionIdentity({ token: token(), paymentUrl: 'x' });
  assert.equal(identity.userId, 'usr-1');
  assert.equal(identity.username, 'kwabena_i');
  assert.equal(identity.email, 'k@example.com');
  assert.equal(identity.fullName, 'Kwabena Imhotep');

  // Only firstName/surName present → joined into a full name.
  assert.equal(decodeGnpToken(token(SPARSE_CLAIMS)).fullName, 'Ama Serwaa');
});

test('returns null when no token was issued, so callers keep old behaviour', () => {
  for (const result of [null, undefined, {}, { token: '' }, { token: '   ' }, { paymentUrl: 'x', userId: 'u' }]) {
    assert.equal(extractSubscriptionIdentity(result), null, JSON.stringify(result));
  }
});

test('decoding tolerates base64url, missing padding, unicode and bad input', () => {
  // No padding + url-safe characters.
  assert.equal(decodeGnpToken('h.eyJmdWxsTmFtZSI6IkFtYSBTZXJ3YWEifQ.s')?.fullName, 'Ama Serwaa');

  const unicode = Buffer.from(JSON.stringify({ fullName: 'Kwabena Ägyeman — 日本語' })).toString('base64url');
  assert.equal(decodeGnpToken(`h.${unicode}.s`)?.fullName, 'Kwabena Ägyeman — 日本語');

  for (const bad of ['', 'not-a-jwt', 'header..sig', 'a.@@@.c', null, undefined, 42]) {
    assert.equal(decodeGnpToken(bad), null, String(bad));
  }
});

test('display name and biometric payload degrade gracefully', () => {
  const identity = extractSubscriptionIdentity(API_RESULT);
  assert.equal(getIdentityDisplayName(identity), 'Kwabena Imhotep');

  assert.equal(getIdentityDisplayName({ token: 't', userId: 'u', username: 'kwabena_i', fullName: '', email: '' }), 'kwabena_i');
  assert.equal(getIdentityDisplayName({ token: 't', userId: 'u', username: '', fullName: '', email: 'k@example.com' }), 'k@example.com');
  assert.equal(getIdentityDisplayName(null), '');

  assert.deepEqual(toBiometricUser(identity), {
    id: 'usr-1',
    email: 'k@example.com',
    name: 'Kwabena Imhotep',
  });
  assert.deepEqual(toBiometricUser(null), { id: '', email: '', name: '' });
});

test('guest checkout keeps the result (and token) when the envelope is unsuccessful', async () => {
  globalThis.gnpUserHttpClient = async () => ({
    success: false,
    message: 'Failed to initialize payment',
    error: null,
    result: API_RESULT,
  });

  const response = await guestSubscription({
    firstName: 'Kwabena', lastName: 'Imhotep', email: 'k@example.com',
    phoneNumber: '0541234567', subscriptionPlanId: 'plan-1',
    subscriptionPlanDescription: 'Daily Graphic - Monthly (GHS 35.90)',
    billingCycle: 'Monthly',
  });

  // Success stays false (Paystack never started) but the identity survives.
  assert.equal(response.success, false);
  assert.equal(response.message, 'Failed to initialize payment');
  assert.equal(extractSubscriptionIdentity(response.data).token, token());
});

test('guest checkout reports success when the envelope succeeds', async () => {
  globalThis.gnpUserHttpClient = async () => ({
    success: true, message: '', error: null, result: API_RESULT,
  });

  const response = await guestSubscription({
    firstName: 'Kwabena', lastName: 'Imhotep', email: 'k@example.com',
    phoneNumber: '0541234567', subscriptionPlanId: 'plan-1',
    subscriptionPlanDescription: 'Daily Graphic - Monthly (GHS 35.90)',
    billingCycle: 'Monthly',
  });

  assert.equal(response.success, true);
  assert.equal(response.data.paymentUrl, 'https://checkout.paystack.com/abc');
});

test('guest checkout without any result still fails cleanly', async () => {
  globalThis.gnpUserHttpClient = async () => ({ success: false, message: 'Plan missing', result: null });
  assert.deepEqual(
    await guestSubscription({ subscriptionPlanId: 'p', subscriptionPlanDescription: 'd' }),
    { success: false, message: 'Plan missing' },
  );
});
