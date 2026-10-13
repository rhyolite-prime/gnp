<template>
  <div class="bg-white min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-5xl w-full">
      <!-- Hero Section with Story-Driven Narrative -->
      <div class="text-center mb-16">
        <div class="mx-auto h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-8">
          <UsersIcon class="h-10 w-10 text-primary-600" />
        </div>
        
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl md:text-6xl mb-6">
          Your Digital News stand
        </h1>
        
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          For decades, Graphic Communications Group has relied on street news stands to deliver news to the people. 
          Today, your website, blog, or social media handle can become the modern news stand — with financial rewards.
        </p>
        
        <div class="bg-primary-50 border-l-4 border-primary-500 p-4 max-w-2xl mx-auto rounded-r-lg mb-10">
          <p class="text-primary-800 text-sm font-medium">
            From street corners to digital spaces — earn commissions by sharing authentic and trusted news with your audience.
          </p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/affiliates/register" 
            class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:scale-105"
          >
            Become a Virtual News stand
          </NuxtLink>
          <NuxtLink 
            to="/affiliates/login" 
            class="inline-flex items-center px-8 py-4 border border-primary-200 text-lg font-medium rounded-xl text-primary-700 bg-primary-50 hover:bg-primary-100 transition-all transform hover:scale-105"
          >
            Affiliate Login
          </NuxtLink>
        </div>
      </div>

      <!-- The Story Behind the Program -->
      <div class="bg-gray-50 rounded-2xl p-8 mb-16 border border-gray-100">
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <div class="md:w-1/3 flex justify-center">
            <div class="relative">
              <div class="h-32 w-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-primary-100">
                <NewspaperIcon class="h-16 w-16 text-primary-600" />
              </div>
              <div class="absolute -bottom-2 -right-2 bg-green-100 rounded-full p-2">
                <ArrowPathIcon class="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div class="md:w-2/3">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">From Street Stands to Digital Spaces</h2>
            <p class="text-gray-600 mb-3">
              In the early days of print media, Graphic Communications Group built its foundation on public news stands 
              along the streets — the trusted points where communities connected with quality journalism.
            </p>
            <p class="text-gray-600">
              Today, we're reimagining that legacy. Your website, blog, or social media platforms can now serve as 
              <span class="font-semibold text-primary-700">virtual news stands</span>. Every subscriber you bring becomes 
              a part of our community, and you earn commissions for every successful referral — turning your digital 
              influence into tangible rewards.
            </p>
          </div>
        </div>
      </div>

      <!-- How It Works -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-4">How Your Virtual News stand Works</h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Transform your digital platform into a revenue-generating news stand with three simple steps.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-primary-700 font-bold text-xl">1</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Sign Up as Affiliate</h3>
            <p class="text-gray-600">Register your website, blog, or social media handle to become an official Graphic NewsPlus virtual news stand.</p>
          </div>
          
          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-primary-700 font-bold text-xl">2</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Share & Promote</h3>
            <p class="text-gray-600">Use your unique affiliate links to share Graphic NewsPlus with your audience through your digital channels.</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-primary-700 font-bold text-xl">3</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Earn Commissions</h3>
            <p class="text-gray-600">Receive competitive commissions for every new subscriber who joins through your referral, with timely payouts.</p>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div>
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-10">Why Become a Virtual News stand?</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div class="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
              <CurrencyDollarIcon class="h-6 w-6 text-green-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Financial Rewards</h3>
            <p class="text-gray-600">Turn your digital influence into income with competitive commission rates on every successful subscription referral.</p>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div class="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
              <LinkIcon class="h-6 w-6 text-blue-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
            <p class="text-gray-600">Monitor your referrals, clicks, and earnings instantly through your affiliate dashboard — no more guessing.</p>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div class="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
              <ArrowPathIcon class="h-6 w-6 text-purple-600" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Reliable Payouts</h3>
            <p class="text-gray-600">Receive your earned commissions directly to your account with our dependable and timely payout system.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UsersIcon, CurrencyDollarIcon, LinkIcon, ArrowPathIcon, NewspaperIcon } from '@heroicons/vue/24/outline'
import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Affiliates | Graphic News Plus'
})

const authStore = useAffiliateAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/affiliates/dashboard')
  }
})
</script>