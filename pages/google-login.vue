<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
      <div class="text-center">
        <!-- Google Logo -->
        <div class="flex justify-center mb-6">
          <svg class="h-10 w-10 mr-2" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path id="Icon_awesome-google" d="M24,12.843c0,6.847-4.766,11.719-11.8,11.719a12.085,12.085,0,0,1-12.2-12,12.085,12.085,0,0,1,12.2-12A11.834,11.834,0,0,1,20.375,3.7l-3.32,3.14C12.713,2.721,4.638,5.817,4.638,12.563A7.577,7.577,0,0,0,12.2,20.14c4.83,0,6.639-3.406,6.925-5.173H12.2V10.84H23.808A10.356,10.356,0,0,1,24,12.843Z" data-name="Icon awesome-google" fill="#DB4437" transform="translate(0 -0.563)"></path>
          </svg>
        </div>
        
        <h1 class="text-2xl font-bold mb-4">Google Authentication</h1>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center space-y-3">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Processing your authentication...</p>
          <p class="text-sm text-gray-500">Please wait while we complete the sign-in process.</p>
        </div>
        
        <!-- Success State - will show briefly before redirect -->
        <div v-if="!loading && !error && authStore.isAuthenticated" class="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          <svg class="h-6 w-6 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="font-medium">Authentication successful!</p>
          <p class="text-sm mt-1">You will be redirected momentarily...</p>
        </div>
        
        <!-- Error State -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          <svg class="h-6 w-6 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="font-medium">Authentication failed</p>
          <p class="text-sm mt-1">{{ error }}</p>
          <p class="text-sm text-gray-500 mt-3">You will be redirected to the home page shortly.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
 
import { useGoogleAuth } from '~/composables/useGoogleAuth';
import { useBasicAuthStore } from '~/stores/basic-user-auth';
import { useRouter } from 'vue-router';

const loading = ref(true);
const error = ref(null);
const router = useRouter();
const authStore = useBasicAuthStore();
const { processGoogleAuthResponse } = useGoogleAuth();
const redirectPath = ref('/');

 onMounted(async () => {
  try {
    // Get the fragment from URL (Google OAuth uses fragment/hash for response)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);
    
    // Process the response
    const userInfo = await processGoogleAuthResponse(hashParams.size > 0 ? hashParams : searchParams);
    
    // Get redirect path from session storage
    const storedRedirectPath = sessionStorage.getItem('googleOAuthRedirectPath');
    if (storedRedirectPath) {
      redirectPath.value = storedRedirectPath;
      sessionStorage.removeItem('googleOAuthRedirectPath'); // Clear after use
    }
    
    if (userInfo) {
      // Success - show success message briefly before redirecting
      loading.value = false;
      setTimeout(() => {
        router.push(redirectPath.value);
      }, 1000);
    } else {
      // No user info returned, but no explicit error
      error.value = 'Authentication completed but no user data was returned.';
      loading.value = false;
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  } catch (err) {
    console.error('Error processing Google authentication:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred';
    loading.value = false;
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }
});
</script>
