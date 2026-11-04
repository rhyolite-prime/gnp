<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="bg-white border-b border-gray-200">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-600" aria-label="Breadcrumb">
        <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
        <span class="mx-2">›</span>
        <NuxtLink to="/more/videos" class="hover:text-red-600">Videos</NuxtLink>
        <span class="mx-2">›</span>
        <span aria-current="page">{{ video?.title || 'Video details' }}</span>
      </nav>
    </div>

    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <p v-if="status === 'pending' || status === 'idle'" class="text-center py-16 text-gray-500" role="status">Loading video…</p>
      <div v-else-if="error" class="text-center py-16" role="alert">
        <h1 class="text-2xl font-bold text-gray-900">Unable to load video</h1>
        <p class="mt-3 text-gray-600">Please check your connection and try again.</p>
        <button type="button" class="mt-4 text-red-600 font-semibold hover:underline" @click="refresh()">Try again</button>
      </div>
      <div v-else-if="!video" class="text-center py-16">
        <h1 class="text-2xl font-bold text-gray-900">Video not found</h1>
        <NuxtLink to="/more/videos" class="inline-block mt-4 text-red-600 hover:underline">Browse all videos</NuxtLink>
      </div>
      <article v-else class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <!-- Do not mount the external player until the reader has signed in. -->
        <div v-if="!canWatch" class="aspect-video bg-gray-900 flex items-center justify-center p-6 text-center">
          <div>
            <IconPlay class="w-12 h-12 mx-auto text-white mb-4" />
            <h2 class="text-xl font-semibold text-white">Sign in to watch this video</h2>
            <p class="mt-2 text-gray-300">Log in to your Graphic NewsPlus account to continue.</p>
            <button type="button" class="mt-5 btn-primary" @click="showSignInModal = true">Sign In</button>
          </div>
        </div>
        <div v-else-if="embedUrl" class="aspect-video bg-black">
          <iframe
            :src="embedUrl"
            :title="`${video.title} — YouTube video player`"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </div>
        <div v-else class="aspect-video bg-gray-900 text-white flex items-center justify-center p-6 text-center" role="status">
          This video does not have a valid YouTube link available for playback.
        </div>

        <div class="p-6 sm:p-8">
          <h1 class="text-3xl font-bold text-gray-900">{{ video.title }}</h1>
          <div class="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-gray-500">
            <span>{{ video.durationInMins }} min</span>
            <span>{{ formatVideoCount(video.views) }} views</span>
            <span>{{ formatVideoCount(video.likes) }} likes</span>
            <span>{{ formatVideoCount(video.downloads) }} downloads</span>
          </div>
          <p class="mt-6 text-gray-700 whitespace-pre-line leading-relaxed">{{ video.description }}</p>
          <ul v-if="tags.length" class="flex flex-wrap gap-2 mt-6" aria-label="Video tags">
            <li v-for="tag in tags" :key="tag" class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{{ tag }}</li>
          </ul>

          <section class="mt-8 pt-6 border-t border-gray-100" aria-labelledby="video-metadata">
            <h2 id="video-metadata" class="text-lg font-semibold text-gray-900 mb-4">Video details</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div v-for="detail in details" :key="detail.label" class="min-w-0">
                <dt class="text-gray-500">{{ detail.label }}</dt>
                <dd class="mt-1 font-medium text-gray-900 break-words">{{ detail.value }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </article>
      <NuxtLink to="/more/videos" class="inline-block mt-8 text-red-600 font-semibold hover:underline">← Back to all videos</NuxtLink>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useBasicAuthStore } from '~/stores/basic-user-auth';
import { getVideoById } from '~/services/newsPapers';
import {
  getYoutubeEmbedUrl, parseVideoMetadata, parseVideoTags,
  formatVideoCount, formatVideoDate, formatVideoFileSize,
} from '~/utils/latestVideos';

const route = useRoute();
const authStore = useBasicAuthStore();
const showSignInModal = useState<boolean>('showSignInModal', () => false);
const mounted = ref(false);
const canWatch = computed(() => mounted.value && authStore.isAuthenticated);
const { data: video, status, error, refresh } = await useAsyncData(
  () => `public-video-${String(route.params.id)}`,
  () => getVideoById(String(route.params.id)),
  { server: false },
);

const embedUrl = computed(() => video.value ? getYoutubeEmbedUrl(video.value) : null);
const tags = computed(() => parseVideoTags(video.value?.tags));
const metadata = computed(() => parseVideoMetadata(video.value?.metadata));
const details = computed(() => video.value ? [
  { label: 'Published', value: formatVideoDate(video.value.createdAt) },
  { label: 'Format', value: video.value.format?.toUpperCase() || 'Not specified' },
   
] : []);

onMounted(() => { mounted.value = true; });
watch([mounted, () => authStore.isAuthenticated, () => route.params.id], ([ready, authenticated]) => {
  if (ready && !authenticated) showSignInModal.value = true;
});

useHead({
  title: computed(() => `${video.value?.title || 'Video details'} - Graphic NewsPlus`),
  meta: [{ name: 'description', content: computed(() => video.value?.description || 'Watch videos on Graphic NewsPlus.') }],
});
</script>
