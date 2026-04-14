<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900">Forgot Password</h2>
            <p class="mt-2 text-gray-600">Enter your email and we'll send you an OTP to reset your password.</p>
          </div>

          <form v-if="step === 1" @submit.prevent="handleSendOtp" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <div class="mt-1">
                <input 
                  id="email" 
                  v-model="email" 
                  type="email" 
                  required 
                  class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Send OTP
              </button>
            </div>
          </form>

          <form v-else @submit.prevent="handleVerifyOtp" class="space-y-6">
            <div>
              <label for="otp" class="block text-sm font-medium text-gray-700">Enter OTP</label>
              <div class="mt-1">
                <input 
                  id="otp" 
                  v-model="otp" 
                  type="text" 
                  required 
                  class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verify OTP
              </button>
            </div>
          </form>

          <div class="mt-8 text-center">
            <NuxtLink to="/affiliates/login" class="text-sm font-medium text-primary-600 hover:text-primary-500 underline">
              Back to Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sendOtp, validateOtp } from '~/services/auth'

definePageMeta({
  layout: 'default'
})

const email = ref('')
const otp = ref('')
const step = ref(1)
const loading = ref(false)
const requestId = ref('')
const router = useRouter()

const handleSendOtp = async () => {
  loading.value = true
  try {
    const response = await sendOtp({ 
      email: email.value, 
      sessionId: "b13ef0e1-1c73-4615-a331-1c4b92a51c11" // Placeholder or generated session
    })
    
    if (response && response.requestId) {
      requestId.value = response.requestId
      step.value = 2
    } else {
      alert('Failed to send OTP')
    }
  } catch (error) {
    console.error('OTP Send error:', error)
    alert('An error occurred.')
  } finally {
    loading.value = false
  }
}

const handleVerifyOtp = async () => {
  loading.value = true
  try {
    const response = await validateOtp({ 
      email: email.value, 
      otp: otp.value, 
      requestId: requestId.value 
    })
    
    if (response && response.isValid) {
      // Redirect to reset password with session info
      router.push({
        path: '/affiliates/reset-password',
        query: { 
          email: email.value, 
          sessionId: response.sessionId,
          userId: (response as any).userId 
        }
      })
    } else {
      alert('Invalid OTP')
    }
  } catch (error) {
    console.error('OTP Verify error:', error)
    alert('An error occurred.')
  } finally {
    loading.value = false
  }
}
</script>
