<template>
  <div class="relative z-50" role="dialog" aria-modal="true" aria-labelledby="buy-subscription-title">
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="handleClose"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
        <div class="relative w-full transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:max-w-4xl">

          <!-- Header -->
          <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 pb-4 pt-5 sm:px-6">
            <div>
              <h2 id="buy-subscription-title" class="text-xl font-bold text-gray-900">Buy Subscription</h2>
              <p class="mt-1 text-sm text-gray-500">
                You're subscribing as a guest — no account needed. We'll email your access details after payment.
              </p>
              <p v-if="contextNote" class="mt-2 inline-flex items-start gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700">
                <svg class="mt-px h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ contextNote }}
              </p>
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
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {{ plans.length }} plan{{ plans.length === 1 ? '' : 's' }} available
              </p>

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
              </div>

              <!-- Checkout could not be initialised (e.g. Paystack error) -->
              <div v-if="paymentError" class="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                <h3 class="text-base font-bold text-gray-900">We couldn't start your payment</h3>
                <p class="mt-1 text-sm text-gray-600">{{ paymentError }}</p>
                <p v-if="signedInEmail" class="mt-2 text-xs text-gray-500">
                  Your account ({{ signedInEmail }}) is ready — you can retry the payment from
                  <NuxtLink to="/pricing" class="font-medium text-red-600 hover:underline">the pricing page</NuxtLink>.
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
                  Access details go to <strong>{{ email || 'your email' }}</strong>.
                </p>
                <button
                  type="button"
                  class="mt-4 inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                  @click="emit('close')"
                >
                  Done
                </button>
              </div>

              <!-- Guest details -->
              <form v-else class="mt-5 space-y-3" novalidate @submit.prevent="submit">
                <div>
                  <label for="guest-full-name" class="mb-1 block text-sm font-medium text-gray-700">Full name</label>
                  <input
                    id="guest-full-name"
                    v-model="fullName"
                    type="text"
                    autocomplete="name"
                    placeholder="Kwabena Imhotep"
                    class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    :class="fieldError('fullName') ? 'border-red-500' : 'border-gray-300'"
                    @blur="touched.fullName = true"
                  />
                  <p v-if="fieldError('fullName')" class="mt-1 text-xs text-red-600">{{ fieldError('fullName') }}</p>
                </div>

                <div>
                  <label for="guest-email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="guest-email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    :class="fieldError('email') ? 'border-red-500' : 'border-gray-300'"
                    @blur="touched.email = true"
                  />
                  <p v-if="fieldError('email')" class="mt-1 text-xs text-red-600">{{ fieldError('email') }}</p>
                </div>

                <div>
                  <label for="guest-phone" class="mb-1 block text-sm font-medium text-gray-700">Phone number</label>
                  <input
                    id="guest-phone"
                    v-model="phoneNumber"
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    placeholder="0541234567"
                    class="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    :class="fieldError('phoneNumber') ? 'border-red-500' : 'border-gray-300'"
                    @blur="touched.phoneNumber = true"
                  />
                  <p v-if="fieldError('phoneNumber')" class="mt-1 text-xs text-red-600">{{ fieldError('phoneNumber') }}</p>
                </div>

                <!-- API error -->
                <div v-if="errorMessage" class="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {{ errorMessage }}
                </div>

                <button
                  type="submit"
                  :disabled="isProcessing || !selectedPlanId || !plans.length"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span v-if="!isProcessing">Continue to Pay</span>
                  <span v-else class="flex items-center gap-2">
                    <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Processing…
                  </span>
                </button>

                <p class="text-center text-[11px] leading-relaxed text-gray-500">
                  Already have an account?
                  <button type="button" class="font-medium text-red-600 hover:underline" @click="emit('requestSignIn')">
                    Sign in to subscribe
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  formatPlanPrice,
  formatPlanTypeLabel,
  formatSubscriptionPlanDescription,
  resolveActiveBillingCycle,
  resolvePlanPrice,
  splitFullName,
} from '~/utils/pricingPlans';
import { isValidEmail, isValidPhoneNumber } from '~/utils/helpers';
import type { SubscriptionPlan, SubscriptionResponseModel, GuestSubscriptionPayload } from '~/models';

