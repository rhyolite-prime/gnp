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
} from '../utils/pricingPlans.ts';
import { getPricingPlans } from '../services/newsPapers.ts';
import { guestSubscription } from '../services/userSubscription.ts';

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

test('guest subscription posts the selected plan + cycle and unwraps the payment', async () => {
  const payment = { paymentUrl: 'https://checkout.paystack.com/abc', reference: 'ref-1', userId: 'user-1' };
  let captured = null;
  globalThis.gnpUserHttpClient = async (path, baseURL, options) => {
    captured = { path, options };
    return { success: true, message: '', result: payment };
  };

  const result = await guestSubscription({
    firstName: 'Kwabena', lastName: 'Imhotep', email: 'k@example.com',
    phoneNumber: '0541234567', subscriptionPlanId: 'plan-1', billingCycle: 'Monthly',
  });

  assert.equal(captured.path, 'subscription/guest');
  assert.equal(captured.options.method, 'post');
  assert.equal(captured.options.body.subscriptionPlanId, 'plan-1');
  assert.equal(captured.options.body.billingCycle, 'Monthly');
  assert.deepEqual(result, { success: true, data: payment });
});

test('guest subscription surfaces API failures instead of returning null', async () => {
  globalThis.gnpUserHttpClient = async () => ({ success: false, message: 'Plan is no longer available', result: null });
  assert.deepEqual(await guestSubscription({ subscriptionPlanId: 'plan-1', billingCycle: 'Monthly' }), {
    success: false,
    message: 'Plan is no longer available',
  });
});
