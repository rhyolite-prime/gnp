<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Publications</h1>
        <p class="mt-2 text-sm text-gray-700">Manage Publications</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Create Publication
        </button>
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
            class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search Publiation..."
          />
        </div>
      </div>
       
    </div>

    <!-- Publication List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price (GHS)</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">

          <tr v-for="publication in publicationList" :key="publication.id">
             
          
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {{ publication.name }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {{ publication.price }}</td>
           
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <span
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="publication.isActive ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'">
                {{ publication.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
             
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button
                class="text-indigo-600 hover:text-indigo-800 mr-3"
                @click="viewPublicationDetails(publication)"
              >
                Edit
              </button>
              <button
                class="text-red-600 hover:text-red-800"
                @click="delPublication(publication)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

       
 
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
                      {{ isEditing ? 'Edit Publication' : 'Create Publication' }}
                    </DialogTitle>
                    
                    <form @submit.prevent="savePublication" class="mt-6 space-y-6">
                      <!-- Basic Info -->
                      <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div class="sm:col-span-6">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Name <span class="text-red-500">*</span></label>
                          <input
                            type="text"
                            v-model="form.name"
                            required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            placeholder="Enter publication name"
                          />
                        </div>

                        <div class="sm:col-span-6">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                          <textarea
                            v-model="form.description"
                            rows="3"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            placeholder="Enter publication description"
                          />
                        </div>

                        <div class="sm:col-span-3">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Price (GHS) <span class="text-red-500">*</span></label>
                          <input
                            type="number"
                            v-model="form.price"
                            required
                            step="0.01"
                            min="0"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            placeholder="0.00"
                          />
                        </div>

                        <div class="sm:col-span-3">
                          <label class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                            <select
                              v-model="form.isActive"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            >
                              <option :value="true">Active</option>
                              <option :value="false">Inactive</option>
                            </select>
                        </div>
                      </div>

                      <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          :disabled="isSaving"
                          class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {{ isSaving ? 'Saving...' : (isEditing ? 'Update Publication' : 'Create Publication') }}
                        </button>
                        <button
                          type="button"
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          @click="closeModal"
                        >
                          Cancel
                        </button>
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
import type { Publication } from "~/models";
const { $toast } = useNuxtApp();


definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Publications | Graphic News Plus'
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

const publicationList = ref<Publication[]>([]);

const isShimmerLoading = ref(true);
const isEditing = ref(false)

const onPageChange = async (pageNumber: number) => {

	filters.pageNo = pageNumber;
	const filteredQuery = filterQueryParams({ ...route.query, ...filters });

	router.replace({ name: route.name ?? '', query: filteredQuery });
    await getPaginatedPublications()
}

const getPaginatedPublications = async () => {

    isShimmerLoading.value = true;

    try {

        let result = await getPublications(filters);

        publicationList.value = result.data;

        paginationParams.totalPages = result.totalPages;
        paginationParams.totalCount = result.totalCount;
        paginationParams.lowerBound = result.lowerBound;
        paginationParams.upperBound = result.upperBound;

    } catch (error) {
        $toast.error('Unable to fetch publications !');
    } finally {
        isShimmerLoading.value = false;
    }

 }


// Filters
const showFilters = ref(false)

const isModalOpen = ref(false)
const isSaving = ref(false)
const isDeleteModalOpen = ref(false)
const publicationToDelete = ref<Publications | null>(null)


const form = ref({
  id: '',
  name: '',
  isActive: false,
  description: "",
  price: 0,
})

const openCreateModal = () => {
  isEditing.value = false
   
  form.value = {
    name: '',
    isActive: false,
    description: "",
    price: 0,
    id: ''
  }
  isModalOpen.value = true
}



const closeModal = () => {
  isModalOpen.value = false
}

const savePublication = async () => {

  // Validation
  if (!form.name.trim()) {
    $toast.error('Publication name is required');
    return;
  }
  if (!form.price || parseFloat(form.price) < 0) {
    $toast.error('Please enter a valid price');
    return;
  }

  isSaving.value = true;

  try {
    if (isEditing.value) {
      await updatePublication(form.value,form.value );
      $toast.success('Publication updated successfully');
    } else {
      await createPublication(form.value);
      $toast.success('Publication created successfully');
    }
    
    isModalOpen.value = false;
    await getPaginatedPublications();
  } catch (error) {
    console.error('Failed to save publication', error)
    $toast.error('Failed to save publication. Please try again.')
  }
  finally {
    isSaving.value = false;
  }
}


const viewPublicationDetails = (publication: Publication) => {

  console.log('publication->', publication);
  isEditing.value = true;
  form.value.id = publication.id;
  form.value.name = publication.name;
  form.value.description = publication.description || '';
  form.value.price = publication.price;
  form.value.isActive = publication.isActive;
  isModalOpen.value = true;
};


const delPublication = (publication: Publication) => {
  publicationToDelete.value = publication
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  publicationToDelete.value = null
}

const confirmDelete = async () => {
  if (!publicationToDelete.value) return;

  try {
    await deletePublication({ id: publicationToDelete.value.id });
    $toast.success('Publication deleted successfully');
    await getPaginatedPublications();
  } catch (error) {
    console.error('Failed to delete publication', error);
    $toast.error('Failed to delete publication');
  } finally {
    closeDeleteModal();
  }
};

const debouncedSearch = debounce(() => {
    filters.pageNo = 1; // Reset to first page for new search
    getPaginatedPublications();
  }, 300); // 300ms delay


  watch(() => filters.query, debouncedSearch);

  onMounted(async () => {
    if (!isEmpty(route.query)) {
      filters.pageNo = parseInt(route.query.pageNo as string);
    }
    
    await getPaginatedPublications();

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