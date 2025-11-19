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
      </div>
      <div class="flex justify-center items-center min-h-[600px] bg-gray-100 rounded-lg overflow-auto" style="position:relative;">
          <ClientOnly>
            <ejs-pdfviewer
              :serviceUrl="serviceUrl"
              :documentPath="pdfUrl"
              style="height: 600px; width: 100%;"
            />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const router = useRouter();
const newspaperId = route.params.id;
const newspaperTitle = ref('');
const pdfUrl = ref('');
const serviceUrl = ref('https://ej2services.syncfusion.com/production/web-services/api/pdfviewer');

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
    pdf: 'https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf'
  }
};

const data = sampleData[newspaperId as keyof typeof sampleData];
newspaperTitle.value = data?.title || 'Newspaper';
pdfUrl.value = data?.pdf || '';

function goBack() {
  router.back();
}
</script>
 