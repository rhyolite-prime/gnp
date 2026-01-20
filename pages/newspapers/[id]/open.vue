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
            <select v-model="selectedPublication" class="w-full md:w-auto border border-gray-300 rounded-lg px-2 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all">
              <option disabled value="">Select Publication</option>
              <option v-for="publication in publicationList" :key="publication.id" :value="publication.id">
                {{ publication.name }}
              </option>
            </select>
          </div>

          <div class="flex-shrink-0">
            <input
              type="date"
              v-model="selectedDate"
              class="border border-gray-300 rounded-lg px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            />
          </div>

          <button 
            @click="getNewspaperByDate" 
            class="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <Search class="w-4 h-4" />
            <span>Search</span>
          </button>
          
          <button @click="goBack" class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all border border-gray-200">
            Back
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-8xl mx-auto mt-8 bg-white rounded-lg shadow p-2 sm:p-6 overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 px-4 sm:px-0">
        <h1 class="text-2xl font-bold text-gray-900">{{ newspaperTitle }}</h1>
      </div>
      
      <div class="flex justify-center items-center min-h-[600px] bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
          <!-- Loading state -->
          <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-white z-20 transition-all duration-300">
              <div class="relative w-20 h-20 mb-6">
                <div class="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                   <FileText class="w-8 h-8 text-red-600" />
                </div>
              </div>
              <p class="text-xl font-bold text-gray-900 tracking-tight">{{ loaderMessage }}</p>
              <p class="text-sm text-gray-500 mt-2">Please wait while we fetch your publication</p>
          </div>

          <!-- No Access state -->
          <div v-else-if="!accessGranted" class="flex flex-col items-center justify-center p-8 sm:p-16 text-center w-full bg-white z-10 animate-fade-in">
            <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
              <Lock class="w-12 h-12 text-red-600" />
            </div>
            <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Access Denied</h2>
            <p class="text-gray-500 mb-10 max-w-md text-lg leading-relaxed">
              We couldn't verify an active subscription or purchase for this edition. Join thousands of readers today to get full access.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <NuxtLink to="/newspapers" class="inline-flex items-center justify-center px-10 py-4 border border-gray-200 text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-300">
                Browse More
              </NuxtLink>
            </div>
          </div>

          <!-- Reader state -->
          <ClientOnly v-else>
            <iframe
              title="NewsPaper"
              :src="assetUrl"
              class="w-full h-screen border-0 shadow-2xl"
            ></iframe>
          </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsPaper,Publication,GuestSubscriptionResponseModel } from "~/models";
import { Lock, FileText, Search } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();
const newspaperId = route.params.id as string;
const newspaperTitle = ref('');
const assetBaseUrl = ref('https://docviewer.graphicnewsplus.com/ResourceShell');
const assetUrl = ref('');
const isLoading = ref(true);
const accessGranted = ref(false);

const loaderMessage = ref("Validating Subscription...");

const selectedPublication = ref('');
const selectedDate = ref('');
const newsPaperDetail = ref<NewsPaper | null>(null);
const publicationList = ref<Publication[]>([]);


const getAllPublications = async () => {

    let result = await getPublications({pageNo: 1, pageSize: 100});

    publicationList.value = result.data;
 
}

const getNewspaperByDate = async () => {

  isLoading.value = true;

  try {

    let response = await findNewspaperByDate(selectedPublication.value, selectedDate.value);

    if (!response.success) {
      accessGranted.value = false;
      isLoading.value = false;
      return;
    }

    // Force a full browser reload to the new newspaper uniqueId.
    // This ensures a clean slate and re-runs all initialization logic.
    if (response.data.uniqueId !== route.params.id) {
       window.location.href = `/newspapers/${response.data.uniqueId}/open`;
    } else {
       isLoading.value = false;
    }

  }
  catch (error) {
         
    $toast.error('Error fetching newspaper. Please try again later.');
    
    } finally {
        isLoading.value = false;
    }
 


}

onMounted( async() => {

  await getAllPublications();

  var response = await getRedactedNewsPaperDetailsViaUniqueId(newspaperId);
  if (!response.success)
  { 
    accessGranted.value = false;
    // display a no access div in place of the iframe
    isLoading.value = false;
    return;

  }

  newsPaperDetail.value = response.data;
  newspaperTitle.value = response.data.title;
  selectedPublication.value = response.data.publicationId;
  selectedDate.value = response.data.publicationDate.split('T')[0];
  accessGranted.value = true;
  
  isLoading.value = false;

  const gnpUserAuthIdentity = useGnpUserAuthIdentity();

  assetUrl.value = `${assetBaseUrl.value}?id=${newspaperId}&tkn=${gnpUserAuthIdentity.value}`;

});

 
 
 function goBack() {
  router.back();
}


watch(newsPaperDetail, (newValue) => {
  if (newValue) {
    useHead({
      title: `${newValue.title} - Graphic NewsPlus`,
      meta: [
        { name: 'description', content: `Read ${newValue.title} newspaper from ${newValue.publicationDate}.` }
      ]
    });
  }
});

// Note: Automatic fetch watchers removed in favor of manual Search button
</script>
 