<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h2>
        <p class="text-sm text-slate-500 mt-1">Generate reports on subscriber activity and overall engagement.</p>
      </div>
      <div class="flex items-center gap-3">
        <select class="rounded-xl border-slate-200 bg-white text-slate-700 py-2 pl-4 pr-10 text-sm font-bold shadow-sm focus:ring-primary-500 focus:border-primary-500">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>Year to Date</option>
        </select>
        <button class="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-sm text-sm">
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>
    </div>

    <!-- Overview Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <h3 class="text-slate-500 text-sm font-bold mb-2">Total Reads</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">42.5k</p>
        <span class="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
          <ArrowTrendingUpIcon class="w-4 h-4 mr-1" />
          +18% from last month
        </span>
      </div>
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <h3 class="text-slate-500 text-sm font-bold mb-2">Avg. Session Duration</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">8m 12s</p>
        <span class="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
          <ArrowTrendingUpIcon class="w-4 h-4 mr-1" />
          +2m 4s from last month
        </span>
      </div>
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <h3 class="text-slate-500 text-sm font-bold mb-2">New Members Onboarded</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">342</p>
        <span class="text-sm font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
           Same as last month
        </span>
      </div>
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <h3 class="text-slate-500 text-sm font-bold mb-2">Active Readers (30d)</h3>
        <p class="text-3xl font-extrabold text-slate-900 tracking-tight">2,105</p>
        <span class="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md self-start mt-4 flex items-center">
          <ArrowTrendingDownIcon class="w-4 h-4 mr-1" />
          -4% from last month
        </span>
      </div>
    </div>

    <!-- Charts / Content Areas -->
    <div class="grid lg:grid-cols-3 gap-8 mb-8">
      <!-- Main Activity Chart -->
      <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <div class="flex justify-between items-center mb-6">
           <h3 class="text-lg font-bold text-slate-900">Engagement Over Time</h3>
        </div>
        <div class="flex-1 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-8 relative overflow-hidden min-h-[300px]">
           <!-- Mock Chart Visual using Tailwind gradients -->
           <div class="absolute bottom-0 w-full h-[60%] flex items-end justify-between px-8 pb-8 gap-4 opacity-70">
              <div v-for="i in 12" :key="i" class="w-full bg-primary-500 rounded-t-md hover:bg-primary-400 transition-colors cursor-pointer relative group" :style="{ height: `${Math.max(20, Math.random() * 100)}%` }">
                 <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ Math.floor(Math.random() * 1000) }}
                 </div>
              </div>
           </div>
           <p class="text-slate-400 font-medium z-10 bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-200">Interactive Chart View</p>
        </div>
      </div>

      <!-- Top Publications -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
         <h3 class="text-lg font-bold text-slate-900 mb-6">Top Publications</h3>
         <div class="space-y-6 flex-1">
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 shadow-inner">
                     1
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Daily Graphic</h4>
                    <p class="text-xs text-slate-500">18.2k reads</p>
                  </div>
               </div>
               <div class="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">24%</div>
            </div>
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 shadow-inner">
                     2
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Graphic Business</h4>
                    <p class="text-xs text-slate-500">12.4k reads</p>
                  </div>
               </div>
               <div class="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">16%</div>
            </div>
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 shadow-inner">
                     3
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">The Mirror</h4>
                    <p class="text-xs text-slate-500">5.1k reads</p>
                  </div>
               </div>
               <div class="text-sm font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">8%</div>
            </div>
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 shadow-inner">
                     4
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Graphic Sports</h4>
                    <p class="text-xs text-slate-500">4.8k reads</p>
                  </div>
               </div>
               <div class="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-2%</div>
            </div>
         </div>
         <button class="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-colors border border-slate-200">
            View All Publications
         </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'

// Logic can be added here
</script>
