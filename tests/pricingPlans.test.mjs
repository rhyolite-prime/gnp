// Run with: node --experimental-strip-types --test tests/pricingPlans.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRICING_BILLING_CYCLES,
  PRICING_TABS,
  groupPricingPlans,
  getPlanBillingCycles,
  getAvailableBillingCycles,
  getPlanPricing,
  formatPlanPrice,
  resolveActiveBillingCycle,
  resolvePlanPrice,
  formatPlanTypeLabel,
  splitFullName,
  getPlansForPublication,
  formatSubscriptionPlanDescription,
  summarizeSubscription,
  pickCurrentSubscription,
  describeSubscriptionStatus,
} from '../utils/pricingPlans.ts';
import { getPricingPlans } from '../services/newsPapers.ts';
import { guestSubscription, userSubscription } from '../services/userSubscription.ts';

// Trimmed copy of the news-papers/get-pricing-plans response.
const MONTHLY = { price: 35.9, savePercentage: 10 };
const WEEKLY = { price: 9.9, savePercentage: 0 };
const API_PLANS = [
  {
    createdAt: '2025-11-14 14:48:15.676820',
    description: 'Premium Blog Posts Subscription (Unlimited access). Enjoy unlimited blog posts access.',
    id: '747544b1-e4d8-4833-8f71-78badb10b723',
    name: 'Blogging Subscription',
    planType: 'premium',
    pricing: { Monthly: MONTHLY, Weekly: WEEKLY },
    targetPublications: [],
    updatedAt: null,
  },
  {
    createdAt: '2025-11-14 14:48:04.792998',
    description: '1 Issue Per Week - Wed Only',
    id: '34b0e901-1312-4ba8-9257-346355f9578d',
    name: 'Junior Graphic',
    planType: 'regular',
    pricing: { '3 Months': { price: 134.9, savePercentage: 10 }, Monthly: { price: 48.9, savePercentage: 5 } },
    targetPublications: ['485ac7f9-022d-4a30-818e-41732d90da18'],
    updatedAt: null,
  },
  {
    createdAt: '2025-11-14 14:47:12.228257',
    description: '6 Issues Per Week',
    id: 'cf92a6b0-d3f3-41bc-8abb-aedd8d1f40f6',
    name: 'Daily Graphic',
    planType: 'regular',
    pricing: { Monthly: MONTHLY, Weekly: WEEKLY },
    targetPublications: ['7378357e-1a8a-4e8e-a1fd-00e8f9f2af2b'],
    updatedAt: null,
  },
  {
    createdAt: '2025-11-14 14:45:32.552842',
    description: 'Daily Graphic, Graphic Business, The Mirror, Graphic Showbiz, Junior Graphic & Graphic Sports',
    id: '1e8d6b8f-054a-459e-b34c-fef7ac8a05af',
    name: 'Combo',
    planType: 'bundle',
    pricing: { '3 Months': { price: 134.9, savePercentage: 10 }, Monthly: { price: 48.9, savePercentage: 5 } },
    targetPublications: ['7378357e-1a8a-4e8e-a1fd-00e8f9f2af2b'],
    updatedAt: null,
  },
  {
    createdAt: '2025-11-14 14:44:58.532323',
    description: 'The Mirror & Graphic Showbiz',
    id: '5420fcb0-469e-4465-bb6f-58dab0847d07',
    name: 'Diva',
    planType: 'bundle',
    pricing: { Monthly: { price: 18.9, savePercentage: 5 }, Weekly: { price: 5, savePercentage: 0 } },
    targetPublications: ['c5bb19de-8b85-4952-93c5-6c63d5b0bea1'],
    updatedAt: null,
  },
];

const ids = (plans) => plans.map((plan) => plan.id);

test('groups API plans into the Bundle / Custom / Premium tabs by planType', () => {
  const groups = groupPricingPlans(API_PLANS);

  assert.deepEqual(ids(groups.bundle), [
    '1e8d6b8f-054a-459e-b34c-fef7ac8a05af', // Combo
    '5420fcb0-469e-4465-bb6f-58dab0847d07', // Diva
  ]);
  assert.deepEqual(ids(groups.custom), [
    'cf92a6b0-d3f3-41bc-8abb-aedd8d1f40f6', // Daily Graphic
    '34b0e901-1312-4ba8-9257-346355f9578d', // Junior Graphic
  ]);
  assert.deepEqual(ids(groups.premium), ['747544b1-e4d8-4833-8f71-78badb10b723']);
});

