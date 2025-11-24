<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <NuxtLink to="/newspapers" class="hover:text-red-600">Newspapers</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">{{ newsPaperDetail?.title }} </span>
          <!-- <span class="font-medium">{{ newsPaperDetail?.title }} - {{ newsPaperDetail?.editionNumber }}, {{ newsPaperDetail?.publishedDate }}</span> -->
        </div>
        <div class="flex items-center gap-2">
          <button @click="goBack" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded">Back</button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
      
      <!-- Newspaper not found -->
      <div v-else-if="!newsPaperDetail" class="py-32 text-center">
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

                <div v-if="imageLoading" class="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
                <span class="text-gray-400 text-xs">Loading...</span>
              </div>

                <img v-else 
                  :src="blobUrl" 
                  :alt="newsPaperDetail.title"
                  class="w-full h-full object-cover rounded-md" 
                  loading="lazy"
                />
              </div>
              <div class="text-center">
                <NuxtLink :to="`/newspapers/${newsPaperDetail?.id}/open`" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md mb-3 font-medium flex items-center justify-center">
                  <FileText class="w-5 h-5 mr-2" />
                  Open to read
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
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ newsPaperDetail.title }}</h1>
              <p class="text-xl text-gray-700 mb-6">{{ newsPaperDetail.publicationName }} | {{ longMonthDateFormat(newsPaperDetail.publishedDate) }}</p>
              
              <div class="flex items-center mb-6">
                <div class="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  Subscribed
                </div>
                <div class="ml-4 text-gray-600">
                  GHS {{ newsPaperDetail.price }}
                </div>
              </div>

              <div class="border-t border-b border-gray-200 py-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Information</h2>
                <p class="text-gray-700">
                  {{ newsPaperDetail.fullDescription }}
                </p>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <NuxtLink to="/newspapers" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md font-medium text-center">
                  Buy this edition (GHS {{ newsPaperDetail.price }})
                </NuxtLink>
                <div class="flex flex-1 items-center justify-between rounded-md bg-gray-100 p-2">
                   <button class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md font-medium" @click="openSubscriptionModal" >
                  Buy Subscription
                </button>
                </div>
              </div>
            </div>

            <!-- Additional content from the newspaper -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Featured Stories</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  v-for="story in newsPaperDetail.featuredStories" 
                  class="border border-gray-200 rounded-md p-4"
                >
                  <h3 class="font-medium text-gray-900 mb-2">{{ story.title }}</h3>
                  <p class="text-sm text-gray-600">{{ story.description }}</p>
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

    <!-- Subscription Modal -->
<div 
  v-if="showSubscriptionModal"
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">

    <!-- Close Button -->
    <button @click="closeSubscriptionModal" class="absolute top-3 right-4 text-gray-600 hover:text-gray-900">
      ✕
    </button>

    <h2 class="text-2xl font-bold mb-4">Buy Subscription</h2>

    <!-- Full Name -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Full Name</label>
      <input
        v-model="fullName"
        type="text"
        class="w-full border rounded px-3 py-2"
        placeholder="Enter your full name"
      />
    </div>

    <!-- Email -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Email</label>
      <input
        v-model="email"
        type="email"
        class="w-full border rounded px-3 py-2"
        placeholder="you@graphicnewsplus.com"
      />
    </div>

    <!-- Phone -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Phone Number</label>
      <input
        v-model="phone"
        type="tel"
        class="w-full border rounded px-3 py-2"
        placeholder="054xxxxxxx"
      />
    </div>

    <!-- Subscription Cards -->
    <label class="block text-sm font-medium mb-2">Choose Subscription Plan</label>
    <div class="grid grid-cols-2 gap-4 mb-6">
      
      <!-- Regular Card -->
      <div
        @click="activeSubscriptionType = 'regular'"
        class="border rounded p-4 cursor-pointer"
        :class="activeSubscriptionType === 'regular' ? 'border-red-600 bg-red-50' : 'border-gray-300'"
      >
        <h3 class="font-semibold mb-2">Regular</h3>
        <p class="text-sm text-gray-600">Standard subscription packages.</p>
      </div>

      <!-- Bundle Card -->
      <div
        @click="activeSubscriptionType = 'bundle'"
        class="border rounded p-4 cursor-pointer"
        :class="activeSubscriptionType === 'bundle' ? 'border-red-600 bg-red-50' : 'border-gray-300'"
      >
        <h3 class="font-semibold mb-2">Bundle</h3>
        <p class="text-sm text-gray-600">Combined multi-paper packages.</p>
      </div>

    </div>

    <!-- Dropdown -->
    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Select Subscription</label>
      <select
        v-model="selectedSubscriptionId"
        class="w-full border rounded px-3 py-2"
      >
        <option disabled value="">Select subscription</option>
        <option
          v-for="option in dynamicDropdownOptions"
          :key="option.id"
          :value="option.id"
        >
          {{ option.name }} — GHS {{ option.price }}
        </option>
      </select>
    </div>

    <!-- Submit -->
    <button class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded" @click="handleContinueToPay">
      Continue to Pay
    </button>

  </div>
