<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <NuxtLink to="/newspapers" class="hover:text-red-600">Newspapers</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">{{ newspaper?.code }} - {{ newspaper?.type }}, {{ newspaper?.date }}</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
      
      <!-- Newspaper not found -->
      <div v-else-if="!newspaper" class="py-32 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Newspaper not found</h2>
        <p class="text-gray-600 mb-6">The newspaper you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/newspapers" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
          Back to Newspapers
        </NuxtLink>
      </div>

      <!-- Newspaper details -->
      <div v-else>
        <div class="flex flex-col lg:flex-row gap-8 mb-8">
          <!-- Left column - Newspaper cover -->
          <div class="lg:w-1/3">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="aspect-[3/4] overflow-hidden mb-6">
                <img 
                  :src="newspaper.image" 
                  :alt="newspaper.title"
                  class="w-full h-full object-cover rounded-md" 
                />
              </div>
              <div class="text-center">
                <NuxtLink to="#" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md mb-3 font-medium flex items-center justify-center">
                  <IconDocument class="w-5 h-5 mr-2" />
                  Open
                </NuxtLink>
                <button @click="handlePreviewClick" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md font-medium">
                  Preview
                </button>
              </div>
            </div>
          </div>

          <!-- Right column - Newspaper details -->
          <div class="lg:w-2/3">
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ newspaper.code }} - {{ newspaper.type }}, {{ newspaper.date }}</h1>
              <p class="text-xl text-gray-700 mb-6">{{ newspaper.title }}</p>
              
              <div class="flex items-center mb-6">
                <div class="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  Subscribed
                </div>
                <div class="ml-4 text-gray-600">
                  GHS {{ newspaper.price.toFixed(2) }}
                </div>
              </div>

              <div class="border-t border-b border-gray-200 py-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Information</h2>
                <p class="text-gray-700">
                  In the Headlines: Good and bad influence of celebrities; Ways to keep the spark going;
                  And Afrobeats vs. Hip-Hop: Which has greater global impact?
                </p>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <button class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md font-medium">
                  Share
                </button>
                <div class="flex flex-1 items-center justify-between rounded-md bg-gray-100 p-2">
                  <button class="text-gray-500 hover:text-red-600">
                    <IconFacebook class="w-6 h-6" />
                  </button>
                  <button class="text-gray-500 hover:text-red-600">
                    <IconTwitter class="w-6 h-6" />
                  </button>
                  <button class="text-gray-500 hover:text-red-600">
                    <IconPinterest class="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Additional content from the newspaper -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Stories</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="border border-gray-200 rounded-md p-4">
                  <h3 class="font-medium text-gray-900 mb-2">Amapiano stole Azonto groove — 2AM</h3>
                  <p class="text-sm text-gray-600">Read the full interview with 2AM discussing how South African Amapiano borrowed elements from Ghana's Azonto.</p>
                </div>
                <div class="border border-gray-200 rounded-md p-4">
                  <h3 class="font-medium text-gray-900 mb-2">Greed ruined my bond with Lumba — Kwadwo Antwi</h3>
                  <p class="text-sm text-gray-600">The renowned Ghanaian artist opens up about his fallout with Daddy Lumba in an exclusive interview.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Suggested Articles Section -->
        <SuggestedArticlesSection 
          :current-newspaper-id="newspaperId"
          class="mb-8"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Get the route params
const route = useRoute();
const newspaperId = computed(() => {
  return parseInt(route.params.id as string);
});

// Page metadata
useHead({
  title: 'Newspaper Details - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'View and read Ghana\'s leading newspapers including Daily Graphic, Graphic Business, and more.' }
  ]
});

// Types
interface Newspaper {
  id: number;
  title: string;
  code: string;
  type: string;
  date: string;
  price: number;
  image: string;
  category?: string;
  publication?: string;
}

// State
const isLoading = ref(true);
const newspaper = ref<Newspaper | null>(null);

// Simulated API call to get newspaper details
// Sample newspaper data (in a real app, this would come from a store or API)
const allNewspapers = [
  {
    id: 1,
    title: 'Graphic Business',
    code: 'GB',
    type: 'Tuesday',
    date: 'August 25, 2025',
    price: 1.50,
    image: 'https://placehold.co/600x800/e74c3c/ffffff?text=GB',
    publication: 'graphic-business',
    category: 'features'
  },
  {
    id: 2,
    title: 'Daily Graphic',
    code: 'DG',
    type: 'Tuesday',
    date: 'August 25, 2025',
    price: 1.50,
    image: 'https://placehold.co/600x800/3498db/ffffff?text=DG',
    publication: 'daily-graphic',
    category: 'dg-paper-stories'
  },
  {
    id: 9,
    title: 'Graphic Showbiz',
    code: 'GSB',
    type: 'Thursday',
    date: 'August 28, 2025',
    price: 1.50,
    image: 'https://placehold.co/600x800/9b59b6/ffffff?text=GSB',
    publication: 'graphic-showbiz',
    category: 'features'
  }
];

onMounted(async () => {
  try {
    // In a real app, fetch from API: await fetch(`/api/newspapers/${newspaperId.value}`)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    
    // Find the newspaper with the matching ID
    const newspaperData = allNewspapers.find(n => n.id === newspaperId.value);
    newspaper.value = newspaperData || null;
  } catch (error) {
    console.error('Error fetching newspaper details:', error);
    newspaper.value = null;
  } finally {
    isLoading.value = false;
  }
});

// Handle preview button click
function handlePreviewClick() {
  // In a real application, this would open a preview modal or redirect to a preview page
  console.log('Preview newspaper:', newspaper.value?.title);
}

// Update page title when newspaper data is loaded
watch(newspaper, (newValue) => {
  if (newValue) {
    useHead({
      title: `${newValue.code} - ${newValue.type}, ${newValue.date} - Graphic NewsPlus`,
      meta: [
        { name: 'description', content: `Read ${newValue.title} newspaper from ${newValue.date}.` }
      ]
    });
  }
});
</script>
