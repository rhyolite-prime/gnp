<template>
  <section class="bg-stone-900 py-14 text-white sm:py-20" aria-labelledby="remember-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">{{ config.eyebrow }}</p>
          <h2 id="remember-title" class="mt-3 text-3xl font-bold sm:text-4xl">{{ config.title }}</h2>
          <p class="mt-3 max-w-xl text-stone-300">{{ config.subtitle }}</p>
        </div>
        <NuxtLink to="/archives" class="rounded-lg px-2 py-3 text-sm font-bold text-amber-300 hover:underline">Explore the archives →</NuxtLink>
      </div>
      <div role="region" aria-roledescription="carousel" aria-label="Stories from the past" @mouseenter="hovered = true" @mouseleave="hovered = false" @focusin="focused = true" @focusout="onFocusOut" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)">
        <p v-if="loading" role="status" class="rounded-2xl bg-white/5 p-10 text-stone-300">Looking back through the archives…</p>
        <template v-else-if="slides.length">
          <div class="grid overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-[1fr_2fr]">
            <div class="relative min-h-48 overflow-hidden md:min-h-80">
              <img :src="current.imageUrl || '/images/explore-archives.jpg'" alt="" width="1536" height="1024" loading="lazy" class="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div class="flex min-h-80 flex-col justify-center p-6 sm:p-10" :aria-live="paused || focused ? 'polite' : 'off'" aria-atomic="true">
              <Transition name="memory" mode="out-in">
                <div :key="active">
                  <p class="text-sm font-bold uppercase tracking-widest text-amber-300">{{ current.label }}</p>
                  <time :datetime="current.date" class="mt-2 block text-sm text-stone-400">{{ formatDate(current.date) }}</time>
                  <template v-if="current.headline || current.story">
                    <p class="mt-5 text-xs font-semibold uppercase tracking-wider text-stone-400">From the archive · {{ current.publicationName || current.story?.publicationName }}</p>
                    <h3 class="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">{{ current.headline || current.story?.snippet }}</h3>
                    <p v-if="current.description" class="mt-3 leading-7 text-stone-300">{{ current.description }}</p>
                    <NuxtLink :to="currentLink" class="mt-6 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-stone-900 hover:bg-amber-100">{{ current.ctaLabel || 'Revisit this story →' }}</NuxtLink>
                  </template>
                  <template v-else>
                    <h3 class="mt-5 text-2xl font-semibold">{{ current.failed ? 'We couldn’t load this moment.' : 'More stories are waiting to be rediscovered.' }}</h3>
                    <p class="mt-3 leading-7 text-stone-300">{{ current.failed ? 'The archives are temporarily unavailable. Please try again later.' : 'No archive excerpt is available for this date. Browse the collection to uncover more moments from the past.' }}</p>
                    <NuxtLink to="/archives" class="mt-5 inline-block font-bold text-amber-300 hover:underline">Browse past editions →</NuxtLink>
                  </template>
                </div>
              </Transition>
            </div>
          </div>
          <div class="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button type="button" class="memory-control" aria-label="Previous memory" @click="move(-1)">←</button>
            <button v-for="(slide, index) in slides" :key="slide.id || slide.label" type="button" class="memory-control text-sm" :class="active === index ? 'bg-white text-stone-900' : 'text-white'" :aria-current="active === index ? 'true' : undefined" @click="active = index">{{ slide.label }}</button>
            <button type="button" class="memory-control" aria-label="Next memory" @click="move(1)">→</button>
            <button type="button" class="memory-control text-sm" :aria-label="paused ? 'Play memories' : 'Pause memories'" @click="paused = !paused">{{ paused ? 'Play' : 'Pause' }}</button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import type { ArchiveSearchItem } from '~/models';
import { buildArchiveSearchRequest, searchArchives } from '~/services/archives';
import { fetchRememberWhenCms } from '~/services/cms';
import {
  DEFAULT_REMEMBER_WHEN_CONFIG,
  resolveRememberWhenSlideLink,
  type RememberWhenConfig,
} from '~/utils/cmsContent';
import { memoryDates } from '~/utils/memoryDates.mjs';

