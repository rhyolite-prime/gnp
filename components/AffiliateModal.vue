<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 mx-4">
      <!-- Close button -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Modal header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Add New Affiliate</h2>
        <p class="text-gray-600 mt-1">Register a new affiliate to your program</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          
          <!-- Name -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
            <div class="mt-2">
              <input 
                type="text" 
                v-model="form.name"
                name="name" 
                id="name" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="sm:col-span-3">
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div class="mt-2">
              <input 
                type="email" 
                v-model="form.email"
                name="email" 
                id="email" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

           <!-- Phone -->
           <div class="sm:col-span-3">
            <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
            <div class="mt-2">
              <input 
                type="tel" 
                v-model="form.phone"
                name="phone" 
                id="phone" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

          <!-- Website -->
           <div class="sm:col-span-3">
            <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Website</label>
            <div class="mt-2">
              <input 
                type="text" 
                v-model="form.website"
                name="website" 
                id="website" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

          <!-- Platform (Multiselect) -->
           <div class="sm:col-span-6">
            <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">Platforms</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div 
                v-for="platform in platformOptions" 
                :key="platform"
                class="relative flex items-start"
              >
                <div class="flex h-6 items-center">
                  <input 
                    :id="`platform-${platform}`"
                    :value="platform"
                    v-model="form.platforms"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  />
                </div>
                <div class="ml-3 text-sm leading-6">
                  <label :for="`platform-${platform}`" class="font-medium text-gray-900 cursor-pointer">
                    {{ platform }}
                  </label>
                </div>
              </div>
            </div>
            <p v-if="form.platforms.length === 0" class="mt-2 text-sm text-red-600">
              Please select at least one platform
            </p>
          </div>

        </div>
        <hr class="my-6 border-gray-200"/>

        <div class="mt-6 flex items-center justify-end gap-x-6">
          <button 
            type="button" 
            @click="$emit('close')"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
             <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving...' : 'Create Affiliate' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

// Define Props
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});

// Define Emits
const emit = defineEmits(['close', 'save']);

// Platform options
const platformOptions = [
  'Instagram',
  'Facebook',
  'Twitter/X',
  'TikTok',
  'LinkedIn',
  'YouTube',
  'Blog/Website',
  'WhatsApp',
  'Telegram',
  'Other'
];

// Form State
const form = reactive({
  name: '',
  email: '',
  phone: '',
  status: 'Active',
  platforms: [] as string[],
  website: ''
});

// Handle Submit
const handleSubmit = () => {
  // Validate at least one platform is selected
  if (form.platforms.length === 0) {
    return;
  }
  emit('save', { ...form });
};
</script>
