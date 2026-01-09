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
              
              <div class="flex items-center mb-6" v-if="hasAccess">
                <div class="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  Purchased — You have access to this publication
                </div>
                <div class="ml-4 text-gray-600 invisible">
                  GHS {{ newsPaperDetail.price }}
                </div>
              </div>

              <div class="flex items-center mb-6" v-else>
                <div class="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  Buy @  GHS {{ newsPaperDetail.price }}
                </div>
                <div class="ml-4 text-gray-600 invisible">
                  GHS {{ newsPaperDetail.price }}
                </div>
              </div>

              <div class="border-t border-b border-gray-200 py-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Information</h2>
                <p class="text-gray-700">
                  {{ newsPaperDetail.fullDescription }}
                </p>
              </div>

              <!-- Shimmer while loading access entitlement -->
              <div 
                v-if="isAccessLoading" 
                class="flex flex-col sm:flex-row gap-4 animate-pulse mt-4">
                <div class="flex-1 h-12 bg-gray-300 rounded-md"></div>
                <div class="flex-1 h-12 bg-gray-200 rounded-md"></div>
              </div>

              <!-- Actual CTA buttons -->
              <div 
                v-else-if="!hasAccess" 
                class="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <button 
                  class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md font-medium text-center"
                  @click="openOneTimePurchaseModal"
                >
                  Buy this edition (GHS {{ newsPaperDetail.price }})
                </button>

                <div class="flex flex-1 items-center justify-between rounded-md bg-gray-100 p-2">
                  <button 
                    class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md font-medium"
                    @click="openSubscriptionModal"
                  >
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
    <label class="block text-sm font-medium mb-2">Choose a Plan</label>
    <div class="grid grid-cols-2 gap-4 mb-6">
      
      <!-- Regular Card -->
      <div
        @click="activeSubscriptionType = 'regular'"
        class="border rounded p-4 cursor-pointer"
        :class="activeSubscriptionType === 'regular' ? 'border-green-600 bg-green-50' : 'border-green-300'"
      >
        <h3 class="font-semibold mb-2">Single Copy</h3>
        <p class="text-sm text-green-600">Standard subscription packages.</p>
      </div>

      <!-- Bundle Card -->
      <div
        @click="activeSubscriptionType = 'bundle'"
        class="border rounded p-4 cursor-pointer"
        :class="activeSubscriptionType === 'bundle' ? 'border-green-600 bg-green-50' : 'border-green-300'"
      >
        <h3 class="font-semibold mb-2">Bundle Subscrption</h3>
        <p class="text-sm text-green-600">Combined multi-paper packages.</p>
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
          v-for="(option,index) in dynamicDropdownOptions"
          :key="option.id"
          :value="option.id"
        >
         ({{ index+1 }}) {{ option.name }} — GHS {{ option.price }}
        </option>
      </select>
    </div>

    <button 
      class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded"
      @click="handleContinueToPay"
      :disabled="isProcessing"
    >
      <span v-if="!isProcessing">Continue to Pay</span>
      <span v-else class="flex items-center justify-center gap-2">
        <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
        Processing...
      </span>
    </button>

  </div>
</div>

<!-- One-Time Purchase Modal -->
<div 
  v-if="showPurchaseModal"
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">

    <!-- Close -->
    <button @click="closePurchaseModal" class="absolute top-3 right-4 text-gray-600 hover:text-gray-900">
      ✕
    </button>

   
    <h2 class="text-2xl font-bold mb-4">Buy This Edition</h2>

     <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="mb-4 mt-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {{ errorMessage }}
    </div>
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

    <!-- Price Card -->
    <div class="border rounded p-4 mb-6 bg-gray-50">
      <h3 class="font-semibold text-lg mb-1">{{ newsPaperDetail?.title }}</h3>
      <p class="text-sm text-gray-600 mb-2">
        {{ longMonthDateFormat(newsPaperDetail.publishedDate) }}
      </p>
      <p class="text-xl font-bold text-red-600">
        GHS {{ newsPaperDetail?.price }}
      </p>
    </div>

    <!-- Submit -->
    <button 
      class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-medium"
      @click="handleOneTimePurchase"
      :disabled="isProcessing"
    >
      <span v-if="!isProcessing">Continue to Pay</span>
      <span v-else class="flex items-center justify-center gap-2">
        <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
        Processing...
      </span>
    </button>

  </div>
