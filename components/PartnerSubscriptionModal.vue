<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
          
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
              <CurrencyDollarIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Assign Subscription Plan</h3>
              <p class="mt-2 text-sm text-gray-500">
                Select a subscription plan and billing cycle to assign to the selected subscribers.
              </p>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loadingPlans" class="mt-6">
            <div class="animate-pulse space-y-4">
              <div class="h-32 bg-gray-200 rounded-lg"></div>
              <div class="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          <!-- Plans Grid -->
          <div v-else class="mt-6">
            <div v-if="plans.length === 0" class="text-center py-8 text-gray-500">
              <p class="text-sm">No subscription plans available.</p>
            </div>
            
            <div v-else class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              <div
                v-for="plan in plans"
                :key="plan.id"
                :class="[
                  'relative rounded-lg border-2 p-5 transition-all',
                  selectedPlanId === plan.id
                    ? 'border-primary-600 bg-primary-50/30'
                    : 'border-gray-200'
                ]"
              >
                <!-- Plan Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div
                        @click="selectPlan(plan.id)"
                        :class="[
                          'flex h-5 w-5 items-center justify-center rounded-full border-2 cursor-pointer',
                          selectedPlanId === plan.id
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300 hover:border-gray-400'
                        ]"
                      >
                        <div v-if="selectedPlanId === plan.id" class="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-900">{{ plan.name }} <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize"> {{ plan.planType || 'Standard' }} </span>
                    </h4>
                        <p v-if="plan.description" class="text-sm text-gray-600 mt-0.5">{{ plan.description }}</p>
                      </div>
                    </div>
                    
                  </div>
                </div>

                <!-- Pricing Options -->
                <div v-if="plan.pricing && Object.keys(plan.pricing).length > 0" class="mt-4">
                  <p class="text-sm font-medium text-gray-700 mb-3">Select Billing Cycle:</p>
                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div
                      v-for="(priceInfo, cycle) in plan.pricing"
                      :key="cycle"
                      @click="selectPlanAndCycle(plan.id, cycle)"
                      :class="[
                        'relative rounded-lg border-2 p-3 cursor-pointer transition-all hover:shadow-md',
                        selectedPlanId === plan.id && selectedBillingCycle === cycle
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      ]"
                    >
                      <div class="text-center">
                        <p :class="[
                          'text-xs font-medium mb-1',
                          selectedPlanId === plan.id && selectedBillingCycle === cycle
                            ? 'text-white'
                            : 'text-gray-600'
                        ]">{{ cycle }}</p>
                        <p :class="[
                          'text-lg font-bold',
                          selectedPlanId === plan.id && selectedBillingCycle === cycle
                            ? 'text-white'
                            : 'text-gray-900'
                        ]">GH₵{{ priceInfo.price }}</p>
                        <p 
                          v-if="priceInfo.savePercentage > 0" 
                          :class="[
                            'text-xs font-medium mt-1',
                            selectedPlanId === plan.id && selectedBillingCycle === cycle
                              ? 'text-primary-100'
                              : 'text-green-600'
                          ]"
                        >
                          Save {{ priceInfo.savePercentage }}%
                        </p>
                      </div>
                      
                      <!-- Selected Indicator -->
                      <div 
                        v-if="selectedPlanId === plan.id && selectedBillingCycle === cycle"
                        class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border-2 border-primary-600 flex items-center justify-center"
                      >
                        <svg class="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 sm:flex sm:flex-row-reverse gap-3">
            <button 
              type="button" 
              :disabled="loading || !selectedPlanId || !selectedBillingCycle"
              @click="handleSubmit"
              class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Assigning...' : 'Assign Plan' }}
            </button>
            <button 
              type="button" 
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
import { XMarkIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
import { getSubscriptionPlans } from '~/services/subscriptionPlans'
import type { SubscriptionPlan } from '~/models'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'assign'])

const plans = ref<SubscriptionPlan[]>([])
const loadingPlans = ref(true)
const selectedPlanId = ref('')
const selectedBillingCycle = ref('')

const selectPlan = (planId: string) => {
  selectedPlanId.value = planId
  // Clear billing cycle when switching plans
  selectedBillingCycle.value = ''
}

const selectPlanAndCycle = (planId: string, cycle: string) => {
  selectedPlanId.value = planId
  selectedBillingCycle.value = cycle
}

onMounted(async () => {
    try {
        const result = await getSubscriptionPlans({ pageSize: 100 })
        plans.value = result.data || []
    } catch (error) {
        console.error('Error fetching plans', error)
    } finally {
        loadingPlans.value = false
    }
})

const handleSubmit = () => {
    if (selectedPlanId.value && selectedBillingCycle.value) {
        const selectedPlan = plans.value.find(p => p.id === selectedPlanId.value)
        const price = selectedPlan?.pricing?.[selectedBillingCycle.value]?.price || 0
        
        emit('assign', {
            planId: selectedPlanId.value,
            billingCycle: selectedBillingCycle.value,
            planName: selectedPlan?.name || '',
            price: price
        })
    }
}
</script>
