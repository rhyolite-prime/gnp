<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div :class="['relative bg-white rounded-lg shadow-xl w-full p-6 mx-4 transition-all duration-300', currentStep === 1 ? 'max-w-2xl' : 'max-w-4xl']">
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
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Add New Subscriber</h2>
        <p class="text-gray-600 mt-1">Create a subscriber account and assign a subscription plan</p>

        <!-- Step Indicator -->
        <nav aria-label="Progress" class="mt-6">
          <ol role="list" class="flex items-center">
            <li class="relative pr-8 sm:pr-20">
              <div class="flex items-center" aria-current="step">
                <span :class="[currentStep >= 1 ? 'bg-primary-600' : 'bg-gray-200', 'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white']">1</span>
                <span :class="[currentStep >= 1 ? 'text-primary-600' : 'text-gray-500', 'ml-4 text-sm font-medium']">Basic Information</span>
              </div>
              <div class="absolute top-4 -right-0 flex items-center" aria-hidden="true">
                <div :class="[currentStep > 1 ? 'bg-primary-600' : 'bg-gray-200', 'h-0.5 w-full']"></div>
              </div>
            </li>
            <li class="relative">
              <div class="flex items-center">
                <span :class="[currentStep === 2 ? 'bg-primary-600' : 'bg-gray-200', 'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white']">2</span>
                <span :class="[currentStep === 2 ? 'text-primary-600' : 'text-gray-500', 'ml-4 text-sm font-medium']">Subscription Plan</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 1" class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 animate-fade-in">

          <!-- First Name -->
          <div class="sm:col-span-3">
            <label for="firstName" class="block text-sm font-medium leading-6 text-gray-900">First Name</label>
            <div class="mt-2">
              <input
                type="text"
                v-model="form.firstName"
                name="firstName"
                id="firstName"
                autocomplete="given-name"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <!-- Last Name -->
          <div class="sm:col-span-3">
            <label for="lastName" class="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
            <div class="mt-2">
              <input
                type="text"
                v-model="form.lastName"
                name="lastName"
                id="lastName"
                autocomplete="family-name"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <!-- Username + Phone Number (same row) -->
          <div class="sm:col-span-3">
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username <span class="text-gray-400 font-normal text-xs">(auto-generated from name)</span></label>
            <div class="mt-2">
              <input
                type="text"
                v-model="form.username"
                @input="usernameManuallyEdited = true"
                name="username"
                id="username"
                autocomplete="username"
                placeholder="e.g. john_doe_123"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="phoneNumber" class="block text-sm font-medium leading-6 text-gray-900">Phone Number <span class="text-gray-400 font-normal">(Optional)</span></label>
            <div class="mt-2">
              <input
                type="tel"
                v-model="form.phoneNumber"
                name="phoneNumber"
                id="phoneNumber"
                autocomplete="tel"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="+233..."
              />
            </div>
          </div>

          <!-- Email -->
          <div class="sm:col-span-6">
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email Address</label>
            <div class="mt-2">
              <input
                type="email"
                v-model="form.email"
                name="email"
                id="email"
                autocomplete="email"
                required
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <!-- ByPass Payment -->
          <div class="sm:col-span-6">
            <div class="relative flex items-start">
              <div class="flex h-6 items-center">
                <input
                  id="byPassPayment"
                  name="byPassPayment"
                  type="checkbox"
                  v-model="form.byPassPayment"
                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
              </div>
              <div class="ml-3 text-sm leading-6">
                <label for="byPassPayment" class="font-medium text-gray-900">Bypass Payment</label>
                <p class="text-gray-500">Enable this if the subscriber should not pay for the subscription.</p>
              </div>
            </div>
          </div>

        </div>

        <!-- Step 2: Subscription Plan -->
        <div v-if="currentStep === 2" class="animate-fade-in space-y-6">

          <!-- Subscription Start Date -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700">Subscription Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  v-model="form.subscriptionStartDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ring-1 ring-inset ring-gray-300 py-1.5 px-3"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Calculated End Date</label>
                <div class="mt-1 block w-full py-2 px-3 bg-gray-100 rounded-md border border-gray-200 text-sm text-gray-600">
                  {{ standardDateFormat(formattedEndDate) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Loading Plans -->
          <div v-if="loadingPlans" class="py-12 flex flex-col items-center justify-center">
            <svg class="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 font-medium">Loading available plans...</p>
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Plans List (Left Column) -->
            <div class="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div v-if="plans.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p class="text-gray-500">No subscription plans available.</p>
              </div>

              <div
                v-for="plan in plans"
                :key="plan.id"
                :class="[
                  'relative rounded-xl border-2 p-4 transition-all',
                  form.subscriptionPlanId === plan.id
                    ? 'border-primary-600 bg-primary-50/30'
                    : 'border-gray-200 bg-white'
                ]"
              >
                <!-- Plan Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div
                        @click="selectPlan(plan)"
                        :class="[
                          'flex h-5 w-5 items-center justify-center rounded-full border-2 cursor-pointer',
                          form.subscriptionPlanId === plan.id
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300 hover:border-gray-400'
                        ]"
                      >
                        <div v-if="form.subscriptionPlanId === plan.id" class="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <h4 class="font-bold text-gray-900 text-base flex items-center gap-2">
                          {{ plan.name }}
                          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase">
                            {{ plan.planType || 'Standard' }}
                          </span>
                        </h4>
                        <p v-if="plan.description" class="text-xs text-gray-500 mt-0.5">{{ plan.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Billing Cycle Options -->
                <div v-if="plan.pricing && Object.keys(plan.pricing).length > 0" class="mt-2">
                  <p class="text-xs font-medium text-gray-500 mb-2">Select Billing Cycle:</p>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      v-for="(priceInfo, cycle) in plan.pricing"
                      :key="cycle"
                      type="button"
                      @click="selectPlanAndCycle(plan, cycle)"
                      :class="[
                        'relative rounded-lg border p-2 text-center transition-all',
                        form.subscriptionPlanId === plan.id && form.billingCycle === cycle
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      ]"
                    >
                      <p class="text-[10px] font-bold uppercase tracking-wider">{{ cycle }}</p>
                      <p class="text-sm font-black">GH₵{{ priceInfo.price }}</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary Sidebar (Right Column) -->
            <div class="bg-gray-900 rounded-xl p-6 text-white h-fit sticky top-0 shadow-xl">
              <h3 class="text-md font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Subscription Summary
              </h3>

              <div class="space-y-4 text-sm">
                <div class="flex justify-between items-center text-gray-400">
                  <span>Subscriber</span>
                  <span class="text-white font-medium">{{ form.firstName }} {{ form.lastName }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-400">
                  <span>Plan</span>
                  <span class="text-white font-medium">{{ form.subscriptionPlanName || 'Not Selected' }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-400">
                  <span>Billing Cycle</span>
                  <span class="text-white font-medium capitalize">{{ form.billingCycle || 'Not Selected' }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-400">
                  <span>Price</span>
                  <span class="text-white font-medium">GH₵{{ selectedPlanPrice }}</span>
                </div>

                <div class="border-t border-gray-800 my-4 pt-4">
                  <div class="flex justify-between items-end">
                    <div>
                      <p class="text-xs text-gray-400 mb-1">Amount Due</p>
                      <p class="text-2xl font-black text-primary-400">GH₵{{ _currency(selectedPlanPrice) }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-800/50 rounded-lg p-3 space-y-2 mt-6">
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-400">Start Date:</span>
                    <span class="text-gray-200">{{ standardDateFormat(form.subscriptionStartDate) }}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-400">End Date:</span>
                    <span class="text-gray-200">{{ standardDateFormat(formattedEndDate) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-8 flex items-center justify-end gap-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            @click="currentStep === 1 ? $emit('close') : currentStep = 1"
            class="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            {{ currentStep === 1 ? 'Cancel' : 'Back' }}
          </button>

          <button
            v-if="currentStep === 1"
            type="button"
            @click="nextStep"
            class="rounded-md bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all"
          >
            Next: Select Plan
          </button>

          <button
            v-else
            type="submit"
            :disabled="loading || !form.subscriptionPlanId || !form.billingCycle"
            class="rounded-md bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating...' : 'Create Subscriber' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getSubscriptionPlans } from '~/services/subscriptionPlans'
import type { SubscriptionPlan } from '~/models'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

// Wizard state
const currentStep = ref(1)
const plans = ref<SubscriptionPlan[]>([])
const loadingPlans = ref(false)
const selectedPlanPrice = ref(0)

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  byPassPayment: false,
  subscriptionPlanId: '',
  subscriptionPlanName: '',
  billingCycle: '',
  subscriptionStartDate: new Date().toISOString().split('T')[0],
})

// Track whether the admin has manually typed a username so we don't overwrite it
const usernameManuallyEdited = ref(false)

const generateUsername = (firstName: string, lastName: string): string => {
  const rand = Math.floor(100 + Math.random() * 900)
  return `${firstName}_${lastName}_${rand}`.toLowerCase().replace(/\s+/g, '')
}

watch(
  () => [form.firstName, form.lastName],
  ([first, last]) => {
    if (!usernameManuallyEdited.value && first && last) {
      form.username = generateUsername(first, last)
    }
  }
)

// Calculate subscription end date from start date + billing cycle
const calculateEndDate = (startDate: string, cycle: string) => {
  if (!startDate || !cycle) return null
  const date = new Date(startDate)

  switch (cycle.toLowerCase()) {
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'quarterly':
    case '3 months':
      date.setMonth(date.getMonth() + 3)
      break
    case 'half-yearly':
    case 'half yearly':
    case '6 months':
      date.setMonth(date.getMonth() + 6)
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1)
      break
    default:
      return null
  }
  return date
}

const formattedEndDate = computed(() => {
  const endDate = calculateEndDate(form.subscriptionStartDate, form.billingCycle)
  return endDate ? endDate.toISOString().split('T')[0] : 'N/A'
})

// Fetch subscription plans
const fetchPlans = async () => {
  loadingPlans.value = true
  try {
    const result = await getSubscriptionPlans({ pageSize: 100 })
    plans.value = result.data || []
  } catch (error) {
    console.error('Error fetching plans:', error)
  } finally {
    loadingPlans.value = false
  }
}

// Advance to step 2 (validates required step-1 fields)
const nextStep = () => {
  if (form.firstName && form.lastName && form.email) {
    currentStep.value = 2
    if (plans.value.length === 0) {
      fetchPlans()
    }
  }
}

// Select plan (clears cycle)
const selectPlan = (plan: SubscriptionPlan) => {
  form.subscriptionPlanId = plan.id
  form.subscriptionPlanName = plan.name
  form.billingCycle = ''
  selectedPlanPrice.value = 0
}

// Select plan + billing cycle together
const selectPlanAndCycle = (plan: SubscriptionPlan, cycle: string) => {
  form.subscriptionPlanId = plan.id
  form.subscriptionPlanName = plan.name
  form.billingCycle = cycle
  selectedPlanPrice.value = plan.pricing[cycle]?.price || 0
}

// Submit
const handleSubmit = () => {
  if (form.subscriptionPlanId && form.billingCycle) {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username || generateUsername(form.firstName, form.lastName),
      email: form.email,
      phoneNumber: form.phoneNumber,
      byPassPayment: form.byPassPayment,
      subscriptionPlanId: form.subscriptionPlanId,
      subscriptionPlanName: `${form.subscriptionPlanName} (${form.billingCycle})`,
      billingCycle: form.billingCycle,
      subscriptionStartDate: form.subscriptionStartDate,
      subscriptionEndDate: formattedEndDate.value,
      price: selectedPlanPrice.value,
    }
    emit('save', payload)
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