</div>

  <!-- Verifying Transaction Modal -->
  <div 
    v-if="isCompletingPurchase"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p class="text-lg font-medium text-gray-800">Verifying transaction...</p>
    </div>
  </div>

  <div 
    v-if="isTransitioning"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p class="text-lg font-medium text-gray-800">Processing Please wait...</p>
    </div>
  </div>

  <!-- Payment Checkout Modal -->
  <div 
    v-if="showPaymentModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="rounded-lg w-full max-w-2xl p-6 relative bg-transparent shadow-none">

      <!-- Iframe -->
      <iframe
        title="Payment"
        v-if="paymentInfo?.paymentUrl"
        :src="paymentInfo.paymentUrl"
        class="w-full h-[600px] rounded overflow-hidden border-0"
        style="overflow: hidden; border: none;"
      ></iframe>

    </div>
  </div>

  <!-- Fingerprint Enrollment Modal -->
  <div 
    v-if="showFingerprintModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center relative">
      <button @click="skipFingerprint" class="absolute top-3 right-4 text-gray-400 hover:text-gray-600">
        <X class="w-5 h-5" />
      </button>

      <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <Fingerprint class="w-8 h-8 text-red-600" />
      </div>
      
      <h3 class="text-xl font-bold text-gray-900 mb-2">Secure your Purchase</h3>
      <p class="text-gray-600 mb-6">
        Link your fingerprint to access this newspaper quickly in the future without entering details.
      </p>

      <div class="space-y-3">
        <button 
          @click="handleLinkFingerprint"
          :disabled="isRegisteringBiometric"
          class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2"
        >
          <span v-if="!isRegisteringBiometric">Link Fingerprint</span>
          <span v-else class="flex items-center">
            <span class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
            Processing...
          </span>
        </button>
        
        <button 
          @click="skipFingerprint"
          class="w-full bg-transparent hover:bg-gray-50 text-gray-600 py-2 px-4 rounded-md font-medium"
        >
          No, thanks
        </button>
      </div>
    </div>
  </div>

  </div>
</template>

<script setup lang="ts">
// Get the route params
import type { NewsPaper, GuestSubscriptionResponseModel } from "~/models";
import { useAuthStore } from '~/stores/auth';
import { 
  Facebook,
  Twitter,
  FileText,
  Fingerprint,
  X
} from 'lucide-vue-next'
import { useBiometrics } from '~/composables/useBiometrics';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

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
const showPurchaseModal = ref(false);
const hasAccess = ref(false);
const isAccessLoading = ref(true);

const isProcessing = ref(false);
const isTransitioning = ref(false);
const imageLoading = ref(true);
const isCompletingPurchase = ref(false);
const blobUrl = ref<string>();
const paymentInfo = ref<GuestSubscriptionResponseModel>();
const newsPaperDetail = ref<NewsPaper | null>(null);
// Modal state
const showSubscriptionModal = ref(false);
const showPaymentModal = ref(false);
const showFingerprintModal = ref(false);
const isBiometricAvailable = ref(false);
const isRegisteringBiometric = ref(false);

const { isBiometricsAvailable, register } = useBiometrics();

// Form fields
const fullName = ref("");
const email = ref("");
const phone = ref("");
const errorMessage = ref("");


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


function openOneTimePurchaseModal() {
  showPurchaseModal.value = true;
}

function closePurchaseModal() {
  showPurchaseModal.value = false;
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

const handleContinueToPay = async () =>  {
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
    phoneNumber: phone.value,
    subscriptionType: activeSubscriptionType.value,
    subscriptionPlanId: "cf92a6b0-d3f3-41bc-8abb-aedd8d1f40f6",
  };

  try {
     
    isProcessing.value = true;
     
    const result = await guestSubscription(payload);

    // Redirect user to the payment URL returned by your API
    if (result) {
      console.log('result =>', result);
      paymentInfo.value = result;
      showPaymentModal.value = true;
      showSubscriptionModal.value = false;

    } else {
      //alert("Payment initiation failed. Please try again.");
    }
  } catch (err) {
    console.error("Payment error:", err);
    //alert("Something went wrong while processing your payment.");
  }
  finally {

    isProcessing.value = false;
  }

}


const handleOneTimePurchase = async () => {

  // Basic validation
  if (!fullName.value || !email.value || !phone.value) {
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
    phoneNumber: phone.value,
    newsPaperId: newsPaperDetail.value?.id,
  };

  try {
     
    isProcessing.value = true;
     
    const result = await guestOneTimePurchase(payload);

    // Redirect user to the payment URL returned by your API
    if (!result.success) {

      errorMessage.value = result.message as string;
      return;
    } 

    paymentInfo.value = result.data ;
    showPaymentModal.value = true;
    showPurchaseModal.value = false;
      
  } catch (err) {
    console.error("Payment error:", err);
     
  }
  finally {

    isProcessing.value = false;
  }

 }


