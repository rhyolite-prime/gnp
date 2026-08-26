<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Coupons</h1>
        <p class="mt-2 text-sm text-gray-700">Manage Coupons</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Create Coupon
        </button>
      </div>
    </div>

     
    <!-- Filters Toggle -->
    <div class="flex justify-end mb-4">
      <button 
        @click="showFilters = !showFilters"
        type="button" 
        class="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <FunnelIcon class="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        Filters
      </button>
    </div>

    <!-- Filters -->
    <div v-show="showFilters" class="mb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 gap-x-4 bg-gray-50 p-4 rounded-lg animate-fadeIn">
      <!-- Search -->
      <div class="relative rounded-md shadow-sm">
         
        <input 
          type="text" 
          v-model="filters.couponCode" 
          class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
          placeholder="Coupon Code" 
        />
      </div>

      <div class="relative rounded-md shadow-sm">
        <input 
          type="date" 
          v-model="filters.expiry" 
          class="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
      </div>


      <!-- Filter Actions -->
      <div class="flex items-center gap-2">
        <button 
          @click="applyFilters" 
          type="button" 
          class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex-1"
        >
          Search
        </button>
        <button 
          @click="resetFilters" 
          type="button" 
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-1"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Coupons List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Coupon Code</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Target Audience</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discount</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Valid Till </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Usage</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="coupon in couponList" :key="coupon.id">
             
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {{ dateAndTimeFormat(coupon.createdAt) }} </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {{ coupon.code }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-if="coupon.userId !== generateEmptyGuid()"> {{ coupon.username }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" v-else> All Users </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> 
              {{ coupon.discount }}{{ coupon.discountAsPercentage === true ? '%' : ' (Flat)' }} 
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ dateAndTimeFormat(coupon.validTill) }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="coupon.status?.toLowerCase() === 'active'
                  ? 'bg-green-50 text-green-700 ring-green-600/20'
                  : coupon.status?.toLowerCase() === 'expired'
                  ? 'bg-red-50 text-red-700 ring-red-600/20'
                  : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'">
                {{ coupon.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {{coupon.usageCount}}/{{ coupon.usageQuota }} </td>
             
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button
                class="text-indigo-600 hover:text-indigo-800 mr-3"
                @click="editCoupon(coupon)"
              >
                Edit
              </button>
              <button
                class="text-red-600 hover:text-red-800"
                @click="delCoupon(coupon)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

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
                      {{ isEditing ? 'Edit Coupon' : 'Create Coupon' }}
                    </DialogTitle>
                    
                    <form @submit.prevent="saveCoupon" class="mt-6 space-y-6">
                      
                      <!-- Basic Info -->
                      <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div class="sm:col-span-3">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Coupon Code</label>
                          <input type="text" v-model="form.code" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>

                        <div class="sm:col-span-3">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Discount Value</label>
                          <div class="flex gap-2">
                             <input type="text" v-model="form.discount" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                             <div class="flex items-center">
                                <input type="checkbox" v-model="form.discountAsPercentage" class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
                                <label class="ml-2 block text-sm text-gray-900">%</label>
                             </div>
                          </div>
                        </div>

                        <div class="sm:col-span-3">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Valid Till</label>
                           <input type="datetime-local" v-model="form.validTill" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>

                        <div class="sm:col-span-3">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Usage Quota</label>
                           <input type="number" v-model="form.usageQuota" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>

                        <div class="sm:col-span-6">
                            <label class="block text-sm font-medium leading-6 text-gray-900">Target User (Select a user or leave empty for all)</label>
                            <VueMultiselect
                              v-model="selectedUser"
                              :options="userList"
                              :multiple="false"
                              :searchable="true"
                              :internal-search="false"
                              :loading="isSearchingUsers"
                              @search-change="onUserSearch"
                              placeholder="Search for a user..."
                              label="email"
                              track-by="id"
                              class="multiselect-custom mt-2"
                            >
                              <template #noResult>
                                <span class="text-gray-500 text-sm">No users found for this query.</span>
                              </template>
                              <template #option="{ option }">
                                <div class="flex flex-col">
                                  <span class="font-medium text-gray-900">{{ option.firstName }} {{ option.lastName }}</span>
                                  <span class="text-xs text-gray-500">{{ option.email }}</span>
                                </div>
                              </template>
                            </VueMultiselect>
                        </div>

                        <div class="sm:col-span-6">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                          <textarea v-model="form.description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>

                      <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button type="submit" :disabled="isSaving" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50">
                          {{ isSaving ? 'Saving...' : (isEditing ? 'Update Coupon' : 'Create Coupon') }}
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
    <!-- Delete Confirmation Modal -->
    <TransitionRoot as="template" :show="isDeleteModalOpen">
      <Dialog as="div" class="relative z-10" @close="closeDeleteModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Delete Coupon</DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete coupon <span class="font-bold text-gray-900">{{ couponToDelete?.code }}</span>? This action cannot be undone and will permanently remove it from our servers.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" @click="confirmDelete">Delete</button>
                  <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="closeDeleteModal">Cancel</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { EnvelopeIcon, BellAlertIcon, MagnifyingGlassIcon, FunnelIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { isEmpty, debounce } from "lodash-es";
import type { Coupon, AdminUser, GnpUser } from "~/models";
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Coupons | Graphic News Plus'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  status: '',
  expiry: '',
  couponCode: '',
  pageNo: 1,
  pageSize: 10,

});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const couponList = ref<Coupon[]>([]);

const isShimmerLoading = ref(true);
const isEditing = ref(false)

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedCoupons()
}

const getPaginatedCoupons = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getCoupons(filters);

        couponList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch coupons !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


// Filters
const showFilters = ref(false)


// Temporary filter models (for inputs)
const tempSearchQuery = ref('')
const tempSelectedStatus = ref('all')
const tempSelectedChannel = ref('all')

const applyFilters = () => {
  filters.couponCode = tempSearchQuery.value;
  filters.status = tempSelectedStatus.value;
  filters.pageNo = 1;
  getPaginatedCoupons();
}

const resetFilters = () => {
  tempSearchQuery.value = ''
  tempSelectedStatus.value = 'all'
  tempSelectedChannel.value = 'all'
  applyFilters()
}


const isModalOpen = ref(false)
const isSaving = ref(false)
const isDeleteModalOpen = ref(false)
const couponToDelete = ref<Coupon | null>(null)
const userList = ref<GnpUser[]>([])
const selectedUser = ref<GnpUser | null>(null)
const isSearchingUsers = ref(false)

const onUserSearch = debounce(async (query: string) => {
  if (!query) return
  isSearchingUsers.value = true
  try {
    const result = await getUsers({ query, pageNo: 1, pageSize: 15 })
    userList.value = result.data
  } catch (error) {
    console.error('Failed to search users', error)
  } finally {
    isSearchingUsers.value = false
  }
}, 300)

watch(selectedUser, (newVal) => {
  if (newVal) {
    form.value.userId = newVal.id
    form.value.username = `${newVal.firstName} ${newVal.lastName}`
  } else {
    form.value.userId = "*"
    form.value.username = ""
  }
})

const form = ref({
  id: '',
  code: '',
  username: '',
  userId: "*",
  discount: "",
  description: "",
  validTill: "",
  usageQuota: 0,
  discountAsPercentage: false,
})

const openCreateModal = () => {
  isEditing.value = false
  selectedUser.value = null
  form.value = {
    id: '',
    code: '',
    username: '',
    userId: "*",
    discount: "",
    description: "",
    validTill: "",
    usageQuota: 0,
    discountAsPercentage: false,
  }
  isModalOpen.value = true
}

const editCoupon = (coupon: Coupon) => {
  isEditing.value = true
  
  if (coupon.userId && coupon.userId !== "*") {
    selectedUser.value = {
      id: coupon.userId,
      firstName: coupon.username || 'Selected',
      lastName: '',
      email: '',
      createdAt: ''
    } as GnpUser
  } else {
    selectedUser.value = null
  }

  form.value = {
    id: coupon.id,
    code: coupon.code,
    username: coupon.username,
    userId: coupon.userId,
    discount: coupon.discount,
    description: coupon.description,
    validTill: coupon.validTill ? new Date(new Date(coupon.validTill).getTime() - new Date(coupon.validTill).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '',
    usageQuota: coupon.usageQuota,
    discountAsPercentage: coupon.discountAsPercentage,
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveCoupon = async () => {
   
  isSaving.value = true;

  try {
    if (isEditing.value) {
      await updateCoupon(form.value);
      $toast.success('Coupon updated successfully');
    } else {
      await createCoupon(form.value);
      $toast.success('Coupon created successfully');
    }
    
    isModalOpen.value = false;
    await getPaginatedCoupons();
  } catch (error) {
    console.error('Failed to save coupon', error)
    $toast.error('Failed to save coupon. Please try again.')
  }
  finally {
    isSaving.value = false;
  }
}

 

const delCoupon = (coupon: Coupon) => {
  couponToDelete.value = coupon
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  couponToDelete.value = null
}

const confirmDelete = async () => {
  if (!couponToDelete.value) return;

  try {
    await deleteCoupon({ id: couponToDelete.value.id });
    $toast.success('Coupon deleted successfully');
    await getPaginatedCoupons();
  } catch (error) {
    console.error('Failed to delete coupon', error);
    $toast.error('Failed to delete coupon');
  } finally {
    closeDeleteModal();
  }
};

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedCoupons();
  }, 300); // 300ms delay


  watch(() => filters.couponCode, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedCoupons();

  });
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>