test('groups tolerate casing, missing payloads, and unknown plan types', () => {
  const groups = groupPricingPlans([
    { id: 'a', name: 'Upper', planType: ' B U N D L E '.replace(/ /g, ''), pricing: { Weekly: WEEKLY } },
    { id: 'b', name: 'Missing type', pricing: { Weekly: WEEKLY } },
    { id: 'c', name: 'New type', planType: 'foo', pricing: { Weekly: WEEKLY } },
    { id: '', name: 'No id', planType: 'bundle', pricing: {} },
    null,
    undefined,
  ]);

  assert.deepEqual(ids(groups.bundle), ['a']);
  assert.deepEqual(ids(groups.custom), ['b', 'c']);
  assert.deepEqual(groups.premium, []);
  assert.deepEqual(groupPricingPlans(null), { bundle: [], custom: [], premium: [] });
});

test('billing cycles keep the Weekly → Yearly order and append unknown cycles', () => {
  assert.deepEqual(getPlanBillingCycles(API_PLANS[1]), ['Monthly', '3 Months']);
  assert.deepEqual(getAvailableBillingCycles(API_PLANS), ['Weekly', 'Monthly', '3 Months']);
  assert.deepEqual(getAvailableBillingCycles([]), [...PRICING_BILLING_CYCLES]);

  const odd = [{ id: 'a', pricing: { Yearly: { price: 1, savePercentage: 0 }, Fortnightly: { price: 1, savePercentage: 0 } } }];
  assert.deepEqual(getPlanBillingCycles(odd[0]), ['Yearly', 'Fortnightly']);
  assert.deepEqual(getPlanBillingCycles({ pricing: {} }), [...PRICING_BILLING_CYCLES]);
});

test('pricing lookups return the tier for the selected cycle only', () => {
  const dailyGraphic = API_PLANS[2];
  assert.deepEqual(getPlanPricing(dailyGraphic, 'Monthly'), MONTHLY);
  assert.deepEqual(getPlanPricing(dailyGraphic, 'Yearly'), null);
  assert.equal(getPlanPricing(dailyGraphic, undefined), null);
  assert.equal(getPlanPricing(null, 'Monthly'), null);

  // Numeric strings and missing savePercentage are normalised.
  assert.deepEqual(
    getPlanPricing({ id: 'a', pricing: { Monthly: { price: '12.5' } } }, 'Monthly'),
    { price: 12.5, savePercentage: 0 },
  );
  assert.equal(getPlanPricing({ id: 'a', pricing: { Monthly: { price: 'oops' } } }, 'Monthly'), null);
});

test('prices render as GHS amounts with two decimals', () => {
  assert.equal(formatPlanPrice(9.9), 'GHS 9.90');
  assert.equal(formatPlanPrice(201.6), 'GHS 201.60');
  assert.equal(formatPlanPrice(0), 'GHS 0.00');
  assert.equal(formatPlanPrice(undefined), 'GHS 0.00');
});

test('resolving a cycle keeps the current choice, else falls back to the cheapest', () => {
  // Combo + Diva both sell Monthly; Weekly only exists on Diva.
  const bundle = groupPricingPlans(API_PLANS).bundle;
  assert.equal(resolveActiveBillingCycle(bundle, '3 Months'), '3 Months');
  assert.equal(resolveActiveBillingCycle(bundle, 'Yearly'), 'Weekly'); // cheapest (GHS 5.00)
  assert.equal(resolveActiveBillingCycle(groupPricingPlans(API_PLANS).premium, 'Monthly'), 'Monthly');
  assert.equal(resolveActiveBillingCycle([], 'Weekly'), 'Weekly');
  assert.equal(resolveActiveBillingCycle([], 'not-a-cycle'), 'Weekly');
  assert.deepEqual(PRICING_TABS.map((tab) => tab.planType), ['bundle', 'regular', 'premium']);
});

test('pricing service calls the news-papers endpoint and returns the plan list', async () => {
  const result = {
    data: API_PLANS,
    lowerBound: 1,
    pageNo: 1,
    pageSize: 100,
    totalCount: API_PLANS.length,
    totalPages: 1,
    upperBound: API_PLANS.length,
  };
  globalThis.httpClient = async (path, baseURL, options) => {
    assert.equal(path, 'news-papers/get-pricing-plans');
    assert.equal(options, undefined);
    return { success: true, error: null, message: '', result };
  };

  const plans = await getPricingPlans();
  assert.deepEqual(plans, { data: API_PLANS, totalCount: API_PLANS.length });
});