const completeOneTimePurchase = async () => {

    isCompletingPurchase.value = true;

  try {


    // wait for 4 seconds before proceeding...
    await new Promise(resolve => setTimeout(resolve, 2800));
     
    const result = await fulfillGuestOneTimePurchase({ reference: paymentInfo.value?.reference });

    if (result) {

      //set result.token in cookies using nuxt cookies
      const gnpUserIdentityCookie = useCookie("gnp-user-identity", {
        maxAge: 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        priority: "medium",
        sameSite: "strict"
      });
      
      gnpUserIdentityCookie.value = result;
      authStore.setAccessToken(result);
      
      // Check if biometric is available
      const available = await isBiometricsAvailable();
      if (available) {
        isBiometricAvailable.value = true;
        showFingerprintModal.value = true;
        // Don't auto-redirect/show success yet, wait for user choice
      } else {
        // Fallback for devices without biometrics
        await retrieveNewsPaperEntitlement(newspaperId.value);
      }

    }
    
  } catch (error) {
    
  }
  finally {
    isCompletingPurchase.value = false;
  }
  
 }



async function payStackCheckoutEventCallback(message: MessageEvent<any>) {
  if (message.origin === 'https://checkout.paystack.com') {
    if (message.data?.data?.status) {
       
      showPaymentModal.value = false;
      
      await completeOneTimePurchase();

    }
    else {
      if (message.data?.event === 'close') {
        //await terminateSession()
      }
    }
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

const retrieveNewsPaperEntitlement = async (id: string, maxRetries = 3) => {
 
  isAccessLoading.value = true;
  isProcessing.value = true;

  let attempt = 0;
  let delay = 1500; // Start with 1 second

  try {
    while (attempt < maxRetries) {
      try {
        let result = await validateNewsPaperEntitlement({newsPaperId: id});
        
        if (result.hasAccess) {
          hasAccess.value = true;
          isProcessing.value = false;
          return; // Success, exit
        }
        
        // If no access yet, throw to trigger retry logic
        console.log(`Attempt ${attempt + 1}: No access yet, retrying...`);
        throw new Error("No access returned");
        
      } catch (e) {
        // If it's the last attempt, don't wait, just fail (or keep hasAccess as false)
        if (attempt === maxRetries - 1) {
          console.warn("Max retries reached for entitlement check.");
          break; 
        }
        
        // Wait with backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        attempt++;
      }
    }
  } catch (error) {
    console.error('Unable to fetch entitlement', error);
    isAccessLoading.value = false
    isProcessing.value = false;
    hasAccess.value = false;
  } finally {
    isAccessLoading.value = false;
    isProcessing.value = false;
  }
}

const verifyNewsPaperEntitlement = async (id: string) => {

  try {

    let result = await validateNewsPaperEntitlement({newsPaperId: id});
    console.log('result -> ', result);

    if (result && result.hasAccess) {
      hasAccess.value = true;
      return;
    }

  } catch {
    isAccessLoading.value = false
    hasAccess.value = false;
  }
  finally {
    isAccessLoading.value = false
  }

}

 onBeforeUnmount(() => {
  window.removeEventListener('message', payStackCheckoutEventCallback)
 })

onMounted(async () => {

  await retrieveNewsPaperDetails(newspaperId.value);
   
  await verifyNewsPaperEntitlement(newspaperId.value);

  if (!import.meta.server) {
    window.addEventListener('message', payStackCheckoutEventCallback)
  }
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

const handleLinkFingerprint = async () => {
  try {
      
      isRegisteringBiometric.value = true;
      
      // Use current user details for enrollment
      // In a real app we might want to ensure we have a persistent user ID from the response
      const user = {
          id: paymentInfo.value?.reference || 'guest-user',
          email: email.value,
          name: fullName.value
      };

      const credential = await register(user);
        
      // Send to backend..
      await registerBiometric(credential, paymentInfo.value?.userId);

      await retrieveNewsPaperEntitlement(newspaperId.value);

        // Success - close modal
        showFingerprintModal.value = false;
        // Optionally show a success toast here
        
    } catch (error) {
        console.error("Biometric enrollment failed", error);
        // show error
    } finally {
        isRegisteringBiometric.value = false;
    }
}

const skipFingerprint = async () => {
  showFingerprintModal.value = false;
    await retrieveNewsPaperEntitlement(newspaperId.value)
}
</script>
