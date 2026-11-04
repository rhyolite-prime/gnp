<template>
  <div class="sm:flex sm:items-center sm:justify-between mb-8">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Affiliate Applications</h1>
      <p class="mt-2 text-sm text-gray-700">Review and manage incoming affiliate applications.</p>
    </div>
  </div>

  <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Applicant</th>
           
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Applied</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="application in affiliateList" :key="application.id">
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
            <div class="font-medium text-gray-900">{{ application.firstName }} {{ application.lastName }}</div>
            <div class="text-gray-500">{{ application.email }}</div>
          </td>
           
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ application.dateApplied }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <span
              class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
              :class="getStatusBadgeClass(application.status)"
            >
              {{ getStatusLabel(application.status) }}
            </span>
          </td>
          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
            <button @click="changeApplicantStatus(application.id, 11)" class="text-green-600 hover:text-green-900 font-medium">Approve</button>
            <span class="text-gray-300">|</span>
            <button @click="changeApplicantStatus(application.id, 17)" class="text-red-600 hover:text-red-900 font-medium">Reject</button>
            <span class="text-gray-300">|</span>
            <button @click="changeApplicantStatus(application.id, 2)" class="text-gray-600 hover:text-gray-900 font-medium">Archive</button>
            <span class="text-gray-300">|</span>
            <button @click="delApplication(application.id)" class="text-gray-600 hover:text-gray-900 font-medium">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
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
    
    <div v-if="affiliateList.length === 0" class="p-12 text-center">
      <div class="mx-auto h-12 w-12 text-gray-400">
        <InboxIcon class="h-12 w-12" />
      </div>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No pending applications</h3>
      <p class="mt-1 text-sm text-gray-500">You're all caught up!</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { InboxIcon } from '@heroicons/vue/24/outline'
import type { Affiliate } from "~/models";

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

useHead({
  title: 'Applications | Graphic News Plus'
})

const router = useRouter();
const route = useRoute();

const filters = reactive({
  sortBy: '',
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

const affiliateList = ref<Affiliate[]>([]);

const isShimmerLoading = ref(true);
const applicantToDeleteId = ref('');
const isLoading = ref(false);
const isEditing = ref(false);

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedAffiliateApplicants()
}

const STATUS = {
  PENDING: 20,
  APPROVED: 11,
  REJECTED: 17,
  ARCHIVED: 2,
} as const

const getStatusLabel = (status: number): string => {
  switch (status) {
    case STATUS.PENDING: return 'Pending'
    case STATUS.APPROVED: return 'Approved'
    case STATUS.REJECTED: return 'Rejected'
    case STATUS.ARCHIVED: return 'Archived'
    default: return 'Unknown'
  }
}

const getStatusBadgeClass = (status: number): string => {
  switch (status) {
    case STATUS.PENDING:  return 'bg-yellow-100 text-yellow-800'
    case STATUS.APPROVED: return 'bg-green-100 text-green-800'
    case STATUS.REJECTED: return 'bg-red-100 text-red-800'
    case STATUS.ARCHIVED: return 'bg-gray-100 text-gray-800'
    default:              return 'bg-gray-100 text-gray-800'
  }
}

const getPaginatedAffiliateApplicants = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getAffiliateApplicants(filters);

        affiliateList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch affiliate applications!');
    } finally {
        isShimmerLoading.value = false;
    }

}
 
 
const changeApplicantStatus = async(id: string, status: number) => {

  isLoading.value = false;

  try {

        let success = await updateAffiliateAccountStatus(id, status);

        if (success) {
          $toast.success('Affiliate status updated successfully');
        }

    } catch (error) {
        $toast.error('Unable to change applicant status!');
    } finally {
    isLoading.value = false;
    await getPaginatedAffiliateApplicants();
    }
  
}


const delApplication = (id: string) => {
  applicantToDeleteId.value = id
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  applicantToDeleteId.value = null
}

const confirmDelete = async () => {
  if (!applicantToDeleteId.value) return;

  try {
    await deleteAffiliate(applicantToDeleteId);
    $toast.success('Affiliate deleted successfully');
    await getPaginatedAffiliateApplicants();
  } catch (error) {
    console.error('Failed to delete affiliate record', error);
    $toast.error('Failed to delete affiliate record');
  } finally {
    closeDeleteModal();
  }
};

onMounted(async () => {
  
  await getPaginatedAffiliateApplicants();
})
</script>