test('pricing service throws on failure and tolerates a missing payload', async () => {
  globalThis.httpClient = async () => ({ success: false, message: 'Plans are offline', result: null });
  await assert.rejects(getPricingPlans, /Plans are offline/);

  globalThis.httpClient = async () => ({ success: true, message: '', result: null });
  assert.deepEqual(await getPricingPlans(), { data: [], totalCount: 0 });
});

test('plan price resolution falls back to the plan’s own cycle when the chosen one is missing', () => {
  const diva = { id: 'diva', name: 'Diva', pricing: { Weekly: { price: 5, savePercentage: 0 }, Monthly: { price: 18.9, savePercentage: 5 } } };
  assert.deepEqual(resolvePlanPrice(diva, 'Monthly'), { cycle: 'Monthly', pricing: { price: 18.9, savePercentage: 5 } });
  // Yearly is not sold on this plan → first canonical cycle it does sell.
  assert.deepEqual(resolvePlanPrice(diva, 'Yearly'), { cycle: 'Weekly', pricing: { price: 5, savePercentage: 0 } });
  assert.equal(resolvePlanPrice({ id: 'x', pricing: {} }, 'Monthly'), null);
  assert.equal(resolvePlanPrice(null, 'Monthly'), null);
});

test('plan type labels and full-name splitting match the checkout payload shape', () => {
  assert.equal(formatPlanTypeLabel('bundle'), 'Bundle');
  assert.equal(formatPlanTypeLabel(' PREMIUM '), 'Premium');
  assert.equal(formatPlanTypeLabel(''), 'Standard');
  assert.equal(formatPlanTypeLabel(undefined), 'Standard');

  assert.deepEqual(splitFullName('Kwabena Imhotep'), { firstName: 'Kwabena', lastName: 'Imhotep' });
  assert.deepEqual(splitFullName('  Nana   Kwame  Mensah '), { firstName: 'Nana', lastName: 'Kwame Mensah' });
  assert.deepEqual(splitFullName('Madonna'), { firstName: 'Madonna', lastName: '' });
  assert.deepEqual(splitFullName(''), { firstName: '', lastName: '' });
  assert.deepEqual(splitFullName(null), { firstName: '', lastName: '' });
});

test('guest subscription posts the selected plan, cycle and description, then unwraps the payment', async () => {
  const payment = { paymentUrl: 'https://checkout.paystack.com/abc', reference: 'ref-1', userId: 'user-1' };
  let captured = null;
  globalThis.gnpUserHttpClient = async (path, baseURL, options) => {
    captured = { path, options };
    return { success: true, message: '', result: payment };
  };

  const result = await guestSubscription({
    firstName: 'Kwabena', lastName: 'Imhotep', email: 'k@example.com',
    phoneNumber: '0541234567', subscriptionPlanId: 'plan-1',
    subscriptionPlanDescription: 'Combo - Monthly (GHS 48.90)',
    billingCycle: 'Monthly',
  });

  assert.equal(captured.path, 'subscription/guest');
  assert.equal(captured.options.method, 'post');
  assert.equal(captured.options.body.subscriptionPlanId, 'plan-1');
  assert.equal(captured.options.body.billingCycle, 'Monthly');
  assert.equal(captured.options.body.subscriptionPlanDescription, 'Combo - Monthly (GHS 48.90)');
  assert.deepEqual(result, { success: true, message: '', data: payment });
});

test('subscription plan descriptions read like the partner/admin flows', () => {
  assert.equal(
    formatSubscriptionPlanDescription({ name: 'Combo' }, 'Monthly', 48.9),
    'Combo - Monthly (GHS 48.90)',
  );
  assert.equal(
    formatSubscriptionPlanDescription(API_PLANS[0], 'Weekly', 9.9),
    'Blogging Subscription - Weekly (GHS 9.90)',
  );
  // Missing piece of the label simply drops out instead of printing "undefined".
  assert.equal(formatSubscriptionPlanDescription({ name: 'Diva' }, 'Yearly'), 'Diva - Yearly');
  assert.equal(formatSubscriptionPlanDescription({ name: 'Diva' }, null, 189.9), 'Diva (GHS 189.90)');
  assert.equal(formatSubscriptionPlanDescription({ name: '  Diva  ' }, '  Weekly  ', 5), 'Diva - Weekly (GHS 5.00)');
  assert.equal(formatSubscriptionPlanDescription(null, 'Monthly', 10), 'Monthly (GHS 10.00)');
  assert.equal(formatSubscriptionPlanDescription(null, null), '');
});

