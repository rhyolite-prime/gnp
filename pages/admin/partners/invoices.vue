<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Partner Invoices</h1>
        <p class="mt-2 text-sm text-gray-700"> Manage and monitor all commercial partner billing, invoices and payments. </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ArrowDownTrayIcon class="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          Export Report
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg bg-blue-100">
            <component :is="BanknotesIcon" class="h-6 w-6 text-blue-600" />
          </div>
           
        </div>
        <h3 class="text-sm font-medium text-gray-500">Total Invoiced</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="invoiceStats?.totalInvoiced" :duration="2" :options="{ prefix:  'GHS ', suffix: '', decimalPlaces: 2 }" />
        </p>
      </div>


      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg bg-green-100">
            <component :is="CheckCircleIcon" class="h-6 w-6 text-green-600" />
          </div>
           
        </div>
        <h3 class="text-sm font-medium text-gray-500">Total Paid</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="invoiceStats?.totalPaid" :duration="2" :options="{ prefix:  'GHS ', suffix: '', decimalPlaces: 2 }" />
        </p>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg bg-yellow-100">
            <component :is="ClockIcon" class="h-6 w-6 text-yellow-600" />
          </div>
           
        </div>
        <h3 class="text-sm font-medium text-gray-500">Pending Invoices</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="invoiceStats?.pendingInvoices" :duration="2" :options="{ prefix:  'GHS ', suffix: '', decimalPlaces: 2 }" />
        </p>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 rounded-lg bg-red-100">
            <component :is="ExclamationCircleIcon" class="h-6 w-6 text-red-600" />
          </div>
           
        </div>
        <h3 class="text-sm font-medium text-gray-500">Overdue Amount</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">
          <count-up :end-val="invoiceStats?.overdueAmount" :duration="2" :options="{ prefix:  'GHS ', suffix: '', decimalPlaces: 2 }" />
        </p>
      </div>
       
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
      <div class="w-full sm:max-w-xs">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            v-model="filters.query"
            class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 transition-all duration-200"
            placeholder="Search Partner or Invoice #"
          />
        </div>
      </div>
      <div class="flex gap-2">
        <select v-model="filters.status" class="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
    </div>

    <!-- Invoices List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <div v-if="isShimmerLoading" class="animate-pulse">
        <div class="h-10 bg-gray-50 border-b border-gray-200"></div>
        <div v-for="i in 5" :key="i" class="h-16 bg-white border-b border-gray-100"></div>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Created</th>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Invoice #</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Partner</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="(invoice, index) in invoiceList" :key="invoice.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ longDateAndTimeFormat(invoice.createdAt) }}
            </td>
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="font-medium text-primary-600">#{{ invoice.invoiceNumber }}</div>
              <div class="text-xs text-gray-400">{{ invoice.billingCycle }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <div class="text-gray-900 font-medium">{{ invoice.partnerName }}</div>
              <div class="text-xs text-gray-500">{{ invoice.partnerEmail }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">
              {{ invoice.currency }} {{ _currency(invoice.invoiceAmount) }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span :class="isOverdue(invoice.dueDate) && invoice.status === 'Pending' ? 'text-red-600 font-medium' : ''">
                {{ standardDateFormat(invoice.dueDate) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span 
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-all"
                :class="statusClass(invoice.status)"
              >
                <div class="w-1 h-1 rounded-full mr-1.5" :class="statusDotClass(invoice.status)"></div>
                {{ invoice.status }}
              </span>
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="relative dropdown-container">
                <button 
                  @click.stop="toggleDropdown(invoice.id)" 
                  class="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  <EllipsisVerticalIcon class="h-5 w-5" />
                </button>
                <!-- Dropdown Menu -->
                <div 
                  v-if="activeDropdownId === invoice.id" 
                  class="absolute right-0 w-48 bg-white rounded-xl shadow-xl z-50 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-100"
                  :class="index > invoiceList.length - 4 ? 'bottom-full mb-2' : 'top-full mt-2'"
                >
                  <div class="py-2">
                    <button 
                      v-if="invoice.status === 'Pending'"
                      @click="initMarkAsPaid(invoice)"
                      class="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <CheckCircleIcon class="h-4 w-4 mr-2" />
                      Mark as Paid
                    </button>
                    <button 
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <EyeIcon class="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    <button 
                      class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
                      Download PDF
                    </button>
                    <div class="h-px bg-gray-100 my-1"></div>
                    <button 
                      @click="handleDeleteInvoice(invoice.id)"
                      class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon class="h-4 w-4 mr-2" />
                      Delete Invoice
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!isShimmerLoading && invoiceList.length === 0" class="py-20 text-center">
        <div class="mx-auto h-16 w-16 text-gray-300 mb-4">
          <BanknotesIcon class="h-16 w-16" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900">No invoices found</h3>
        <p class="text-sm text-gray-500">Try adjusting your search or filters.</p>
      </div>

      <!-- Pagination -->
      <client-only>
        <SimplePagination 
          :lower-bound="paginationParams.lowerBound"
          :upper-bound="paginationParams.upperBound"
          @on-page-changed="onPageChange"
          :page-no="filters.pageNo" 
          :total-pages="paginationParams.totalPages"
          :total-count="paginationParams.totalCount" 
          :disabled="isShimmerLoading" 
        />
      </client-only>
    </div>

    <!-- Mark as Paid Confirmation Modal -->
    <ConfirmModal 
      :show="showPaidModal"
      title="Confirm Payment"
      :message="`Are you sure you want to mark invoice #${selectedInvoice?.invoiceNumber} for ${selectedInvoice?.partnerName} as paid? This will update the balance to zero and record the current date as the payment date.`"
      confirm-text="Confirm Payment"
      cancel-text="Cancel"
      type="success"
      :loading="isUpdatingStatus"
      @confirm="handleMarkAsPaid"
      @cancel="showPaidModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal 
      :show="showDeleteModal"
      title="Delete Invoice"
      message="Are you sure you want to delete this invoice? This action cannot be undone."
      confirm-text="Delete Invoice"
      cancel-text="Cancel"
      type="danger"
      :loading="isDeleting"
      @confirm="confirmDeleteInvoice"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  BanknotesIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  TrashIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'
import CountUp from 'vue-countup-v3'
import { isEmpty, debounce } from "lodash-es";
import type { PartnerInvoice, PartnerInvoiceStat } from "~/models";

const { $toast } = useNuxtApp();

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Partner Invoices | Graphic News Plus'
})

const router = useRouter();
const route = useRoute();

// State
const isShimmerLoading = ref(true);
const isUpdatingStatus = ref(false);
const isDeleting = ref(false);
const activeDropdownId = ref<string | null>(null);
const showPaidModal = ref(false);
const showDeleteModal = ref(false);
const selectedInvoice = ref<PartnerInvoice | null>(null);
const invoiceToDeleteId = ref<string | null>(null);

const filters = reactive({
  query: '',
  status: '',
  pageNo: 1,
  pageSize: 10,
});

const paginationParams = reactive({
  totalPages: 0,
  totalCount: 0,
  lowerBound: 0,
  upperBound: 0
});

const invoiceList = ref<PartnerInvoice[]>([]);
const invoiceStats = ref<PartnerInvoiceStat>();

// Methods
const fetchInvoices = async () => {
  isShimmerLoading.value = true;
  try {
    const result = await getPartnerInvoices(filters);
    invoiceList.value = result.data;
    paginationParams.totalPages = result.totalPages;
    paginationParams.totalCount = result.totalCount;
    paginationParams.lowerBound = result.lowerBound;
    paginationParams.upperBound = result.upperBound;

  } catch (error) {
    $toast.error('Unable to fetch partner invoices');
  } finally {
    isShimmerLoading.value = false;
  }
};

const fetchPartnerInvoiceStats = async () => {

  try {

    invoiceStats.value = await getPartnerInvoiceStats();

  } catch (error) {
    $toast.error('Unable to fetch partner invoice stats');
  } finally {
  }
};






const onPageChange = async (pageNumber: number) => {
  filters.pageNo = pageNumber;
  const filteredQuery = filterQueryParams({ ...route.query, ...filters });
  router.replace({ name: route.name ?? '', query: filteredQuery });
  await fetchInvoices();
}

const toggleDropdown = (id: string) => {
  activeDropdownId.value = activeDropdownId.value === id ? null : id;
};

const initMarkAsPaid = (invoice: PartnerInvoice) => {
  selectedInvoice.value = invoice;
  showPaidModal.value = true;
  activeDropdownId.value = null;
};

const handleMarkAsPaid = async () => {
  if (!selectedInvoice.value) return;
  isUpdatingStatus.value = true;
  try {
    const success = await markPartnerInvoiceAsPaid(selectedInvoice.value.id);
    if (success) {
      $toast.success('Invoice marked as paid successfully');
      showPaidModal.value = false;
      await fetchInvoices();
    }
  } catch (error) {
    $toast.error('Failed to update invoice status');
  } finally {
    isUpdatingStatus.value = false;
  }
};

const handleDeleteInvoice = (id: string) => {
  invoiceToDeleteId.value = id;
  showDeleteModal.value = true;
  activeDropdownId.value = null;
};

const confirmDeleteInvoice = async () => {
  if (!invoiceToDeleteId.value) return;
  isDeleting.value = true;
  try {
    const success = await deletePartnerInvoice(invoiceToDeleteId.value);
    if (success) {
      $toast.success('Invoice deleted successfully');
      showDeleteModal.value = false;
      await fetchInvoices();
    }
  } catch (error) {
    $toast.error('Failed to delete invoice');
  } finally {
    isDeleting.value = false;
  }
};

const statusClass = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-50 text-green-700 ring-green-600/20';
    case 'Pending': return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
    case 'Overdue': return 'bg-red-50 text-red-700 ring-red-600/20';
    default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
  }
};

const statusDotClass = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-500';
    case 'Pending': return 'bg-yellow-500';
    case 'Overdue': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

// Search & Watchers
const debouncedSearch = debounce(() => {
  filters.pageNo = 1;
  fetchInvoices();
}, 500);

watch(() => filters.query, debouncedSearch);
watch(() => filters.status, () => {
  filters.pageNo = 1;
  fetchInvoices();
});

onMounted(() => {
  if (!isEmpty(route.query)) {
    if (route.query.pageNo) filters.pageNo = parseInt(route.query.pageNo as string);
    if (route.query.status) filters.status = route.query.status as string;
    if (route.query.query) filters.query = route.query.query as string;
  }
  fetchInvoices();
  fetchPartnerInvoiceStats();

  document.addEventListener('click', (e: any) => {
    if (!e.target.closest('.dropdown-container')) {
      activeDropdownId.value = null;
    }
  });
});
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Custom transitions */
.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity 0.3s ease;
}
.fade-in-enter-from, .fade-in-leave-to {
  opacity: 0;
}
</style>
