<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          
          <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button 
              type="button" 
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" 
              @click="$emit('close')"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <UserPlusIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                {{ subscriber ? 'Edit Subscriber' : 'Add New Subscriber' }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ subscriber ? 'Update the details of the subscriber.' : 'Enter the details of the new subscriber to add to this partner.' }}
                </p>
                
                <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                    <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div class="sm:col-span-3">
                            <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                            <div class="mt-2">
                                <input 
                                  v-model="form.firstName"
                                  type="text" 
                                  name="first-name" 
                                  id="first-name" 
                                  autocomplete="given-name" 
                                  required
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                                />
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                            <div class="mt-2">
                                <input 
                                  v-model="form.lastName"
                                  type="text" 
                                  name="last-name" 
                                  id="last-name" 
                                  autocomplete="family-name" 
                                  required
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                                />
                            </div>
                        </div>

                         <div class="sm:col-span-6">
                            <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone Number </label>
                            <div class="mt-2">
                                <input 
                                  v-model="form.phoneNumber"
                                  type="text" 
                                  name="phone" 
                                  id="phone" 
                                  autocomplete="tel" 
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                                />
                            </div>
                        </div>

                        <div class="sm:col-span-6">
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email Address (Optional)</label>
                            <div class="mt-2">
                                <input 
                                  v-model="form.email"
                                  type="email" 
                                  name="email" 
                                  id="email" 
                                  autocomplete="email" 
                                  required
                                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                                />
                            </div>
                        </div>
                        
                    </div>

                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button 
                          type="submit" 
                          :disabled="loading"
                          class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {{ loading ? 'Saving...' : (subscriber ? 'Save Changes' : 'Add Subscriber') }}
                        </button>
                        <button 
                          type="button" 
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          @click="$emit('close')"
                        >
                          Cancel
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
import { reactive, watch, type PropType } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  subscriber: {
    type: Object as PropType<any>,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
})

watch(() => props.subscriber, (newVal) => {
  if (newVal) {
    form.firstName = newVal.firstName || '';
    form.lastName = newVal.lastName || '';
    form.email = newVal.email || '';
    form.phoneNumber = newVal.phoneNumber || '';
  } else {
    form.firstName = '';
    form.lastName = '';
    form.email = '';
    form.phoneNumber = '';
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', { ...form })
}
</script>
