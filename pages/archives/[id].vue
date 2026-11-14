<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Breadcrumb -->
    <div class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex min-w-0 items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2 text-gray-400">›</span>
          <NuxtLink to="/archives" class="hover:text-red-600">Archives</NuxtLink>
          <span class="mx-2 text-gray-400">›</span>
          <span class="truncate font-medium text-gray-900">{{ pageTitle }}</span>
        </div>
        <NuxtLink
          to="/archives"
          class="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
        >
          <ArrowLeftIcon class="h-4 w-4" />
          <span class="hidden sm:inline">Back</span>
        </NuxtLink>
      </div>
    </div>

    <main class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center gap-4 py-32 text-gray-500" role="status">
        <div class="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-[#e32932]"></div>
        <p class="text-sm font-medium">Checking your access to this document…</p>
      </div>

      <template v-else>
        <!-- Metadata card — rendered whenever the API described the document -->
        <section v-if="metadata" class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div class="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div class="min-w-0">
              <p class="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#e32932]">Graphic Archives</p>
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {{ metadata.publicationName || 'Archived publication' }}
              </h1>
              <p class="mt-1 text-base text-gray-600">{{ formatArchivePublicationDate(metadata.publicationDate) }}</p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                @click="isBookmarked = !isBookmarked"
              >
                <BookmarkIcon :class="['h-5 w-5', isBookmarked ? 'fill-gray-900 text-gray-900' : 'text-gray-500']" />
                <span class="hidden sm:inline">{{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}</span>
              </button>
              <button
                type="button"
                class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                @click="shareDocument"
              >
                <ShareIcon class="h-5 w-5 text-gray-500" />
                <span class="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="flex items-start gap-3">
              <BuildingOfficeIcon class="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">Publisher</dt>
                <dd class="text-gray-800">{{ metadata.publicationName || '—' }}</dd>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <CalendarIcon class="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">Date Published</dt>
                <dd class="text-gray-800">{{ formatArchivePublicationDate(metadata.publicationDate) || '—' }}</dd>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <DocumentIcon class="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-gray-500">File Type</dt>
                <dd class="text-gray-800">
                  <span class="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm">{{ formatArchiveFileType(metadata.fileType) }}</span>
                </dd>
              </div>
            </div>

            <div v-if="metadata.tags.length" class="flex items-start gap-3 sm:col-span-2 lg:col-span-3">
              <TagIcon class="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <div class="min-w-0">
                <dt class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Tags</dt>
                <dd class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in metadata.tags"
                    :key="tag"
                    class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600"
                  >
                    {{ tag }}
                  </span>
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <!-- Document viewer, or the paywall when the API denies access -->
        <section v-if="hasAccess" class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div class="flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckBadgeIcon class="h-5 w-5" />
              <span>Access granted — full document unlocked</span>
            </div>
          </div>
          <ArchiveDocumentViewer
            :key="archiveId"
            :src="documentUrl"
            :file-type="metadata?.fileType || ''"
            :access-token="accessToken"
            :title="readerTitle"
          />
        </section>

        <ArchivePaywall
          v-else
          :publication-name="metadata?.publicationName ?? ''"
          :date-label="formatArchivePublicationDate(metadata?.publicationDate)"
          :file-type="metadata?.fileType ?? ''"
          :is-loading-plans="isLoadingPlans"
          :is-signed-in="isSignedIn"
          @view-plans="openSubscriptionModal"
        />

        <!-- The API failed entirely (network, 5xx): no metadata to show -->
        <section
          v-if="!metadata && !hasAccess"
          class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
        >
          <ExclamationTriangleIcon class="mx-auto mb-4 h-10 w-10 text-amber-500" />
          <h2 class="text-xl font-bold text-gray-900">We couldn't load this document</h2>
          <p class="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {{ access?.message || 'The archive service is unavailable right now. Please try again.' }}
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              class="rounded-lg bg-[#e32932] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              @click="loadAccess()"
            >
              Try again
            </button>
            <NuxtLink
              to="/archives"
              class="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back to Archives
            </NuxtLink>
          </div>
        </section>

        <ArchivePageRecommendations
          v-if="metadata"
          :current-id="archiveId"
          :metadata="metadata"
          :cached-items="searchedItems"
          :query="appliedQuery"
        />
      </template>
    </main>

    <!-- ─── Subscription checkout (same flow as /pricing) ─────────────────── -->
    <!-- Signed-in readers: no contact form, backed by subscription/user. -->
    <BuySubscriptionModalAuthenticated
      v-if="showSubscriptionModal && isSignedIn"
      :plans="subscriptionModalPlans"
      :initial-plan-id="initialSubscriptionPlanId"
      :initial-billing-cycle="initialBillingCycle"
      :context-note="subscriptionContextNote"
      redirect-to-checkout
      @close="closeSubscriptionModal"
      @payment-started="handleSubscriptionPaymentStarted"
    />

    <!-- Guests: collects details and calls subscription/guest, then signs in. -->
    <BuySubscriptionModal
      v-else-if="showSubscriptionModal"
      :plans="subscriptionModalPlans"
      :initial-plan-id="initialSubscriptionPlanId"
      :initial-billing-cycle="initialBillingCycle"
      :context-note="subscriptionContextNote"
      redirect-to-checkout
      @close="closeSubscriptionModal"
      @request-sign-in="handleRequestSignIn"
      @payment-started="handleSubscriptionPaymentStarted"
    />

    <!-- Paystack checkout replaces the buy modal while payment is in progress -->
    <PaymentCheckoutModal
      v-if="checkoutPaymentUrl"
      :payment-url="checkoutPaymentUrl"
      @close="closeCheckout"
    />

    <InfoModal
      :show="showInfoModal"
      :type="infoModalType"
      :title="infoModalTitle"
      :message="infoModalMessage"
      :button-text="infoModalButtonText"
      @close="showInfoModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  BookmarkIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckBadgeIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  ShareIcon,
  TagIcon,
} from '@heroicons/vue/24/outline';
import type { SubscriptionPlan, SubscriptionResponseModel } from '~/models';
import type { SubscriptionIdentity } from '~/utils/subscriptionIdentity';
import type { ArchiveAccessState } from '~/utils/archiveAccess';
import {
  buildArchiveDocumentUrl,
  formatArchiveFileType,
  formatArchivePublicationDate,
} from '~/utils/archiveAccess';

