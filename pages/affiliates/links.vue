<template>
  <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Affiliate Links</h1>
      <p class="text-gray-600 mt-1">Generate and manage your tracking links for various publications.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Link Generator -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Generate New Link</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Target Publication / Page</label>
              <select class="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary-500 focus:border-primary-500">
                <option>General Home Page</option>
                <option>Daily Graphic</option>
                <option>The Mirror</option>
                <option>Graphic Showbiz</option>
                <option>Junior Graphic</option>
                <option>Graphic Business</option>
                <option>Graphic Sports</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Name (Optional)</label>
              <input 
                type="text" 
                class="block w-full px-4 py-3 rounded-xl border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Facebook Summer Campaign"
              />
            </div>

            <div class="pt-4">
              <button class="w-full py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition shadow-md font-bold text-lg">
                Generate Tracking Link
              </button>
            </div>
          </div>

          <!-- Generated Link result (example) -->
          <div class="mt-10 p-6 bg-primary-50 rounded-2xl border border-primary-100">
            <label class="block text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">Your Affiliate Link</label>
            <div class="flex gap-3">
              <input 
                readonly 
                value="https://graphicnewsplus.com/?ref=aff_2938"
                class="flex-1 bg-white px-4 py-3 rounded-lg border-primary-200 text-gray-700 font-medium"
              />
              <button @click="copyLink" class="px-6 py-3 bg-white text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-100 transition font-bold">
                Copy
              </button>
            </div>
          </div>
        </div>

        <!-- My Links Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">My Tracked Links</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Target</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Clicks</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Conversions</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Last Used</th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="link in trackedLinks" :key="link.id" class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-gray-900">{{ link.target }}</div>
                    <div class="text-xs text-gray-400 truncate max-w-[200px]">{{ link.url }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ link.clicks }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ link.conversions }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ link.lastUsed }}</td>
                  <td class="px-6 py-4">
                    <button class="text-primary-600 hover:text-primary-700 font-bold text-sm">Copy</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tips & Stats Sidebar -->
      <div class="space-y-8">
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl text-white shadow-xl">
          <h3 class="text-xl font-bold mb-4">Pro Tips</h3>
          <ul class="space-y-4 text-gray-300 text-sm">
            <li class="flex items-start">
              <div class="h-5 w-5 bg-primary-500 rounded flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center text-xs font-bold text-white">1</div>
              Share links on your blog or social media to maximize reach.
            </li>
            <li class="flex items-start">
              <div class="h-5 w-5 bg-primary-500 rounded flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center text-xs font-bold text-white">2</div>
              Use specific publication links if you have a niche audience.
            </li>
            <li class="flex items-start">
              <div class="h-5 w-5 bg-primary-500 rounded flex-shrink-0 mt-0.5 mr-3 flex items-center justify-center text-xs font-bold text-white">3</div>
              Tracking campaigns helps you identify which platforms perform best.
            </li>
          </ul>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-6 text-center">Referral Success Rate</h3>
          <div class="relative h-48 w-48 mx-auto">
             <svg viewBox="0 0 100 100" class="h-full w-full transform -rotate-90">
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" stroke-width="12" />
               <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ea580c" stroke-width="12" stroke-dasharray="163 251" />
             </svg>
             <div class="absolute inset-0 flex items-center justify-center flex-col">
               <span class="text-3xl font-black text-gray-900">65%</span>
               <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Conversion</span>
             </div>
          </div>
          <div class="mt-8 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Total Referrals</span>
              <span class="font-bold">156</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Paid Referrals</span>
              <span class="font-bold">102</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const copyLink = () => {
  // Mock copy
  alert('Link copied to clipboard!')
}

const trackedLinks = ref([
  { id: 1, target: 'Home Page', url: 'https://graphicnewsplus.com/?ref=aff_2938', clicks: 8420, conversions: 85, lastUsed: '2 mins ago' },
  { id: 2, target: 'Daily Graphic', url: 'https://graphicnewsplus.com/daily-graphic?ref=aff_2938', clicks: 3150, conversions: 42, lastUsed: '1 hour ago' },
  { id: 3, target: 'Graphic Showbiz', url: 'https://graphicnewsplus.com/showbiz?ref=aff_2938', clicks: 880, conversions: 29, lastUsed: 'Yesterday' },
])
</script>
