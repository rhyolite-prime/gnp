<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">My Account</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Profile & Passkey -->
        <div class="lg:col-span-1 space-y-8">
          
          <!-- Profile Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <User class="w-5 h-5 mr-2 text-gray-500" />
                Profile Information
              </h2>
              <button 
                v-if="!isEditingProfile && !isLoadingProfile" 
                @click="startEditingProfile" 
                class="text-sm text-red-600 hover:text-red-700 flex items-center font-medium"
              >
                <Pencil class="w-4 h-4 mr-1" /> Edit
              </button>
            </div>

            <div v-if="profileError" class="rounded-md bg-red-50 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <XCircle class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ profileError }}</h3>
                </div>
              </div>
            </div>

            <div v-if="profileSuccess" class="rounded-md bg-green-50 p-4 mb-4">
              <div class="flex">
                 <div class="flex-shrink-0">
                  <CheckCircle class="h-5 w-5 text-green-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Profile updated successfully!</h3>
                </div>
              </div>
            </div>

            <div v-if="isLoadingProfile" class="animate-pulse space-y-4">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            <form v-else-if="isEditingProfile" @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  v-model="profileForm.fullname"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  placeholder="Set Username"
                  v-model="profileForm.username"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  v-model="profileForm.email"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" 
                />
                
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  v-model="profileForm.phoneNumber"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-100 cursor-not-allowed" 
                  disabled
                />
                <p class="mt-1 text-xs text-gray-500">Phone Number cannot be changed.</p>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  @click="cancelEditingProfile"
                  :disabled="isUpdatingProfile"
                  class="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  :disabled="isUpdatingProfile"
                  class="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                >
                  <span v-if="isUpdatingProfile" class="flex items-center">
                    <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </span>
                  <span v-else class="flex items-center">
                    <Save class="w-4 h-4 mr-1" /> Save
                  </span>
                </button>
              </div>
            </form>

            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Full Name</label>
                <div class="mt-1 text-gray-900 font-medium">{{ userMetaData?.bioData?.fullname || 'N/A' }}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Username</label>
                <div class="mt-1 text-gray-900">{{ userMetaData?.bioData?.username || 'N/A' }}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Email Address</label>
                <div class="mt-1 text-gray-900">{{ userMetaData?.bioData?.email || 'N/A' }}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500">Phone Number</label>
                <div class="mt-1 text-gray-900">{{ userMetaData?.bioData?.phoneNumber || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Express Login (Passkey) -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ScanFace class="w-5 h-5 mr-2 text-red-600" />
              Express Login
            </h2>
            
            <div v-if="userProfile?.hasPasskey" class="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <CheckCircle class="h-5 w-5 text-green-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Enabled</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>Your account is secured with Express Login (Passkeys).</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <p class="text-gray-600 mb-4 text-sm">
                Access all your newspapers securely using your device’s built-in authentication <strong>without</strong> typing passwords—<strong>fingerprint</strong>, <strong>face recognition</strong>, or <strong>secure device lock</strong>.
              </p>
              
              <button 
                @click="handleEnablePasskey" 
                :disabled="isRegisteringPasskey"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span v-if="isRegisteringPasskey" class="flex items-center">
                   <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
                   Processing...
                </span>
                <span v-else>Enable Express Login</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Right Column: Subscriptions & Password -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Subscriptions -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <Newspaper class="w-5 h-5 mr-2 text-gray-500" />
                Subscription Summary
              </h2>
              <!-- <NuxtLink to="/account/transactions" class="text-sm text-red-600 hover:text-red-700 font-medium">
                View Renewal history &rarr;
              </NuxtLink> -->

            </div>
              
            <div v-if="isLoadingProfile" class="animate-pulse space-y-4">
               <div class="h-12 bg-gray-200 rounded w-full"></div>
               <div class="h-12 bg-gray-200 rounded w-full"></div>
            </div>

            <div v-else-if="userMetaData.subscriptions && userMetaData.subscriptions.length > 0" class="overflow-hidden border border-gray-200 rounded-md">
              <ul role="list" class="divide-y divide-gray-200">
                <li v-for="sub in userMetaData.subscriptions" :key="sub.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <p class="text-sm font-medium text-red-600 truncate mb-1">
                        {{ sub.subscriptionIdentifier }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Expires: {{ new Date(sub.endDate).toLocaleDateString() }}
                      </p>
                    </div>
                    <div class="flex items-center">
                       <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ sub.isActive ? 'Active' : 'Expired' }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div v-else class="text-center py-8 text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
              <Newspaper class="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p>No active subscriptions found.</p>
              <NuxtLink to="/newspapers" class="mt-3 inline-block text-sm text-red-600 hover:text-red-500 font-medium">
                Browse Newspapers →
              </NuxtLink>
            </div>
          </div>

          <!-- Transactions -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard class="w-5 h-5 mr-2 text-gray-500" />
                Recent Payments
              </h2>
                <!-- <NuxtLink to="/account/transactions" class="text-sm text-red-600 hover:text-red-700 font-medium">
                  View payment history &rarr;
                </NuxtLink> -->
            </div>

            <div v-if="isLoadingProfile" class="animate-pulse space-y-4">
               <div class="h-12 bg-gray-200 rounded w-full"></div>
               <div class="h-12 bg-gray-200 rounded w-full"></div>
            </div>

            <div v-else-if="userMetaData.transactions && userMetaData.transactions.length > 0" class="overflow-hidden border border-gray-200 rounded-md overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="payment in userMetaData.transactions" :key="payment.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ payment.packageName }}</div>
                      <div class="text-[10px] text-gray-400">Ref: {{ payment.transactionReference }}</div>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      GHS {{ payment.amountPaid }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span 
                        class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                        :class="{
                          'bg-green-100 text-green-800': payment.status === 'Success',
                          'bg-yellow-100 text-yellow-800': payment.status === 'Pending',
                          'bg-red-100 text-red-800': payment.status === 'Failed',
                          'bg-blue-100 text-blue-800': payment.status === 'Initiated'
                        }"
                      >
                        {{ payment.status }}
                      </span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-[10px] text-gray-500">
                      {{ new Date(payment.createdAt).toLocaleDateString() }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="text-center py-8 text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
              <CreditCard class="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p>No transactions found.</p>
            </div>
          </div>

          <!-- Change Password -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Lock class="w-5 h-5 mr-2 text-gray-500" />
              Change Password
            </h2>

            <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-md">
              
              <div v-if="passwordError" class="rounded-md bg-red-50 p-4 mb-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <XCircle class="h-5 w-5 text-red-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{{ passwordError }}</h3>
                  </div>
                </div>
              </div>

               <div v-if="passwordSuccess" class="rounded-md bg-green-50 p-4 mb-4">
                <div class="flex">
                   <div class="flex-shrink-0">
                    <CheckCircle class="h-5 w-5 text-green-400" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">Password updated successfully!</h3>
                  </div>
                </div>
              </div>

              <div>
                <label for="current-password" class="block text-sm font-medium text-gray-700">Current Password</label>
                <input 
                  type="password" 
                  id="current-password" 
                  v-model="passwordForm.oldPassword"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" 
                />
              </div>

              <div>
                <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
                <input 
                  type="password" 
                  id="new-password" 
                  v-model="passwordForm.newPassword"
                   required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" 
                />
              </div>

              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirm-password" 
                  v-model="passwordForm.confirmPassword"
                   required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" 
                />
              </div>

              <div class="pt-2">
                <button 
                  type="submit" 
                  :disabled="isChangingPassword"
                  class="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 duration-150 disabled:opacity-50"
                >
                  <span v-if="isChangingPassword" class="flex items-center">
                    <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Updating...
                  </span>
                  <span v-else>Update Password</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  User, 
  MapPin, 
  CreditCard, 
  Lock, 
  Newspaper, 
  ScanFace,
  CheckCircle,
  XCircle,
  Loader2,
  Pencil,
  Save
} from 'lucide-vue-next';
import { useBasicAuthStore } from '~/stores/basic-user-auth';
import { useBiometrics } from '~/composables/useBiometrics';
import type { UserSubscription, Payment } from '~/models';

