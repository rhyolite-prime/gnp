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
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Platform/Website</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Applied</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="application in applications" :key="application.id">
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
            <div class="font-medium text-gray-900">{{ application.name }}</div>
            <div class="text-gray-500">{{ application.email }}</div>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <a :href="application.website" target="_blank" class="text-primary-600 hover:text-primary-900">{{ application.website }}</a>
            <div class="text-xs text-gray-400 mt-0.5">{{ application.platformType }}</div>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ application.dateApplied }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800">
              Pending
            </span>
          </td>
          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
            <button @click="approveApplication(application.id)" class="text-green-600 hover:text-green-900 font-medium">Approve</button>
            <span class="text-gray-300">|</span>
            <button @click="rejectApplication(application.id)" class="text-red-600 hover:text-red-900 font-medium">Reject</button>
            <span class="text-gray-300">|</span>
            <button @click="archiveApplication(application.id)" class="text-gray-600 hover:text-gray-900 font-medium">Archive</button>
            <span class="text-gray-300">|</span>
            <button @click="deleteApplication(application.id)" class="text-gray-600 hover:text-gray-900 font-medium">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="applications.length === 0" class="p-12 text-center">
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

const affiliateList = ref<Coupon[]>([]);

const isShimmerLoading = ref(true);
const isEditing = ref(false)

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedAffiliateApplicants()
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
 

const applications = ref([
  {
    id: 1,
    name: 'Samuel Osei',
    email: 'samuel.osei@example.com',
    website: 'https://ghanalatestnews.com',
    platformType: 'News Blog',
    dateApplied: '2 hours ago',
  },
  {
    id: 2,
    name: 'Beauty Trends GH',
    email: 'contact@beautytrends.gh',
    website: 'https://instagram.com/beautytrendsgh',
    platformType: 'Social Media (Instagram)',
    dateApplied: '5 hours ago',
  },
  {
    id: 3,
    name: 'Tech Insights',
    email: 'info@techinsights.com',
    website: 'https://youtube.com/c/techinsights',
    platformType: 'YouTube Channel',
    dateApplied: '1 day ago',
  },
])

const approveApplication = (id: number) => {
  // In a real app, this would make an API call
  applications.value = applications.value.filter(app => app.id !== id)
  // toast.success('Application approved successfully')
}

const rejectApplication = (id: number) => {
  // In a real app, this would make an API call
  if(confirm('Are you sure you want to reject this application?')) {
    applications.value = applications.value.filter(app => app.id !== id)
    // toast.success('Application rejected')
  }
}
</script>
