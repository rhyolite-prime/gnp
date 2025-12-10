<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <div class="bg-white shadow-sm">
      <div class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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

    <div class="max-w-7xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h1 class="text-2xl font-bold text-gray-900">{{ newspaperTitle }}</h1>
      </div>
      <div class="flex justify-center items-center min-h-[600px] bg-gray-100 rounded-lg overflow-auto" style="position:relative;">
          <div
            v-show="isLoading"
          >
            <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10 space-y-4">
              <div class="text-lg font-medium text-gray-700">{{ loaderMessage }}</div>
              <div class="animate-spin h-12 w-12 border-4 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
          </div>
          <ClientOnly>
            <iframe
            v-show="!isLoading"
              title="NewsPaper"
              :src="assetUrl"
              class="w-full h-screen"
            ></iframe>
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
const assetBaseUrl = ref('https://docviewer.graphicnewsplus.com/ResourceShell');
const assetUrl = ref('');
const isLoading = ref(true);

const loaderMessage = ref("Validating Subscription...");

onMounted(() => {

  let time = 2000;

  time += 2000;
  setTimeout(() => loaderMessage.value = "Preparing File...", time);

  time += 2000;
  setTimeout(() => {
    loaderMessage.value = "Almost done...";
  }, time);


  time += 900;
   
   setTimeout(() => {
    isLoading.value = false;
   }, time);
  

  assetUrl.value = `${assetBaseUrl.value}?id=${newspaperId}`;

});

function goBack() {
  router.back();
}
</script>
 