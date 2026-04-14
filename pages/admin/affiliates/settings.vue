<template>
  <div class="sm:flex sm:items-center sm:justify-between mb-8">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Affiliate Settings</h1>
      <p class="mt-2 text-sm text-gray-700">Configure your affiliate program settings.</p>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        @click="saveSettings"
        class="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
      >
        Save Changes
      </button>
    </div>
  </div>

  <div class="space-y-6">
    <!-- General Settings -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
      <h2 class="text-base font-semibold leading-7 text-gray-900">General Configuration</h2>
      <p class="mt-1 text-sm leading-6 text-gray-500">Set the basic parameters for your affiliate program.</p>

      <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="commission-rate" class="block text-sm font-medium leading-6 text-gray-900">Default Commission Rate (%)</label>
          <div class="mt-2">
            <input 
              type="number" 
              name="commission-rate" 
              id="commission-rate" 
              v-model="settings.commissionRate"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
            />
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="cookie-duration" class="block text-sm font-medium leading-6 text-gray-900">Cookie Duration (Days)</label>
          <div class="mt-2">
            <input 
              type="number" 
              name="cookie-duration" 
              id="cookie-duration" 
              v-model="settings.cookieDuration"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
            />
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="min-payout" class="block text-sm font-medium leading-6 text-gray-900">Minimum Payout Amount (₵)</label>
          <div class="mt-2">
            <div class="relative rounded-md shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 sm:text-sm">₵</span>
              </div>
              <input 
                type="number" 
                name="min-payout" 
                id="min-payout" 
                v-model="settings.minPayout"
                class="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6" 
                placeholder="0.00" 
              />
            </div>
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="payout-schedule" class="block text-sm font-medium leading-6 text-gray-900">Payout Schedule</label>
          <div class="mt-2">
            <select 
              id="payout-schedule" 
              name="payout-schedule" 
              v-model="settings.payoutSchedule"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            >
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Manual Approval</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms & Conditions -->
    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
      <h2 class="text-base font-semibold leading-7 text-gray-900">Terms & Conditions</h2>
      <p class="mt-1 text-sm leading-6 text-gray-500">The agreement that affiliates must accept when signing up.</p>

      <div class="mt-6">
        <div class="col-span-full">
          <label for="terms" class="block text-sm font-medium leading-6 text-gray-900">Agreement Text</label>
          <div class="mt-2">
            <textarea 
              id="terms" 
              name="terms" 
              rows="10" 
              v-model="settings.terms"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            ></textarea>
          </div>
          <p class="mt-3 text-sm leading-6 text-gray-600">You can use Markdown for formatting.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'admin'
})

const settings = ref({
  commissionRate: 10,
  cookieDuration: 30,
  minPayout: 100,
  payoutSchedule: 'Net 30',
  terms: `## Affiliate Agreement

1. **Introduction**
   By signing up as an affiliate, you agree to the terms outlined below.

2. **Commissions**
   You will earn a {{commission_rate}}% commission on every sale referred through your unique link.

3. **Payouts**
   Payouts are processed {{payout_schedule}} once you reach the minimum threshold of ₵{{min_payout}}.

4. **Prohibited Activities**
   - Spamming
   - Misleading advertising
   - Bidding on brand keywords`
})

const saveSettings = () => {
  // Logic to save settings would go here
  // toast.success('Settings saved successfully')
  alert('Settings saved successfully!')
}
</script>
