<template>
  <div class="max-w-8xl mx-auto py-8 px-3 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Ingest Publication
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Upload and configure new newspaper or magazine editions.
        </p>
      </div>
    </div>

    <form @submit.prevent="submitForm" class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Column (2/3) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- File Upload Section -->
          <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div class="px-4 py-6 sm:p-8">
              <div class="max-w-2xl mx-auto">
                <label class="block text-sm font-medium leading-6 text-gray-900 mb-2">Publication File (PDF)</label>
                <div 
                  class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:bg-gray-50 transition-colors cursor-pointer"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                  @click="$refs.fileInput.click()"
                >
                  <div class="text-center">
                    <DocumentIcon v-if="form.file" class="mx-auto h-12 w-12 text-primary-600" aria-hidden="true" />
                    <CloudArrowUpIcon v-else class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                      <span class="font-semibold text-primary-600 hover:text-primary-500">Click to upload</span>
                      <span class="pl-1">or drag and drop</span>
                    </div>
                    <p v-if="form.file" class="text-xs leading-5 text-gray-900 font-medium mt-2">{{ form.file.name }}</p>
                    <p v-else class="text-xs leading-5 text-gray-600">PDF up to 50MB</p>
                    <input ref="fileInput" type="file" class="hidden" accept=".pdf" @change="handleFileSelect" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Stories -->
          <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div class="px-4 py-6 sm:p-8">
              <div class="flex items-center justify-between mb-4">
                 <h3 class="text-base font-semibold leading-7 text-gray-900">Featured Stories</h3>
                 <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ form.featuredStories.length }}/2 Maximum</span>
              </div>
             
              <div class="space-y-6">
                <div v-for="(story, index) in form.featuredStories" :key="index" class="relative bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <button @click="removeFeaturedStory(index)" type="button" class="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                  <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div class="sm:col-span-6">
                      <label class="block text-sm font-medium leading-6 text-gray-900">Story Title</label>
                      <input type="text" v-model="story.title" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                    </div>
                    <div class="sm:col-span-6">
                      <label class="block text-sm font-medium leading-6 text-gray-900">Short Description</label>
                      <textarea v-model="story.description" rows="2" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>
                </div>

                <button 
                  v-if="form.featuredStories.length < 2"
                  @click="addFeaturedStory" 
                  type="button" 
                  class="flex items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-primary-500 hover:bg-gray-50 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <PlusIcon class="h-5 w-5 mr-1.5" />
                  Add Featured Story
                </button>
              </div>
            </div>
          </div>

          <!-- News Headlines -->
          <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
             <div class="px-4 py-6 sm:p-8">
               <h3 class="text-base font-semibold leading-7 text-gray-900 mb-4">News Headlines</h3>
               <div class="space-y-3">
                 <div v-for="(headline, index) in form.headlines" :key="index" class="flex gap-2">
                   <div class="flex-grow">
                     <input 
                      type="text" 
                      v-model="headline.text"
                      placeholder="Enter headline text"
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                   </div>
                   <button @click="removeHeadline(index)" type="button" class="text-gray-400 hover:text-red-500 p-1.5">
                     <TrashIcon class="h-5 w-5" />
                   </button>
                 </div>
                 
                 <button 
                  @click="addHeadline" 
                  type="button" 
                  class="flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 mt-2"
                 >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  Add Another Headline
                 </button>
               </div>
             </div>
          </div>
        </div>

        <!-- Sidebar Column (1/3) -->
        <div class="space-y-8">
          <!-- Publication Settings -->
          <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div class="px-4 py-6 sm:p-8 space-y-6">
              <h3 class="text-base font-semibold leading-7 text-gray-900">Publication Details</h3>
              
              <!-- Date -->
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900">Publication Date</label>
                <input 
                  type="date" 
                  v-model="form.publicationDate"
                  class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>

              <!-- Edition Number -->
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900">Edition Number</label>
                <input 
                    type="text" 
                    v-model="form.editionNumber"
                    class="block mt-2 w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                    placeholder="12354" 
                  />
              </div>

              <!-- Storage Service -->
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900">Storage Service</label>
                <select  v-model="form.storageService"
                  class="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-white focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6">
                  <option disabled>Select Option</option>
                  <option selected value="google-drive">Google Drive</option>
                  <option disabled value="local-storage">Local Storage</option>
                  <option disabled value="aws-s3">AWS S3</option>
                  <option disabled value="cloud-flare-r2">Cloud Flare R2</option>
                </select>
              </div>

              <!-- Price -->
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900">Price (GHS)</label>
                <div class="relative mt-2 rounded-md shadow-sm">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span class="text-gray-500 sm:text-sm">₵</span>
                  </div>
                  <input 
                    type="number" 
                    v-model="form.price"
                    step="0.01"
                    class="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                    placeholder="0.00" 
                  />
                </div>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900">Publication</label>
                <Listbox as="div" v-model="form.publicationId" class="mt-2">
                  <div class="relative">
                    <ListboxButton class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                      <span class="block truncate">{{ form.publicationName || 'Select a publication' }}</span>
                      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                      <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <ListboxOption as="template" v-for="publication in publicationList" :key="publication.id" :value="publication.id" v-slot="{ active, selected }">
                          <li :class="[active ? 'bg-primary-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ publication.name }}</span>
                            <span v-if="selected" :class="[active ? 'text-white' : 'text-primary-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>

            </div>
          </div>

          <!-- Related Content -->
          <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
             <div class="px-4 py-6 sm:p-8">
               <label class="block text-base font-semibold leading-7 text-gray-900 mb-4">Related Content</label>
               <VueMultiselect
                v-model="form.relatedContent"
                :options="relatedOptions"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Select related publications"
                label="name"
                track-by="id"
                class="multiselect-custom"
              >
              </VueMultiselect>
             </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
            <button
              type="button"
              @click="savePublication"
              :disabled="isProcessingIngestion"
              class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm
                     bg-primary-600 hover:bg-primary-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
              
              <svg
                v-if="isProcessingIngestion"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4" />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>

              <span>
                {{ isProcessingIngestion ? 'Processing File…' : 'Save Publication' }}
              </span>
            </button>
          </div>

        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ChevronUpDownIcon
} from '@heroicons/vue/24/outline'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { isEmpty, debounce } from "lodash-es";
import type { Publication } from "~/models";
import { Option } from 'lucide-vue-next';
const { $toast } = useNuxtApp();

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Ingestion | Graphic News Plus'
})

