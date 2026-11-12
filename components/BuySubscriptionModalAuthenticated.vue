<template>
  <div class="relative z-50" role="dialog" aria-modal="true" aria-labelledby="member-subscription-title">
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="handleClose"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
        <div class="relative w-full transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:max-w-4xl">

          <!-- Header -->
          <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 pb-4 pt-5 sm:px-6">
            <div class="flex min-w-0 items-start gap-3">
              <span class="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                {{ accountInitials }}
              </span>
              <div class="min-w-0">
                <h2 id="member-subscription-title" class="text-xl font-bold text-gray-900">
                  {{ isRenewal ? 'Renew your subscription' : 'Buy Subscription' }}
                </h2>
                <p class="mt-1 truncate text-sm text-gray-500">
                  Signed in as <span class="font-medium text-gray-700">{{ displayName }}</span>
                  <span v-if="profile.email && profile.email !== displayName"> · {{ profile.email }}</span>
                </p>
                <p v-if="contextNote" class="mt-2 inline-flex items-start gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700">
                  <svg class="mt-px h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ contextNote }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              aria-label="Close"
              @click="handleClose"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid gap-6 px-5 py-5 lg:grid-cols-5 sm:px-6">
            <!-- ─── Plans ─────────────────────────────────────────────────── -->
            <div class="lg:col-span-3">
              <!-- Current package -->
              <div
                v-if="currentSubscription"
                class="mb-4 rounded-lg border p-3"
                :class="currentSubscription.isActive === null ? 'border-gray-200 bg-gray-50' : currentSubscription.isActive ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Your current package
                  </p>
                  <span
                    class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    :class="currentSubscription.isActive === null ? 'bg-gray-500 text-white' : currentSubscription.isActive ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'"
                  >
                    {{ currentStatusLabel }}
                  </span>
                </div>
                <p class="mt-1 text-sm font-semibold text-gray-900">{{ currentSubscription.label }}</p>
                <dl class="mt-1 space-y-0.5 text-xs text-gray-600">
                  <div v-if="currentSubscription.startDate">
                    <dt class="inline">Activated:</dt> <dd class="inline">{{ formatDate(currentSubscription.startDate) }}</dd>
                  </div>
                  <div v-if="currentSubscription.endDate">
                    <dt class="inline">Valid until:</dt> <dd class="inline">{{ formatDate(currentSubscription.endDate) }}</dd>
                  </div>
                  <div v-if="currentSubscription.dueDate">
                    <dt class="inline">Due date:</dt> <dd class="inline">{{ formatDate(currentSubscription.dueDate) }}</dd>
                  </div>
                  <div v-if="currentSubscription.cycle">
                    <dt class="inline">Billing cycle:</dt> <dd class="inline">{{ currentSubscription.cycle }}</dd>
                  </div>
                  <div v-if="currentSubscription.fee !== null">
                    <dt class="inline">Price:</dt> <dd class="inline">{{ formatPlanPrice(currentSubscription.fee) }}</dd>
                  </div>
                </dl>
              </div>

              <div class="mb-3 flex items-center justify-between">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {{ plans.length }} plan{{ plans.length === 1 ? '' : 's' }} available
                </p>
                <span v-if="isLoadingCurrent" class="text-[11px] text-gray-400">Checking your subscription…</span>
              </div>

              <div class="max-h-[22rem] space-y-2 overflow-y-auto pr-1" role="radiogroup" aria-label="Subscription plans">
                <button
                  v-for="plan in plans"
                  :key="plan.id"
                  type="button"
                  role="radio"
                  :aria-checked="selectedPlanId === plan.id"
                  class="flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  :class="selectedPlanId === plan.id
                    ? 'border-red-600 bg-red-50/60 ring-2 ring-red-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'"
                  @click="selectPlan(plan)"
                >
                  <!-- Radio -->
                  <span
                    class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
                    :class="selectedPlanId === plan.id ? 'border-red-600 bg-red-600' : 'border-gray-300'"
                  >
                    <span v-if="selectedPlanId === plan.id" class="h-2 w-2 rounded-full bg-white"></span>
                  </span>

                  <span class="min-w-0 flex-1">
                    <span class="flex flex-wrap items-center gap-2">
                      <span class="font-semibold text-gray-900">{{ plan.name }}</span>
                      <span class="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                        {{ formatPlanTypeLabel(plan.planType) }}
                      </span>
                      <span
                        v-if="isCurrentPlan(plan)"
                        class="inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700"
                      >
                        Current
                      </span>
                      <span
                        v-if="selectedPlanId === plan.id"
                        class="inline-flex items-center rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                      >
                        Selected
                      </span>
                    </span>
                    <span class="mt-0.5 block text-xs text-gray-500">{{ plan.description }}</span>
                  </span>

                  <span class="whitespace-nowrap text-right">
                    <span class="block font-bold text-gray-900">{{ planPriceLabel(plan) }}</span>
                    <span class="block text-[11px] text-gray-500">{{ planCycleLabel(plan) }}</span>
                  </span>
                </button>
              </div>

              <p v-if="!plans.length" class="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
                No subscription plans are available right now.
              </p>
            </div>

            <!-- ─── Checkout ──────────────────────────────────────────────── -->
            <div class="lg:col-span-2">
              <div class="rounded-xl bg-gray-900 p-5 text-white">
                <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Order summary</p>

                <div class="mt-4 space-y-3 text-sm">
                  <div class="flex items-start justify-between gap-4">
                    <span class="text-gray-400">Plan</span>
                    <span class="text-right font-medium">{{ selectedPlan?.name || 'Not selected' }}</span>
                  </div>
                  <div class="flex items-start justify-between gap-4">
                    <span class="text-gray-400">Billing</span>
                    <span class="text-right font-medium">{{ selectedSelection?.cycle || '—' }}</span>
                  </div>
                  <div v-if="selectedPlan?.description" class="flex items-start justify-between gap-4">
                    <span class="text-gray-400">Includes</span>
                    <span class="text-right text-xs leading-relaxed text-gray-300">{{ selectedPlan.description }}</span>
                  </div>

                  <div class="border-t border-gray-700 pt-3">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-400">Total</span>
                      <span class="text-2xl font-black">{{ formatPlanPrice(selectedSelection?.pricing.price) }}</span>
                    </div>
                    <p v-if="savedPercentage > 0" class="mt-1 text-right text-xs font-medium text-green-400">
                      You save {{ savedPercentage }}%
                    </p>
                  </div>
                </div>

                <dl class="mt-4 space-y-1 border-t border-gray-700 pt-3 text-xs">
                  <div class="flex items-center justify-between gap-3">
                    <dt class="text-gray-400">Account</dt>
                    <dd class="truncate text-right font-medium text-gray-200">{{ profile.email || displayName }}</dd>
                  </div>
                   
                </dl>
              </div>

              <!-- Purchase could n ot be initialised (e.g. Paystack error) -->
              <div v-if="paymentError" class="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                <h3 class="text-base font-bold text-gray-900">We couldn't start your payment</h3>
                <p class="mt-1 text-sm text-gray-600">{{ paymentError }}</p>
                <p class="mt-2 text-xs text-gray-500">
                  Nothing was charged. You're still signed in as {{ profile.email || displayName }}.
                </p>
                <button
                  type="button"
                  class="mt-4 inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                  @click="emit('close')"
                >
                  Close
                </button>
              </div>

              <!-- Payment confirmed -->
              <div v-else-if="paymentCompleted" class="mt-5 rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="mt-3 text-base font-bold text-gray-900">Payment received</h3>
                <p class="mt-1 text-sm text-gray-600">
                  Your {{ selectedPlan?.name || 'subscription' }} ({{ selectedSelection?.cycle || 'plan' }}) is being activated.
                  We'll confirm it against {{ profile.email || 'your account' }}.
                </p>
                <button
                  type="button"
                  class="mt-4 inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                  @click="emit('close')"
                >
                  Done
                </button>
              </div>

              <!-- Confirmation + pay -->
              <form v-else class="mt-5 space-y-3" @submit.prevent="submit">
                <div v-if="errorMessage" class="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {{ errorMessage }}
                </div>

                <button
                  type="submit"
                  :disabled="isProcessing || !selectedPlanId || !plans.length"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span v-if="!isProcessing">{{ isRenewal ? 'Renew subscription' : 'Continue to Pay' }}</span>
                  <span v-else class="flex items-center gap-2">
                    <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Processing…
                  </span>
                </button>

                <p class="text-center text-[11px] leading-relaxed text-gray-500">
                  Your {{ isRenewal ? 'new package' : 'subscription' }} starts
                  once the payment is confirmed.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- In-modal Paystack checkout (host did not ask for a redirect) -->
    <PaymentCheckoutModal
      v-if="paymentInfo?.paymentUrl"
      :payment-url="paymentInfo.paymentUrl"
      @close="closeInlineCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import {
  formatPlanPrice,
  formatPlanTypeLabel,
  formatSubscriptionPlanDescription,
  resolveActiveBillingCycle,
  resolvePlanPrice,
} from '~/utils/pricingPlans';
import { useBasicAuthStore } from '~/stores/basic-user-auth';
import type { SubscriptionPlan, SubscriptionResponseModel, MemberSubscriptionPayload } from '~/models';
import type { CurrentSubscriptionSummary } from '~/utils/pricingPlans';