test('guest subscription surfaces API failures instead of returning null', async () => {
  globalThis.gnpUserHttpClient = async () => ({ success: false, message: 'Plan is no longer available', result: null });
  assert.deepEqual(await guestSubscription({ subscriptionPlanId: 'plan-1', billingCycle: 'Monthly' }), {
    success: false,
    message: 'Plan is no longer available',
  });
});

// ─── Signed-in buyers ─────────────────────────────────────────────────────────

// Fixed clock so "days remaining" is deterministic.
const NOW = Date.parse('2026-11-10T00:00:00Z');

const membership = (overrides = {}) => ({
  id: 'sub-1',
  createdAt: '2026-10-01T00:00:00Z',
  subscriptionIdentifier: 'Daily Graphic - Monthly',
  userId: 'usr-1',
  username: 'kwabena_i',
  email: 'k@example.com',
  currentSubscriptionPlanId: 'plan-daily',
  startDate: '2026-10-01T00:00:00Z',
  endDate: '2026-11-20T00:00:00Z',
  currentBillingCycle: 'Monthly',
  isActive: true,
  nextRenewalDate: '2026-11-20T00:00:00Z',
  fee: 35.9,
  ...overrides,
});

test('a subscription is summarised into the current-package panel', () => {
  const summary = summarizeSubscription(membership(), NOW);

  assert.deepEqual(summary, {
    label: 'Daily Graphic - Monthly',
    cycle: 'Monthly',
    planId: 'plan-daily',
    isActive: true,
    startDate: '2026-10-01T00:00:00Z',
    endDate: '2026-11-20T00:00:00Z',
    daysRemaining: 10,
    fee: 35.9,
  });

  // Missing optional pieces degrade instead of throwing.
  const sparse = summarizeSubscription({ currentSubscriptionPlanId: 'p', currentBillingCycle: 'Weekly' }, NOW);
  assert.equal(sparse.label, 'Current plan - Weekly');
  assert.equal(sparse.isActive, true); // no end date → assume running
  assert.equal(sparse.daysRemaining, null);
  assert.equal(sparse.fee, null);

  assert.equal(summarizeSubscription(null), null);
  assert.equal(summarizeSubscription({ subscriptionIdentifier: '   ' }), null);
});

test('an ended subscription reads as inactive even if the flag says otherwise', () => {
  const lapsed = summarizeSubscription(membership({ endDate: '2026-11-01T00:00:00Z' }), NOW);
  assert.equal(lapsed.isActive, false);
  assert.equal(lapsed.daysRemaining, 0); // never negative
  assert.equal(describeSubscriptionStatus(lapsed, NOW), 'Expired');

  const live = summarizeSubscription(membership(), NOW);
  assert.equal(describeSubscriptionStatus(live, NOW), 'Active · 10 days left');
  assert.equal(describeSubscriptionStatus(summarizeSubscription(membership({ endDate: '2026-11-11T00:00:00Z' }), NOW), NOW), 'Active · 1 day left');
  // Same calendar day counts as the last day, even though the ceiling says 1.
  assert.equal(describeSubscriptionStatus(summarizeSubscription(membership({ endDate: '2026-11-10T12:00:00Z' }), NOW), NOW), 'Expires today');
  assert.equal(describeSubscriptionStatus(summarizeSubscription(membership({ endDate: '' }), NOW), NOW), 'Active');
  assert.equal(describeSubscriptionStatus(null), '');
});

test('the row shown is the active one, then the one expiring last', () => {
  const expired = membership({ id: 'old', currentSubscriptionPlanId: 'plan-old', endDate: '2026-09-01T00:00:00Z', isActive: false });
  const active = membership({ id: 'live', currentSubscriptionPlanId: 'plan-live', endDate: '2026-12-01T00:00:00Z' });
  const longer = membership({ id: 'long', currentSubscriptionPlanId: 'plan-long', endDate: '2027-06-01T00:00:00Z' });

  assert.equal(pickCurrentSubscription([expired], NOW).id, 'old');
  assert.equal(pickCurrentSubscription([expired, active], NOW).id, 'live');
  // Two running packages: the later end date wins.
  assert.equal(pickCurrentSubscription([active, longer], NOW).id, 'long');
  assert.equal(pickCurrentSubscription([active, longer, expired], NOW).id, 'long');
  assert.equal(pickCurrentSubscription([]), null);
  assert.equal(pickCurrentSubscription(null), null);
});