const route = useRoute();
const authStore = useBasicAuthStore();
const { $toast } = useNuxtApp();

// The reader's JWT lives in the `gnp-user-identity` cookie (shared state).
const identityCookie = useCookie<string | null>('gnp-user-identity');
const accessToken = computed(() => authStore.accessToken || identityCookie.value || '');
const archiveApiBase = useRuntimeConfig().public.proxyApiBaseURL;

// The header owns <SignInModal> and reads this shared flag.
const showSignInModal = useState<boolean>('showSignInModal', () => false);

const archiveId = computed(() => String(route.params.id ?? '').trim());

useHead({
  title: 'Archive Document - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Read historical editions from Graphic Archives on Graphic NewsPlus.' },
  ],
});

// ─── Access validation ────────────────────────────────────────────────────────
// `validateArchiveAccess` flattens subscription/validate-archive-access/{id}
// into `{ success, message, metadata, hasAccess }`; it never throws, so a 401
// for a guest lands here as `hasAccess: false` and shows the paywall.
const EMPTY_ACCESS: ArchiveAccessState = { success: false, message: '', metadata: null, hasAccess: false };

const {
  data: access,
  status: accessStatus,
  refresh: refreshAccess,
} = await useAsyncData<ArchiveAccessState>(
  () => `archive-access-${archiveId.value}`,
  async () => {
    const id = archiveId.value;
    const token = accessToken.value;
    const result = await validateArchiveAccess(id, { accessToken: token, apiBase: archiveApiBase });
    return id === archiveId.value && token === accessToken.value ? result : EMPTY_ACCESS;
  },
  {
    // Reactive key follows the document. Session changes force fresh validation,
    // and grants are never reused from an earlier reader's cached payload.
    server: false,
    watch: [accessToken],
    getCachedData: () => undefined,
    default: () => EMPTY_ACCESS,
  },
);

const isLoading = computed(() => accessStatus.value === 'pending' || accessStatus.value === 'idle');

const metadata = computed(() => access.value?.metadata ?? null);
const hasAccess = computed(() => access.value?.hasAccess === true);

const pageTitle = computed(
  () => metadata.value?.publicationName || 'Archive Document',
);

const readerTitle = computed(() => {
  const name = metadata.value?.publicationName ?? 'Graphic Archives';
  const date = formatArchivePublicationDate(metadata.value?.publicationDate);
  return date ? `${name} — ${date}` : name;
});

// The archive-specific proxy revalidates the archive grant before fetching its asset.
const documentUrl = computed(() =>
  buildArchiveDocumentUrl(archiveId.value, metadata.value?.fileType),
);

const dateLabel = computed(() => formatArchivePublicationDate(metadata.value?.publicationDate));

const isBookmarked = ref(false);

/**
 * Re-checks access (after signing in, closing the Paystack overlay, or a retry).
 * The composable caches per id; `refresh` forces a fresh call and keeps the
 * current payload on screen while it runs.
 */
