<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
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
                   <div class="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer overflow-hidden" @click="triggerFileInput">
                      <img v-if="logoPreviewUrl" :src="logoPreviewUrl" alt="logoPreviewUrl" class="w-full h-full object-cover" />
                      <CameraIcon v-else class="w-8 h-8" />
                   </div>
                   <div>
                     <button @click="triggerFileInput" class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Change Logo</button>
                     <p class="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                     <input type="file" ref="fileInput" @change="onFileSelected" accept="image/jpeg, image/png, image/gif" class="hidden" />
                   </div>
                </div>
                
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                   <input type="text" :value="commercialPartnerInfo?.name" disabled class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-slate-50" />
                </div>
                
                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-2">Billing Email</label>
                   <input type="email" :value="commercialPartnerInfo?.billingEmail" disabled class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-slate-50" />
                </div>

                <div>
                   <label class="block text-sm font-bold text-slate-700 mb-2">Phone No.</label>
                   <input type="email" :value="commercialPartnerInfo?.contactPhone" disabled class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-slate-50" />
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
                   <button
                     @click="commercialPartnerInfo && (commercialPartnerInfo.requireTwoFactorAuth = !commercialPartnerInfo.requireTwoFactorAuth)"
                     :class="[
                       'w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                       commercialPartnerInfo?.requireTwoFactorAuth ? 'bg-primary-600' : 'bg-slate-300'
                     ]"
                   >
                     <span
                       :class="[
                         'absolute top-1 bg-white w-4 h-4 rounded-full transition-transform',
                         commercialPartnerInfo?.requireTwoFactorAuth ? 'right-1' : 'left-1'
                       ]"
                     ></span>
                   </button>
                </div>
             </div>
          </div>
       </div>

       <!-- Change Password -->
       <div class="p-8 md:p-10">
          <div class="flex flex-col md:flex-row gap-8">
             <div class="md:w-1/3">
                <h3 class="text-lg font-bold text-slate-900">Change Password</h3>
                <p class="text-sm text-slate-500 mt-2">Update your account password.</p>
             </div>
             <div class="md:w-2/3 space-y-6">
                <div>
                   <form @submit.prevent="handleChangePassword" class="space-y-4">
                     <div v-if="passwordError" class="rounded-xl bg-red-50 p-4">
                       <h3 class="text-sm font-medium text-red-800">{{ passwordError }}</h3>
                     </div>
                     <div v-if="passwordSuccess" class="rounded-xl bg-green-50 p-4">
                       <h3 class="text-sm font-medium text-green-800">Password updated successfully!</h3>
                     </div>

                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                        <input type="password" v-model="passwordForm.oldPassword" required class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-white" />
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <input type="password" v-model="passwordForm.newPassword" required class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-white" />
                     </div>
                     <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                        <input type="password" v-model="passwordForm.confirmPassword" required class="block w-full rounded-xl border-slate-200 py-2.5 text-slate-900 focus:ring-2 focus:ring-primary-500 bg-white" />
                     </div>

                     <div class="pt-2">
                        <button type="submit" :disabled="isChangingPassword" class="flex items-center px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 shadow-sm transition-colors disabled:opacity-50">
                           <span v-if="isChangingPassword" class="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                           Update Password
                        </button>
                     </div>
                   </form>
                </div>
             </div>
          </div>
       </div>

       <div class="bg-slate-50 p-6 flex justify-end gap-3 rounded-b-3xl">
          <button @click="getPartnerInfo" class="px-6 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">Cancel</button>
          <button @click="saveChanges" :disabled="isSaving" class="flex items-center px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-sm hover:bg-primary-700 shadow-sm transition-colors disabled:opacity-50">
            <span v-if="isSaving" class="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Save Changes
          </button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CameraIcon
} from '@heroicons/vue/24/outline'

import type { CommercialPartner } from "~/models";
import { changePassword } from "~/services/users";

const { $toast } = useNuxtApp();

definePageMeta({
  middleware: ['partner-auth']
})

const isShimmerLoading = ref(false)
const isSaving = ref(false)

const commercialPartnerInfo = ref<CommercialPartner | null>(null)

const isChangingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})


const handleChangePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = false;

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "New passwords do not match.";
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = "Password must be at least 6 characters.";
    return;
  }

  try {
    isChangingPassword.value = true;

    const success = await changePartnerAdminPassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });

    if (success) {
      passwordSuccess.value = true;
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
      $toast.success('Password updated successfully!');
    } else {
      passwordError.value = "Failed to update password. Please check your current password.";
    }

  } catch (err) {
    console.error("Change password error:", err);
    passwordError.value = "An error occurred while changing password.";
  } finally {
    isChangingPassword.value = false;
  }
}

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | undefined>(undefined)
const logoPreviewUrl = ref<string | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 1024 * 1024) {
      $toast.error('File size must be less than 1MB')
      return
    }
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreviewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveChanges = async () => {
    isSaving.value = true;
    try {
        const require2FA = commercialPartnerInfo.value?.requireTwoFactorAuth;
        const success = await updatePartnerSettings(selectedFile.value, require2FA);
        if (success) {
            $toast.success('Settings updated successfully!');
            selectedFile.value = undefined;
            await getPartnerInfo();
        } else {
            $toast.error('Failed to update settings');
        }
    } catch (error) {
        $toast.error('An error occurred while saving');
    } finally {
        isSaving.value = false;
    }
}
const getPartnerInfo = async () => {

    isShimmerLoading.value = true;

    try {

       commercialPartnerInfo.value = await getPartnerDetails();
       
       if (commercialPartnerInfo.value?.organizationLogo) {
           logoPreviewUrl.value = `data:image/png;base64,${commercialPartnerInfo.value.organizationLogo}`;
       }

    } catch (error) {
        $toast.error('Unable to retrieve partner details !');
    } finally {
        isShimmerLoading.value = false;
    }

 }

 onMounted(async () => {
    
    await getPartnerInfo();

  });


</script>
