<template>
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
        >
          <!-- Header -->
          <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
              @click="$emit('close')"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <UserPlusIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                Onboard Users — {{ enterprise?.organizationName }}
              </h3>
              <p class="mt-1 text-xs text-gray-500">
                <span class="font-semibold text-gray-900">{{ enterprise?.enrolledUsers ?? 0 }}</span>
                of
                <span class="font-semibold text-gray-900">{{ enterprise?.subscriberQuota ?? 0 }}</span>
                seats used ·
                <span class="font-semibold text-primary-700">{{ remainingSeats }}</span> remaining
              </p>

              <!-- Mode switch -->
              <div class="mt-4 inline-flex rounded-lg p-0.5 bg-gray-100">
                <button
                  type="button"
                  class="px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  :class="mode === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                  @click="mode = 'manual'"
                >
                  Add Manually
                </button>
                <button
                  type="button"
                  class="px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  :class="mode === 'csv' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                  @click="switchMode('csv')"
                >
                  Upload CSV
                </button>
              </div>

              <!-- ── Manual mode ─────────────────────────────────────────── -->
              <div v-if="mode === 'manual'" class="mt-4">
                <div class="space-y-2">
                  <div
                    v-for="(row, index) in manualRows"
                    :key="index"
                    class="grid grid-cols-12 gap-2 items-start"
                  >
                    <input
                      v-model="row.firstName"
                      type="text"
                      placeholder="First name *"
                      class="col-span-3 rounded-md border-0 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600"
                    />
                    <input
                      v-model="row.lastName"
                      type="text"
                      placeholder="Last name *"
                      class="col-span-3 rounded-md border-0 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600"
                    />
                    <input
                      v-model="row.email"
                      type="email"
                      placeholder="Email *"
                      class="col-span-3 rounded-md border-0 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600"
                    />
                    <div class="col-span-3 flex items-center gap-1.5">
                      <input
                        v-model="row.phone"
                        type="text"
                        placeholder="Phone"
                        class="flex-1 rounded-md border-0 py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600"
                      />
                      <button
                        type="button"
                        class="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-40"
                        :disabled="manualRows.length === 1"
                        title="Remove row"
                        @click="manualRows.splice(index, 1)"
                      >
                        <XMarkIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-500 cursor-pointer"
                  @click="manualRows.push({ firstName: '', lastName: '', email: '', phone: '' })"
                >
                  <PlusIcon class="h-4 w-4" />
                  Add another row
                </button>

                <p v-if="manualError" class="mt-2 text-xs font-medium text-red-600">{{ manualError }}</p>
              </div>

              <!-- ── CSV mode ────────────────────────────────────────────── -->
              <div v-else class="mt-4">
                <!-- Template -->
                <div class="mb-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5">
                  <div class="flex items-center gap-2">
                    <DocumentArrowDownIcon class="h-5 w-5 text-gray-400" />
                    <div>
                      <p class="text-xs font-semibold text-gray-900">CSV Template</p>
                      <p class="text-[11px] text-gray-500">Columns: firstName, lastName, email, phone</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    class="rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                    @click="downloadTemplate"
                  >
                    Download
                  </button>
                </div>

                <!-- File picker -->
                <label
                  for="enterprise-csv-upload"
                  class="relative block cursor-pointer rounded-lg border border-dashed border-gray-900/25 px-6 py-5 text-center hover:border-primary-400 transition-colors"
                >
                  <CloudArrowUpIcon class="mx-auto h-7 w-7 text-gray-400" />
                  <span class="mt-1 block text-xs font-semibold text-primary-600">
                    {{ selectedFileName || 'Click to choose a CSV file' }}
                  </span>
                  <span class="mt-0.5 block text-[11px] text-gray-500">CSV files only · parsed locally for preview</span>
                  <input
                    id="enterprise-csv-upload"
                    type="file"
                    accept=".csv,text/csv"
                    class="sr-only"
                    @change="handleFileSelect"
                  />
                </label>

                <!-- Preview -->
                <div v-if="csvParseResult" class="mt-3">
                  <div class="flex items-center gap-2 text-xs">
                    <span class="font-semibold text-gray-900">{{ csvParseResult.totalRows }} rows found</span>
                    <span class="text-emerald-600 font-medium">{{ csvParseResult.validCount }} valid</span>
                    <span v-if="csvParseResult.invalidCount" class="text-red-600 font-medium">
                      {{ csvParseResult.invalidCount }} invalid
                    </span>
                  </div>

                  <div class="mt-2 max-h-44 overflow-y-auto rounded-lg border border-gray-200">
                    <table class="min-w-full divide-y divide-gray-100 text-left">
                      <thead class="bg-gray-50 sticky top-0">
                        <tr>
                          <th class="px-2.5 py-1.5 text-[11px] font-semibold text-gray-500">Line</th>
                          <th class="px-2.5 py-1.5 text-[11px] font-semibold text-gray-500">Name</th>
                          <th class="px-2.5 py-1.5 text-[11px] font-semibold text-gray-500">Email</th>
                          <th class="px-2.5 py-1.5 text-[11px] font-semibold text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100 bg-white">
                        <tr v-for="row in csvParseResult.rows" :key="row.line" :class="row.valid ? '' : 'bg-red-50'">
                          <td class="px-2.5 py-1.5 text-[11px] text-gray-400">{{ row.line }}</td>
                          <td class="px-2.5 py-1.5 text-xs text-gray-800">{{ row.firstName }} {{ row.lastName }}</td>
                          <td class="px-2.5 py-1.5 text-xs text-gray-500">{{ row.email }}</td>
                          <td class="px-2.5 py-1.5 text-[11px]">
                            <span v-if="row.valid" class="text-emerald-600 font-medium">Valid</span>
                            <span v-else class="text-red-600 font-medium">{{ row.error }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p
                    v-if="csvParseResult.validCount > remainingSeats"
                    class="mt-2 text-xs font-medium text-amber-700"
                  >
                    More valid rows ({{ csvParseResult.validCount }}) than remaining seats ({{ remainingSeats }}).
                    Only the first {{ remainingSeats }} will be imported.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:w-auto cursor-pointer disabled:opacity-50"
              :disabled="isSubmitting"
              @click="submit"
            >
              {{ isSubmitting ? 'Onboarding...' : submitLabel }}
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
              @click="$emit('close')"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  XMarkIcon,
  PlusIcon,
  UserPlusIcon,
  DocumentArrowDownIcon,
  CloudArrowUpIcon,
} from '@heroicons/vue/24/outline'
import { parseUsersCsv, MOCK_ENTERPRISE_USERS_CSV_TEMPLATE } from '~/services/enterpriseSubscribers'
import type { EnterpriseSubscriber, EnterpriseCsvRow } from '~/models'

