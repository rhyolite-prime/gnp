<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">All Plans</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">All Plans</h1>

      <!-- Epaper Package Selection -->
      <div class="bg-gray-100 rounded-lg p-6 mb-8">
        <div class="border-l-4 border-red-600 pl-4 mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Select Epaper Package</h2>
        </div>

        <!-- Tab Navigation -->
        <div class="grid grid-cols-3 gap-0 mb-6">
          <button 
            @click="setActiveTab('bundle')"
            :class="[
              'py-3 text-center font-medium transition-colors',
              activeTab === 'bundle' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            Bundle
          </button>
          <button 
            @click="setActiveTab('custom')"
            :class="[
              'py-3 text-center font-medium transition-colors',
              activeTab === 'custom' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            Custom
          </button>
          <button 
            @click="setActiveTab('premium')"
            :class="[
              'py-3 text-center font-medium transition-colors',
              activeTab === 'premium' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            Premium
          </button>
        </div>

        <!-- Custom Tab Content -->
        <div v-if="activeTab === 'custom'">
          <p class="text-gray-700 mb-6">To buy just one publication, use the CUSTOM option</p>

          <!-- Duration Selection -->
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              v-for="(duration, index) in durations" 
              :key="index"
              @click="setActiveDuration(duration)"
              :class="[
                'px-8 py-2 rounded-full text-center font-medium transition-colors',
                activeDuration === duration
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ duration }}
            </button>
          </div>

          <!-- Subscription Options -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="(plan, index) in customSubscriptionPlans" 
              :key="index"
              class="bg-white rounded-lg border border-gray-200 p-4 flex items-center"
            >
              <!-- Radio Button -->
              <div class="mr-4">
                <label class="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    :name="'plan-' + index" 
                    class="form-radio h-5 w-5 text-red-600"
                    :checked="selectedPlan === index"
                    @click="selectedPlan = index"
                  >
                </label>
              </div>
              
              <!-- Plan Details -->
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ plan.name }}</h3>
                <p class="text-sm text-gray-600">{{ plan.description }}</p>
              </div>
              
              <!-- Price -->
              <div class="text-right">
                <div class="text-gray-900 font-bold">GHS {{ currentPricing(plan).price.toFixed(2) }}</div>
                <div v-if="currentPricing(plan).savePercentage > 0" class="text-sm text-gray-600">
                  Save {{ currentPricing(plan).savePercentage }}%
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button class="bg-red-600 text-white font-medium px-8 py-3 rounded-md hover:bg-red-700 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
        
        <!-- Bundle Tab Content -->
        <div v-if="activeTab === 'bundle'">
          <p class="text-gray-700 mb-6">Subscribe to all our publications at a discounted price.</p>

          <!-- Duration Selection -->
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              v-for="(duration, index) in durations" 
              :key="index"
              @click="setActiveDuration(duration)"
              :class="[
                'px-8 py-2 rounded-full text-center font-medium transition-colors',
                activeDuration === duration
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ duration }}
            </button>
          </div>
          
          <!-- Bundle Subscription Options -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="(plan, index) in bundleSubscriptionPlans" 
              :key="index"
              class="bg-white rounded-lg border border-gray-200 p-4 flex items-center"
            >
              <!-- Radio Button -->
              <div class="mr-4">
                <label class="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    :name="'plan-' + index" 
                    class="form-radio h-5 w-5 text-red-600"
                    :checked="selectedPlan === index"
                    @click="selectedPlan = index"
                  >
                </label>
              </div>
              
              <!-- Plan Details -->
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ plan.name }}</h3>
                <p class="text-sm text-gray-600">{{ plan.description }}</p>
              </div>
              
              <!-- Price -->
              <div class="text-right">
                <div class="text-gray-900 font-bold">GHS {{ currentPricing(plan).price.toFixed(2) }}</div>
                <div v-if="currentPricing(plan).savePercentage > 0" class="text-sm text-gray-600">
                  Save {{ currentPricing(plan).savePercentage }}%
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button class="bg-red-600 text-white font-medium px-8 py-3 rounded-md hover:bg-red-700 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
        
        <!-- Premium Tab Content -->
        <div v-if="activeTab === 'premium'">
          <p class="text-gray-700 mb-6">Get access to all our publications plus premium features and exclusive content.</p>

          <!-- Duration Selection -->
          <div class="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              v-for="(duration, index) in durations" 
              :key="index"
              @click="setActiveDuration(duration)"
              :class="[
                'px-8 py-2 rounded-full text-center font-medium transition-colors',
                activeDuration === duration
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ duration }}
            </button>
          </div>

          <!-- Premium Subscription Options -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="(plan, index) in premiumSubscriptionPlans" 
              :key="index"
              class="bg-white rounded-lg border border-gray-200 p-4 flex items-center"
            >
              <!-- Radio Button -->
              <div class="mr-4">
                <label class="inline-flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    :name="'plan-' + index" 
                    class="form-radio h-5 w-5 text-red-600"
                    :checked="selectedPlan === index"
                    @click="selectedPlan = index"
                  >
                </label>
              </div>
              
              <!-- Plan Details -->
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ plan.name }}</h3>
                <p class="text-sm text-gray-600">{{ plan.description }}</p>
              </div>
              
              <!-- Price -->
              <div class="text-right">
                <div class="text-gray-900 font-bold">GHS {{ currentPricing(plan).price.toFixed(2) }}</div>
                <div v-if="currentPricing(plan).savePercentage > 0" class="text-sm text-gray-600">
                  Save {{ currentPricing(plan).savePercentage }}%
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button class="bg-red-600 text-white font-medium px-8 py-3 rounded-md hover:bg-red-700 transition-colors">
              Get Premium
            </button>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Why Subscribe to Graphic NewsPlus?</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p class="text-gray-600">Get immediate access to the latest issues as soon as they are published.</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p class="text-gray-600">Read on any device with a secure and reliable digital platform.</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Flexible Payment</h3>
            <p class="text-gray-600">Choose from multiple subscription options that fit your reading habits.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-200 pb-4">
            <button 
              @click="toggleFaq(index)"
              class="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
            >
              <span>{{ faq.question }}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 text-gray-500 transition-transform" 
                :class="{ 'transform rotate-180': openFaqIndex === index }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              v-show="openFaqIndex === index"
              class="mt-2 text-gray-600"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink 
            to="/contact"
            class="text-red-600 font-medium hover:text-red-700"
          >
            Still have questions? Contact us
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Pricing & Subscription Plans - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Subscribe to Ghana\'s leading newspapers including Daily Graphic, Graphic Business, and more. Choose from our flexible subscription plans.' }
  ]
})

