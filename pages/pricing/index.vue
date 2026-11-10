<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">All Plans</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">All Plans</h1>

      <!-- Epaper Package Selection -->
      <div class="bg-gray-100 rounded-lg p-6 mb-8">
        <div class="border-l-4 border-red-600 pl-4 mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Select Epaper Package</h2>
        </div>

        <!-- Tab Navigation -->
        <div class="grid grid-cols-3 gap-0 mb-6">
          <button
            v-for="tab in PRICING_TABS"
            :key="tab.key"
            @click="setActiveTab(tab.key)"
            :class="[
              'py-3 text-center font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Loading / Error States -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16" role="status">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <p class="mt-4 text-gray-600">Loading subscription plans…</p>
        </div>

        <div v-else-if="plansError" class="py-12 text-center" role="alert">
          <p class="text-gray-700">We couldn't load the subscription plans right now.</p>
          <button
            type="button"
            @click="refreshPlans()"
            class="mt-4 bg-red-600 text-white font-medium px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>

        <template v-else>
          <p class="text-gray-700 mb-6">{{ activeTabDescription }}</p>

          <!-- Duration Selection -->
          <div v-if="activePlans.length" class="flex flex-wrap justify-center gap-4 mb-8">
            <button
              v-for="duration in activeBillingCycles"
              :key="duration"
              @click="setActiveDuration(duration)"
              :class="[
                'px-8 py-2 rounded-full text-center font-medium transition-colors',
                activeDuration === duration
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ duration }}
            </button>
          </div>

          <!-- Subscription Options -->
          <div v-if="activePlans.length" class="space-y-4 mb-6">
            <div
              v-for="row in activePlanRows"
              :key="row.plan.id"
              role="button"
              tabindex="0"
              :aria-label="`Subscribe to ${row.plan.name}`"
              class="bg-white rounded-lg border p-4 flex items-center transition-colors cursor-pointer hover:border-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              :class="selectedPlanId === row.plan.id ? 'border-red-600 ring-1 ring-red-600' : 'border-gray-200'"
              @click="openBuyModal(row.plan)"
              @keydown.enter.prevent="openBuyModal(row.plan)"
              @keydown.space.prevent="openBuyModal(row.plan)"
            >
              <!-- Radio Button -->
              <div class="mr-4">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    :name="'plan-' + activeTab"
                    class="form-radio h-5 w-5 text-red-600"
                    :checked="selectedPlanId === row.plan.id"
                    @click.stop="selectedPlanId = row.plan.id"
                  >
                </label>
              </div>

              <!-- Plan Details -->
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ row.plan.name }}</h3>
                <p class="text-sm text-gray-600">{{ row.plan.description }}</p>
              </div>

              <!-- Price -->
              <div class="text-right">
                <template v-if="row.pricing">
                  <div class="text-gray-900 font-bold">{{ formatPlanPrice(row.pricing.price) }}</div>
                  <div v-if="row.pricing.savePercentage > 0" class="text-sm text-gray-600">
                    Save {{ row.pricing.savePercentage }}%
                  </div>
                </template>
                <div v-else class="text-gray-500 text-sm">Not available</div>
              </div>
            </div>
          </div>

          <div v-else class="py-12 text-center">
            <p class="text-gray-500">No {{ activeTabLabel.toLowerCase() }} plans are available at the moment.</p>
          </div>

          <div v-if="activePlans.length" class="text-center">
            <button
              type="button"
              :disabled="!selectedPlanId"
              class="bg-red-600 text-white font-medium px-8 py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="openBuyModal()"
            >
              {{ activeTab === 'premium' ? 'Get Premium' : 'Subscribe Now' }}
            </button>
          </div>
        </template>
      </div>

      <!-- Benefits Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Why Subscribe to Graphic NewsPlus?</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p class="text-gray-600">Get immediate access to the latest issues as soon as they are published.</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p class="text-gray-600">Read on any device with a secure and reliable digital platform.</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Flexible Payment</h3>
            <p class="text-gray-600">Choose from multiple subscription options that fit your reading habits.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-200 pb-4">
            <button 
              @click="toggleFaq(index)"
              class="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
            >
              <span>{{ faq.question }}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 text-gray-500 transition-transform" 
                :class="{ 'transform rotate-180': openFaqIndex === index }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              v-show="openFaqIndex === index"
              class="mt-2 text-gray-600"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink 
            to="/contact"
            class="text-red-600 font-medium hover:text-red-700"
          >
            Still have questions? Contact us
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Guest checkout -->
    <BuySubscriptionModal
      v-if="showBuyModal"
      :plans="buyModalPlans"
      :initial-plan-id="buyModalPlanId"
      :initial-billing-cycle="activeDuration"
      @close="closeBuyModal"
      @request-sign-in="handleRequestSignIn"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PRICING_BILLING_CYCLES,
  PRICING_TABS,
  formatPlanPrice,
  getAvailableBillingCycles,
  getPlanPricing,
  resolveActiveBillingCycle,
} from '~/utils/pricingPlans';
import type { PricingTabKey } from '~/utils/pricingPlans';
import type { SubscriptionPlan } from '~/models';

