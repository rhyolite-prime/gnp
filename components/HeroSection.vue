<template>
  <section
    id="home-hero"
    class="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#fdfcfa] to-[#fbfaf7]"
    aria-labelledby="home-hero-title"
  >
    <!-- Ambient artwork -->
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute -right-28 -top-36 h-[30rem] w-[30rem] rounded-full bg-primary-100/70 blur-3xl" />
      <div class="absolute -left-32 top-40 h-[22rem] w-[22rem] rounded-full bg-orange-100/50 blur-3xl" />
      <div class="absolute inset-y-0 left-1/4 hidden w-px bg-stone-900/[0.05] lg:block" />
      <div class="absolute inset-y-0 left-1/2 hidden w-px bg-stone-900/[0.05] lg:block" />
      <div class="absolute inset-y-0 left-3/4 hidden w-px bg-stone-900/[0.05] lg:block" />
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <!-- Copy -->
        <div class="lg:col-span-6">

          <h1
            id="home-hero-title"
            class="mt-6 text-[2.55rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-stone-900 sm:text-[3.4rem] lg:text-[3.15rem] xl:text-[3.9rem]"
          >
            <span class="block">Ghana's Leading</span>
            <span class="relative mt-1 block w-fit pr-2">
              <span
                class="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 bg-clip-text font-display italic font-medium text-transparent"
              >
                Digital News
              </span>
              <svg
                class="absolute -bottom-1.5 left-0 h-2.5 w-full text-primary-400/60 sm:-bottom-2.5 sm:h-3"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8.5C48 3.5 96 2.6 148 5.2c40 2 82 4.2 150 1.4"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span class="mt-1 block">Platform</span>
          </h1>

          <p class="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:mt-7 sm:text-lg sm:leading-8">
            Access digital versions of Ghana's most trusted newspapers including
            <span class="font-semibold text-stone-800">Daily Graphic, Graphic Business,
            Graphic Sports and The Mirror</span> and more — on any device, anywhere in the
            world.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              class="group inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-xl bg-primary-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 active:translate-y-0"
              @click="startReading"
            >
              Get Started
              <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                <path d="M4 10h11.5m0 0-4.5-4.5m4.5 4.5L11 14.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <NuxtLink
              to="/learn-more"
              class="group inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-xl border border-stone-300 bg-white px-7 py-3.5 text-sm font-bold text-stone-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
            >
              <svg viewBox="0 0 20 20" fill="none" class="h-4 w-4 text-primary-600" aria-hidden="true">
                <path d="M3.5 5.25A1.75 1.75 0 0 1 5.25 3.5H9v13H5.25a1.75 1.75 0 0 1-1.75-1.75V5.25Zm13 0A1.75 1.75 0 0 0 14.75 3.5H11v13h3.75a1.75 1.75 0 0 0 1.75-1.75V5.25Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
              Learn More
            </NuxtLink>
          </div>

        </div>

        <!-- Artwork -->
        <div class="relative mx-auto w-full max-w-md lg:col-span-6 lg:max-w-none">
          <div
            class="absolute -inset-x-3 bottom-4 top-10 -z-10 rounded-[2.25rem] bg-gradient-to-br from-primary-600/12 via-primary-100/40 to-transparent"
            aria-hidden="true"
          />

          <figure
            class="group relative overflow-hidden rounded-[1.75rem] shadow-2xl shadow-stone-900/20 ring-1 ring-stone-900/10"
          >
            <WelcomeSlider />

            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/5 to-transparent"
              aria-hidden="true"
            />

            <figcaption class="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
              <NuxtLink
                :to="editionLink"
                :aria-label="editionAriaLabel"
                :aria-busy="isLoading"
                class="group/edition flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-600 text-white">
                  <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" aria-hidden="true">
                    <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5H16a1.5 1.5 0 0 1 1.5 1.5V17A2 2 0 0 0 19.5 19H7a1.5 1.5 0 0 1-1.5-1.5V6.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                    <path d="M7.5 9h6M7.5 12h6M7.5 15h3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                  </svg>
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px] font-bold leading-tight text-stone-900">
                    Today's edition · Daily Graphic
                  </p>
                  <p class="truncate text-[11px] font-medium text-stone-500">
                    {{ editionSubtitle }}
                  </p>
                </div>
                <span class="hidden shrink-0 items-center gap-1 rounded-full bg-stone-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors group-hover/edition:bg-primary-600 sm:inline-flex">
                  {{ editionBadge }}
                </span>
              </NuxtLink>
            </figcaption>
          </figure>
        </div>
      </div>

      <!-- Mastheads -->
      <div class="border-t border-stone-200/80 py-5">
        <div
          class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400 sm:justify-between sm:text-[11px] sm:tracking-[0.18em]"
        >
          <template v-for="(paper, index) in mastheads" :key="paper">
            <span class="whitespace-nowrap">{{ paper }}</span>
            <span
              v-if="index < mastheads.length - 1"
              class="hidden h-1 w-1 rounded-full bg-stone-300 sm:block"
              aria-hidden="true"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useBasicAuthStore } from '~/stores/basic-user-auth';
import { useLatestNewspapers } from '~/composables/useLatestNewspapers';
import {
  findDailyGraphicEdition,
  getLocalDateKey,
  getNewspaperDetailPath,
} from '~/utils/latestNewspapers';

const showSignInModal = useState<boolean>('showSignInModal', () => false);
const authStore = useBasicAuthStore();
const { newspapers, isLoading, refresh } = useLatestNewspapers();

const stats = [
  { value: '12', label: 'Editions' },
  { value: '2M+', label: 'Readers' },
  { value: '74', label: 'Years' },
];

const mastheads = [
  'Daily Graphic',
  'Graphic Business',
  'Graphic Sports',
  'The Mirror',
  'Graphic Showbiz',
];

// Keep the calendar date hydrated from the server, then follow the reader’s clock.
const todayDateKey = useState<string>('hero-edition-date-key', () => getLocalDateKey());
let dateTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  todayDateKey.value = getLocalDateKey();
  dateTimer = setInterval(() => {
    todayDateKey.value = getLocalDateKey();
  }, 60_000);
});

onBeforeUnmount(() => {
  if (dateTimer) clearInterval(dateTimer);
});

// If the page stays open overnight, reload the feed for the new day.
watch(todayDateKey, (value, previous) => {
  if (previous && value !== previous) refresh();
});

const todayEdition = computed(() => findDailyGraphicEdition(newspapers.value, todayDateKey.value));
const editionLink = computed(() => todayEdition.value ? getNewspaperDetailPath(todayEdition.value.id) : '/newspapers');
const todayLabel = computed(() => {
  if (!todayDateKey.value) return '';
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${todayDateKey.value}T00:00:00Z`));
});
const editionSubtitle = computed(() => {
  if (isLoading.value) return 'Checking the latest editions…';
  return todayEdition.value
    ? `${todayLabel.value} · ready to read`
    : 'Not available yet · browse all editions';
});
const editionBadge = computed(() => isLoading.value ? '…' : todayEdition.value ? 'Open' : 'Browse');
const editionAriaLabel = computed(() => todayEdition.value
  ? `Read today's Daily Graphic edition (${todayLabel.value})`
  : 'Browse all newspaper editions');

function startReading() {
  if (authStore.isAuthenticated) {
    navigateTo('/newspapers');
  } else {
    showSignInModal.value = true;
  }
}
</script>