type Memory = {
  id?: string;
  label: string;
  date: string;
  publicationName?: string;
  headline?: string;
  description?: string;
  imageUrl?: string;
  archiveId?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  story?: ArchiveSearchItem;
  failed?: boolean;
};

const config = ref<RememberWhenConfig>({ ...DEFAULT_REMEMBER_WHEN_CONFIG });
const slides = ref<Memory[]>(memoryDates());
const active = ref(0);
const current = computed(() => slides.value[active.value] ?? slides.value[0]!);
const currentLink = computed(() => {
  const slide = current.value;
  if (!slide) return '/archives';
  if (slide.story?.id) return `/archives/${encodeURIComponent(slide.story.id)}`;
  return resolveRememberWhenSlideLink({ archiveId: slide.archiveId || '', ctaUrl: slide.ctaUrl || '' });
});
const loading = ref(true);
const paused = ref(false);
const hovered = ref(false);
const focused = ref(false);
let disposed = false;
let timer: ReturnType<typeof setInterval> | undefined;
let motion: MediaQueryList | undefined;
const syncMotion = () => { paused.value = motion?.matches ?? false; };
const move = (direction: number) => {
  if (!slides.value.length) return;
  active.value = (active.value + direction + slides.value.length) % slides.value.length;
};
function onFocusOut(event: FocusEvent) {
  focused.value = (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null);
}
function formatDate(date: string) {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parsed);
}
onMounted(async () => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncMotion();
  motion.addEventListener('change', syncMotion);

  let cmsSlides: Memory[] = [];
  let shouldFallback = true;

  try {
    const cmsRes = await fetchRememberWhenCms({ publishedOnly: true });
    if (cmsRes?.config) {
      config.value = cmsRes.config;
      shouldFallback = cmsRes.config.fallbackToArchiveDates !== false;
    }
    if (Array.isArray(cmsRes?.slides) && cmsRes.slides.length > 0) {
      cmsSlides = cmsRes.slides.map(slide => ({
        id: slide.id,
        label: slide.label,
        date: slide.date,
        publicationName: slide.publicationName,
        headline: slide.headline,
        description: slide.description,
        imageUrl: slide.imageUrl,
        archiveId: slide.archiveId,
        ctaLabel: slide.ctaLabel,
        ctaUrl: slide.ctaUrl,
      }));
    }
  } catch {
    // CMS unavailable — fall back to automatic archive date lookup.
  }

  if (disposed) return;

  if (cmsSlides.length > 0) {
    slides.value = cmsSlides;
  } else if (shouldFallback) {
    const results = await Promise.all(memoryDates().map(async (slide: Memory) => {
      try {
        const result = await searchArchives(buildArchiveSearchRequest({ pageNo: 1, pageSize: 12, publicationDate: slide.date }));
        const story = result.data?.find(item => item.id && item.snippet?.trim() && item.publicationDate?.slice(0, 10) === slide.date);
        return {
          ...slide,
          publicationName: story?.publicationName,
          headline: story?.snippet,
          ctaLabel: 'Revisit this story →',
          story,
        };
      } catch {
        return { ...slide, failed: true };
      }
    }));
    if (disposed) return;
    slides.value = results;
  } else {
    slides.value = [];
  }

  loading.value = false;
  timer = setInterval(() => {
    if (!paused.value && !hovered.value && !focused.value && !document.hidden) move(1);
  }, config.value.autoplayMs || 8000);
});
onBeforeUnmount(() => {
  disposed = true;
  if (timer) clearInterval(timer);
  motion?.removeEventListener('change', syncMotion);
});
</script>

<style scoped>
.memory-control { @apply min-h-[44px] min-w-[44px] rounded-full border border-white/30 px-4 font-semibold hover:border-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300; }
.memory-enter-active, .memory-leave-active { transition: opacity 250ms ease, transform 250ms ease; }
.memory-enter-from { opacity: 0; transform: translateY(8px); }
.memory-leave-to { opacity: 0; transform: translateY(-8px); }
@media (prefers-reduced-motion: reduce) {
  .memory-enter-active, .memory-leave-active { transition: none; }
}
</style>
