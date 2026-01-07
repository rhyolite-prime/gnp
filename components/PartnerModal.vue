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
        <h2 class="text-2xl font-bold text-gray-800">Create New Partner</h2>
        <p class="text-gray-600 mt-1">Add a new commercial partner</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          
          <!-- Partner Name -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Partner Name</label>
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

          <!-- Contact Name -->
          <div class="sm:col-span-3">
            <label for="contactName" class="block text-sm font-medium leading-6 text-gray-900">Contact Person</label>
            <div class="mt-2">
              <input 
                type="text" 
                v-model="form.contactName"
                name="contactName" 
                id="contactName" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

          <!-- Contact Email -->
          <div class="sm:col-span-3">
            <label for="contactEmail" class="block text-sm font-medium leading-6 text-gray-900">Contact Email</label>
            <div class="mt-2">
              <input 
                type="email" 
                v-model="form.contactEmail"
                name="contactEmail" 
                id="contactEmail" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

          <!-- Contact Phone -->
          <div class="sm:col-span-3">
            <label for="contactPhone" class="block text-sm font-medium leading-6 text-gray-900">Contact Phone</label>
            <div class="mt-2">
              <input 
                type="tel" 
                v-model="form.contactPhone"
                name="contactPhone" 
                id="contactPhone" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

           <!-- Billing Email -->
           <div class="sm:col-span-3">
            <label for="billingEmail" class="block text-sm font-medium leading-6 text-gray-900">Billing Email</label>
            <div class="mt-2">
              <input 
                type="email" 
                v-model="form.billingEmail"
                name="billingEmail" 
                id="billingEmail" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
            </div>
          </div>

          <!-- Billing Cycle -->
          <div class="sm:col-span-3">
            <label for="billingCycle" class="block text-sm font-medium leading-6 text-gray-900">Billing Cycle</label>
            <div class="mt-2">
              <select 
                id="billingCycle" 
                v-model="form.billingCycle"
                name="billingCycle" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <!-- Currency -->
          <div class="sm:col-span-3">
            <label for="currency" class="block text-sm font-medium leading-6 text-gray-900">Currency</label>
            <div class="mt-2">
              <select 
                id="currency" 
                v-model="form.currency"
                name="currency" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              >
                <option value="GHS">GHS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <!-- Subaccount Enabled -->
          <div class="sm:col-span-6">
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input 
                  id="subaccountEnabled" 
                  v-model="form.subaccountEnabled"
                  name="subaccountEnabled" 
                  type="checkbox" 
                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" 
                />
              </div>
              <div class="text-sm leading-6">
                <label for="subaccountEnabled" class="font-medium text-gray-900">Enable Subaccounts</label>
                <p class="text-gray-500">Allow this partner to manage sub-accounts for their organization.</p>
              </div>
            </div>
          </div>

        </div>

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
            {{ loading ? 'Saving...' : 'Create Partner' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// Define Props
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});

// Define Emits
const emit = defineEmits(['close', 'save']);

// Form State
const form = reactive({
  name: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  billingEmail: '',
  billingCycle: 'Monthly',
  currency: 'GHS',
  subaccountEnabled: false,
});

// Handle Submit
const handleSubmit = () => {
  emit('save', { ...form });
};

</script>