// State
const activeTab = ref('custom') // 'bundle', 'custom', 'premium'
const activeDuration = ref('Weekly')
const selectedPlan = ref(0)
const openFaqIndex = ref(-1)

// Duration options
const durations = [
  'Weekly',
  'Monthly',
  '3 Months',
  'Half-Yearly',
  'Yearly'
]

// Bundle pricing for different durations
const bundlePricing: { [key: string]: string } = {
  'Weekly': '7.90',
  'Monthly': '25.00',
  '3 Months': '65.00',
  'Half-Yearly': '120.00',
  'Yearly': '220.00'
}

// Premium pricing for different durations
const premiumPricing: { [key: string]: { price: string; savePercentage: number } } = {
  'Weekly': { price: '9.90', savePercentage: 0 },
  'Monthly': { price: '35.00', savePercentage: 12 },
  '3 Months': { price: '95.00', savePercentage: 15 },
  'Half-Yearly': { price: '175.00', savePercentage: 18 },
  'Yearly': { price: '350.00', savePercentage: 22 }
}

// Define prices for each subscription plan based on billing cycle
interface PriceTier {
  price: number;
  savePercentage: number;
}

interface SubscriptionPricing {
  [key: string]: PriceTier;
}

interface SubscriptionPlan {
  name: string;
  description: string;
  pricing: {
    Weekly: PriceTier;
    Monthly: PriceTier;
    '3 Months': PriceTier;
    'Half-Yearly': PriceTier;
    Yearly: PriceTier;
  };
}