test('member subscription posts plan details to subscription/user and unwraps the payment', async () => {
  const payment = { paymentUrl: 'https://checkout.paystack.com/member', reference: 'ref-m', userId: 'usr-1' };
  let captured = null;
  globalThis.gnpUserHttpClient = async (path, baseURL, options) => {
    captured = { path, options };
    return { success: true, message: '', result: payment };
  };

  const result = await userSubscription({
    subscriptionPlanId: 'plan-daily',
    subscriptionPlanName: 'Daily Graphic (Monthly)',
    subscriptionPlanDescription: 'Daily Graphic - Monthly (GHS 35.90)',
    billingCycle: 'Monthly',
    subscriptionType: 'regular',
    price: 35.9,
  });

  assert.equal(captured.path, 'subscription/user');
  assert.equal(captured.options.method, 'post');
  // No contact details: the bearer token identifies the reader.
  assert.deepEqual(captured.options.body, {
    subscriptionPlanId: 'plan-daily',
    subscriptionPlanName: 'Daily Graphic (Monthly)',
    subscriptionPlanDescription: 'Daily Graphic - Monthly (GHS 35.90)',
    billingCycle: 'Monthly',
    subscriptionType: 'regular',
    price: 35.9,
  });
  assert.deepEqual(result, { success: true, message: '', data: payment });
});

test('member subscription reports API failures instead of a bare boolean', async () => {
  globalThis.gnpUserHttpClient = async () => ({ success: false, message: 'Plan is no longer available', result: null });
  assert.deepEqual(await userSubscription({ subscriptionPlanId: 'p', subscriptionPlanName: 'P', subscriptionPlanDescription: 'P', billingCycle: 'Monthly' }), {
    success: false,
    message: 'Plan is no longer available',
  });

  // A rejected Paystack init still carries the message the modal displays.
  globalThis.gnpUserHttpClient = async () => ({
    success: false,
    message: 'Failed to initialize payment',
    result: { paymentUrl: '', reference: '', userId: 'usr-1' },
  });
  assert.deepEqual(await userSubscription({ subscriptionPlanId: 'p', subscriptionPlanName: 'P', subscriptionPlanDescription: 'P', billingCycle: 'Monthly' }), {
    success: false,
    message: 'Failed to initialize payment',
    data: { paymentUrl: '', reference: '', userId: 'usr-1' },
  });
});

test('plans targeting a publication are listed first, regular before bundle', () => {
  const DG = '7378357e-1a8a-4e8e-a1fd-00e8f9f2af2b';
  const MIRROR = 'c5bb19de-8b85-4952-93c5-6c63d5b0bea1';
  const plans = [
    { id: 'family', name: 'Family', planType: 'bundle', pricing: { Monthly: MONTHLY }, targetPublications: [DG, MIRROR] },
    { id: 'daily', name: 'Daily Graphic', planType: 'regular', pricing: { Monthly: MONTHLY }, targetPublications: [DG] },
    { id: 'mirror', name: 'The Mirror', planType: 'regular', pricing: { Monthly: MONTHLY }, targetPublications: [MIRROR] },
    { id: 'combo', name: 'Combo', planType: 'bundle', pricing: { Monthly: MONTHLY }, targetPublications: [MIRROR] },
    { id: 'blog', name: 'Blogging', planType: 'premium', pricing: { Monthly: MONTHLY }, targetPublications: [] },
  ];

  // Regular single-publication plan wins over bundles that also include the paper.
  assert.deepEqual(getPlansForPublication(plans, DG).map((p) => p.id), ['daily', 'family']);
  // The Mirror has its own regular plan, which outranks the bundles again.
  assert.deepEqual(getPlansForPublication(plans, MIRROR).map((p) => p.id), ['mirror', 'combo', 'family']);
});

test('publication matching is case/whitespace tolerant and handles empty input', () => {
  const plans = [
    { id: 'a', name: 'A', planType: 'regular', pricing: {}, targetPublications: [' ABC-123 '] },
    { id: 'b', name: 'B', planType: 'regular', pricing: {}, targetPublications: [] },
    { id: 'c', name: 'C', planType: 'regular', pricing: {} },
  ];
  assert.deepEqual(getPlansForPublication(plans, 'abc-123').map((p) => p.id), ['a']);
  assert.deepEqual(getPlansForPublication(plans, '  ABC-123  ').map((p) => p.id), ['a']);
  assert.deepEqual(getPlansForPublication(plans, ''), []);
  assert.deepEqual(getPlansForPublication(plans, null), []);
  assert.deepEqual(getPlansForPublication(null, 'abc-123'), []);
  assert.deepEqual(getPlansForPublication(plans, 'missing'), []);
});
