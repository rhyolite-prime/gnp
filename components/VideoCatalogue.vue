<template>
  <div :aria-busy="status === 'pending'">
    <p v-if="status === 'pending' || status === 'idle'" class="text-center py-12 text-gray-500" role="status">Loading videos…</p>
    <div v-else-if="error" class="text-center py-12" role="alert">
      <p class="text-gray-600">Unable to load videos. Please try again.</p>
      <button type="button" class="mt-4 text-red-600 font-semibold hover:underline" @click="refresh()">Try again</button>
    </div>
    <template v-else-if="data?.data.length">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <VideoCard v-for="video in data.data" :key="video.id" :video="video" class="animate-slide-up" />
      </div>
      <Pagination
        v-if="!preview && data.totalPages > 1"
        :current-page="pageNo"
        :total-pages="data.totalPages"
        @page-change="pageNo = $event"
      />
    </template>
    <p v-else class="text-center py-12 text-gray-500">No videos available at the moment.</p>
  </div>
</template>

<script setup lang="ts">
import { getVideos } from '~/services/newsPapers';

const props = withDefaults(defineProps<{ preview?: boolean }>(), { preview: false });
const pageNo = ref(1);
const pageSize = computed(() => props.preview ? 4 : 10);
const { data, status, error, refresh } = await useAsyncData(
  () => `public-videos-${pageNo.value}-${pageSize.value}`,
  () => getVideos({ pageNo: pageNo.value, pageSize: pageSize.value }),
  { server: false },
);
</script>