const bundleSubscriptionPlans: SubscriptionPlan[] = [
    {
        name: 'Corporate',
        description: 'Daily Graphic & Graphic Business',
        pricing: {
            'Weekly': { price: 9.90, savePercentage: 10 },
            'Monthly': { price: 16.80, savePercentage: 60 },
            '3 Months': { price: 50.40, savePercentage: 60 },
            'Half-Yearly': { price: 100.80, savePercentage: 60 },
            'Yearly': { price: 201.60, savePercentage: 60 }
        }
    },
    {
        name: 'Special',
        description: 'Daily Graphic & The Mirror',
        pricing: {
            'Weekly': { price: 11.75, savePercentage: 0 },
            'Monthly': { price: 42.00, savePercentage: 7 },
            '3 Months': { price: 119.90, savePercentage: 12 },
            'Half-Yearly': { price: 219.90, savePercentage: 18 },
            'Yearly': { price: 399.90, savePercentage: 22 }
        }
    },
    {
        name: 'Diva',
        description: 'The Mirror & Graphic Showbiz',
        pricing: {
            'Weekly': { price: 5.00, savePercentage: 0 },
            'Monthly': { price: 18.90, savePercentage: 5 },
            '3 Months': { price: 52.90, savePercentage: 8 },
            'Half-Yearly': { price: 99.90, savePercentage: 10 },
            'Yearly': { price: 189.90, savePercentage: 15 }
        }
    },
    {
        name: 'Family',
        description: 'Daily Graphic, The Mirror, Graphic Showbiz & Graphic Sports',
        pricing: {
            'Weekly': { price: 13.50, savePercentage: 0 },
            'Monthly': { price: 49.90, savePercentage: 8 },
            '3 Months': { price: 139.90, savePercentage: 12 },
            'Half-Yearly': { price: 259.90, savePercentage: 15 },
            'Yearly': { price: 499.90, savePercentage: 20 }
        }
    },
    {
        name: 'Lifestyle',
        description: 'Daily Graphic, The Mirror, Graphic Showbiz',
        pricing: {
            'Weekly': { price: 12.00, savePercentage: 0 },
            'Monthly': { price: 44.90, savePercentage: 5 },
            '3 Months': { price: 124.90, savePercentage: 10 },
            'Half-Yearly': { price: 239.90, savePercentage: 12 },
            'Yearly': { price: 459.90, savePercentage: 15 }
        }
    },
    {
        name: 'Suave',
        description: 'Daily Graphic, Graphic Business & Graphic Sports',
        pricing: {
            'Weekly': { price: 13.00, savePercentage: 0 },
            'Monthly': { price: 48.90, savePercentage: 5 },
            '3 Months': { price: 134.90, savePercentage: 10 },
            'Half-Yearly': { price: 249.90, savePercentage: 15 },
            'Yearly': { price: 479.90, savePercentage: 20 }
        }
    },
    {
        name: 'Combo',
        description: 'Daily Graphic, Graphic Business, The Mirror, Graphic Showbiz, Junior Graphic & Graphic Sports',
        pricing: {
            'Weekly': { price: 13.00, savePercentage: 0 },
            'Monthly': { price: 48.90, savePercentage: 5 },
            '3 Months': { price: 134.90, savePercentage: 10 },
            'Half-Yearly': { price: 249.90, savePercentage: 15 },
            'Yearly': { price: 479.90, savePercentage: 20 }
        }
    }

];