const props = withDefaults(
  defineProps<{
    /** Plans already loaded by the pricing page — the modal never fetches. */
    plans: SubscriptionPlan[];
    /** Plan to highlight when the modal opens. */
    initialPlanId?: string;
    /** Billing cycle to price with, e.g. `Monthly`. */
    initialBillingCycle?: string;
    /** Optional note, e.g. which edition the subscription unlocks. */
    contextNote?: string;
    /**
     * Dismiss this dialog once checkout starts and let the host render
     * <PaymentCheckoutModal> with the returned URL. Defaults to keeping the
     * Paystack iframe inside this modal.
     */
    redirectToCheckout?: boolean;
  }>(),
  { initialPlanId: '', initialBillingCycle: '', contextNote: '', redirectToCheckout: false },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'requestSignIn'): void;
  (e: 'paymentStarted', payment: SubscriptionResponseModel): void;
}>();

const { $toast } = useNuxtApp();

// ─── Selection ────────────────────────────────────────────────────────────────
const selectedPlanId = ref('');
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

// ─── Guest details + validation ───────────────────────────────────────────────
const fullName = ref('');
const email = ref('');
const phoneNumber = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');

const touched = reactive({ fullName: false, email: false, phoneNumber: false });

const validationErrors = computed<Record<'fullName' | 'email' | 'phoneNumber', string>>(() => {
  const errors = { fullName: '', email: '', phoneNumber: '' };
  const { firstName } = splitFullName(fullName.value);

  if (!firstName) errors.fullName = 'Enter your full name.';
  if (!email.value.trim()) errors.email = 'Enter your email address.';
  else if (!isValidEmail(email.value)) errors.email = 'Enter a valid email address.';

  const phone = phoneNumber.value.trim();
  if (!phone) errors.phoneNumber = 'Enter your phone number.';
  else if (!isValidPhoneNumber(phone)) errors.phoneNumber = 'Enter a 10-digit phone number.';

  return errors;
});

function fieldError(field: 'fullName' | 'email' | 'phoneNumber') {
  if (!touched[field]) return '';
  return validationErrors.value[field];
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
const paymentInfo = ref<SubscriptionResponseModel | null>(null);
const paymentCompleted = ref(false);
// Set when the API returned a result but Paystack could not be initialised.
const paymentError = ref('');
const signedInEmail = ref('');

async function submit() {
  touched.fullName = true;
  touched.email = true;
  touched.phoneNumber = true;
  errorMessage.value = '';

  if (Object.values(validationErrors.value).some(Boolean)) return;
  if (!selectedPlan.value || !selectedSelection.value) {
    errorMessage.value = 'Select a subscription plan to continue.';
    return;
  }

  const { firstName, lastName } = splitFullName(fullName.value);
  const { cycle, pricing } = selectedSelection.value;
  const payload: GuestSubscriptionPayload = {
    firstName,
    lastName,
    email: email.value.trim(),
    phoneNumber: phoneNumber.value.trim(),
    subscriptionPlanId: selectedPlan.value.id,
    // Readable snapshot, e.g. "Combo - Monthly (GHS 48.90)".
    subscriptionPlanDescription: formatSubscriptionPlanDescription(selectedPlan.value, cycle, pricing.price),
    billingCycle: cycle,
    subscriptionType: selectedPlan.value.planType,
  };

  isProcessing.value = true;
  try {
    const result = await guestSubscription(payload);

    if (!result.data) {
      errorMessage.value = result.message || 'We could not start your subscription. Please try again.';
      return;
    }

    // Hand over even when Paystack failed to initialise: the payload also carries
    // the reader identity token, and the host signs the buyer in with it.
    emit('paymentStarted', result.data);

    if (props.redirectToCheckout) {
      // Host owns the payment overlay, so close this dialog first.
      emit('close');
      return;
    }

    // In-modal checkout needs a URL; without one, surface the API/Paystack error.
    paymentError.value = result.success ? '' : result.message || 'Failed to initialize payment.';
    if (paymentError.value) {
      signedInEmail.value = result.data.email ?? '';
      return;
    }

    paymentInfo.value = result.data;
  } catch (error: any) {
    console.error('Guest subscription error:', error);
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

// Paystack reports completion from inside the iframe with a postMessage, exactly
// like the newspaper checkout. The backend (subscription/guest) owns fulfilment
// and emails the access details, so we only acknowledge the payment here.
function onCheckoutMessage(message: MessageEvent<any>) {
  console.log('message->', message)
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
