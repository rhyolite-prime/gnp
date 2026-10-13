<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-extrabold text-gray-900">Reset Password</h2>
            <p class="mt-2 text-gray-600">Set a new secure password for your account</p>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-6">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
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

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <div class="mt-1">
                <input 
                  id="confirmPassword" 
                  v-model="form.confirmPassword" 
                  type="password" 
                  required 
                  class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
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
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { setPassword } from '~/services/auth'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const form = reactive({
  password: '',
  confirmPassword: ''
})

const handleResetPassword = async () => {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  const { email, sessionId, userId } = route.query
  if (!email || !sessionId || !userId) {
    alert('Missing session information. Please start over.')
    router.push('/affiliates/forgot-password')
    return
  }

  loading.value = true
  try {
    const success = await setPassword({
      email: email as string,
      userId: userId as string,
      sessionId: sessionId as string,
      password: form.password,
      confirmPassword: form.confirmPassword
    })
    
    if (success) {
      alert('Password reset successful!')
      router.push('/affiliates/login')
    } else {
      alert('Failed to reset password')
    }
  } catch (error) {
    console.error('Reset password error:', error)
    alert('An error occurred.')
  } finally {
    loading.value = false
  }
}
</script>
