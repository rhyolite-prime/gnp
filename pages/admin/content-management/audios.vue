<template>
  <div class="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Audios</h1>
        <p class="mt-2 text-sm text-gray-700">Manage and ingest audio content like podcasts and news clips.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="showIngestModal = true"
          type="button"
          class="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
          Ingest Audio
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
            placeholder="Search audios..."
          />
        </div>
      </div>
      
      <div class="flex gap-4">
        <select v-model="filters.source" class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
          <option value="all">All Sources</option>
          <option value="upload">Uploaded</option>
          <option value="link">External Link</option>
        </select>
      </div>
    </div>

    <!-- Audio List -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Audio Title</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Duration</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Transcription</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Added</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-if="isLoading" class="animate-pulse">
            <td colspan="7" class="px-3 py-10 text-center text-sm text-gray-500">
                <div class="flex justify-center items-center space-x-2">
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                    <div class="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
            </td>
          </tr>

          <tr v-else-if="filteredAudios.length === 0">
            <td colspan="7" class="px-3 py-10 text-center text-gray-500">
                <p class="text-sm">No audios found.</p>
            </td>
          </tr>

          <tr v-else v-for="audio in filteredAudios" :key="audio.id" class="hover:bg-gray-50 transition-colors">
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 bg-primary-100 rounded-full flex items-center justify-center">
                    <MusicalNoteIcon class="h-5 w-5 text-primary-600" />
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-gray-900">{{ audio.title }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{{ audio.source }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ audio.duration || '--:--' }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-green-50 text-green-700 ring-green-600/20': audio.status === 'Published',
                      'bg-yellow-50 text-yellow-700 ring-yellow-600/20': audio.status === 'Processing',
                      'bg-gray-50 text-gray-600 ring-gray-500/20': audio.status === 'Draft'
                    }">
                    {{ audio.status }}
                  </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span 
                    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="{
                      'bg-green-50 text-green-700 ring-green-600/20': audio.transcriptionStatus === 'Completed',
                      'bg-blue-50 text-blue-700 ring-blue-600/20': audio.transcriptionStatus === 'Processing',
                      'bg-gray-50 text-gray-600 ring-gray-500/20': audio.transcriptionStatus === 'None',
                      'bg-red-50 text-red-700 ring-red-600/20': audio.transcriptionStatus === 'Failed'
                    }">
                    {{ audio.transcriptionStatus }}
                  </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ audio.dateAdded }}</td>
              
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="relative dropdown-container flex justify-end">
                    <button 
                        @click.stop="toggleDropdown(audio.id)" 
                        class="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <EllipsisVerticalIcon class="h-5 w-5" />
                    </button>

                    <div 
                        v-if="activeDropdownId === audio.id" 
                        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100 ring-1 ring-black ring-opacity-5"
                    >
                        <div class="py-1">
                            <button 
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                View Details
                            </button>
                            <button 
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                Edit Metadata
                            </button>
                            <button 
                                v-if="audio.transcriptionStatus === 'None' || audio.transcriptionStatus === 'Failed'"
                                class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left">
                                Request Transcription
                            </button>
                            <button 
                                class="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                                Delete
                            </button> 
                        </div>
                    </div>
                </div>
              </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Media Ingestion Modal -->
    <MediaIngestionModal 
      :is-open="showIngestModal" 
      media-type="audio" 
      @close="showIngestModal = false" 
      @submit="handleIngest"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon, EllipsisVerticalIcon, MusicalNoteIcon } from '@heroicons/vue/24/outline'
import MediaIngestionModal from '~/components/MediaIngestionModal.vue'

const { $toast } = useNuxtApp()

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})


useHead({
  title: 'Audios Management | Graphic News Plus'
})

const showIngestModal = ref(false)
const isLoading = ref(true)
const activeDropdownId = ref<string | null>(null)

const filters = reactive({
  query: '',
  source: 'all'
})

// Mock Audio Data
const audios = ref([
  {
    id: 'aud-1',
    title: 'Daily Graphic Podcast: Ep 14',
    source: 'upload',
    duration: '34:10',
    status: 'Published',
    transcriptionStatus: 'Completed',
    dateAdded: '2026-08-25',
  },
  {
    id: 'aud-2',
    title: 'News in 5 Minutes - August 24',
    source: 'upload',
    duration: '05:00',
    status: 'Draft',
    transcriptionStatus: 'None',
    dateAdded: '2026-08-24',
  },
  {
    id: 'aud-3',
    title: 'Political Analysis Spotify Stream',
    source: 'link',
    duration: '52:30',
    status: 'Published',
    transcriptionStatus: 'Processing',
    dateAdded: '2026-08-23',
  }
])

const filteredAudios = computed(() => {
  return audios.value.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(filters.query.toLowerCase())
    const matchesSource = filters.source === 'all' || a.source === filters.source
    return matchesSearch && matchesSource
  })
})

const toggleDropdown = (id: string) => {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

const handleIngest = (payload: any) => {
  // Add to mock data
  const newAudio = {
    id: `aud-${Date.now()}`,
    title: payload.title,
    source: payload.type, // 'upload' or 'link'
    duration: '--:--',
    status: 'Processing',
    transcriptionStatus: payload.generateTranscription ? 'Processing' : 'None',
    dateAdded: new Date().toISOString().split('T')[0],
  }
  
  audios.value.unshift(newAudio)
  $toast.success('Audio ingested successfully and is now processing.')
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 600)
  
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.dropdown-container')) {
      activeDropdownId.value = null
    }
  })
})
</script>
