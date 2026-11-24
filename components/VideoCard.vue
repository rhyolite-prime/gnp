<template>
  <NuxtLink
    :to="`/videos/${video.id}`"
    class="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
    :aria-label="`Watch ${video.title}`"
  >
    <article class="h-full bg-white rounded-xl shadow-lg card-hover overflow-hidden">
      <div class="relative aspect-video overflow-hidden bg-gray-200">
        <img
          v-if="thumbnail && !imageFailed"
          :src="thumbnail"
          :alt="video.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          @error="imageFailed = true"
        >
        <div class="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <IconPlay class="w-6 h-6 text-gray-900 ml-1" />
          </div>
        </div>
        <span class="absolute bottom-2 right-2 rounded bg-black/80 text-white text-xs px-2 py-1">{{ video.durationInMins }} min</span>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-2 group-hover:text-red-600">{{ video.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2">{{ video.description }}</p>
        <p class="mt-3 text-xs text-gray-500">{{ formatVideoCount(video.views) }} views</p>
      </div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Video } from '~/models';
import { normalizeVideoUrl, formatVideoCount } from '~/utils/latestVideos';

const props = defineProps<{ video: Video }>();
const thumbnail = computed(() => normalizeVideoUrl(props.video.thumbnailUrl));
const imageFailed = ref(false);
watch(thumbnail, () => { imageFailed.value = false; });
</script>
