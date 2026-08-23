<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          
          <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button 
              type="button" 
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" 
              @click="$emit('close')"
              :disabled="uploading"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
              <ArrowUpTrayIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Upload Subscribers</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-4">
                  Upload a CSV or Excel file with subscriber information. You have <span class="font-semibold text-gray-900">{{ remainingQuota }}</span> slots remaining.
                </p>

                <!-- Step 1: Download Template -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <DocumentArrowDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3 flex-1">
                      <h4 class="text-sm font-medium text-gray-900">Step 1: Download Template</h4>
                      <p class="mt-1 text-xs text-gray-500">Download the template file and fill it with subscriber data.</p>
                      <div class="mt-3 flex gap-2">
                        <button
                          @click="downloadTemplate('csv')"
                          type="button"
                          class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <ArrowDownTrayIcon class="-ml-0.5 mr-1 h-4 w-4 text-gray-400" />
                          CSV Template
                        </button>
                        <button
                          @click="downloadTemplate('excel')"
                          type="button"
                          class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <ArrowDownTrayIcon class="-ml-0.5 mr-1 h-4 w-4 text-gray-400" />
                          Excel Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Upload File -->
                <div class="mb-4">
                  <div class="flex items-start mb-2">
                    <div class="flex-shrink-0">
                      <CloudArrowUpIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                      <h4 class="text-sm font-medium text-gray-900">Step 2: Upload Filled Template</h4>
                      <p class="mt-1 text-xs text-gray-500">Select the file you've filled with subscriber data.</p>
                    </div>
                  </div>

                  <div class="mt-3">
                    <label 
                      for="file-upload" 
                      class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                    >
                      <div class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6">
                        <div class="text-center">
                          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                          <div class="mt-4 flex text-sm leading-6 text-gray-600">
                            <span class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                              <span>Upload a file</span>
                              <input 
                                id="file-upload" 
                                ref="fileInput"
                                name="file-upload" 
                                type="file" 
                                class="sr-only" 
                                accept=".csv, .xlsx, .xls"
                                @change="handleFileSelect"
                                :disabled="uploading"
                              />
                            </span>
                            <p class="pl-1">or drag and drop</p>
                          </div>
                          <p class="text-xs leading-5 text-gray-600">CSV or Excel files only</p>
                          <p v-if="selectedFile" class="mt-2 text-sm font-medium text-gray-900">
                            Selected: {{ selectedFile.name }}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div v-if="uploading" class="mb-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">Uploading...</span>
                    <span class="text-sm font-medium text-gray-700">{{ uploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      class="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                      :style="{ width: uploadProgress + '%' }"
                    ></div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button 
                    type="button"
                    @click="handleUpload"
                    :disabled="!selectedFile || uploading"
                    class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ uploading ? 'Uploading...' : 'Upload' }}
                  </button>
                  <button 
                    type="button" 
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="$emit('close')"
                    :disabled="uploading"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  XMarkIcon, 
  ArrowUpTrayIcon, 
  DocumentArrowDownIcon, 
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  uploading: {
    type: Boolean,
    default: false
  },
  uploadProgress: {
    type: Number,
    default: 0
  },
  remainingQuota: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'upload'])

const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const downloadTemplate = async (type: 'csv' | 'excel') => {
  if (type === 'csv') {
    // Create CSV template
    const csvContent = 'FirstName,LastName,Email,PhoneNumber\nKwabena,Imhotep,kwabena.imhotep@graphic.com.gh,+233244256444\nFrancis,Odame,francis.odame@raphic.com.gh,+233242573763'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'subscriber_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // Generate actual Excel file using sheetjs
    const data = [
      ['FirstName', 'LastName', 'Email', 'PhoneNumber'],
      ['Kwabena', 'Imhotep', 'kwabena.imhotep@graphic.com.gh', '+233244256444'],
      ['Francis', 'Odame', 'francis.odame@raphic.com.gh', '+233242573763']
    ]
    downloadExcelTemplate(data, 'subscriber_template.xlsx')
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
  }
}

const handleUpload = () => {
  if (selectedFile.value) {
    emit('upload', selectedFile.value)
  }
}
</script>
