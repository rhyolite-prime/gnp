<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-extrabold text-gray-900">Affiliate Login</h2>
            <p class="mt-2 text-gray-600">Enter your credentials to access your dashboard</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
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
import { signIn } from '~/services/auth'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await signIn({ 
      usernameOrEmail: form.email, 
      password: form.password 
    })
    
    if (response && response.token) {
      const gnpUserIdentityCookie = useCookie("gnp-user-identity", {
        maxAge: 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        priority: "medium",
        sameSite: "strict"
      });
      
      gnpUserIdentityCookie.value = response.token;
      authStore.setAccessToken(response.token);
      
      router.push('/affiliates/dashboard')
    } else {
      alert('Invalid credentials')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('An error occurred during login.')
  } finally {
    loading.value = false
  }
}
</script>