const props = withDefaults(
  defineProps<{
    /** Plans already loaded by the host page — the modal never fetches plans. */
    plans: SubscriptionPlan[];
    /** Plan to highlight when the modal opens. */
    initialPlanId?: string;
    /** Billing cycle to price with, e.g. `Monthly`. */
    initialBillingCycle?: string;
    /** Optional note, e.g. which edition the subscription unlocks. */
    contextNote?: string;
    /**
     * Dismiss this dialog once checkout starts and let the host render its
     * `<PaymentCheckoutModal>` with the returned URL. Defaults to keeping the
     * Paystack iframe inside this modal.
     */
    redirectToCheckout?: boolean;
    /**
     * Invoked once when the modal opens. The host owns the fetch so this
     * component stays presentational; it only renders the result.
     */
    loadCurrentSubscription?: () => Promise<CurrentSubscriptionSummary | null>;
  }>(),
  {
    initialPlanId: '',
    initialBillingCycle: '',
    contextNote: '',
    redirectToCheckout: false,
    loadCurrentSubscription: undefined,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'paymentStarted', payment: SubscriptionResponseModel): void;
}>();

const { $toast } = useNuxtApp();
const authStore = useBasicAuthStore();
const { profile, displayName, purchase, loadCurrentSubscription: fetchCurrentSubscription } = useMemberSubscription();

