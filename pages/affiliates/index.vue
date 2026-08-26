<template>
  <div class="bg-white min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-4xl w-full text-center">
      <div class="mx-auto h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-8">
        <UsersIcon class="h-10 w-10 text-primary-600" />
      </div>
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
        Graphic NewsPlus Affiliate Program
      </h1>
      <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Join our affiliate program and earn commissions by sharing Graphic NewsPlus with your audience. 
        Promote professional journalism and get rewarded for every new subscriber.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <NuxtLink 
          to="/affiliates/register" 
          class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:scale-105"
        >
          Become an Affiliate
        </NuxtLink>
        <NuxtLink 
          to="/affiliates/login" 
          class="inline-flex items-center px-8 py-4 border border-primary-200 text-lg font-medium rounded-xl text-primary-700 bg-primary-50 hover:bg-primary-100 transition-all transform hover:scale-105"
        >
          Affiliate Login
        </NuxtLink>
      </div>

      <!-- Features/Benefits -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div class="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
            <CurrencyDollarIcon class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">High Commissions</h3>
          <p class="text-gray-600">Earn competitive rates on every successful subscription referral you bring to our platform.</p>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div class="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
            <LinkIcon class="h-6 w-6 text-blue-600" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Easy Tracking</h3>
          <p class="text-gray-600">Generate custom links and track your clicks, conversions, and earnings in real-time.</p>
        </div>

        <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div class="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4">
            <ArrowPathIcon class="h-6 w-6 text-purple-600" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Timely Payouts</h3>
          <p class="text-gray-600">Receive your earned commissions directly to your account with our reliable payout system.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UsersIcon, CurrencyDollarIcon, LinkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

definePageMeta({
  layout: 'default'
})

const authStore = useAffiliateAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
    // In a real app, we'd check for an "affiliate" role or similar
    // For now, if logged in, show dashboard
    router.push('/affiliates/dashboard')
  }
})
</script>
