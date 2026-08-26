<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="closeModal">
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

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <component :is="mediaType === 'video' ? VideoCameraIcon : MusicalNoteIcon" class="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                      Ingest New {{ mediaType === 'video' ? 'Video' : 'Audio' }}
                    </DialogTitle>
                    
                    <div class="mt-6">
                      <!-- Tabs -->
                      <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                          <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            @click="activeTab = tab.id"
                            :class="[
                              activeTab === tab.id
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                            ]"
                          >
                            {{ tab.name }}
                          </button>
                        </nav>
                      </div>

                      <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
                        <!-- Upload Tab -->
                        <div v-if="activeTab === 'upload'" class="space-y-6">
                          <div class="col-span-full">
                            <label class="block text-sm font-medium leading-6 text-gray-900">Media File</label>
                            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" :class="{ 'bg-gray-50': file }">
                              <div class="text-center">
                                <DocumentArrowUpIcon v-if="!file" class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <DocumentIcon v-else class="mx-auto h-12 w-12 text-primary-500" aria-hidden="true" />
                                <div class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                  <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                                    <span>{{ file ? 'Change file' : 'Upload a file' }}</span>
                                    <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileChange" :accept="mediaType === 'video' ? 'video/*' : 'audio/*'" />
                                  </label>
                                  <p class="pl-1" v-if="!file">or drag and drop</p>
                                </div>
                                <p class="text-xs leading-5 text-gray-600 mt-1" v-if="!file">
                                  {{ mediaType === 'video' ? 'MP4, MOV, AVI up to 500MB' : 'MP3, WAV, AAC up to 100MB' }}
                                </p>
                                <p class="text-sm font-medium text-gray-900 mt-2" v-if="file">{{ file.name }} ({{ (file.size / (1024 * 1024)).toFixed(2) }} MB)</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Link Tab -->
                        <div v-if="activeTab === 'link'" class="space-y-6">
                          <div>
                            <label for="externalUrl" class="block text-sm font-medium leading-6 text-gray-900">External Source URL</label>
                            <div class="mt-2">
                              <input
                                type="url"
                                name="externalUrl"
                                id="externalUrl"
                                v-model="formData.url"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                                :placeholder="mediaType === 'video' ? 'https://youtube.com/watch?v=...' : 'https://spotify.com/...'"
                              />
                            </div>
                          </div>
                        </div>

                        <!-- Common Metadata Fields -->
                        <div class="space-y-4 pt-4 border-t border-gray-100">
                          <div>
                            <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title <span class="text-red-500">*</span></label>
                            <div class="mt-2">
                              <input required type="text" v-model="formData.title" id="title" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>
                          
                          <div>
                            <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                            <div class="mt-2">
                              <textarea v-model="formData.description" id="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" />
                            </div>
                          </div>

                          <!-- Transcription Toggle -->
                          <div class="relative flex items-start mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div class="flex h-6 items-center">
                              <input
                                id="transcribe"
                                name="transcribe"
                                type="checkbox"
                                v-model="formData.generateTranscription"
                                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                              />
                            </div>
                            <div class="ml-3 text-sm leading-6">
                              <label for="transcribe" class="font-medium text-gray-900">Generate Transcribed Text</label>
                              <p class="text-gray-500">Automatically generate a text transcript from this {{ mediaType }}. This process may take a few minutes depending on the file size.</p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleSubmit"
                  :disabled="loading || (activeTab === 'upload' && !file) || (activeTab === 'link' && !formData.url) || !formData.title"
                >
                  <span v-if="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                  <span v-else>Ingest {{ mediaType === 'video' ? 'Video' : 'Audio' }}</span>
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
                  @click="closeModal"
                  :disabled="loading"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { VideoCameraIcon, MusicalNoteIcon, DocumentArrowUpIcon, DocumentIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  mediaType: {
    type: String, // 'video' | 'audio'
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const activeTab = ref('upload')
const tabs = [
  { id: 'upload', name: 'File Upload' },
  { id: 'link', name: 'External Link' }
]

const file = ref<File | null>(null)
const loading = ref(false)

const formData = reactive({
  title: '',
  description: '',
  url: '',
  generateTranscription: false
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

const closeModal = () => {
  if (loading.value) return
  emit('close')
  // Reset state on close
  setTimeout(() => {
    activeTab.value = 'upload'
    file.value = null
    formData.title = ''
    formData.description = ''
    formData.url = ''
    formData.generateTranscription = false
  }, 300)
}

const handleSubmit = async () => {
  loading.value = true
  
  // Simulate API call for ingestion
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  emit('submit', {
    type: activeTab.value,
    file: file.value,
    ...formData
  })
  
  loading.value = false
  closeModal()
}
</script>
