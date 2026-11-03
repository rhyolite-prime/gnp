<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6"
        >
          <!-- Header -->
          <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
              @click="$emit('close')"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <BuildingOffice2Icon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                Onboard Enterprise Subscriber
              </h3>

              <!-- Steps -->
              <div class="mt-3 flex items-center gap-2">
                <div class="flex items-center gap-2">
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    :class="currentStep === 1 ? 'bg-primary-600 text-white' : 'bg-emerald-600 text-white'"
                  >
                    <CheckIcon v-if="currentStep > 1" class="h-3.5 w-3.5" />
                    <template v-else>1</template>
                  </span>
                  <span class="text-xs font-medium text-gray-700">Organization</span>
                </div>
                <div class="h-px flex-1 bg-gray-200"></div>
                <div class="flex items-center gap-2">
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    :class="currentStep === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'"
                  >
                    2
                  </span>
                  <span class="text-xs font-medium text-gray-700">Subscription Package</span>
                </div>
              </div>

              <!-- Step 1: Organization -->
              <div v-if="currentStep === 1" class="mt-5 grid grid-cols-1 gap-y-4 sm:grid-cols-2 gap-x-4">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700">Organization Name *</label>
                  <input
                    v-model="form.organizationName"
                    type="text"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    placeholder="e.g. Ghana Library Authority"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Contact Person *</label>
                  <input
                    v-model="form.contactName"
                    type="text"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Account Type</label>
                  <select
                    v-model="form.accountType"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                  >
                    <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Contact Email *</label>
                  <input
                    v-model="form.contactEmail"
                    type="email"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    placeholder="name@organization.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input
                    v-model="form.contactPhone"
                    type="text"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    placeholder="+233 ..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Region</label>
                  <input
                    v-model="form.region"
                    type="text"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    placeholder="e.g. Greater Accra"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    v-model="form.address"
                    type="text"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    placeholder="Postal / street address"
                  />
                </div>
              </div>

              <!-- Step 2: Subscription Package -->
              <div v-else class="mt-5">
                <label class="block text-sm font-medium text-gray-700">Subscription Package *</label>
                <select
                  v-model="form.packageId"
                  class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                >
                  <option value="" disabled>Select a package</option>
                  <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                    {{ pkg.name }} — {{ pkg.pricing }}
                  </option>
                </select>

                <div v-if="selectedPackage" class="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p class="text-sm text-gray-700">{{ selectedPackage.description }}</p>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span
                      v-for="pub in selectedPackage.targetPublications"
                      :key="pub"
                      class="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200"
                    >
                      {{ pub }}
                    </span>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Billing Cycle</label>
                    <select
                      v-model="form.billingCycle"
                      class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    >
                      <option v-for="cycle in billingCycles" :key="cycle" :value="cycle" class="capitalize">{{ cycle }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">User Quota (seats)</label>
                    <input
                      v-model.number="form.subscriberQuota"
                      type="number"
                      min="1"
                      class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                    />
                  </div>
                </div>

                <p class="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs text-amber-800">
                  The enterprise will be created with status <strong>Pending Approval</strong>. Use
                  <strong>Approve</strong> from the list once you have verified its details.
                </p>
              </div>

              <p v-if="errorMessage" class="mt-3 text-xs font-medium text-red-600">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:w-auto cursor-pointer disabled:opacity-50"
              :disabled="isSaving"
              @click="currentStep === 1 ? goStep2() : submit()"
            >
              {{ currentStep === 1 ? 'Continue' : (isSaving ? 'Creating...' : 'Create Enterprise') }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
              @click="currentStep === 1 ? $emit('close') : (currentStep = 1)"
            >
              {{ currentStep === 1 ? 'Cancel' : 'Back' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon, CheckIcon, BuildingOffice2Icon } from '@heroicons/vue/24/outline'
import {
  MOCK_ENTERPRISE_PACKAGES,
  MOCK_ENTERPRISE_TYPE_OPTIONS,
} from '~/services/enterpriseSubscribers'
import type { EnterprisePackage } from '~/models'

const emit = defineEmits(['close', 'save'])

const packages = MOCK_ENTERPRISE_PACKAGES as EnterprisePackage[]
const typeOptions = MOCK_ENTERPRISE_TYPE_OPTIONS

const currentStep = ref(1)
const isSaving = ref(false)
const errorMessage = ref('')

const form = reactive({
  organizationName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  accountType: 'corporate',
  region: '',
  address: '',
  packageId: '' as string,
  billingCycle: 'annual',
  subscriberQuota: 50,
})

const selectedPackage = computed(() => packages.find((p) => p.id === form.packageId) || null)
const billingCycles = computed(() => selectedPackage.value?.billingCycles || ['annual'])

watch(selectedPackage, (pkg) => {
  if (!pkg) return
  if (!pkg.billingCycles.includes(form.billingCycle)) {
    form.billingCycle = pkg.billingCycles[0]
  }
  form.subscriberQuota = pkg.userQuota
})

const goStep2 = () => {
  errorMessage.value = ''
  if (!form.organizationName.trim()) {
    errorMessage.value = 'Organization name is required.'
    return
  }
  if (!form.contactName.trim()) {
    errorMessage.value = 'Contact person is required.'
    return
  }
  if (!form.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) {
    errorMessage.value = 'A valid contact email is required.'
    return
  }
  currentStep.value = 2
}

const submit = () => {
  errorMessage.value = ''
  if (!form.packageId) {
    errorMessage.value = 'Select a subscription package.'
    return
  }
  if (!form.subscriberQuota || form.subscriberQuota < 1) {
    errorMessage.value = 'User quota must be at least 1.'
    return
  }

  isSaving.value = true
  emit('save', {
    organizationName: form.organizationName.trim(),
    contactName: form.contactName.trim(),
    contactEmail: form.contactEmail.trim(),
    contactPhone: form.contactPhone.trim(),
    accountType: form.accountType,
    region: form.region.trim(),
    address: form.address.trim(),
    packageId: form.packageId,
    billingCycle: form.billingCycle,
    subscriberQuota: form.subscriberQuota,
  })
}
</script>
