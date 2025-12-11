<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div class="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-100/50 blur-3xl opacity-60 animate-pulse"></div>
      <div class="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-100/50 blur-3xl opacity-60 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-red-50/50 blur-3xl opacity-60 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <div class="w-full max-w-md p-8 relative z-10">
      <!-- Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-8 sm:p-10 animate-fade-in">
        
        <!-- Header -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-6 shadow-lg shadow-primary-500/30 transform transition-transform hover:scale-105 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight mb-2">Admin Portal</h1>
          <p class="text-gray-500 text-sm">Sign in to manage Graphic NewsPlus</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Email Input -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700 block ml-1">Email Address</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                required 
                class="block w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 sm:text-sm"
                placeholder="admin@graphic.com.gh"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-gray-700 block ml-1">Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                id="password" 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                class="block w-full pl-11 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 sm:text-sm"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-3 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-600 font-medium">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/20 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <!-- Footer Links -->
          <div class="flex items-center justify-between mt-6">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-500">Remember me</label>
            </div>
            
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
                Forgot password?
              </a>
            </div>
          </div>
        </form>
      </div>

      <!-- Copyright -->
      <p class="mt-8 text-center text-xs text-gray-400">
        &copy; {{ new Date().getFullYear() }} Graphic NewsPlus. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'



const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await adminSignIn({ 
      usernameOrEmail: email.value, 
      password: password.value 
    })

    if (response && response.token) {
      // Set cookie for persistence
      const gnpUserIdentityCookie = useCookie("gnp-user-identity", {
        maxAge: 60 * 60 * 24, // 1 day
        secure: true,
        httpOnly: false,
        priority: "medium",
        sameSite: "strict"
      })
      
      gnpUserIdentityCookie.value = response.token
      
      // Update store
      authStore.setAccessToken(response.token)
      
      // Redirect to admin dashboard
      // Assuming /admin or /admin/dashboard is the target
      router.push('/admin/dashboard')
    } else {
      error.value = 'Invalid credentials. Please try again.'
    }
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.response?._data?.message || 'An error occurred during sign in. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>