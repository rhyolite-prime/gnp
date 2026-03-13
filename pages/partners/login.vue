<template>
  <div class="bg-slate-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Decorative backgrounds -->
    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
    <div class="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>

    <div class="max-w-md w-full relative z-10 animate-fade-in">
      <div class="text-center mb-10">
        <NuxtLink to="/partners" class="inline-flex items-center group">
           <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <BuildingOfficeIcon class="h-7 w-7 text-primary-500" />
           </div>
        </NuxtLink>
        <h2 class="mt-6 text-4xl font-extrabold text-white tracking-tight">Partner Portal</h2>
        <p class="mt-2 text-slate-400 text-lg">Secure Institutional Access</p>
      </div>

      <div class="bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
        <div class="p-8 sm:p-10">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-bold text-slate-300 mb-2">Work Email or Username</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon class="h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input 
                  id="email" 
                  v-model="form.email" 
                  type="text" 
                  required 
                  class="block w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-inner"
                  placeholder="name@organization.com"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-sm font-bold text-slate-300">Password</label>
                <NuxtLink to="/partners/forgot-password" class="text-xs font-bold text-primary-500 hover:text-primary-400">
                  Forgot?
                </NuxtLink>
              </div>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon class="h-5 w-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input 
                  id="password" 
                  v-model="form.password" 
                  type="password" 
                  required 
                  class="block w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-900/50 border-white/10 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  id="remember" 
                  v-model="form.remember" 
                  type="checkbox" 
                  class="h-5 w-5 text-primary-600 focus:ring-primary-500 bg-slate-900 border-white/10 rounded-lg transition-all"
                />
                <label for="remember" class="ml-3 block text-sm font-medium text-slate-400 cursor-pointer">
                  Keep me signed in
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Authenticating...' : 'Sign In to Portal' }}
            </button>
          </form>

          <div class="mt-10 text-center">
            <p class="text-sm text-slate-400">
              Interested in becoming a partner? 
              <NuxtLink to="/partners#contact-sales" class="font-bold text-primary-500 hover:text-primary-400 ml-1 transition-colors">Contact Sales</NuxtLink>
            </p>
          </div>
        </div>
      </div>
      
      <p class="text-center mt-12 text-slate-500 text-xs">
        &copy; 2026 Graphic NewsPlus Institutional. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BuildingOfficeIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import { signIn } from '~/services/auth'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Partner Login - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Secure institutional access for Graphic NewsPlus commercial partners.' }
  ]
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
      
      // Navigate to partner-specific dashboard
      router.push('/partners/dashboard')
    } else {
      alert('Invalid institutional credentials')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('An authentication error occurred. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

input {
  @apply placeholder-slate-500;
}
</style>