// ─── Account ─────────────────────────────────────────────────────────────────
const accountInitials = computed(() => {
  const source = displayName.value;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
});

// ─── Current package ─────────────────────────────────────────────────────────
const currentSubscription = ref<CurrentSubscriptionSummary | null>(null);
const isLoadingCurrent = ref(false);

const currentStatusLabel = computed(() => describeSubscriptionStatus(currentSubscription.value));

const isRenewal = computed(() => currentSubscription.value?.isActive === true);

function isCurrentPlan(plan: SubscriptionPlan) {
  return Boolean(currentSubscription.value?.planId) && plan.id === currentSubscription.value?.planId;
}

function formatDate(value: string) {
  return Number.isNaN(Date.parse(value)) ? value : (standardDateFormat(value) ?? value);
}

async function loadCurrent() {
  const loader = props.loadCurrentSubscription ?? fetchCurrentSubscription;

  isLoadingCurrent.value = true;
  try {
    currentSubscription.value = (await loader()) ?? null;

    // A reader who already owns a package most likely pressed this to renew or
    // upgrade it — start on that plan instead of the first in the list.
    const planId = currentSubscription.value?.planId;
    if (!hasSelectedPlan.value && planId && props.plans.some((plan) => plan.id === planId)) {
      selectedPlanId.value = planId;
      if (currentSubscription.value?.cycle) fallbackCycle.value = currentSubscription.value.cycle;
    }
  } catch (error) {
    // Optional context only: never block the purchase on it.
    console.error('Failed to load the current subscription:', error);
    currentSubscription.value = null;
  } finally {
    isLoadingCurrent.value = false;
  }
}

onMounted(loadCurrent);

// ─── Selection ───────────────────────────────────────────────────────────────
const selectedPlanId = ref('');
const hasSelectedPlan = ref(false);
const fallbackCycle = ref(props.initialBillingCycle);

const selectedPlan = computed(() => props.plans.find((plan) => plan.id === selectedPlanId.value) ?? null);

