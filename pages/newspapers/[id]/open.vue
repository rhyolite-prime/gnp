<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <NuxtLink to="/newspapers" class="hover:text-red-600">Newspapers</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">Open Newspaper</span>
        </div>
        <div class="flex items-center gap-2">
          <button @click="goBack" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded">Back</button>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h1 class="text-2xl font-bold text-gray-900">{{ newspaperTitle }}</h1>
        <div class="flex items-center gap-2">
          <button @click="zoomOut" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">-</button>
          <span class="text-sm">{{ (scale * 100).toFixed(0) }}%</span>
          <button @click="zoomIn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">+</button>
          <button @click="toggleFullscreen" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h6M4 4v6M4 4l6 6M20 20h-6M20 20v-6M20 20l-6-6" /></svg>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-center mb-4 gap-2">
        <button @click="prevPage" :disabled="pageNum <= 1" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">&lt;</button>
        <span class="text-sm">{{ pageNum }} of {{ numPages }}</span>
        <button @click="nextPage" :disabled="pageNum >= numPages" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">&gt;</button>
      </div>
      <div ref="pdfContainer" class="flex justify-center items-center min-h-[600px] bg-gray-100 rounded-lg overflow-auto" style="position:relative;">
        <canvas ref="pdfCanvas" class="shadow-lg rounded" style="max-width:100%; max-height:80vh; background:white;"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';

const route = useRoute();
const router = useRouter();
const newspaperId = route.params.id;
const newspaperTitle = ref('');
const pdfUrl = ref('');

// Simulated data: In a real app, fetch PDF URL and title from API
const sampleData = {
  1: {
    title: 'Graphic Business - August 25, 2025',
    pdf: 'https://res.cloudinary.com/rhyoliteprime/image/upload/v1754998481/wssd_repository/h4cenvdr6sqjqn8zr6ud.pdf'
  },
  2: {
    title: 'Daily Graphic - August 25, 2025',
    pdf: 'https://res.cloudinary.com/rhyoliteprime/image/upload/v1754998489/wssd_repository/tbzgkx1tzcwechqxs18l.pdf'
  },
  9: {
    title: 'Graphic Showbiz - August 28, 2025',
    pdf: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  }
};

const pageNum = ref(1);
const numPages = ref(1);
const scale = ref(1.2);
const pdfDoc = ref<any>(null);
const pdfCanvas = ref<HTMLCanvasElement | null>(null);
const pdfContainer = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  const data = sampleData[newspaperId as keyof typeof sampleData];
  newspaperTitle.value = data?.title || 'Newspaper';
  pdfUrl.value = data?.pdf || '';
  if (pdfUrl.value) {
    await loadPdf(pdfUrl.value);
  }
});

async function loadPdf(url: string) {
  try {
    pdfDoc.value = await pdfjsLib.getDocument(url).promise;
    numPages.value = pdfDoc.value.numPages;
    pageNum.value = 1;
    await renderPage(pageNum.value);
  } catch (err) {
    console.error('Error loading PDF:', err);
  }
}

async function renderPage(num: number) {
  if (!pdfDoc.value || !pdfCanvas.value) return;
  const page = await pdfDoc.value.getPage(num);
  const viewport = page.getViewport({ scale: scale.value });
  const canvas = pdfCanvas.value;
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport }).promise;
}

function prevPage() {
  if (pageNum.value > 1) {
    pageNum.value--;
    renderPage(pageNum.value);
  }
}

function nextPage() {
  if (pageNum.value < numPages.value) {
    pageNum.value++;
    renderPage(pageNum.value);
  }
}

function zoomIn() {
  scale.value = Math.min(scale.value + 0.1, 2);
  renderPage(pageNum.value);
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.1, 0.5);
  renderPage(pageNum.value);
}

function toggleFullscreen() {
  const el = pdfContainer.value;
  if (!el) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    el.requestFullscreen();
  }
}

function goBack() {
  router.back();
}

watch(pageNum, (newVal) => {
  renderPage(newVal);
});
watch(scale, () => {
  renderPage(pageNum.value);
});
</script>

<style scoped>
.min-h-600px {
  min-height: 600px;
}
</style>
