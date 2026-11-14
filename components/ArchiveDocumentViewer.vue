<template>
  <div class="flex h-[calc(100dvh-14rem)] min-h-[400px] flex-col bg-gray-100">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white p-3">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-gray-700">{{ isPdf ? 'PDF viewer' : 'Image viewer' }}</span>
        <template v-if="!isPdf && blobUrl">
          <button type="button" aria-label="Zoom out" class="viewer-button" :disabled="zoom <= 1" @click="zoom = Math.max(1, zoom - 0.25)">−</button>
          <button type="button" class="viewer-button text-xs" @click="zoom = 1">{{ Math.round(zoom * 100) }}% · Fit</button>
          <button type="button" aria-label="Zoom in" class="viewer-button" :disabled="zoom >= 4" @click="zoom = Math.min(4, zoom + 0.25)">+</button>
          <span v-if="zoom > 1" class="text-xs text-gray-500">Drag to pan</span>
        </template>
      </div>
      <a v-if="isPdf && blobUrl" :href="blobUrl" target="_blank" rel="noopener" class="viewer-button text-sm">Open in new tab ↗</a>
    </div>
    <div v-if="loading" role="status" class="flex flex-1 items-center justify-center p-6 text-gray-600">Loading your archive document…</div>
    <div v-else-if="error" role="alert" class="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p class="text-red-700">{{ error }}</p>
      <button type="button" class="viewer-button" @click="loadDocument">Try again</button>
    </div>
    <template v-else-if="blobUrl">
      <ClientOnly v-if="isPdf">
        <NewspaperReader :key="blobUrl" :pdf-url="blobUrl" :title="title" class="min-h-0 w-full flex-1 overflow-hidden" />
        <template #fallback><p class="p-6 text-center">Preparing PDF reader…</p></template>
      </ClientOnly>
      <div
        v-else
        ref="imageViewport"
        class="min-h-0 flex-1 overflow-auto p-3 sm:p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
        :class="zoom > 1 ? (dragging ? 'cursor-grabbing select-none' : 'cursor-grab select-none') : ''"
        tabindex="0"
        aria-label="Archive image; zoom in and drag with your mouse to pan, or use arrow keys to scroll"
        @pointerdown="pan.start"
        @pointermove="pan.move"
        @pointerup="pan.stop"
        @pointercancel="pan.stop"
        @lostpointercapture="pan.stop"
      >
        <div class="flex min-h-full min-w-full items-start justify-center" :style="zoom > 1 ? { width: `${zoom * 100}%` } : { height: '100%' }">
          <img :draggable="false" @dragstart.prevent :src="blobUrl" :alt="title" class="block h-auto max-h-none bg-white shadow-lg" :class="zoom === 1 ? 'max-h-full max-w-full object-contain' : 'w-full'" :style="zoom === 1 ? { maxHeight: '100%' } : {}" @error="error = 'The archive image could not be displayed. Please try again.'" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { createImagePanController } from '~/utils/imagePan';
import { archiveAssetType } from '~/utils/archiveAccess';
const props = defineProps<{ src: string; fileType: string; accessToken: string; title: string }>();
const loading = ref(true);
const error = ref('');
const blobUrl = ref('');
const zoom = ref(1);
const imageViewport = ref<HTMLElement | null>(null);
const dragging = ref(false);
const pan = createImagePanController(() => zoom.value > 1 && !loading.value && !error.value, value => { dragging.value = value; });
watch(zoom, async value => {
  pan.stop();
  if (value === 1) {
    await nextTick();
    imageViewport.value?.scrollTo({ left: 0, top: 0 });
  }
});
const isPdf = computed(() => archiveAssetType(props.fileType)?.extension === 'pdf');
let controller: AbortController | undefined;
let generation = 0;
let mounted = false;
function release() {
  pan.stop();
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value);
  blobUrl.value = '';
}
async function loadDocument() {
  const request = ++generation;
  controller?.abort();
  release();
  error.value = '';
  zoom.value = 1;
  if (!props.src || !archiveAssetType(props.fileType)) {
    error.value = 'This archive file type is not supported.';
    loading.value = false;
    return;
  }
  controller = new AbortController();
  loading.value = true;
  try {
    const blob = await $fetch<Blob>(props.src, {
      responseType: 'blob', credentials: 'same-origin',
      headers: props.accessToken ? { Authorization: `Bearer ${props.accessToken}` } : {},
      signal: controller.signal, retry: 0,
    });
    if (request !== generation) return;
    blobUrl.value = URL.createObjectURL(blob);
  } catch (cause: any) {
    if (request !== generation) return;
    const status = cause?.statusCode || cause?.response?.status;
    error.value = status === 401 ? 'Your session expired. Sign in again to view this document.'
      : status === 403 ? 'You no longer have access to this document. Refresh the page to check your subscription.'
      : status === 404 ? 'This archive file is not available in storage.' : 'The archive document could not be loaded. Please try again.';
  } finally { if (request === generation) loading.value = false; }
}
onMounted(() => { mounted = true; loadDocument(); });
watch(() => [props.src, props.accessToken, props.fileType], () => { if (mounted) loadDocument(); });
onBeforeUnmount(() => { generation++; controller?.abort(); release(); });
</script>

<style scoped>
.viewer-button { @apply inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 disabled:opacity-40; }
</style>
