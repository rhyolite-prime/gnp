<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-extrabold text-gray-900">GNP Affiliate Login</h2>
            <p class="mt-2 text-gray-600">Enter your credentials to access your dashboard</p>
          </div>

          <form v-if="!pendingAuth" @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
              <div class="mt-1">
                <input 
                  id="email" 
                  v-model="form.email" 
                  type="email" 
                  required 
                  class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <NuxtLink to="/affiliates/forgot-password" class="text-sm font-medium text-primary-600 hover:text-primary-500 underline">
                  Forgot password?
                </NuxtLink>
              </div>
              <div class="mt-1">
                <input 
                  id="password" 
                  v-model="form.password" 
                  type="password" 
                  required 
                  class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div class="flex items-center">
              <input 
                id="remember" 
                v-model="form.remember" 
                type="checkbox" 
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
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
                Sign In
              </button>
            </div>
          </form>

          <form v-else @submit.prevent="handleOtpSubmit" class="space-y-6">
            <div>
              <label for="otp" class="block text-sm font-medium text-gray-700">Verification code</label>
              <input id="otp" v-model="otp" type="text" inputmode="numeric" autocomplete="one-time-code" required
                class="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your verification code" />
            </div>
            <button type="submit" :disabled="loading" class="w-full rounded-xl bg-primary-600 px-4 py-4 text-lg font-medium text-white hover:bg-primary-700 disabled:opacity-50">
              {{ loading ? 'Verifying...' : 'Verify' }}
            </button>
            <button type="button" class="w-full text-sm text-primary-600 hover:text-primary-700" @click="pendingAuth = null; otp = ''">Back to login</button>
          </form>

          <div class="mt-10 text-center">
            <p class="text-sm text-gray-600">
              New to our affiliate program? 
              <NuxtLink to="/affiliates/register" class="font-medium text-primary-600 hover:text-primary-500 ml-1 underline">Join now</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { affiliateSignIn, validateOtp } from '~/services/auth'
import type { AffiliateSigninResponseModel } from '~/models'
import { useAffiliateAuthStore } from '~/stores/affiliate-auth'

definePageMeta({
  layout: 'default'
})

const loading = ref(false)
const authStore = useAffiliateAuthStore()
const router = useRouter()
const pendingAuth = ref<AffiliateSigninResponseModel | null>(null)
const otp = ref('')


const form = reactive({
  email: '',
  password: '',
  remember: false
})

const completeLogin = async (affiliate: AffiliateSigninResponseModel) => {
  // setAffiliate persists the token, profile metadata and session storage in one
  // place, so no separate cookie write is needed here.
  authStore.setAffiliate(affiliate)
  await router.push('/affiliates/dashboard')
}

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await affiliateSignIn({
      usernameOrEmail: form.email,
      password: form.password
    })

    if (response?.requiresTwoFactorAuth) {
      pendingAuth.value = response
    } else if (response?.token) {
      await completeLogin(response)
    } else {
      alert('Invalid credentials')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    alert(error?.data?.message || 'An error occurred during login.')
  } finally {
    loading.value = false
  }
}

const handleOtpSubmit = async () => {
  if (!pendingAuth.value) return
  loading.value = true
  try {
    const response = await validateOtp({
      email: form.email,
      otp: otp.value,
      requestId: pendingAuth.value.requestId
    }) as { isValid?: boolean; token?: string } | null
    const token = response?.token || (response?.isValid ? pendingAuth.value.token : '')
    if (token && (response?.isValid || response?.token)) {
      await completeLogin({ ...pendingAuth.value, token })
    } else {
      alert('Invalid verification code or missing authentication token.')
    }
  } catch (error: any) {
    alert(error?.data?.message || 'Unable to verify the code. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
