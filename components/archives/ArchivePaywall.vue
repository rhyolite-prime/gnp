<template>
  <!--
    Archive paywall. Rendered whenever `validate-archive-access` answers
    `hasAccess: false`, including for guests and readers who are signed in but
    have no archive subscription. The CTA hands control to the same Buy
    Subscription flow used by /pricing (guest or member variant).
  -->
  <section
    class="relative overflow-hidden rounded-2xl border border-red-100 bg-white shadow-xl"
    role="region"
    aria-labelledby="archive-paywall-title"
  >
    <!-- Decorative backdrop: blurred document so the upsell reads as a preview -->
    <div class="absolute inset-0" aria-hidden="true">
      <div class="absolute inset-0 bg-[#fdfbf7]"></div>
      <div class="absolute inset-0 px-8 py-10 opacity-[0.14] blur-[3px] select-none">
        <div class="mx-auto max-w-3xl">
          <div class="mb-6 border-b-2 border-gray-900/60 pb-3">
            <p class="font-serif text-2xl font-black uppercase tracking-wide text-gray-900">
              {{ publicationName || 'Graphic Archives' }}
            </p>
            <p class="font-serif text-xs text-gray-700">{{ dateLabel }}</p>
          </div>
          <div class="columns-1 gap-6 sm:columns-2">
            <div
              v-for="(line, index) in previewLines"
              :key="index"
              class="mb-2 h-2 rounded-sm bg-gray-900/50"
              :style="{ width: line }"
            ></div>
          </div>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-white/40 via-white/85 to-white"></div>
    </div>

    <div class="relative px-6 py-10 text-center sm:px-10 sm:py-14">
      <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <LockClosedIcon class="h-8 w-8 text-[#e32932]" />
      </div>

      <h2 id="archive-paywall-title" class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Unlock Full Access
      </h2>

      <p class="mx-auto mt-3 max-w-xl text-base leading-relaxed text-gray-600">
        <template v-if="publicationName">
          This {{ fileTypeLabel.toLowerCase() }} from <span class="font-semibold text-gray-800">{{ publicationName }}</span>
          <template v-if="dateLabel"> ({{ dateLabel }})</template>
          is part of Graphic Archives.
        </template>
        <template v-else>
          This document is part of Graphic Archives.
        </template>
        Subscribe to read the full edition and explore decades of historical news.
      </p>

      <div class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e32932] px-8 py-4 text-base font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          @click="emit('viewPlans')"
        >
          <!-- Never blocked while plans load: the modal opens and fills in. -->
          <ArrowPathIcon v-if="isLoadingPlans" class="h-5 w-5 animate-spin" />
          <span>View Subscription Plans</span>
        </button>

        <NuxtLink
          to="/archives"
          class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          Back to Archives
        </NuxtLink>
      </div>

      <p v-if="!isSignedIn" class="mt-6 text-sm text-gray-500">
        Already a subscriber?
        <button
          type="button"
          class="font-semibold text-[#e32932] hover:underline"
          @click="showSignInModal = true"
        >
          Sign In
        </button>
      </p>
      <p v-else class="mt-6 text-sm text-gray-500">
        Signed in without archive access? Manage your plan from
        <NuxtLink to="/account" class="font-semibold text-[#e32932] hover:underline">your account</NuxtLink>.
      </p>

      <ul class="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-2 text-left text-sm text-gray-600 sm:grid-cols-3">
        <li v-for="perk in perks" :key="perk" class="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2">
          <CheckIcon class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
          <span>{{ perk }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import type { ArchiveFileType } from '~/models';
import { formatArchiveFileType } from '~/utils/archiveAccess';

const props = withDefaults(
  defineProps<{
    /** Publication of the locked document, e.g. `Daily Graphic`. */
    publicationName?: string;
    /** Already formatted date label, e.g. `18 December 1950`. */
    dateLabel?: string;
    /** `metadata.fileType` — only used to word the copy correctly. */
    fileType?: ArchiveFileType | null;
    /** True while the pricing plans are being fetched on demand. */
    isLoadingPlans?: boolean;
    /** Drives the "Sign In" hint vs. the account hint. */
    isSignedIn?: boolean;
  }>(),
  {
    publicationName: '',
    dateLabel: '',
    fileType: 'PDF',
    isLoadingPlans: false,
    isSignedIn: false,
  },
);

const emit = defineEmits<{
  /** Reader wants the plans — the page opens the buy subscription modal. */
  (e: 'viewPlans'): void;
}>();

// The header owns <SignInModal> and reads this shared flag.
const showSignInModal = useState<boolean>('showSignInModal', () => false);

const fileTypeLabel = computed(() => formatArchiveFileType(props.fileType));

const perks = ['Every archive edition', 'Cancel anytime', 'Read on any device'];

// Faux body lines behind the lock — purely decorative, fixed widths so the
// preview never shifts between renders.
const previewLines = [
  '100%', '96%', '100%', '88%', '100%', '92%', '100%', '75%',
  '100%', '98%', '86%', '100%', '94%', '100%', '80%',
];
</script>
