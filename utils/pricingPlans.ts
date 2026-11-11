import type { SubscriptionPlan, SubscriptionPricingTier } from '~/models';

/** Billing cycles in the order the pricing page should display them. */
export const PRICING_BILLING_CYCLES = ['Weekly', 'Monthly', '3 Months', 'Half-Yearly', 'Yearly'] as const;

/** Tabs shown on /pricing, each mapped to the API `planType` it renders. */
export const PRICING_TABS = [
  { key: 'bundle', label: 'Bundle', planType: 'bundle' },
  { key: 'custom', label: 'Custom', planType: 'regular' },
  { key: 'premium', label: 'Premium', planType: 'premium' },
] as const;

export type PricingTabKey = (typeof PRICING_TABS)[number]['key'];

/** Plan groups matching the pricing page tabs. */
export interface PricingPlanGroups {
  bundle: SubscriptionPlan[];
  custom: SubscriptionPlan[];
  premium: SubscriptionPlan[];
}

function normalizePlanType(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function byName(a: SubscriptionPlan, b: SubscriptionPlan): number {
  return (a.name || '').localeCompare(b.name || '');
}

/**
 * Splits the API plans across the Bundle / Custom / Premium tabs using the
 * `planType` the backend sends. Unknown types stay reachable on the Custom tab
 * so a new backend plan type never disappears from the page.
 */
export function groupPricingPlans(plans: readonly SubscriptionPlan[] | null | undefined): PricingPlanGroups {
  const groups: PricingPlanGroups = { bundle: [], custom: [], premium: [] };

  for (const plan of plans ?? []) {
    if (!plan || typeof plan.id !== 'string' || !plan.id.trim()) continue;

    const planType = normalizePlanType(plan.planType);
    if (planType === 'bundle') groups.bundle.push(plan);
    else if (planType === 'premium') groups.premium.push(plan);
    else groups.custom.push(plan);
  }

  // The API ordering is insertion order; sort each tab by name for a stable UI.
  groups.bundle.sort(byName);
  groups.custom.sort(byName);
  groups.premium.sort(byName);

  return groups;
}

/**
 * Billing cycles available for a plan, starting with the canonical order
 * (Weekly → Yearly) and appending any unexpected server cycles at the end.
 */
export function getPlanBillingCycles(plan: SubscriptionPlan | null | undefined): string[] {
  const cycles = Object.keys(plan?.pricing ?? {});
  if (!cycles.length) return [...PRICING_BILLING_CYCLES];

  const known = PRICING_BILLING_CYCLES.filter((cycle) => cycles.includes(cycle)) as unknown as string[];
  const extra = cycles.filter((cycle) => !(PRICING_BILLING_CYCLES as readonly string[]).includes(cycle)).sort();
  return [...known, ...extra];
}

/**
 * Billing cycles offered by at least one plan in the active tab, kept in the
 * canonical order so switching tabs never changes the duration order.
 */
export function getAvailableBillingCycles(plans: readonly SubscriptionPlan[] | null | undefined): string[] {
  const offered = new Set<string>();
  for (const plan of plans ?? []) {
    for (const cycle of Object.keys(plan?.pricing ?? {})) offered.add(cycle);
  }

  if (!offered.size) return [...PRICING_BILLING_CYCLES];

  const known = PRICING_BILLING_CYCLES.filter((cycle) => offered.has(cycle)) as unknown as string[];
  const extra = [...offered].filter((cycle) => !(PRICING_BILLING_CYCLES as readonly string[]).includes(cycle)).sort();
  return [...known, ...extra];
}

/** Price + saving for one plan/cycle pair, or null when the cycle is not sold. */
export function getPlanPricing(
  plan: SubscriptionPlan | null | undefined,
  cycle: string | null | undefined,
): SubscriptionPricingTier | null {
  if (!plan?.pricing || typeof cycle !== 'string') return null;

  const tier = plan.pricing[cycle];
  const price = Number(tier?.price);
  if (!Number.isFinite(price)) return null;

  const savePercentage = Number(tier?.savePercentage);

  return {
    price,
    savePercentage: Number.isFinite(savePercentage) ? savePercentage : 0,
  };
}

/** `GHS 9.90` style label used by the plan rows. */
export function formatPlanPrice(price: number | null | undefined, currency = 'GHS'): string {
  const amount = Number(price);
  return `${currency} ${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
}

/**
 * Picks the cycle to keep selected after a tab change: the current choice when
 * the tab offers it, otherwise the tab's cheapest cycle, otherwise its first.
 */
export function resolveActiveBillingCycle(
  plans: readonly SubscriptionPlan[] | null | undefined,
  preferred: string | null | undefined,
): string {
  const cycles = getAvailableBillingCycles(plans);
  if (preferred && cycles.includes(preferred)) return preferred;

  let cheapest: { cycle: string; price: number } | null = null;
  for (const plan of plans ?? []) {
    for (const cycle of cycles) {
      const tier = getPlanPricing(plan, cycle);
      if (tier && (!cheapest || tier.price < cheapest.price)) cheapest = { cycle, price: tier.price };
    }
  }

  return cheapest?.cycle ?? cycles[0] ?? PRICING_BILLING_CYCLES[0];
}

/** Cycle + price shown for a plan once a buyer has chosen a duration. */
export interface PlanPriceSelection {
  cycle: string;
  pricing: SubscriptionPricingTier;
}

/**
 * Resolves the tier to display for a plan: the chosen cycle when that plan
 * sells it, otherwise its first available saved cycle (kept in canonical order)
 * so the plan still shows a price instead of "Not available".
 */
export function resolvePlanPrice(
  plan: SubscriptionPlan | null | undefined,
  preferred: string | null | undefined,
): PlanPriceSelection | null {
  const preferredTier = getPlanPricing(plan, preferred);
  if (preferredTier && typeof preferred === 'string') return { cycle: preferred, pricing: preferredTier };

  for (const cycle of getPlanBillingCycles(plan)) {
    const tier = getPlanPricing(plan, cycle);
    if (tier) return { cycle, pricing: tier };
  }

  return null;
}

/** Human label for a plan's tier, e.g. `Bundle · Monthly`. */
export function formatPlanTypeLabel(planType: string | null | undefined): string {
  const value = typeof planType === 'string' ? planType.trim() : '';
  if (!value) return 'Standard';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Splits the checkout name into the API's first/last name fields. A single word
 * is sent as the first name; every extra word goes to the surname.
 */
export function splitFullName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

/**
 * Plans that grant access to a specific publication: the regular plan whose
 * `targetPublications` contains it, followed by every bundle that includes it.
 * Used by the newspaper page to pre-select the right plan for the edition being
 * read. Matching is case-insensitive and ignores surrounding whitespace because
 * ids come from different backend tables.
 */
export function getPlansForPublication(
  plans: readonly SubscriptionPlan[] | null | undefined,
  publicationId: string | null | undefined,
): SubscriptionPlan[] {
  const target = typeof publicationId === 'string' ? publicationId.trim().toLowerCase() : '';
  if (!target) return [];

  const grants = (plan: SubscriptionPlan | null | undefined) =>
    Array.isArray(plan?.targetPublications) &&
    plan!.targetPublications.some(
      (id) => typeof id === 'string' && id.trim().toLowerCase() === target,
    );

  const matches = (plans ?? []).filter((plan) => plan && grants(plan));

  // Regular plans first (single-publication access), then bundles.
  const rank = (plan: SubscriptionPlan) => (normalizePlanType(plan.planType) === 'bundle' ? 1 : 0);
  return matches.sort((a, b) => rank(a) - rank(b) || byName(a, b));
}
