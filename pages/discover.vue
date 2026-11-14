<template>
  <div class="bg-stone-950 text-white">
    <div class="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6 lg:px-8">
      <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold sm:text-2xl">Discover <span class="font-normal text-stone-500">/</span> <span class="text-amber-300">For you</span></h1>
          <p class="mt-1 text-xs leading-5 text-stone-400">{{ selection.length ? `More from your ${selection.length} interests, mixed with fresh discoveries.` : 'A shuffled mix of news, newspapers, archives and videos.' }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink to="/interests" class="feed-control">Edit interests</NuxtLink>
          <button type="button" :disabled="loading" class="feed-control disabled:opacity-50" @click="refreshFeed">↻ Shuffle again</button>
        </div>
      </header>
      <p id="feed-instructions" class="sr-only">Swipe or scroll to discover content. Focus this feed and use arrow up or down to move between cards. Full newspaper and archive content opens in the subscription reader.</p>
      <div class="relative mx-auto max-w-5xl">
        <div ref="scroller" class="discover-scroller rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300" role="feed" aria-label="Personalised discovery feed" aria-describedby="feed-instructions" :aria-busy="loading" tabindex="0" @scroll.passive="onScroll" @keydown="onKeydown">
          <article v-for="(item, index) in items" :key="item.key" class="discover-slide" :aria-labelledby="`discover-title-${index + 1}`" :aria-posinset="index + 1" :aria-setsize="-1">
            <DiscoverFeedCard :item="item" :active="activeIndex === index && !selectedStory" :position="index + 1" @story="selectedStory = $event" />
          </article>
          <div ref="sentinel" class="flex min-h-56 flex-col items-center justify-center gap-4 p-6 text-center" :class="!items.length ? 'min-h-full' : ''">
            <p v-if="loading" role="status" class="text-stone-300">Mixing your next discoveries…</p>
            <template v-else-if="errors.length">
              <p role="status" class="max-w-lg text-sm leading-6 text-amber-200">Some content couldn’t be loaded: {{ errors.map(error => error.label).join(', ') }}. Your available discoveries are still here.</p>
              <button type="button" class="feed-control" @click="loadMore">Retry / load more</button>
            </template>
            <template v-else-if="finished">
              <p class="font-semibold">{{ items.length ? 'You’re all caught up.' : 'No discoveries are available right now.' }}</p>
              <p class="max-w-md text-sm leading-6 text-stone-400">{{ items.length ? 'You’ve reached the end of the available catalogue. Shuffle again for a fresh order, or explore different interests.' : 'Check back for new content or explore the newspaper collection.' }}</p>
              <button type="button" class="feed-control" @click="refreshFeed">Shuffle again</button>
              <NuxtLink to="/newspapers" class="text-sm text-amber-300 underline">Browse newspapers</NuxtLink>
            </template>
            <button v-else type="button" class="feed-control" @click="loadMore">Load more discoveries</button>
          </div>
        </div>
        <nav v-if="items.length" class="pointer-events-none absolute bottom-4 right-3 z-10 flex flex-col gap-2" aria-label="Move through discoveries">
          <button type="button" aria-label="Previous discovery" :disabled="activeIndex === 0" class="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-stone-900/90 text-white disabled:opacity-30" @click="move(-1)">↑</button>
          <button type="button" aria-label="Next discovery" class="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-stone-900/90 text-white" @click="move(1)">↓</button>
        </nav>
      </div>
      <div class="mx-auto mt-3 flex max-w-5xl flex-wrap justify-between gap-2 text-xs text-stone-400">
        <span>{{ items.length ? `${Math.min(activeIndex + 1, items.length)} / ${items.length} loaded` : 'Your next discovery is waiting' }} · Scroll to explore</span>
        <span>Interest matches use keywords. New batches are shuffled; no paid access is bypassed.</span>
      </div>
    </div>

    <TransitionRoot :show="!!selectedStory" as="template">
      <Dialog as="div" class="relative z-[80]" @close="selectedStory = null">
        <div class="fixed inset-0 bg-black/75" />
        <div class="fixed inset-0 overflow-y-auto p-4 sm:p-8">
          <div class="flex min-h-full items-center justify-center">
            <DialogPanel class="w-full max-w-3xl rounded-2xl bg-white p-6 text-stone-900 sm:p-10">
              <button type="button" class="float-right ml-4 min-h-[44px] min-w-[44px] rounded-full bg-stone-100 text-xl" aria-label="Close story" @click="selectedStory = null">×</button>
              <DialogTitle class="text-2xl font-bold">{{ selectedStory?.title }}</DialogTitle>
              <p class="mt-6 whitespace-pre-line text-base leading-8 text-stone-700">{{ selectedStory?.body }}</p>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot } from '@headlessui/vue';
