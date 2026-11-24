<template>
  <div class="mt-10">
    <section aria-labelledby="related-archive-title">
      <h2 id="related-archive-title" class="text-xl font-bold text-gray-900">Related High-Ranking Results</h2>
      <p class="mt-2 text-sm text-gray-600">{{ relatedQuery ? `Archive relevance matches for “${relatedQuery}”.` : 'Explore more pages from the archive collection.' }}</p>
      <p v-if="relatedLoading" role="status" class="mt-5 text-sm text-gray-500">Finding related results…</p>
      <div v-if="relatedItems.length" class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="item in relatedItems" :key="item.id" :to="`/archives/${encodeURIComponent(item.id)}`" @click="emit('open')" class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
          <div class="flex h-44 items-center justify-center overflow-hidden bg-gray-100">
            <img v-if="thumbnail(item)" :src="thumbnail(item)" :alt="`${item.publicationName} page ${item.pageNumber || '—'}`" loading="lazy" decoding="async" class="h-full w-full object-contain" @error="failedThumbnails.add(item.id)" />
            <p v-else class="line-clamp-4 px-6 text-center font-serif text-sm text-gray-600">{{ item.snippet || item.supportingText || 'Archive page preview unavailable' }}</p>
          </div>
          <div class="p-5">
            <h3 class="font-bold text-gray-900 group-hover:text-red-600">{{ item.publicationName }} · Page {{ item.pageNumber || '—' }}</h3>
            <p class="mt-2 text-xs text-gray-500">{{ formatArchivePublicationDate(item.publicationDate) }}</p>
            <p class="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{{ item.snippet || item.supportingText || 'Open this page to read more.' }}</p>
            <span class="mt-4 inline-block text-sm font-semibold text-red-600">View page →</span>
          </div>
        </NuxtLink>
      </div>
      <p v-if="!relatedLoading && !relatedItems.length && !relatedError" class="mt-5 text-sm text-gray-500">No related results were found. Try a different keyword in the archives.</p>
      <div v-if="relatedError" role="status" class="mt-4 text-sm text-red-700">{{ relatedError }} <button type="button" class="recommendation-button ml-2" :disabled="relatedLoading" @click="loadRelated">Try again</button></div>
      <NuxtLink to="/archives" class="recommendation-button mt-5">Explore all archives</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, onBeforeUnmount } from 'vue';
import type { ArchiveAccessMetadata, ArchiveSearchItem } from '~/models';
import { searchArchives, buildArchiveSearchRequest } from '~/services/archives';
import { rankRelatedArchives, archiveThumbnail } from '~/utils/archiveRecommendations';
import { formatArchivePublicationDate } from '~/utils/archiveAccess';
const props = defineProps<{ currentId: string; metadata: ArchiveAccessMetadata; cachedItems: ArchiveSearchItem[]; query: string }>();
/** A related result was opened; the page scrolls back up to the reader. */
const emit = defineEmits<{ (e: 'open'): void }>();
const relatedQuery = computed(() => props.query.trim() || props.metadata.tags?.[0] || props.metadata.publicationName);
const remoteRelated = ref<ArchiveSearchItem[]>([]);
const relatedItems = computed(() => rankRelatedArchives([...props.cachedItems, ...remoteRelated.value], props.currentId));
const failedThumbnails = reactive(new Set<string>());
const relatedLoading = ref(false);
const relatedError = ref('');
let relatedRequest = 0;
let ready = false;
function thumbnail(item: { id: string; thumbnailId: string }) { return failedThumbnails.has(item.id) ? '' : archiveThumbnail(item.thumbnailId); }
async function loadRelated() {
  const request = ++relatedRequest;
  relatedLoading.value = true;
  relatedError.value = '';
  try {
    const result = await searchArchives(buildArchiveSearchRequest({ pageNo: 1, pageSize: 12, query: relatedQuery.value }));
    if (request === relatedRequest) remoteRelated.value = result.data || [];
  } catch { if (request === relatedRequest) relatedError.value = 'We could not refresh related results. Available search results are still shown.'; }
  finally { if (request === relatedRequest) relatedLoading.value = false; }
}
function initialise() {
  relatedRequest++;
  remoteRelated.value = [];
  failedThumbnails.clear();
  relatedLoading.value = false;
  relatedError.value = '';
  // Cached search hits are ranked immediately. Deep links fetch their own results.
  if (rankRelatedArchives(props.cachedItems, props.currentId).length < 3) loadRelated();
}
// The page stays mounted while the reader moves between archive pages, so only a
// new keyword starts over; a new page just tops the list up when it runs short.
watch(relatedQuery, () => { if (ready) initialise(); });
watch(() => props.currentId, () => { if (ready && relatedItems.value.length < 3 && !remoteRelated.value.length && !relatedLoading.value) loadRelated(); });
onMounted(() => { ready = true; initialise(); });
onBeforeUnmount(() => { relatedRequest++; });
</script>

<style scoped>
.recommendation-button { @apply inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-red-400 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-50; }
</style>