function loadAccess() {
  return refreshAccess();
}

// Signing in or out changes who is asking, so the grant must be re-checked.
watch([archiveId, accessToken], () => { access.value = { ...EMPTY_ACCESS }; }, { flush: 'sync' });

// Update the page title when client-side access metadata arrives.
watchEffect(() => {
  if (!metadata.value) return;
  useHead({
    title: `${readerTitle.value} - Graphic NewsPlus`,
    meta: [
      {
        name: 'description',
        content: `Archive ${formatArchiveFileType(metadata.value.fileType)} of ${metadata.value.publicationName} from ${dateLabel.value}.`,
      },
    ],
  });
});

// Keep the original keyword context for high-relevance recommendations.
// Edition-page requests are independent and never mutate these search results.
const { items: searchedItems, appliedQuery } = useArchiveSearch();

async function shareDocument() {
  const url = import.meta.client ? window.location.href : '';
  const shareData = { title: readerTitle.value, url };

  try {
    if (import.meta.client && navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(url);
    $toast.success('Link copied to your clipboard.');
  } catch {
    // Reader dismissed the share sheet or the clipboard was blocked.
  }
}

// ─── Subscription checkout ────────────────────────────────────────────────────
// Same components and endpoints as /pricing: the modal renders live plans from
// news-papers/get-pricing-plans and starts the Paystack checkout itself.
const {
  plans: pricingPlans,
  isLoading: isLoadingPlans,
  refresh: refreshPricingPlans,
} = usePricingPlans();

const showSubscriptionModal = ref(false);
const initialSubscriptionPlanId = ref('');
const initialBillingCycle = ref('');

// Signed-in readers buy with subscription/user, guests with subscription/guest.
const isSignedIn = computed(() => Boolean(authStore.isAuthenticated && authStore.accessToken));

const checkoutPaymentUrl = ref('');
const { signInFromCheckout } = useGnpUserSession();

const showInfoModal = ref(false);
const infoModalType = ref<'success' | 'error' | 'info'>('info');
const infoModalTitle = ref('');
const infoModalMessage = ref('');
const infoModalButtonText = ref('Close');

function showInfo({ type = 'info', title, message, buttonText = 'Close' }: {
  type?: 'success' | 'error' | 'info';
  title: string;
  message: string;
  buttonText?: string;
}) {
  infoModalType.value = type;
  infoModalTitle.value = title;
  infoModalMessage.value = message;
  infoModalButtonText.value = buttonText;
  showInfoModal.value = true;
}

// Every plan is offered, exactly like the pricing page; the archive copy only
// adds context about what a subscription unlocks.
const subscriptionModalPlans = computed<SubscriptionPlan[]>(() => pricingPlans.value);

const subscriptionContextNote = computed(() => {
  const name = metadata.value?.publicationName;
  return name ? `Unlocks ${name} archive editions and the other publications in the plan.` : '';
});

// Pre-select the first plan once the list arrives; the modal keeps it valid.
watch(
  subscriptionModalPlans,
  (plans) => {
    initialSubscriptionPlanId.value = plans[0]?.id ?? '';
  },
  { immediate: true },
);

function openSubscriptionModal() {
  showSubscriptionModal.value = true;

  // Plans are fetched lazily; a direct visit to this page may not have them yet.
  if (!pricingPlans.value.length && !isLoadingPlans.value) {
    refreshPricingPlans().catch(() => {
      $toast.error('Could not load subscription plans. Please try again.');
    });
  }
}

function closeSubscriptionModal() {
  showSubscriptionModal.value = false;
}

// Guests get signed in with the identity token checkout returns; signed-in
// buyers keep their session (re-signing them would swap identity mid-purchase).
async function handleSubscriptionPaymentStarted(payment: SubscriptionResponseModel) {
  showSubscriptionModal.value = false;

  const identity: SubscriptionIdentity | null = isSignedIn.value ? null : signInFromCheckout(payment);

  if (payment?.paymentUrl) {
    checkoutPaymentUrl.value = payment.paymentUrl;
    return;
  }

  const account = identity?.email || identity?.username || authStore.user?.email || '';
  showInfo({
    type: 'error',
    title: 'Payment could not be started',
    message: account
      ? `Your account (${account}) is ready — retry the payment to unlock this document.`
      : 'Please try again to unlock this document.',
  });
}

function closeCheckout() {
  checkoutPaymentUrl.value = '';

  // Payment finished (or was abandoned): re-check access so a successful
  // subscription unlocks the document without a manual reload.
  loadAccess();
}

function handleRequestSignIn() {
  showSubscriptionModal.value = false;
  showSignInModal.value = true;
}

</script>