const publicationList = ref<Publication[]>([]);
const selectedPublication = ref<Publication | null>(null);
const uploadedPublicationFile = ref<File | null>(null);
const isProcessingIngestion = ref(false);




const getAllPublications = async () => {

    let result = await getPublications({pageNo: 1, pageSize: 100});

    publicationList.value = result.data;
 
}


interface FeaturedStory {
  title: string;
  description: string;
}

interface Headline {
  text: string;
}

 
 
 

const relatedOptions = [
  { id: 101, name: 'Daily Graphic - Dec 14' },
  { id: 102, name: 'The Mirror - Dec 13' },
  { id: 103, name: 'Graphic Sports - Dec 12' },
  { id: 104, name: 'Junior Graphic - Dec 10' },
]

const form = ref({
  file: null as File | null,
  headlines: [{ text: '' }] as Headline[],
  featuredStories: [] as FeaturedStory[],
  publicationDate: new Date().toISOString().split('T')[0],
  price: '',
  editionNumber: '',
  storageService: 'google-drive',
  publicationId: '',
  publicationName: '',
  fullDescription: '',
  relatedContent: []
})

const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    form.value.file = input.files[0]
  }
}

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    if (file.type === 'application/pdf') {
      form.value.file = file
    } else {
      alert('Please upload a PDF file.')
    }
  }
}

const addFeaturedStory = () => {
  if (form.value.featuredStories.length < 2) {
    form.value.featuredStories.push({ title: '', description: '' })
  }
}

const removeFeaturedStory = (index: number) => {
  form.value.featuredStories.splice(index, 1)
}

const addHeadline = () => {
  form.value.headlines.push({ text: '' })
}

const removeHeadline = (index: number) => {
  form.value.headlines.splice(index, 1)
}

const savePublication = async () => {
  isProcessingIngestion.value = true;

  // Build fullDescription from headlines, separated by semicolons
  form.value.fullDescription = form.value.headlines
    .map(h => h.text)
    .filter(text => text && text.trim() !== '')
    .join(' ; ');

  if (!form.value.file) {
    $toast.error('Upload a PDF file.');
    isProcessingIngestion.value = false;
    return;
  }

  if (!selectedPublication.value) {
    $toast.error('Select a publication.');
    isProcessingIngestion.value = false;
    return;
  }

  // Build title: e.g. "DG Monday, April 3, 2023"
  const publicationName = selectedPublication.value.name;

  // Abbreviation from publication name (e.g. "Daily Graphic" -> "DG")
  const abbreviation = publicationName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  // Format publication date
  const dateObj = new Date(form.value.publicationDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const title = `${abbreviation} ${formattedDate}`;

  // Optional slug generation from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  try {
    // Upload file to storage service
    const uploadResult = await uploadGnpDocument(form.value.file);

    // Create newspaper/publication
    await createNewsPaper({
      ...form.value,
      title,
      slug,
      documentId: uploadResult.documentId,
      thumbnailId: uploadResult.thumbnailId,
    });

    $toast.success('Publication ingested successfully.');
    await navigateTo('/admin/content-management/newspapers/');
  } catch (error) {
    $toast.error('Ingestion failed');
  } finally {
    isProcessingIngestion.value = false;
    // navigate to the newspaper page.
    

  }

  console.log('Submitting publication:', { ...form.value, title, slug });
};

watch(
  () => form.value.publicationId,
  (publicationId) => {
    if (!publicationId) {
      form.value.publicationName = ''
      selectedPublication.value = null
      return
    }

    const publication = publicationList.value.find(
      (p) => p.id === publicationId
    )

    if (publication) {
      form.value.publicationName = publication.name
      selectedPublication.value = publication
    }
  }
)

onMounted(async () => {
     
    await getAllPublications();

  });
  
</script>

<style>
/* Customizing Vue Multiselect to match Tailwind/Project theme better if needed */
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