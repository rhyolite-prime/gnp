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
        <h2 class="text-2xl font-bold text-gray-800">Create New Partner</h2>
        <p class="text-gray-600 mt-1">Add a new commercial partner and assign a default subscription plan</p>
        
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
                <span :class="[currentStep === 2 ? 'text-primary-600' : 'text-gray-500', 'ml-4 text-sm font-medium']">Default Subscription Plan</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 1" class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 animate-fade-in">
          
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

          <!-- Subscriber Quota -->
           <div class="sm:col-span-3">
            <label for="subscriberQuota" class="block text-sm font-medium leading-6 text-gray-900">Subscriber Quota</label>
            <div class="mt-2">
              <input 
                type="number" 
                v-model="form.subscriberQuota"
                name="subscriberQuota" 
                id="subscriberQuota"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                required
              />
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
                  v-model="form.subAccountEnabled"
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

        <!-- Step 2: Subscription Plan -->
        <div v-if="currentStep === 2" class="animate-fade-in space-y-6">
          <!-- Dates Selection -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700">Subscription Start Date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  v-model="form.subscriptionStartDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
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
                  form.defaultSubscriptionPlanId === plan.id
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
                          form.defaultSubscriptionPlanId === plan.id
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300 hover:border-gray-400'
                        ]"
                      >
                        <div v-if="form.defaultSubscriptionPlanId === plan.id" class="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <h4 class="font-bold text-gray-900 text-base flex items-center gap-2">
                          {{ plan.name }}
                          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase">
                            {{ plan.planType || 'Standard' }}
                          </span>
                        </h4>
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
                        form.defaultSubscriptionPlanId === plan.id && form.defaultBillingCycle === cycle
                          ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      ]"
                    >
                      <p class="text-[10px] font-bold uppercase tracking-wider">{{ cycle }}</p>
                      <p class="text-sm font-black">{{ form.currency }} {{ priceInfo.price }}</p>
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
                  <span>Plan</span>
                  <span class="text-white font-medium">{{ form.defaultSubscriptionPlanName || 'Not Selected' }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-400">
                  <span>Billing Cycle</span>
                  <span class="text-white font-medium">{{ form.defaultBillingCycle || 'Not Selected' }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-400">
                  <span>Unit Price</span>
                  <span class="text-white font-medium">{{ form.currency }} {{ selectedPlanPrice }}</span>
                </div>
                <div class="flex justify-between items-center text-gray-400">
                  <span>Subscriber Quota</span>
                  <span class="text-white font-medium">{{ form.subscriberQuota }}</span>
                </div>
                
                <div class="border-t border-gray-800 my-4 pt-4">
                  <div class="flex justify-between items-end">
                    <div>
                      <p class="text-xs text-gray-400 mb-1">Total Amount Due</p>
                      <p class="text-2xl font-black text-primary-400">{{ form.currency }} {{ _currency(totalAmount) }}</p>
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
                    <span class="text-gray-200">{{ standardDateFormat(formattedEndDate)  }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            :disabled="loading || !form.defaultSubscriptionPlanId || !form.defaultBillingCycle || form.defaultSubscriptionPlanId === generateEmptyGuid()"
            class="rounded-md bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
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
import { ref, reactive, onMounted, computed } from 'vue'
import { getSubscriptionPlans } from '~/services/subscriptionPlans'
import type { SubscriptionPlan } from '~/models'

// Define Props
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});

// Define Emits
const emit = defineEmits(['close', 'save']);

// Wizard State
const currentStep = ref(1);
const plans = ref<SubscriptionPlan[]>([]);
const loadingPlans = ref(false);
const selectedPlanPrice = ref(0);

// Form State
const form = reactive({
  name: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  billingEmail: '',
  subscriberQuota: 1,
  defaultSubscriptionPlanId: generateEmptyGuid(),
  defaultSubscriptionPlanName: '',
  defaultBillingCycle: '',
  subscriptionStartDate: new Date().toISOString().split('T')[0],
  currency: 'GHS',
  subAccountEnabled: false,
});

// Computed Properties
const totalAmount = computed(() => {
  return (selectedPlanPrice.value * form.subscriberQuota).toFixed(2);
});

const calculateEndDate = (startDate: string, cycle: string) => {
  if (!startDate || !cycle) return null;
  const date = new Date(startDate);
  
  switch (cycle.toLowerCase()) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
    case '3 months':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'half-yearly':
    case 'half yearly':
    case '6 months':
      date.setMonth(date.getMonth() + 6);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      return null;
  }
  return date;
};

const formattedEndDate = computed(() => {
  const endDate = calculateEndDate(form.subscriptionStartDate, form.defaultBillingCycle);
  return endDate ? endDate.toISOString().split('T')[0] : 'N/A';
});

// Fetch Plans
const fetchPlans = async () => {
  loadingPlans.value = true;
  try {
    const result = await getSubscriptionPlans({ pageSize: 100 });
    plans.value = result.data || [];
  } catch (error) {
    console.error('Error fetching plans:', error);
  } finally {
    loadingPlans.value = false;
  }
};

// Next Step
const nextStep = () => {
  if (form.name && form.contactEmail && form.contactName) {
    currentStep.value = 2;
    if (plans.value.length === 0) {
      fetchPlans();
    }
  }
};

// Select Plan
const selectPlan = (plan: SubscriptionPlan) => {
  form.defaultSubscriptionPlanId = plan.id;
  form.defaultSubscriptionPlanName = plan.name;
  form.defaultBillingCycle = '';
  selectedPlanPrice.value = 0;
};

const selectPlanAndCycle = (plan: SubscriptionPlan, cycle: string) => {
  form.defaultSubscriptionPlanId = plan.id;
  form.defaultSubscriptionPlanName = plan.name;
  form.defaultBillingCycle = cycle;
  selectedPlanPrice.value = plan.pricing[cycle]?.price || 0;
};

// Handle Submit
const handleSubmit = () => {
  if (form.defaultSubscriptionPlanId && form.defaultBillingCycle && form.defaultSubscriptionPlanId !== generateEmptyGuid()) {

    let invoiceNo = `GNP-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

    const finalPayload = {
      ...form,
      defaultSubscriptionPlanName: `${form.defaultSubscriptionPlanName} (${form.defaultBillingCycle})`,
      subscriptionEndDate: formattedEndDate.value,
      partnerInvoice: {
        billingCycle: form.defaultBillingCycle,
        invoiceNumber: invoiceNo,
        description: `Subscription Invoice for ${form.name} - ${form.defaultSubscriptionPlanName} (${form.defaultBillingCycle})`,
        unitPrice: selectedPlanPrice.value,
        invoiceAmount: parseFloat(totalAmount.value),
        balance: parseFloat(totalAmount.value),
        currency: form.currency,
        dueDate: form.subscriptionStartDate,
        status: 'Pending'
      }
    };

    emit('save', finalPayload);
  }
};

onMounted(() => {
});

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom scrollbar for plan list */
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
