import { computed } from 'vue';
import { getPricingPlans } from '~/services/newsPapers';
import { groupPricingPlans } from '~/utils/pricingPlans';
import type { SubscriptionPlan } from '~/models';

/**
 * Client-side feed of the public pricing plans from
 * `news-papers/get-pricing-plans`, grouped for the Bundle / Custom / Premium
 * tabs. A single useAsyncData key keeps every consumer on one payload.
 */
export function usePricingPlans() {
  const request = useAsyncData<SubscriptionPlan[]>(
    'public-pricing-plans',
    async () => {
      const result = await getPricingPlans();
      if (!Array.isArray(result?.data)) {
        throw new Error('Unable to load pricing plans');
      }
      return result.data;
    },
    {
      server: false,
      lazy: true,
      // Tabs on the same page may mount together; share the in-flight request.
      dedupe: 'defer',
      default: () => [],
    },
  );

  const plans = computed(() => request.data.value ?? []);
  const groups = computed(() => groupPricingPlans(plans.value));
  const isLoading = computed(() => request.status.value === 'idle' || request.status.value === 'pending');

  return {
    plans,
    groups,
    isLoading,
    error: request.error,
    refresh: request.refresh,
  };
}
