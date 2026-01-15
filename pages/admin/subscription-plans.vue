<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Subscription Plans</h1>
        <p class="mt-2 text-sm text-gray-700">Manage subscription tiers, pricing models, and content access rules.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Create New Plan
        </button>
      </div>
    </div>

    <!-- Plans List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pricing Summary</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="plan in subscriptionPlanList" :key="plan.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="font-medium text-gray-900">{{ plan.name }}</div>
              <div class="text-gray-500 truncate max-w-xs">{{ plan.description }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 capitalize">{{ plan.planType }}</span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
              <div
                v-if="plan.pricing"
                class="flex flex-col gap-1"
              >
                <span class="font-medium text-gray-900">
                  From GHS {{ getPricingSummary(plan.pricing).lowestPrice }}
                </span>

                <span class="text-xs text-gray-500">
                  {{ getPricingSummary(plan.pricing).count }} plans
                </span>

                <span
                  v-if="getPricingSummary(plan.pricing).maxSave > 0"
                  class="inline-flex w-fit items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                >
                  Save up to {{ getPricingSummary(plan.pricing).maxSave }}%
                </span>
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button @click="viewPlanDetails(plan)" class="text-primary-600 hover:text-primary-900 mr-4">View Details</button>
              <button @click="editPlan(plan)" class="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
              <button class="text-red-600 hover:text-red-900" @click="deletePlan(plan)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <client-only>
        <SimplePagination :lower-bound="paginationParams.lowerBound" 
        :upper-bound="paginationParams.upperBound"
        @on-page-changed="onPageChange"
        :page-no="filters.pageNo " 
        :total-pages="paginationParams.totalPages"
        :total-count="paginationParams.totalCount" 
        :disabled="isShimmerLoading" />
      </client-only>

    </div>

    <!-- Create/Edit Modal -->
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog as="div" class="relative z-10" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div class="mt-3 text-center sm:mt-5 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      {{ isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan' }}
                    </DialogTitle>
                    
                    <form @submit.prevent="savePlan" class="mt-6 space-y-6">
                      
                      <!-- Basic Info -->
                      <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Plan Name</label>
                          <input type="text" v-model="form.name" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>

                        <div class="sm:col-span-2">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Plan Type</label>
                          <select v-model="form.planType" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
                            <option value="regular">Regular</option>
                            <option value="bundle">Bundle</option>
                          </select>
                        </div>

                        <div class="sm:col-span-6">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                          <textarea v-model="form.description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>

                      <!-- Pricing Builder (JSONB) -->
                      <div class="border-t border-gray-200 pt-4">
                        <div class="flex items-center justify-between mb-2">
                          <label class="text-sm font-medium leading-6 text-gray-900">Pricing Configuration</label>
                          <button type="button" @click="addPricingTier" class="text-xs font-semibold text-primary-600 hover:text-primary-500 flex items-center">
                            <PlusIcon class="h-3 w-3 mr-1" /> Add Tier
                          </button>
                        </div>
                        <div class="space-y-3 bg-gray-50 p-3 rounded-lg">
                          <div v-for="(tier, index) in form.pricing" :key="index" class="flex gap-3 items-start">
                            <div class="flex-1">
                              <select v-model="tier.duration" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                              </select>
                            </div>
                            <div class="flex-1 relative rounded-md shadow-sm">
                              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span class="text-gray-500 sm:text-sm">₵</span>
                              </div>
                              <input type="number" v-model="tier.amount" placeholder="Amount" class="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                            </div>
                            <button type="button" @click="removePricingTier(index)" class="text-gray-400 hover:text-red-500 mt-2">
                              <TrashIcon class="h-5 w-5" />
                            </button>
                          </div>
                          <p v-if="form.pricing.length === 0" class="text-sm text-gray-500 italic text-center py-2">No pricing tiers configured.</p>
                        </div>
                      </div>

                      <!-- Target Publications (JSONB) -->
                      <div class="border-t border-gray-200 pt-4">
                        <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">Target Publications (Access Control)</label>
                        <VueMultiselect
                          v-model="form.targetPublications"
                          :options="publicationOptions"
                          :multiple="true"
                          :close-on-select="false"
                          placeholder="Select accessible publications"
                          label="name"
                          track-by="id"
                          class="multiselect-custom"
                        >
                        </VueMultiselect>
                        <p class="mt-1 text-xs text-gray-500">Leave empty for "All Access" based on plan type logic.</p>
                      </div>

                      <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button type="submit" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2">
                          {{ isEditing ? 'Update Plan' : 'Create Plan' }}
                        </button>
                        <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" @click="closeModal">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- View Details Modal -->
    <TransitionRoot as="template" :show="isViewDetailsOpen">
      <Dialog as="div" class="relative z-10" @close="closeViewDetails">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-6 pb-6 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <DialogTitle class="text-lg font-semibold text-gray-900 mb-4">
                  Subscription Plan Details
                </DialogTitle>

                <div v-if="selectedPlan" class="space-y-5">
                  <!-- Plan Info -->
                  <div>
                    <p class="text-sm text-gray-500">Plan Name</p>
                    <p class="text-base font-medium text-gray-900">
                      {{ selectedPlan.name }}
                    </p>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ selectedPlan.description }}
                    </p>
                  </div>

                  <!-- Pricing Breakdown -->
                  <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">
                      Pricing Breakdown
                    </p>

                    <div class="divide-y divide-gray-200 rounded-md border border-gray-200">
                      <div
                        v-for="(tier, duration) in selectedPlan.pricing"
                        :key="duration"
                        class="flex items-center justify-between px-4 py-3"
                      >
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            {{ duration }}
                          </p>
                          <p
                            v-if="tier.savePercentage > 0"
                            class="text-xs text-green-600"
                          >
                            Save {{ tier.savePercentage }}%
                          </p>
                        </div>

                        <p class="text-sm font-semibold text-gray-900">
                          GHS {{ tier.price }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    @click="closeViewDetails"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    
    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :show="isDeleteModalOpen"
      title="Delete Subscription Plan"
      :message="`Are you sure you want to delete the plan '${planToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete Plan"
      type="danger"
      :loading="isDeletingPlan"
      @confirm="confirmDeletePlan"
      @cancel="closeDeleteModal"
    />

  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ConfirmModal from '~/components/ConfirmModal.vue'
import CountUp from 'vue-countup-v3'
import { isEmpty, debounce } from "lodash-es";
import type { SubscriptionPlan } from "~/models";
const { $toast } = useNuxtApp();
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Subscriptions | Graphic News Plus'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  query: '',
  pageNo: 1,
  pageSize: 10,

});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});