// Page metadata
useHead({
  title: 'Pricing & Subscription Plans - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Subscribe to Ghana\'s leading newspapers including Daily Graphic, Graphic Business, and more. Choose from our flexible subscription plans.' }
  ]
})

// Plans come from news-papers/get-pricing-plans and are grouped per tab.
const { plans, groups, isLoading, error: plansError, refresh: refreshPlans } = usePricingPlans();

// State
const activeTab = ref<PricingTabKey>('custom') // 'bundle' | 'custom' | 'premium'
const activeDuration = ref<string>(PRICING_BILLING_CYCLES[0])
const selectedPlanId = ref('')
const openFaqIndex = ref(-1)

// The header owns <SignInModal>; it reads this shared flag, so guests can be
// handed over to the regular sign-in flow from the checkout modal.
const showSignInModal = useState<boolean>('showSignInModal', () => false)

// Plans shown on the active tab, straight from the API groups.
const activePlans = computed<SubscriptionPlan[]>(() => groups.value[activeTab.value]);

const activeTabConfig = computed(
  () => PRICING_TABS.find((tab) => tab.key === activeTab.value) ?? PRICING_TABS[1],
);
const activeTabLabel = computed(() => activeTabConfig.value.label);

const activeTabDescription = computed(() => {
  switch (activeTab.value) {
    case 'bundle':
      return 'Subscribe to all our publications at a discounted price.';
    case 'premium':
      return 'Get access to all our publications plus premium features and exclusive content.';
    default:
      return 'To buy just one publication, use the CUSTOM option';
  }
});

// Billing cycles offered by the active tab; the current choice is kept when possible.
const activeBillingCycles = computed(() => getAvailableBillingCycles(activePlans.value));

// One row per plan, priced for the selected billing cycle.
const activePlanRows = computed(() =>
  activePlans.value.map((plan) => ({
    plan,
    pricing: getPlanPricing(plan, activeDuration.value),
  })),
);

// Keep the selected plan and duration valid whenever the tab or data changes.
watch(
  activePlans,
  (plans) => {
    activeDuration.value = resolveActiveBillingCycle(plans, activeDuration.value);

    if (!plans.some((plan) => plan.id === selectedPlanId.value)) {
      const firstPriced = plans.find((plan) => getPlanPricing(plan, activeDuration.value));
      selectedPlanId.value = (firstPriced ?? plans[0])?.id ?? '';
    }
  },
  { immediate: true },
);

// FAQ data
const faqs = [
  {
    question: 'How do I subscribe to Graphic NewsPlus?',
    answer: 'You can subscribe by selecting a plan that suits your needs, clicking on the "Subscribe Now" button, and completing the checkout process. You\'ll need to create an account if you don\'t already have one.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of your current billing period.'
  },
  {
    question: 'How can I access the newspapers after subscribing?',
    answer: 'After subscribing, you can access the newspapers by logging into your account on our website or mobile app. You\'ll see all your subscribed publications in your library.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We generally don\'t offer refunds for subscription payments. However, if you\'re experiencing technical issues with accessing your subscription, please contact our support team.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, mobile money, and bank transfers for subscription payments.'
  }
]

// ─── Guest checkout ───────────────────────────────────────────────────────────
// Clicking a plan card (or the CTA) opens the Buy Subscription modal with that
// plan pre-selected; the modal itself calls subscription/guest.
const showBuyModal = ref(false);
const buyModalPlanId = ref('');

// Pass every plan so the buyer can switch plans inside the modal, but list the
// clicked tab's plans first so the highlighted plan is in view.
const buyModalPlans = computed<SubscriptionPlan[]>(() => {
  const active = groups.value[activeTab.value];
  const activeIds = new Set(active.map((plan) => plan.id));
  return [...active, ...plans.value.filter((plan) => !activeIds.has(plan.id))];
});

function openBuyModal(plan?: SubscriptionPlan) {
  const target = plan ?? activePlanRows.value.find((row) => row.plan.id === selectedPlanId.value)?.plan;
  buyModalPlanId.value = target?.id ?? selectedPlanId.value;
  if (target) selectedPlanId.value = target.id;
  showBuyModal.value = true;
}

function closeBuyModal() {
  showBuyModal.value = false;
}

// Guests without access to a subscription plan can sign in instead; the header
// owns the sign-in modal, so nudge the buyer to the account area.
function handleRequestSignIn() {
  showBuyModal.value = false;
  showSignInModal.value = true;
}

// Methods
function setActiveTab(tab: PricingTabKey) {
  activeTab.value = tab
}

function setActiveDuration(duration: string) {
  activeDuration.value = duration
}

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
