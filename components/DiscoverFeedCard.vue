<template>
  <div class="discover-card relative flex h-full min-h-0 flex-col justify-end overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
    <img v-if="image && !failed" :src="image" alt="" :loading="position === 1 ? 'eager' : 'lazy'" decoding="async" class="absolute inset-0 h-full w-full" :class="item.kind === 'newspaper' || item.kind === 'archive' ? 'object-contain' : 'object-cover'" @error="failed = true" />
    <div class="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/10" />
    <div class="absolute inset-x-4 top-4 flex flex-wrap items-center gap-2 sm:inset-x-8 sm:top-6">
      <span class="rounded-full bg-white/95 px-3 py-2 text-xs font-bold uppercase tracking-widest text-stone-800 backdrop-blur">{{ labels[item.kind] }}</span>
      <span v-if="item.mock" class="rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900">SAMPLE</span>
      <span v-if="item.preferred" class="rounded-full bg-amber-300 px-3 py-2 text-xs font-semibold text-stone-950">For you · {{ item.reason }}</span>
      <span v-else class="hidden rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-stone-700 backdrop-blur sm:inline">Something different</span>
    </div>
    <div v-if="playing && active && item.videoEmbed" class="absolute inset-x-3 top-20 z-10 aspect-video overflow-hidden rounded-xl bg-black sm:inset-x-8">
      <iframe :src="`${item.videoEmbed}?autoplay=1`" :title="item.title" class="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" />
      <button type="button" aria-label="Close video" class="absolute right-2 top-2 rounded-full bg-black/80 px-3 py-2 text-white" @click="playing = false">×</button>
    </div>
    <div class="discover-copy relative p-4 sm:p-8 sm:pr-24 lg:p-10 lg:pr-24" :class="playing && active ? 'max-h-[42%] overflow-y-auto' : ''">
      <p class="text-xs font-semibold uppercase tracking-wider text-stone-600">{{ item.source }}<span v-if="date"> · {{ date }}</span></p>
      <h2 :id="`discover-title-${position}`" class="discover-title mt-3 line-clamp-3 max-w-3xl text-[clamp(1.25rem,5.5vw,1.75rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl">{{ item.title }}</h2>
      <p class="discover-excerpt mt-3 line-clamp-2 sm:line-clamp-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">{{ item.excerpt }}</p>
      <div class="mt-5 flex flex-wrap items-center gap-3">
        <button v-if="item.mock || (item.kind === 'story' && item.body)" type="button" class="feed-link bg-primary-600 text-white hover:bg-primary-700" @click="$emit('story', item)">{{ item.mock ? 'Preview sample' : 'Read this story' }} →</button>
        <NuxtLink v-else :to="item.href" class="feed-link bg-primary-600 text-white hover:bg-primary-700">{{ item.kind === 'video' ? 'Open video' : item.free ? 'Read now' : 'Read with subscription' }} →</NuxtLink>
        <button v-if="item.videoEmbed && !playing" type="button" class="feed-link border border-stone-300 bg-white text-stone-800 hover:bg-stone-50" @click="playing = true">▶ Play here</button>
        <span v-if="!item.mock && (item.kind === 'newspaper' || item.kind === 'archive')" class="text-xs text-stone-600">Full access checked in the reader</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { DiscoverItem } from '~/utils/discoverFeed';
const props = defineProps<{ item: DiscoverItem; active: boolean; position: number }>();
defineEmits<{ story: [item: DiscoverItem] }>();
const labels = { archive: 'From the archives', newspaper: 'Newspaper', video: 'Watch', story: 'Top story' };
const failed = ref(false);
const playing = ref(false);
const image = computed(() => props.item.image || (props.item.kind === 'archive' ? '/images/explore-archives.jpg' : '/images/explore-newspapers.jpg'));
const date = computed(() => {
  const value = new Date(props.item.date);
  return Number.isNaN(value.getTime()) ? '' : value.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
});
watch(() => props.active, value => { if (!value) playing.value = false; });
watch(() => props.item.key, () => { failed.value = false; playing.value = false; });
</script>

<style scoped>
.discover-copy { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
@media (max-width: 639px) {
  .discover-card { border-radius: 1rem; }
  .discover-copy { max-height: calc(100% - 7rem); overflow-y: auto; overscroll-behavior: auto; }
}
@media (max-height: 600px) and (max-width: 639px) {
  .discover-title { font-size: 1.1rem; -webkit-line-clamp: 2; }
  .discover-excerpt { display: none; }
}

.feed-link { @apply inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600; }
</style>
