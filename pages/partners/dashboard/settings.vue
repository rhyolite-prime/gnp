<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Organization Settings</h2>
      <p class="text-sm text-slate-500 mt-1">Update your company details and portal preferences.</p>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
       
       <!-- Profile Settings -->
       <div class="p-8 md:p-10">
          <div class="flex flex-col md:flex-row gap-8">
             <div class="md:w-1/3">
                <h3 class="text-lg font-bold text-slate-900">Organization Profile</h3>
                <p class="text-sm text-slate-500 mt-2">This information will be displayed to your members during onboarding.</p>
             </div>
             <div class="md:w-2/3 space-y-6">
                <div class="flex items-center gap-6">
                   <div class="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer">
                      <CameraIcon class="w-8 h-8" />
                   </div>
                   <div>
                     <button class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Change Logo</button>
                     <p class="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                   </div>
                </div>
                
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                   <input type="text" :value="companyName" class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-slate-50" />
                </div>
                
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                   <input type="email" :value="supportEmail" class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-slate-50" />
                   <p class="text-xs text-slate-500 mt-1.5">Where member inquiries should be directed.</p>
                </div>
             </div>
          </div>
       </div>

       <!-- Security / Login -->
       <div class="p-8 md:p-10">
          <div class="flex flex-col md:flex-row gap-8">
             <div class="md:w-1/3">
                <h3 class="text-lg font-bold text-slate-900">Security Options</h3>
                <p class="text-sm text-slate-500 mt-2">Manage login mechanisms and authentication features.</p>
             </div>
             <div class="md:w-2/3 space-y-6">
                <!-- Toggle Item -->
                <div class="flex items-center justify-between">
                   <div>
                      <h4 class="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4>
                      <p class="text-sm text-slate-500 mt-1">Require portal admins to use 2FA when signing in.</p>
                   </div>
                   <button class="w-12 h-6 bg-primary-600 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                     <span class="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                   </button>
                </div>

                <!-- Toggle Item -->
                <div class="flex items-center justify-between">
                   <div>
                      <h4 class="font-bold text-slate-900 text-sm">Force Single Sign-On (SSO)</h4>
                      <p class="text-sm text-slate-500 mt-1">Force subscribers to authenticate via your corporate identity provider.</p>
                   </div>
                   <button class="w-12 h-6 bg-slate-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                     <span class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform border border-slate-300 shadow-sm"></span>
                   </button>
                </div>
             </div>
          </div>
       </div>

       <div class="bg-slate-50 p-6 flex justify-end gap-3 rounded-b-3xl">
          <button class="px-6 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
          <button class="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-sm hover:bg-primary-700 shadow-sm transition-colors">Save Changes</button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CameraIcon
} from '@heroicons/vue/24/outline'
import { usePartnerAuthStore } from '~/stores/partnerAuth'

const partnerAuthStore = usePartnerAuthStore()

const companyName = computed(() => partnerAuthStore.partner?.partnerName || 'Institutional Partner')
const supportEmail = computed(() => partnerAuthStore.partner?.partnerEmail || 'support@organization.com')
</script>
