<template>
  <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-extrabold text-gray-900">Create Affiliate Account on GNP</h2>
            <p class="mt-2 text-gray-600">Join our network and start earning commissions</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-6">
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
               
              <!-- First Name -->
              <div class="sm:col-span-1">
                <label for="email" class="block text-sm font-medium text-gray-700">First Name</label>
                <div class="mt-1">
                  <input 
                    v-model="form.firstName" 
                    type="text" 
                    required 
                    class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    placeholder="First Name"
                  />
                </div>
              </div>

              <!-- First Name -->
              <div class="sm:col-span-1">
                <label for="email" class="block text-sm font-medium text-gray-700">First Name</label>
                <div class="mt-1">
                  <input 
                    v-model="form.lastName" 
                    type="text" 
                    required 
                    class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="sm:col-span-1">
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

              <!-- Phone -->
              <div class="sm:col-span-1">
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <div class="mt-1">
                  <input 
                    id="phone" 
                    v-model="form.phone" 
                    type="tel" 
                    required 
                    class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    placeholder="0201234567"
                  />
                </div>
              </div>

              <!-- Website/Social -->
              <div class="sm:col-span-2">
                <label for="website" class="block text-sm font-medium text-gray-700">Website or Primary Social Media Link</label>
                <div class="mt-1">
                  <input 
                    id="website" 
                    v-model="form.website" 
                    type="url" 
                    required 
                    class="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="sm:col-span-1">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
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

              <!-- Confirm Password -->
              <div class="sm:col-span-1">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
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
            </div>

            <div class="flex items-center">
              <input 
                id="terms" 
                v-model="form.terms" 
                type="checkbox" 
                required 
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" class="text-primary-600 hover:text-primary-500 underline">Affiliate Terms & Conditions</a>
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
                Register as Affiliate
              </button>
            </div>
          </form>

          <div class="mt-10 text-center">
            <p class="text-sm text-gray-600">
              Already an affiliate? 
              <NuxtLink to="/affiliates/login" class="font-medium text-primary-600 hover:text-primary-500 ml-1 underline">Sign in here</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createAffiliate } from '~/services/affiliate'

definePageMeta({
  layout: 'default'
})

const loading = ref(false)
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  website: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  
  loading.value = true
  try {
    // Note: createAffiliate currently uses 'admin/create-subscription-plan' in the codebase
    // This probably needs to be a public endpoint in a real scenario
    const success = await createAffiliate({
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      website: form.website,
      password: form.password
    })
    
    if (success) {
      alert('Registration successful! Please login.')
      useRouter().push('/affiliates/login')
    } else {
      alert('Registration failed. Please try again.')
    }
  } catch (error) {
    console.error('Registration error:', error)
    alert('An error occurred during registration.')
  } finally {
    loading.value = false
  }
}
</script>
