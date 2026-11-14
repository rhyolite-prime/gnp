<template>
  <div class="relative flex h-full min-h-0 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-stone-900 shadow-2xl">
    <img v-if="image && !failed" :src="image" alt="" :loading="position === 1 ? 'eager' : 'lazy'" decoding="async" class="absolute inset-0 h-full w-full" :class="item.kind === 'newspaper' || item.kind === 'archive' ? 'object-contain' : 'object-cover'" @error="failed = true" />
    <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/10" />
    <div class="absolute inset-x-4 top-4 flex flex-wrap items-center gap-2 sm:inset-x-8 sm:top-6">
      <span class="rounded-full bg-white/15 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur">{{ labels[item.kind] }}</span>
      <span v-if="item.preferred" class="rounded-full bg-amber-300 px-3 py-2 text-xs font-semibold text-stone-950">For you · {{ item.reason }}</span>
      <span v-else class="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur">Discover something different</span>
    </div>
    <div v-if="playing && active && item.videoEmbed" class="absolute inset-x-3 top-20 z-10 aspect-video overflow-hidden rounded-xl bg-black sm:inset-x-8">
      <iframe :src="`${item.videoEmbed}?autoplay=1`" :title="item.title" class="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" />
      <button type="button" aria-label="Close video" class="absolute right-2 top-2 rounded-full bg-black/80 px-3 py-2 text-white" @click="playing = false">×</button>
    </div>
    <div class="relative p-5 pr-20 sm:p-8 sm:pr-24 lg:p-10 lg:pr-24" :class="playing && active ? 'max-h-[42%] overflow-y-auto' : ''">
      <p class="text-xs font-semibold uppercase tracking-wider text-stone-300">{{ item.source }}<span v-if="date"> · {{ date }}</span></p>
      <h2 :id="`discover-title-${position}`" class="mt-3 line-clamp-3 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{{ item.title }}</h2>
      <p class="mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">{{ item.excerpt }}</p>
      <div class="mt-5 flex flex-wrap items-center gap-3">
        <button v-if="item.kind === 'story' && item.body" type="button" class="feed-link bg-white text-stone-950 hover:bg-stone-100" @click="$emit('story', item)">Read this story →</button>
        <NuxtLink v-else :to="item.href" class="feed-link bg-white text-stone-950 hover:bg-stone-100">{{ item.kind === 'video' ? 'Open video' : item.free ? 'Read now' : 'Read with subscription' }} →</NuxtLink>
        <button v-if="item.videoEmbed && !playing" type="button" class="feed-link border border-white/40 text-white hover:bg-white/10" @click="playing = true">▶ Play here</button>
        <span v-if="item.kind === 'newspaper' || item.kind === 'archive'" class="text-xs text-stone-400">Full access checked in the reader</span>
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
.feed-link { @apply inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300; }
</style>
