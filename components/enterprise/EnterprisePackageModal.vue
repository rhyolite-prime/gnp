<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
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
              <CreditCardIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                Assign Subscription Package
              </h3>
              <p class="mt-1 text-xs text-gray-500">
                {{ enterprise?.organizationName }}
                <span v-if="enterprise?.packageName"> · currently on <strong>{{ enterprise.packageName }}</strong></span>
              </p>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700">Package *</label>
                <select
                  v-model="form.packageId"
                  class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                >
                  <option value="" disabled>Select a package</option>
                  <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                    {{ pkg.name }} — {{ pkg.pricing }}
                  </option>
                </select>
              </div>

              <div v-if="selectedPackage" class="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3.5">
                <p class="text-xs text-gray-700">{{ selectedPackage.description }}</p>
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
                    :min="enterprise?.enrolledUsers || 1"
                    class="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                  />
                  <p v-if="enterprise && form.subscriberQuota < enterprise.enrolledUsers" class="mt-1 text-[11px] text-red-600">
                    Quota cannot be below the {{ enterprise.enrolledUsers }} already enrolled users.
                  </p>
                </div>
              </div>

              <p v-if="errorMessage" class="mt-3 text-xs font-medium text-red-600">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:w-auto cursor-pointer disabled:opacity-50"
              :disabled="isSaving || !!enterprise && form.subscriberQuota < enterprise.enrolledUsers"
              @click="submit"
            >
              {{ isSaving ? 'Assigning...' : 'Assign Package' }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
              @click="$emit('close')"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon, CreditCardIcon } from '@heroicons/vue/24/outline'
import { MOCK_ENTERPRISE_PACKAGES } from '~/services/enterpriseSubscribers'
import type { EnterprisePackage, EnterpriseSubscriber } from '~/models'

const props = defineProps<{
  enterprise: EnterpriseSubscriber | null
}>()

const emit = defineEmits(['close', 'assign'])

const packages = MOCK_ENTERPRISE_PACKAGES as EnterprisePackage[]
const isSaving = ref(false)
const errorMessage = ref('')

const form = reactive({
  packageId: props.enterprise?.packageId || '',
  billingCycle: props.enterprise?.billingCycle || 'annual',
  subscriberQuota: props.enterprise?.subscriberQuota || 50,
})

const selectedPackage = computed(() => packages.find((p) => p.id === form.packageId) || null)
const billingCycles = computed(() => selectedPackage.value?.billingCycles || ['annual'])

watch(selectedPackage, (pkg) => {
  if (!pkg) return
  if (!pkg.billingCycles.includes(form.billingCycle)) {
    form.billingCycle = pkg.billingCycles[0]
  }
  // Suggest the package's default quota, but never below already-enrolled seats
  const minSeats = props.enterprise?.enrolledUsers || 1
  form.subscriberQuota = Math.max(pkg.userQuota, minSeats)
})

const submit = () => {
  errorMessage.value = ''
  if (!form.packageId) {
    errorMessage.value = 'Select a subscription package.'
    return
  }
  const minSeats = props.enterprise?.enrolledUsers || 1
  if (!form.subscriberQuota || form.subscriberQuota < minSeats) {
    errorMessage.value = `Quota must be at least ${minSeats} (already enrolled users).`
    return
  }

  isSaving.value = true
  emit('assign', {
    packageId: form.packageId,
    billingCycle: form.billingCycle,
    subscriberQuota: form.subscriberQuota,
  })
}
</script>