const props = defineProps<{
  enterprise: EnterpriseSubscriber | null
  mode: 'manual' | 'csv'
}>()

const emit = defineEmits(['close', 'done'])

const mode = ref<'manual' | 'csv'>(props.mode)
const isSubmitting = ref(false)

const remainingSeats = computed(() => {
  const ent = props.enterprise
  if (!ent) return 0
  return Math.max(0, ent.subscriberQuota - ent.enrolledUsers)
})

const submitLabel = computed(() =>
  mode.value === 'manual' ? 'Onboard Users' : 'Import Valid Rows'
)

// ── Manual ───────────────────────────────────────────────────────────────────
const manualRows = reactive<Array<{ firstName: string; lastName: string; email: string; phone: string }>>([
  { firstName: '', lastName: '', email: '', phone: '' },
])
const manualError = ref('')

// ── CSV ──────────────────────────────────────────────────────────────────────
const selectedFileName = ref('')
const csvParseResult = ref<{ rows: EnterpriseCsvRow[]; totalRows: number; validCount: number; invalidCount: number } | null>(null)

const switchMode = (next: 'manual' | 'csv') => {
  mode.value = next
  manualError.value = ''
}

const downloadTemplate = () => {
  const blob = new Blob([MOCK_ENTERPRISE_USERS_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'enterprise-users-template.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  selectedFileName.value = file.name
  const text = await file.text()
  csvParseResult.value = parseUsersCsv(text) as typeof csvParseResult.value
}

// ── Submit ───────────────────────────────────────────────────────────────────
const submit = () => {
  isSubmitting.value = true

  if (mode.value === 'manual') {
    const rows = manualRows
      .map((r) => ({
        firstName: r.firstName.trim(),
        lastName: r.lastName.trim(),
        email: r.email.trim().toLowerCase(),
        phone: r.phone.trim(),
      }))
      .filter((r) => r.firstName || r.lastName || r.email)

    if (rows.length === 0) {
      manualError.value = 'Enter at least one user.'
      isSubmitting.value = false
      return
    }
    const invalid = rows.find(
      (r) => !r.firstName || !r.lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)
    )
    if (invalid) {
      manualError.value = 'Each row needs a first name, last name, and a valid email.'
      isSubmitting.value = false
      return
    }

    emit('done', { mode: 'manual', rows })
  } else {
    if (!csvParseResult.value || csvParseResult.value.validCount === 0) {
      isSubmitting.value = false
      return
    }
    emit('done', { mode: 'csv', rows: csvParseResult.value.rows })
  }
}
</script>
