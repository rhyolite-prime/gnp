<template>
  <section id="newspapers" class="bg-[#fbfaf7] py-16 sm:py-20" aria-labelledby="latest-newspapers-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-9 flex flex-col justify-between gap-5 sm:mb-11 sm:flex-row sm:items-end">
        <div class="max-w-2xl">
          <p class="mb-3 text-xs font-bold uppercase tracking-[.2em] text-primary-700">A fresh perspective, every day</p>
          <h2 id="latest-newspapers-title" class="font-display text-3xl font-semibold tracking-tight text-[#263d37] sm:text-4xl">Latest Newspapers</h2>
          <p class="mt-3 text-sm leading-6 text-stone-600 sm:text-base">The latest editions from the voices Ghana trusts. Find a story worth sitting down for.</p>
        </div>
        <NuxtLink
          to="/newspapers"
          class="group inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Browse all editions
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-4 w-4 transition-transform group-hover:translate-x-0.5"><path d="M4.5 10h11m0 0L11 5.5M15.5 10 11 14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </NuxtLink>
      </div>

      <div v-if="newspapers.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-6">
        <NewspaperCard
          v-for="(newspaper, index) in newspapers"
          :key="newspaper.id"
          :newspaper="newspaper"
          @click="viewNewspaper(newspaper)"
          class="animate-slide-up"
          :style="{ animationDelay: `${Math.min(index, 5) * 60}ms` }"
        />
      </div>
      <div v-else-if="isLoading" class="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-6" aria-label="Loading latest newspaper editions">
        <div v-for="item in 12" :key="item" class="overflow-hidden rounded-xl border border-stone-200/80 bg-white p-2 shadow-sm">
          <div class="aspect-[3/4] animate-pulse rounded-lg bg-stone-100" />
          <div class="mx-2 my-3 h-3 animate-pulse rounded bg-stone-100" />
          <div class="mx-2 mb-2 h-3 w-2/3 animate-pulse rounded bg-stone-100" />
        </div>
      </div>
      <p v-else class="rounded-2xl border border-dashed border-stone-300 px-6 py-12 text-center text-sm text-stone-600">New editions are on their way. Please check back soon.</p>

      <p class="mt-6 text-center text-xs text-stone-500">Good journalism brings us closer. Explore today’s editions.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLatestNewspapers } from '~/composables/useLatestNewspapers';
import { getNewspaperDetailPath } from '~/utils/latestNewspapers';
import type { NewsPaper } from '~/models';

// Shared with HeroSection so the hero can link to an edition from this same feed.
const { newspapers, isLoading } = useLatestNewspapers();

function viewNewspaper(newspaper: NewsPaper) {
  navigateTo(getNewspaperDetailPath(newspaper.id));
}
</script>