useHead({
  title: 'My Account - Graphic NewsPlus',
});

const authStore = useBasicAuthStore();
const { register, isBiometricsAvailable } = useBiometrics();
// State
const isLoadingProfile = ref(true);
const userMetaData = ref<UserAccountMetaData | null>(null);
const subscriptions = ref<UserSubscription[]>([]);
const payments = ref<Payment[]>([]);

// Sample Test Data
  const mockSubscriptions: UserSubscription[] = [
    {
      id: 'sub_1',
      subscriptionIdentifier: 'Daily Graphic - Annual Plan',
      userId: 'u_1',
      username: 'Test User',
      email: 'test@example.com',
      currentSubscriptionPlanId: 'plan_daily',
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString(),
      currentBillingCycle: 'Yearly',
      isActive: true,
      nextRenewalDate: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString(),
      fee: 365.00,
      createdAt: new Date().toISOString()
    },
    {
      id: 'sub_2',
      subscriptionIdentifier: 'The Mirror - Weekly',
      userId: 'u_1',
      username: 'Test User',
      email: 'test@example.com',
      currentSubscriptionPlanId: 'plan_mirror',
      startDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      currentBillingCycle: 'Weekly',
      isActive: false,
      nextRenewalDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      fee: 15.00,
      createdAt: new Date().toISOString()
    }
  ];

  const mockPayments: Payment[] = [
    {
      id: 'pay_1',
      userName: 'Test User',
      userEmail: 'test@example.com',
      packageName: 'Daily Graphic - Annual',
      amountPaid: '365.00',
      receiptNo: 'GN-88493',
      transactionReference: 'T39482L001',
      status: 'Success',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString()
    },
    {
      id: 'pay_2',
      userName: 'Test User',
      userEmail: 'test@example.com',
      packageName: 'The Mirror - Weekly',
      amountPaid: '15.00',
      receiptNo: 'GN-12345',
      transactionReference: 'T99283K442',
      status: 'Success',
      createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString()
    }
  ];

