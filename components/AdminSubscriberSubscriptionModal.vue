<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
    
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 shrink-0">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-200 shadow-sm">
            {{ subscriber?.firstName?.charAt(0) || 'S' }}
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 tracking-tight">{{ subscriber?.firstName }} {{ subscriber?.lastName }}</h3>
            <p class="text-sm text-slate-500 font-medium">{{ subscriber?.email }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1">
        
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 h-full">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin mb-4 shadow-sm"></div>
          <p class="text-sm font-bold text-slate-500 animate-pulse">Loading subscription details...</p>
        </div>
        
        <template v-else>
          <!-- Summary Section -->
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Subscription Summary</h4>
          
          <div class="bg-blue-50 rounded-2xl p-6 text-blue-900 border border-blue-100 shadow-inner mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="col-span-1 md:col-span-2">
                <div class="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">Current Package</div>
                <div class="text-3xl font-extrabold mb-3 tracking-tight text-blue-950">{{ currentSubscription.package }}</div>
                <div v-if="currentSubscription.package !== 'N/A'" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                  <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  Active
                </div>
              </div>
              
              <div class="flex flex-col justify-center space-y-4 md:border-l md:border-blue-200 md:pl-6">
                <div>
                  <div class="text-xs text-blue-500 font-medium mb-1">Activated On</div>
                  <div class="font-bold text-lg text-blue-900">{{ standardDateFormat(currentSubscription.activatedOn) }}</div>
                </div>

                <div>
                  <div class="text-xs text-blue-500 font-medium mb-1">Valid Until</div>
                  <div class="font-bold text-lg text-blue-900">{{ standardDateFormat(currentSubscription.validUntil) }}</div>
                </div>

                <div>
                  <div class="text-xs text-blue-500 font-medium mb-1">Days Remaining</div>
                  <div class="font-bold text-sm text-blue-900">{{ currentSubscription.daysRemaining }} days</div>
                </div>
              </div>
            </div>
          </div>

          <!-- History Section -->
          <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Renewal History</h4>
          
          <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white border-b-2 border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th class="px-5 py-4">Date</th>
                  <th class="px-5 py-4">Package</th>
                  <th class="px-5 py-4">Amount</th>
                  <th class="px-5 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="(record, index) in renewalHistory" :key="index" class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-5 py-4">
                    <div class="text-sm font-bold text-slate-900">{{ record.date }}</div>
                    <div class="text-xs text-slate-500 font-medium group-hover:text-primary-600 transition-colors">Ref: {{ record.reference }}</div>
                  </td>
                  <td class="px-5 py-4 text-sm text-slate-600 font-medium">
                    {{ record.package }}
                  </td>
                  <td class="px-5 py-4 text-sm font-bold text-slate-900">
                    {{ record.amount }}
                  </td>
                  <td class="px-5 py-4 text-right">
                    <span :class="[
                      'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold',
                      record.status === 'Successful' ? 'bg-green-50 text-green-600 border border-green-100' :
                      record.status === 'Failed' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-yellow-50 text-yellow-600 border border-yellow-100'
                    ]">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-if="renewalHistory.length === 0" class="px-6 py-10 text-center flex flex-col items-center">
              <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
                <ClockIcon class="w-6 h-6 text-slate-400" />
              </div>
              <p class="text-sm font-bold text-slate-900">No Renewal History</p>
              <p class="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">This subscriber hasn't had any renewals yet.</p>
            </div>
          </div>
        </template>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
        <button @click="$emit('close')" class="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95">
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
 
import { XMarkIcon, ClockIcon } from '@heroicons/vue/24/outline';
import type { Subscriber, PartnerSubscriberSubscriptionSummary } from "~/models";


const props = defineProps<{
  show: boolean;
  subscriber: Subscriber | null;
  partnerId: string;
}>();

defineEmits(['close']);

const isLoading = ref(false);
const subscriptionDetails = ref<PartnerSubscriberSubscriptionSummary | null>(null);

watch(() => props.show, async (newVal) => {
  if (newVal && props.subscriber && props.partnerId) {
    isLoading.value = true;
    try {
      subscriptionDetails.value = await getPartnerSubscriberInfo(props.partnerId, props.subscriber.id);
    } catch (e) {
      console.error(e);
      subscriptionDetails.value = null;
    } finally {
      isLoading.value = false;
    }
  } else {
    subscriptionDetails.value = null;
  }
});

const currentSubscription = computed(() => {
  if (subscriptionDetails.value?.subscriptionSummary) {
    return {
      package: subscriptionDetails.value.subscriptionSummary.package || 'N/A',
      activatedOn: subscriptionDetails.value.subscriptionSummary.activatedOn || 'N/A',
      validUntil: subscriptionDetails.value.subscriptionSummary.validUntil || 'N/A',
      daysRemaining: subscriptionDetails.value.subscriptionSummary.daysRemaining || 0,
      billingCycle: subscriptionDetails.value.subscriptionSummary.billingCycle || 'N/A'
    };
  }
  return {
    package: 'N/A',
    activatedOn: 'N/A',
    validUntil: 'N/A',
    daysRemaining: 0,
    billingCycle: 'N/A'
  };
});

const renewalHistory = computed(() => {
  if (subscriptionDetails.value?.renewalHistory) {
    return subscriptionDetails.value.renewalHistory;
  }
  return [];
});
</script>
