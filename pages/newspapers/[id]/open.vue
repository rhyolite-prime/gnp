<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Breadcrumb -->
        <div class="flex items-center text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap scrollbar-hide pb-1 md:pb-0">
          <NuxtLink to="/" class="hover:text-red-600 transition-colors">Home</NuxtLink>
          <span class="mx-1.5 text-gray-400">›</span>
          <NuxtLink to="/newspapers" class="hover:text-red-600 transition-colors">Newspapers</NuxtLink>
          <span class="mx-1.5 text-gray-400">›</span>
          <span class="font-medium text-gray-900">{{ newsPaperDetail?.title }} </span>
        </div>

        <!-- Desktop/Mobile Controls -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="flex-1 md:flex-none">
            <select v-model="selectedPublication" class="w-full md:w-auto border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all">
              <option disabled value="">Select Publication</option>
              <option value="daily-graphic">Daily Graphic</option>
              <option value="ghanaian-times">Ghanaian Times</option>
              <option value="graphic-sports">Graphic Sports</option>
            </select>
          </div>

          <div class="flex-shrink-0">
            <input
              type="date"
              v-model="selectedDate"
              class="border border-gray-300 rounded-lg px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            />
          </div>

          <button @click="goBack" class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all border border-gray-200">
            Back
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-8xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h1 class="text-2xl font-bold text-gray-900">{{ newspaperTitle }}</h1>
      </div>
      <div class="flex justify-center items-center min-h-[600px] bg-gray-100 rounded-lg overflow-auto" style="position:relative;">
          <div v-show="isLoading" >
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
import type { NewsPaper, GuestSubscriptionResponseModel } from "~/models";

const route = useRoute();
const router = useRouter();
const newspaperId = route.params.id;
const newspaperTitle = ref('');
const assetBaseUrl = ref('https://docviewer.graphicnewsplus.com/ResourceShell');
const assetUrl = ref('');
const isLoading = ref(true);

const loaderMessage = ref("Validating Subscription...");

const selectedPublication = ref('');
const selectedDate = ref('');
const newsPaperDetail = ref<NewsPaper | null>(null);

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

  const gnpUserAuthIdentity = useGnpUserAuthIdentity();

  assetUrl.value = `${assetBaseUrl.value}?id=${newspaperId}&tkn=${gnpUserAuthIdentity.value}`;

});

const retrieveNewsPaperDetails = async (id: string) => {

    isLoading.value = true;

    try {

      let result = await getNewsPaperDetails({id : id});

      newsPaperDetail.value = result

    } catch (error) {
        //$toast.error('Unable to fetch finishing options !');
    } finally {
        isLoading.value = false;
    }

}
 
function goBack() {
  router.back();
}


onMounted(async () => {
  await retrieveNewsPaperDetails(newspaperId as string);
});

watch(newsPaperDetail, (newValue) => {
  if (newValue) {
    useHead({
      title: `${newValue.title} - Graphic NewsPlus`,
      meta: [
        { name: 'description', content: `Read ${newValue.title} newspaper from ${newValue.publishedDate}.` }
      ]
    });
  }
});
</script>
 