const subscriptionPlanList = ref<SubscriptionPlan[]>([]);

const isShimmerLoading = ref(true);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedSubscriptionPlans()
}

const getPaginatedSubscriptionPlans = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getSubscriptionPlans(filters);

        subscriptionPlanList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch payments !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

const getPricingSummary = (pricing: Record<string, { price: number; savePercentage: number }>) => {
  const entries = Object.values(pricing)

  const lowestPrice = Math.min(...entries.map(p => p.price))
  const maxSave = Math.max(...entries.map(p => p.savePercentage))
  const count = entries.length

  return {
    lowestPrice,
    maxSave,
    count
  }
}

const isViewDetailsOpen = ref(false)
const selectedPlan = ref<SubscriptionPlan | null>(null)

const viewPlanDetails = (plan: SubscriptionPlan) => {
  selectedPlan.value = plan
  isViewDetailsOpen.value = true
}

const closeViewDetails = () => {
  isViewDetailsOpen.value = false
  selectedPlan.value = null
}



const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedSubscriptionPlans();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedSubscriptionPlans();

  });



interface PricingTier {
  duration: string;
  amount: number | '';
}

interface Publication {
  id: string;
  name: string;
}

interface Plan {
  name: string;
  planType: string;
  description: string;
  pricing: PricingTier[];
  targetPublications: [];
}
 

const publicationOptions = [
  { id: 'p1', name: 'Daily Graphic' },
  { id: 'p2', name: 'The Mirror' },
  { id: 'p3', name: 'Graphic Showbiz' },
  { id: 'p4', name: 'Junior Graphic' },
]

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const form = ref<Plan>({
  name: '',
  planType: 'regular',
  description: '',
  pricing: [],
  targetPublications: []
})

// Delete State
const isDeleteModalOpen = ref(false)
const planToDelete = ref<SubscriptionPlan | null>(null)
const isDeletingPlan = ref(false)

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    planType: 'regular',
    description: '',
    pricing: [{ duration: 'Monthly', amount: '' }],
    targetPublications: []
  }
  isModalOpen.value = true
}

const editPlan = (plan: Plan) => {
  isEditing.value = true
  // Deep copy to avoid reactive edits before saving
  form.value = JSON.parse(JSON.stringify(plan))
  isModalOpen.value = true
}

const deletePlan = (plan: SubscriptionPlan) => {
  planToDelete.value = plan
  isDeleteModalOpen.value = true
}

const confirmDeletePlan = async () => {
  if (!planToDelete.value) return

  try {
    isDeletingPlan.value = true

    const isSuccessful = await deleteSubscriptionPlan({ id: planToDelete.value.id })

    if (isSuccessful) {
      $toast.success('Subscription plan deleted successfully')
      await getPaginatedSubscriptionPlans()
    }
  } catch (error) {
    $toast.error('Unable to delete subscription plan!')
  } finally {
    isDeletingPlan.value = false
    closeDeleteModal()
  }
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  planToDelete.value = null
}

const closeModal = () => {
  isModalOpen.value = false
}

const addPricingTier = () => {
  form.value.pricing.push({ duration: 'Monthly', amount: '' })
}

const removePricingTier = (index: number) => {
  form.value.pricing.splice(index, 1)
}

const savePlan = async () => {
  try {
    // Transform pricing array into API payload format
    const transformedPricing: Record<string, { price: number; savePercentage: number }> = {}

    // Sort tiers by amount (ascending) to compute savings logically
    const sortedTiers = [...form.value.pricing].sort(
      (a, b) => Number(a.amount) - Number(b.amount)
    )

    const basePrice = sortedTiers[0]?.amount
      ? Number(sortedTiers[0].amount)
      : 0

    sortedTiers.forEach((tier) => {
      const price = Number(tier.amount)

      const savePercentage =
        basePrice > 0 && price < basePrice
          ? 0
          : basePrice > 0
          ? Math.round(((basePrice - price) / basePrice) * 100 * -1)
          : 0

      transformedPricing[tier.duration] = {
        price,
        savePercentage: Math.max(0, savePercentage),
      }
    })

    const payload = {
      ...form.value,
      pricing: transformedPricing,
    }

    const isSuccessful = await createSubscriptionPlan(payload)

    if (isSuccessful) {
      $toast.success(
        isEditing.value
          ? 'Subscription plan updated successfully'
          : 'Subscription plan created successfully'
      )
      await getPaginatedSubscriptionPlans()
      closeModal()
    }
  } catch (error) {
    $toast.error('Unable to create subscription plan !')
  } finally {
    closeModal()
  }
}
</script>

<style>
.multiselect-custom .multiselect__tags {
  @apply min-h-[42px] border-gray-300 rounded-md pt-2;
}
.multiselect-custom .multiselect__option--highlight {
  @apply bg-primary-600;
}
.multiselect-custom .multiselect__option--highlight::after {
  @apply bg-primary-600;
}
</style>