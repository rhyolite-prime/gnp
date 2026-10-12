<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">

          <!-- Close button -->
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

          <!-- Modal Header -->
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <CurrencyDollarIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                {{ hasActivePlan ? 'Modify Subscription Plan' : 'Assign Subscription Plan' }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                <span v-if="hasActivePlan">
                  This subscriber currently has an active plan. Choose how you want to apply the new plan.
                </span>
                <span v-else>
                  Select a subscription plan and billing cycle to assign to this subscriber.
                </span>
              </p>
            </div>
          </div>

          <!-- ─── Step 1: Action Selection (only if subscriber already has a plan) ─── -->
          <div v-if="hasActivePlan && step === 1" class="mt-6">
            <!-- Current plan info banner -->
            <div class="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div class="flex items-start gap-3">
                <InformationCircleIcon class="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-blue-800">Current Subscription</p>
                  <p class="text-sm text-blue-700 mt-0.5">
                    {{ subscriber?.subscriptionPlanName || 'Active Plan' }}
                    <span v-if="subscriber?.subscriptionEndDate" class="text-blue-600">
                      · Expires {{ shortDateFormat(subscriber.subscriptionEndDate) }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <p class="text-sm font-semibold text-gray-700 mb-4">How would you like to update this subscription?</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Replace Option -->
              <button
                type="button"
                @click="selectAction('replace')"
                :class="[
                  'relative rounded-xl border-2 p-5 text-left transition-all focus:outline-none',
                  selectedAction === 'replace'
                    ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-start gap-3">
                  <div :class="[
                    'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                    selectedAction === 'replace' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                  ]">
                    <div v-if="selectedAction === 'replace'" class="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">Replace Current Plan</p>
                    <p class="mt-1 text-xs text-gray-500 leading-relaxed">
                      Cancel the current subscription immediately and start the new plan from today. The subscriber's expiry date will be recalculated based on the new plan.
                    </p>
                    <span class="mt-2 inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                      Overwrites current plan
                    </span>
                  </div>
                </div>
              </button>

              <!-- Extend Option -->
              <button
                type="button"
                @click="selectAction('extend')"
                :class="[
                  'relative rounded-xl border-2 p-5 text-left transition-all focus:outline-none',
                  selectedAction === 'extend'
                    ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-start gap-3">
                  <div :class="[
                    'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                    selectedAction === 'extend' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                  ]">
                    <div v-if="selectedAction === 'extend'" class="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">Extend Current Plan</p>
                    <p class="mt-1 text-xs text-gray-500 leading-relaxed">
                      Keep the current subscription active and add extra time on top. The new plan's duration will be appended to the existing expiry date.
                    </p>
                    <span class="mt-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Adds to current plan
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <!-- Step 1 Actions -->
            <div class="mt-6 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="button"
                :disabled="!selectedAction"
                @click="step = 2"
                class="inline-flex w-full justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRightIcon class="ml-1.5 h-4 w-4" />
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                @click="$emit('close')"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- ─── Step 2 (or Step 1 for new subscribers): Plan Selection ─── -->
          <div v-if="step === 2 || !hasActivePlan">

            <!-- Action summary badge (only shown when modifying) -->
            <div v-if="hasActivePlan && selectedAction" class="mt-5 flex items-center gap-2">
              <button
                type="button"
                class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
                @click="step = 1"
              >
                <ArrowLeftIcon class="h-3.5 w-3.5" />
                Back
              </button>
              <span class="text-gray-300">|</span>
              <span :class="[
                'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                selectedAction === 'replace'
                  ? 'bg-orange-50 text-orange-700 ring-orange-600/20'
                  : 'bg-green-50 text-green-700 ring-green-600/20'
              ]">
                {{ selectedAction === 'replace' ? 'Replacing current plan' : 'Extending current plan' }}
              </span>
            </div>

            <!-- Loading State -->
            <div v-if="loadingPlans" class="mt-6">
              <div class="animate-pulse space-y-4">
                <div class="h-32 bg-gray-200 rounded-lg"></div>
                <div class="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <!-- Plans Grid -->
            <div v-else class="mt-5">
              <div v-if="plans.length === 0" class="text-center py-8 text-gray-500">
                <p class="text-sm">No subscription plans available.</p>
              </div>

              <div v-else class="space-y-6 max-h-[420px] overflow-y-auto pr-2">
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
                          <h4 class="text-lg font-semibold text-gray-900">
                            {{ plan.name }}
                            <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize ml-1">
                              {{ plan.planType || 'Standard' }}
                            </span>
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
                {{ loading ? 'Saving...' : submitLabel }}
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
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon, CurrencyDollarIcon, InformationCircleIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import type { SubscriptionPlan, Subscriber } from '~/models'

const props = defineProps<{
  loading?: boolean
  subscriber?: Subscriber | null
}>()

const emit = defineEmits(['close', 'assign'])

// ─── Computed ─────────────────────────────────────────────────────────────────
const hasActivePlan = computed(() => !!props.subscriber?.subscriptionPlanId)

// ─── Step: 1 = action selection (only for modify), 2 = plan selection ─────────
const step = ref(hasActivePlan.value ? 1 : 2)

watch(() => props.subscriber, () => {
  step.value = hasActivePlan.value ? 1 : 2
})

// ─── Action ───────────────────────────────────────────────────────────────────
type SubscriptionAction = 'replace' | 'extend'
const selectedAction = ref<SubscriptionAction | null>(null)

const selectAction = (action: SubscriptionAction) => {
  selectedAction.value = action
}

// ─── Plan selection ───────────────────────────────────────────────────────────
const plans = ref<SubscriptionPlan[]>([])
const loadingPlans = ref(true)
const selectedPlanId = ref('')
const selectedBillingCycle = ref('')

const selectPlan = (planId: string) => {
  selectedPlanId.value = planId
  selectedBillingCycle.value = ''
}

const selectPlanAndCycle = (planId: string, cycle: string) => {
  selectedPlanId.value = planId
  selectedBillingCycle.value = cycle
}

// ─── Submit label ─────────────────────────────────────────────────────────────
const submitLabel = computed(() => {
  if (!hasActivePlan.value) return 'Assign Plan'
  return selectedAction.value === 'replace' ? 'Replace Plan' : 'Extend Plan'
})

// ─── Date helper ─────────────────────────────────────────────────────────────
const shortDateFormat = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────
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

// ─── Submit ───────────────────────────────────────────────────────────────────
const handleSubmit = () => {
  if (selectedPlanId.value && selectedBillingCycle.value) {
    const selectedPlan = plans.value.find(p => p.id === selectedPlanId.value)
    const price = selectedPlan?.pricing?.[selectedBillingCycle.value]?.price || 0

    emit('assign', {
      planId: selectedPlanId.value,
      billingCycle: selectedBillingCycle.value,
      planName: selectedPlan?.name || '',
      price: price,
      // 'replace' | 'extend' | undefined (undefined = new assignment, no existing plan)
      action: hasActivePlan.value ? selectedAction.value : undefined,
    })
  }
}
</script>