// Passkey State
const isRegisteringPasskey = ref(false);

// Profile Edit State
const isEditingProfile = ref(false);
const isUpdatingProfile = ref(false);
const profileSuccess = ref(false);
const profileError = ref('');
const profileForm = reactive({
  fullname: '',
  username: '',
  email: '',
  phoneNumber: ''
});

// Password State
const isChangingPassword = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref('');
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

 


async function fetchUserMetaData() {
  try {

    isLoadingProfile.value = true;
    userMetaData.value = await getUserAccountMetaData();
    
  } catch (err) {
    console.error('Failed to load profile', err);
  } finally {
    isLoadingProfile.value = false;
  }
}


// Actions
function startEditingProfile() {
  if (userMetaData.value?.bioData) {
    profileForm.fullname = userMetaData.value.bioData.fullname || '';
    profileForm.username = userMetaData.value.bioData.username || '';
    profileForm.email = userMetaData.value.bioData.email || '';
    profileForm.phoneNumber = userMetaData.value.bioData.phoneNumber || '';
  }
  isEditingProfile.value = true;
  profileSuccess.value = false;
  profileError.value = '';
}

function cancelEditingProfile() {
  isEditingProfile.value = false;
  profileError.value = '';
}

async function handleUpdateProfile() {
  profileError.value = '';
  profileSuccess.value = false;
  
  if (!profileForm.fullname || !profileForm.email) {
    profileError.value = "Full Name and Email are required.";
    return;
  }
  
  try {
    isUpdatingProfile.value = true;
    
    // We send only the editable fields
    const payload = {
      fullname: profileForm.fullname,
      email: profileForm.email,
      phoneNumber: profileForm.phoneNumber
    };
    
    const success = await updateProfile(payload);
    
    if (success) {
      profileSuccess.value = true;
      isEditingProfile.value = false;
      // Refresh user metadata
      await fetchUserMetaData();
    } else {
      profileError.value = "Failed to update profile. Please try again.";
    }
  } catch (err) {
    console.error("Profile update error:", err);
    profileError.value = "An error occurred. Please try again later.";
  } finally {
    isUpdatingProfile.value = false;
  }
}

async function handleEnablePasskey() {
  try {
    isRegisteringPasskey.value = true;
    
    // Check if device supports it
    const available = await isBiometricsAvailable();
    if (!available) {
      alert("Your device does not support biometric authentication or passkeys.");
      return;
    }

    // Prepare user model for registration
    const userModel = {
      id: authStore.user?.idTokenClaims.userId || 'unknown',
      email: userProfile.value?.email || authStore.user?.idTokenClaims.email || '',
      name: userProfile.value?.firstName 
        ? `${userProfile.value.firstName} ${userProfile.value.lastName}` 
        : (authStore.user?.idTokenClaims.name || 'User')
    };

    // Client-side WebAuthn registration
    const credential = await register(userModel);
    
    // Send to backend
    const result = await registerBiometric(credential, userModel.id);
    
    if (result.success) {
      // Refresh profile to show "Enabled" state
      await fetchProfile();
      alert("Express Login enabled successfully!");
    } else {
      throw new Error(result.message || "Registration failed on server.");
    }

  } catch (err) {
    console.error("Passkey error:", err);
    alert("Failed to enable Express Login. Please try again.");
  } finally {
    isRegisteringPasskey.value = false;
  }
}

async function handleChangePassword() {
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
    
    const success = await changeUserPassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });

    if (success) {
      passwordSuccess.value = true;
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    } else {
      passwordError.value = "Failed to update password. Please check your current password.";
    }

  } catch (err) {
    console.error("Password change error:", err);
    passwordError.value = "An error occurred. Please try again later.";
  } finally {
    isChangingPassword.value = false;
  }
}


onMounted(async () => {
  if (!authStore.isAuthenticated) {
    navigateTo('/');
    return;
  }
   
  await fetchUserMetaData();
});


</script>