import { useDiscoverFeed } from '~/composables/useDiscoverFeed';
import { normalizeContentSelection, type ContentCategoryId } from '~/utils/contentCategories';
import { INTERESTS_STORAGE_KEY } from '~/utils/onboarding';
import type { DiscoverItem } from '~/utils/discoverFeed';

useHead({ title: 'Discover — For you | Graphic NewsPlus', meta: [{ name: 'description', content: 'Swipe through a shuffled mix of stories, videos, newspaper editions and archive pages, with more from your interests.' }] });
const { items, loading, errors, selection, finished, loadMore, reset } = useDiscoverFeed();
const scroller = ref<HTMLElement | null>(null);
const sentinel = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const selectedStory = ref<DiscoverItem | null>(null);
let observer: IntersectionObserver | undefined;
let mounted = false;
let disposed = false;
async function refreshFeed() {
  let selected: ContentCategoryId[] = [];
  try { selected = normalizeContentSelection(JSON.parse(localStorage.getItem(INTERESTS_STORAGE_KEY) || '[]')); } catch { /* Discovery is available without saved preferences. */ }
  activeIndex.value = 0;
  scroller.value?.scrollTo({ top: 0, behavior: 'instant' });
  await reset(selected);
  if (disposed) return;
  // Re-observe once per explicit reset, including when a previous catalogue was empty.
  if (mounted) { await nextTick(); observe(); }
}
function onScroll() {
  const element = scroller.value;
  if (element) activeIndex.value = Math.min(Math.max(0, items.value.length - 1), Math.round(element.scrollTop / element.clientHeight));
}
function move(direction: number) {
  const element = scroller.value;
  if (!element) return;
  const index = Math.max(0, Math.min(items.value.length, activeIndex.value + direction));
  element.scrollTo({ top: index * element.clientHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
function onKeydown(event: KeyboardEvent) {
  if ((event.target as HTMLElement).closest('a, button, input, select, textarea')) return;
  if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault(); move(event.key === 'ArrowDown' || event.key === 'PageDown' ? 1 : -1);
  }
}
function observe() {
  observer?.disconnect();
  if (!('IntersectionObserver' in window) || !scroller.value || !sentinel.value) return;
  observer = new IntersectionObserver(entries => {
    // Pause automatic retries after a network error; retain a deliberate retry button.
    if (entries.some(entry => entry.isIntersecting) && !loading.value && !errors.value.length && !finished.value && !selectedStory.value) loadMore();
  }, { root: scroller.value, rootMargin: '0px 0px 600px 0px' });
  observer.observe(sentinel.value);
}
onMounted(async () => { mounted = true; await refreshFeed(); });
onBeforeUnmount(() => { disposed = true; mounted = false; observer?.disconnect(); });
</script>

<style scoped>
.discover-scroller { height: calc(100vh - 18rem); height: calc(100dvh - 18rem); min-height: 420px; overflow-y: auto; scroll-snap-type: y proximity; overscroll-behavior-y: contain; scrollbar-width: thin; scrollbar-color: #57534e #0c0a09; }
.discover-slide { height: 100%; padding-bottom: 12px; scroll-snap-align: start; scroll-margin-top: 0; content-visibility: auto; }
.feed-control { @apply inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:border-amber-300 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300; }
@media (prefers-reduced-motion: reduce) { .discover-scroller { scroll-behavior: auto; scroll-snap-type: none; } }
</style>