// Subscription plans with pricing for each billing cycle
const customSubscriptionPlans: SubscriptionPlan[] = [
    {
        name: 'Daily Graphic',
        description: '6 Issues Per Week',
        pricing: {
            'Weekly': { price: 9.90, savePercentage: 0 },
            'Monthly': { price: 35.90, savePercentage: 10 },
            '3 Months': { price: 99.90, savePercentage: 15 },
            'Half-Yearly': { price: 189.90, savePercentage: 20 },
            'Yearly': { price: 349.90, savePercentage: 25 }
        }
    },
    {
        name: 'The Mirror',
        description: '1 Issue Per Week - Saturday Only',
        pricing: {
            'Weekly': { price: 11.75, savePercentage: 0 },
            'Monthly': { price: 42.00, savePercentage: 7 },
            '3 Months': { price: 119.90, savePercentage: 12 },
            'Half-Yearly': { price: 219.90, savePercentage: 18 },
            'Yearly': { price: 399.90, savePercentage: 22 }
        }
    },
    {
        name: 'Graphic Sports',
        description: '1 Issue Per Week - Mon Only',
        pricing: {
            'Weekly': { price: 5.00, savePercentage: 0 },
            'Monthly': { price: 18.90, savePercentage: 5 },
            '3 Months': { price: 52.90, savePercentage: 8 },
            'Half-Yearly': { price: 99.90, savePercentage: 10 },
            'Yearly': { price: 189.90, savePercentage: 15 }
        }
    },
    {
        name: 'Graphic Showbiz',
        description: '1 Issue Per Week - Thu Only',
        pricing: {
            'Weekly': { price: 13.50, savePercentage: 0 },
            'Monthly': { price: 49.90, savePercentage: 8 },
            '3 Months': { price: 139.90, savePercentage: 12 },
            'Half-Yearly': { price: 259.90, savePercentage: 15 },
            'Yearly': { price: 499.90, savePercentage: 20 }
        }
    },
    {
        name: 'Graphic Business',
        description: '1 Issue Per Week - Tue Only',
        pricing: {
            'Weekly': { price: 12.00, savePercentage: 0 },
            'Monthly': { price: 44.90, savePercentage: 5 },
            '3 Months': { price: 124.90, savePercentage: 10 },
            'Half-Yearly': { price: 239.90, savePercentage: 12 },
            'Yearly': { price: 459.90, savePercentage: 15 }
        }
    },
    {
        name: 'Junior Graphic',
        description: '1 Issue Per Week - Wed Only',
        pricing: {
            'Weekly': { price: 13.00, savePercentage: 0 },
            'Monthly': { price: 48.90, savePercentage: 5 },
            '3 Months': { price: 134.90, savePercentage: 10 },
            'Half-Yearly': { price: 249.90, savePercentage: 15 },
            'Yearly': { price: 479.90, savePercentage: 20 }
        }
    }

];

const premiumSubscriptionPlans: SubscriptionPlan[] = [
    {
        name: 'Blogging Subscription',
        description: 'Premium Blog Posts Subscription (Unlimited access). Enjoy unlimited blog posts access.',
        pricing: {
            'Weekly': { price: 9.90, savePercentage: 0 },
            'Monthly': { price: 35.90, savePercentage: 10 },
            '3 Months': { price: 99.90, savePercentage: 15 },
            'Half-Yearly': { price: 189.90, savePercentage: 20 },
            'Yearly': { price: 349.90, savePercentage: 25 }
        }
    },

];


// FAQ data
const faqs = [
  {
    question: 'How do I subscribe to Graphic NewsPlus?',
    answer: 'You can subscribe by selecting a plan that suits your needs, clicking on the "Subscribe Now" button, and completing the checkout process. You\'ll need to create an account if you don\'t already have one.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of your current billing period.'
  },
  {
    question: 'How can I access the newspapers after subscribing?',
    answer: 'After subscribing, you can access the newspapers by logging into your account on our website or mobile app. You\'ll see all your subscribed publications in your library.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We generally don\'t offer refunds for subscription payments. However, if you\'re experiencing technical issues with accessing your subscription, please contact our support team.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, mobile money, and bank transfers for subscription payments.'
  }
]

// Computed properties
const currentPricing = computed(() => {
  return (plan: SubscriptionPlan) => {
    return plan.pricing[activeDuration.value as keyof typeof plan.pricing];
  };
});

// Methods
function setActiveTab(tab: string) {
  activeTab.value = tab
}

function setActiveDuration(duration: string) {
  activeDuration.value = duration
}

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