// The chosen duration when the selected plan sells it, else that plan's first cycle.
const selectedSelection = computed(() => resolvePlanPrice(selectedPlan.value, fallbackCycle.value));

const savedPercentage = computed(() => {
  const save = Number(selectedSelection.value?.pricing.savePercentage);
  return Number.isFinite(save) && save > 0 ? save : 0;
});

// Pre-select the plan that was clicked (or the first available one).
watch(
  [() => props.plans, () => props.initialPlanId],
  ([plans, initialPlanId]) => {
    if (!plans.length) {
      selectedPlanId.value = '';
      return;
    }
    const requested = plans.find((plan) => plan.id === initialPlanId);
    selectedPlanId.value = (requested ?? plans[0]).id;
  },
  { immediate: true },
);

// Keep a valid duration when the buyer switches plans.
watch(selectedPlan, (plan) => {
  fallbackCycle.value = resolveActiveBillingCycle(plan ? [plan] : [], fallbackCycle.value);
});

function selectPlan(plan: SubscriptionPlan) {
  hasSelectedPlan.value = true;
  selectedPlanId.value = plan.id;
  errorMessage.value = '';
}

function planCycleLabel(plan: SubscriptionPlan) {
  return resolvePlanPrice(plan, fallbackCycle.value)?.cycle ?? 'Not available';
}

function planPriceLabel(plan: SubscriptionPlan) {
  const selection = resolvePlanPrice(plan, fallbackCycle.value);
  return selection ? formatPlanPrice(selection.pricing.price) : '—';
}

// ─── Checkout ────────────────────────────────────────────────────────────────
const paymentInfo = ref<SubscriptionResponseModel | null>(null);
const paymentCompleted = ref(false);
const paymentError = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');

function buildPayload(): MemberSubscriptionPayload | null {
  if (!selectedPlan.value || !selectedSelection.value) return null;

  const { cycle, pricing } = selectedSelection.value;
  return {
    subscriptionPlanId: selectedPlan.value.id,
    // e.g. `Daily Graphic (Monthly)` — what the reader sees on the receipt.
    subscriptionPlanName: `${selectedPlan.value.name} (${cycle})`,
    subscriptionPlanDescription: formatSubscriptionPlanDescription(selectedPlan.value, cycle, pricing.price),
    billingCycle: cycle,
    subscriptionType: selectedPlan.value.planType,
    price: pricing.price,
  };
}

async function submit() {
  errorMessage.value = '';
  paymentError.value = '';

  if (!authStore.accessToken) {
    errorMessage.value = 'Your session has expired. Sign in again to complete this purchase.';
    return;
  }

  const payload = buildPayload();
  if (!payload) {
    errorMessage.value = 'Select a subscription plan to continue.';
    return;
  }

  isProcessing.value = true;
  try {
    const result = await purchase(payload);

    // Always hand the payload over: the host may want to report the reason even
    // when Paystack refused to initialise.
    if (result.data) emit('paymentStarted', result.data);

    if (!result.data?.paymentUrl) {
      paymentError.value = result.message || 'Failed to initialize payment.';
      return;
    }

    if (props.redirectToCheckout) {
      // Host owns the payment overlay, so close this dialog first.
      emit('close');
      return;
    }

    paymentInfo.value = result.data;
  } catch (error: any) {
    console.error('Member subscription error:', error);
    errorMessage.value =
      error?.data?.message || error?.message || 'Something went wrong while starting your subscription.';
    $toast.error(errorMessage.value);
  } finally {
    isProcessing.value = false;
  }
}

function handleClose() {
  if (isProcessing.value) return;
  emit('close');
}

// Closing the inline Paystack overlay returns the buyer to the plan list.
function closeInlineCheckout() {
  paymentInfo.value = null;
}

// Paystack reports completion from inside the iframe with a postMessage, exactly
// like the guest checkout. The backend (subscription/user) owns fulfilment, so we
// only acknowledge the payment here.
function onCheckoutMessage(message: MessageEvent<any>) {
  if (message.origin !== 'https://checkout.paystack.com') return;
  if (!message.data?.data?.status) return;

  paymentInfo.value = null;
  paymentCompleted.value = true;
}

onMounted(() => {
  if (import.meta.client) window.addEventListener('message', onCheckoutMessage);
});

onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener('message', onCheckoutMessage);
});
</script>
