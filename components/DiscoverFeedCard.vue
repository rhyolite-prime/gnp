<template>
  <div class="discover-card relative flex h-full min-h-0 flex-col justify-end overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
    <img
      v-if="image && !failed"
      :src="image"
      alt=""
      :loading="position === 1 ? 'eager' : 'lazy'"
      decoding="async"
      class="absolute inset-0 h-full w-full"
      :class="item.kind === 'newspaper' || item.kind === 'archive' ? 'object-contain' : 'object-cover'"
      @error="failed = true"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/10" />

    <!-- Top Badge Row -->
    <div class="absolute inset-x-4 top-4 flex flex-wrap items-center gap-2 sm:inset-x-8 sm:top-6 z-10">
      <span class="rounded-full bg-white/95 px-3 py-2 text-xs font-bold uppercase tracking-widest text-stone-800 backdrop-blur">{{ labels[item.kind] }}</span>
      <span v-if="item.mock" class="rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900">SAMPLE</span>
      <span v-if="item.preferred" class="rounded-full bg-amber-300 px-3 py-2 text-xs font-semibold text-stone-950">For you · {{ item.reason }}</span>
      <span v-else class="hidden rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-stone-700 backdrop-blur sm:inline">Something different</span>
    </div>

    <!-- Right-Side Floating Engagement Action Stack -->
    <aside class="absolute right-3 sm:right-6 bottom-32 sm:bottom-36 z-20 flex flex-col items-center gap-3 sm:gap-4" aria-label="Discovery interactions">
      <!-- Views Counter -->
      <div class="flex flex-col items-center gap-0.5" title="Total views">
        <div class="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur border border-stone-200">
          <EyeIcon class="h-5 w-5" />
        </div>
        <span class="text-[11px] font-bold text-stone-900 drop-shadow-sm">{{ formatCount(engagement.views) }}</span>
      </div>

      <!-- Like Button -->
      <button
        type="button"
        :aria-label="engagement.isLiked ? 'Unlike this discovery' : 'Like this discovery'"
        :aria-pressed="engagement.isLiked"
        class="flex flex-col items-center gap-0.5 group/like focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 rounded-full"
        @click.stop="handleLike"
      >
        <div
          class="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full transition-all duration-200 shadow-md backdrop-blur"
          :class="engagement.isLiked ? 'bg-red-500 text-white scale-105' : 'bg-white/90 text-stone-700 hover:scale-105 hover:bg-white border border-stone-200'"
        >
          <HeartSolid v-if="engagement.isLiked" class="h-5 w-5 fill-current animate-heart-pop" />
          <HeartIcon v-else class="h-5 w-5" />
        </div>
        <span
          class="text-[11px] font-bold drop-shadow-sm transition-colors"
          :class="engagement.isLiked ? 'text-red-600' : 'text-stone-900'"
        >
          {{ formatCount(engagement.likes) }}
        </span>
      </button>

      <!-- Comment Button -->
      <button
        type="button"
        :aria-label="`Open discussion (${engagement.commentsCount} comments)`"
        class="flex flex-col items-center gap-0.5 group/comment focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 rounded-full"
        @click.stop="$emit('comment', item)"
      >
        <div class="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur hover:scale-105 hover:bg-white transition-all border border-stone-200">
          <ChatBubbleBottomCenterTextIcon class="h-5 w-5" />
        </div>
        <span class="text-[11px] font-bold text-stone-900 drop-shadow-sm">{{ formatCount(engagement.commentsCount) }}</span>
      </button>

      <!-- Share Button -->
      <button
        type="button"
        aria-label="Share discovery"
        class="flex flex-col items-center gap-0.5 group/share focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 rounded-full"
        @click.stop="handleShare"
      >
        <div class="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white/90 text-stone-700 shadow-md backdrop-blur hover:scale-105 hover:bg-white transition-all border border-stone-200">
          <ShareIcon class="h-5 w-5" />
        </div>
        <span class="text-[11px] font-bold text-stone-900 drop-shadow-sm">Share</span>
      </button>
    </aside>

    <!-- Optional Video Player -->
    <div v-if="playing && active && item.videoEmbed" class="absolute inset-x-3 top-20 z-10 aspect-video overflow-hidden rounded-xl bg-black sm:inset-x-8">
      <iframe :src="`${item.videoEmbed}?autoplay=1`" :title="item.title" class="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" />
      <button type="button" aria-label="Close video" class="absolute right-2 top-2 rounded-full bg-black/80 px-3 py-2 text-white" @click="playing = false">×</button>
    </div>

    <!-- Main Card Content Copy -->
    <div class="discover-copy relative p-4 sm:p-8 sm:pr-24 lg:p-10 lg:pr-24" :class="playing && active ? 'max-h-[42%] overflow-y-auto' : ''">
      <p class="text-xs font-semibold uppercase tracking-wider text-stone-600">{{ item.source }}<span v-if="date"> · {{ date }}</span></p>
      <h2 :id="`discover-title-${position}`" class="discover-title mt-3 line-clamp-3 max-w-3xl text-[clamp(1.25rem,5.5vw,1.75rem)] font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl">{{ item.title }}</h2>
      <p class="discover-excerpt mt-3 line-clamp-2 sm:line-clamp-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">{{ item.excerpt }}</p>

      <!-- Inline Engagement Summary Chips -->
      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-stone-100/90 px-3 py-1 font-medium text-stone-700 border border-stone-200/60" title="Views">
          <EyeIcon class="h-3.5 w-3.5 text-stone-500" />
          <span>{{ formatCount(engagement.views) }} views</span>
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
          :class="engagement.isLiked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200/80 border border-stone-200/60'"
          :aria-label="engagement.isLiked ? 'Unlike' : 'Like'"
          :aria-pressed="engagement.isLiked"
          @click.stop="handleLike"
        >
          <HeartSolid v-if="engagement.isLiked" class="h-3.5 w-3.5 fill-current text-red-600" />
          <HeartIcon v-else class="h-3.5 w-3.5 text-stone-500" />
          <span>{{ formatCount(engagement.likes) }} {{ engagement.likes === 1 ? 'like' : 'likes' }}</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full bg-stone-100/90 px-3 py-1 font-semibold text-stone-700 hover:bg-stone-200/80 border border-stone-200/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600"
          @click.stop="$emit('comment', item)"
        >
          <ChatBubbleLeftEllipsisIcon class="h-3.5 w-3.5 text-stone-500" />
          <span>{{ formatCount(engagement.commentsCount) }} {{ engagement.commentsCount === 1 ? 'comment' : 'comments' }}</span>
        </button>
      </div>

      <!-- Action Buttons -->
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
import {
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/vue/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid';
import type { DiscoverItem } from '~/utils/discoverFeed';
import { useDiscoverEngagement } from '~/composables/useDiscoverEngagement';

const props = defineProps<{ item: DiscoverItem; active: boolean; position: number }>();
const emit = defineEmits<{
  story: [item: DiscoverItem];
  comment: [item: DiscoverItem];
}>();

const { $toast } = useNuxtApp();
const { getEngagement, toggleLike, trackView, formatCount } = useDiscoverEngagement();

const labels: Record<string, string> = {
  archive: 'From the archives',
  newspaper: 'Newspaper',
  video: 'Watch',
  story: 'Top story',
};

const failed = ref(false);
const playing = ref(false);

const engagement = computed(() => getEngagement(props.item.key));

const image = computed(() => props.item.image || (props.item.kind === 'archive' ? '/images/explore-archives.jpg' : '/images/explore-newspapers.jpg'));

const date = computed(() => {
  const value = new Date(props.item.date);
  return Number.isNaN(value.getTime()) ? '' : value.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
});

async function handleLike() {
  await toggleLike(props.item.key);
}

function handleShare() {
  const url = typeof window !== 'undefined' ? window.location.href : 'https://graphicnewsplus.com/discover';
  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({
      title: props.item.title,
      text: props.item.excerpt,
      url,
    }).catch(() => {});
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      $toast?.success?.('Discovery link copied to clipboard!');
    }).catch(() => {});
  }
}

watch(
  () => props.active,
  (isActive) => {
    if (!isActive) {
      playing.value = false;
    } else {
      trackView(props.item.key);
    }
  },
  { immediate: true }
);

watch(() => props.item.key, () => {
  failed.value = false;
  playing.value = false;
});
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

@keyframes heart-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.animate-heart-pop {
  animation: heart-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