</div>

  </div>
</template>

<script setup lang="ts">
// Get the route params
import type { NewsPaper } from "~/models";

import { 
  Facebook,
  Twitter,
  FileText,
  X
} from 'lucide-vue-next'

const route = useRoute();
const router = useRouter();

const newspaperId = computed(() => {
  return route.params.id as string;
});

// Page metadata
useHead({
  title: 'Newspaper Details - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'View and read Ghana\'s leading newspapers including Daily Graphic, Graphic Business, and more.' }
  ]
});

 

// State
const isLoading = ref(true);
const imageLoading = ref(true);
const blobUrl = ref<string>()
const newsPaperDetail = ref<NewsPaper | null>(null);
// Modal state
const showSubscriptionModal = ref(false);

// Form fields
const fullName = ref("");
const email = ref("");
const phone = ref("");

// Subscription card selection
const activeSubscriptionType = ref<"regular" | "bundle">("regular");

// Options for each subscription type
const subscriptionOptions = {
  regular: [
    { id: 1, name: "Daily Graphic - Regular", price: 25 },
    { id: 2, name: "Business Graphic - Regular", price: 30 }
  ],
  bundle: [
    { id: 3, name: "Daily Graphic + Showbiz Bundle", price: 50 },
    { id: 4, name: "Mega Bundle - All Newspapers", price: 80 }
  ]
};

// Selected dropdown value
const selectedSubscriptionId = ref(null);

// Computed dropdown options based on active card
const dynamicDropdownOptions = computed(() => {
  return subscriptionOptions[activeSubscriptionType.value];
});

// Open modal when button is clicked
function openSubscriptionModal() {
  showSubscriptionModal.value = true;
}

// Close modal
function closeSubscriptionModal() {
  showSubscriptionModal.value = false;
}


const loadImageAsBlob = async (fileId: string) => {

    imageLoading.value = true;
    
    try {

        const url = await getSecureThumbnail(fileId);
        blobUrl.value = url;
        imageLoading.value = false;
        
      } catch (error) {

        imageLoading.value = false;
      }    
}

async function handleContinueToPay() {
  // Basic validation
  if (!fullName.value || !email.value || !phone.value || !selectedSubscriptionId.value) {
    alert("Please fill all fields and select a subscription plan.");
    return;
  }

  // Split full name
  const [firstName, ...rest] = fullName.value.trim().split(" ");
  const lastName = rest.join(" ");

  // Build payload
  const payload = {
    firstName,
    lastName,
    email: email.value,
    phone: phone.value,
    subscriptionType: activeSubscriptionType.value,
    subscriptionId: selectedSubscriptionId.value,
  };

  try {
    // Optional: Show loading state if you want
    // isProcessing.value = true;

    // Call backend to initiate payment  
    // Replace with your real API method
    const result = await guestSubscription(payload);

    // Redirect user to the payment URL returned by your API
    if (result) {
      console.log('result=>', result);
      //initialize another modal with the checkout url to render an iframe
      //window.location.href = response.paymentUrl;
    } else {
      alert("Payment initiation failed. Please try again.");
    }
  } catch (err) {
    console.error("Payment error:", err);
    alert("Something went wrong while processing your payment.");
  }
}


const retrieveNewsPaperDetails = async (id: string) => {

    isLoading.value = true;

    try {

      let result = await getNewsPaperDetails({id : id});

      newsPaperDetail.value = result

      loadImageAsBlob(result.thumbnailId)

    } catch (error) {
        //$toast.error('Unable to fetch finishing options !');
    } finally {
        isLoading.value = false;
    }

 }

onMounted(async () => {
     await retrieveNewsPaperDetails(newspaperId.value);
});

// Handle preview button click
function handlePreviewClick() {
  // In a real application, this would open a preview modal or redirect to a preview page
  console.log('Preview newspaper:', newsPaperDetail.value?.title);
}

// Update page title when newspaper data is loaded
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

function goBack() {
  router.back();
}
</script>
