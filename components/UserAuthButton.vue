<template>
  <div v-if="isAuthLoading" class="flex items-center space-x-2">
    <div class="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    <div class="hidden md:block w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
  </div>

    <div v-if="authStore && !isAuthLoading && authStore.isAuthenticated">
      
      <button 
        @click="toggleDropdown" 
        class="flex items-center space-x-2 focus:outline-none"
        ref="buttonRef"
      >
        <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
          <img 
            v-if="authStore.userPhotoUrl" 
            :src="authStore.userPhotoUrl" 
            alt="Profile" 
            class="w-full h-full object-cover"
          />
          <div 
            v-else
            class="w-full h-full bg-orange-100 flex items-center justify-center text-orange-800 font-medium"
          >
            {{ userInitials }}
          </div>
        </div>
        <span class="hidden md:block text-sm font-medium">{{ userName }}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          :class="{ 'transform rotate-180': isOpen }"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <!-- Dropdown menu -->
      <div 
        v-if="isOpen" 
        class="absolute right-50 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
      >
        <div class="px-4 py-3 border-b border-gray-100">
          <p class="text-sm leading-5 font-medium text-gray-900">{{ userName }}</p>
          <p class="text-xs leading-4 text-gray-500 mt-1 truncate">{{ userEmail }}</p>
        </div>
        <a 
          href="#" 
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click.prevent="navigateTo('/account')">
           Account
        </a>
        <a 
          href="#" 
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click.prevent="navigateTo('/notifications')">
           Notifications
        </a>
        <a 
          href="#" 
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          @click.prevent="navigateTo('/subscriptions')">
          Subscription
        </a>
        <div class="border-t border-gray-100">
          <a 
            href="#" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click.prevent="handleSignOut"
          >
            Sign out
          </a>
        </div>
      </div>

    </div>

  <button v-if="authStore && !isAuthLoading && !authStore.isAuthenticated"  class="btn-primary" @click="openSignInModal" >Sign In</button>

</template>

<script lang="ts" setup>

import { useAuthStore } from '~/stores/auth';
import { useMsalAuth } from '~/composables/useMsalAuth';
import { useGoogleAuth } from '~/composables/useGoogleAuth';

const props = defineProps({
  showSignInModal: {
    type: Function,
    required: true
  }
});

const authStore = useAuthStore();
const msalAuth = useMsalAuth();
const googleAuth = useGoogleAuth();
const router = useRouter();
const isOpen = ref(false);
const isAuthLoading = ref(true);
const buttonRef = ref(null);

// Get user display information
const userName = computed(() => {
  const user = authStore.user;
  if (!user) return '';

  if (user.givenName) return user.givenName;
  if (user.email) return user.email;
  
  // MSAL specific fields
  if (authStore.authProvider === 'microsoft') {
    const name = user.name || 
                user.displayName || 
                (user.idTokenClaims && user.idTokenClaims.name);
    return name || 'User';
  }
  
  return 'User';
});

const userEmail = computed(() => {
  const user = authStore.user;
  if (!user) return '';
  
  if (user.username) return user.email;
  
  // MSAL specific fields
  if (authStore.authProvider === 'microsoft') {
    const email = user.username || 
                 (user.idTokenClaims && user.idTokenClaims.name);
    return email || '';
  }
  
  return '';
});

const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return 'U';
  
  const parts = name.split(' ');
  if (parts.length === 1) return name.substring(0, 1).toUpperCase();
  
  return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const openSignInModal = () => {
  props.showSignInModal();
};

const navigateTo = (path) => {
  isOpen.value = false;
  router.push(path);
};

const handleSignOut = async () => {
  isOpen.value = false;
  
  // Sign out from the appropriate service based on the auth provider
  if (authStore.authProvider === 'microsoft') {
    await msalAuth.signOut();
  } else if (authStore.authProvider === 'google') {
    await googleAuth.signOut();
  }
  
  // Always clear the auth store
  authStore.clearUser();

  const gnpUserIdentityCookie = useCookie('gnp-user-identity');
  gnpUserIdentityCookie.value = null;
  
  router.push('/newspapers');

};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target) && isOpen.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
   
  authStore.initializeFromStorage();
   
   
  isAuthLoading.value = false;
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
   
  document.removeEventListener('click', handleClickOutside);
});



</script>

 