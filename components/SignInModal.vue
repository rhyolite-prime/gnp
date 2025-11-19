<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
      <!-- Close button -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Modal header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Sign In</h2>
        <p class="text-gray-600 mt-1">Login to Graphic News Plus</p>
      </div>
      
      <!-- Email/Password Form -->
      <form @submit.prevent="handleEmailSignIn">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Username or Email Address</label>
          <input 
            type="text" 
            v-model="usernameOrEmail" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            required
          />
        </div>
        
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              v-model="remember" 
              class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
          </div>
          
          <a href="#" class="text-sm text-red-600 hover:text-red-500">Forgot password?</a>
        </div>
        
        <button 
          type="submit" 
          class="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Sign in
        </button>
      </form>
      
      <!-- Divider -->
      <div class="relative flex items-center mt-6 mb-6">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="flex-shrink mx-4 text-gray-600">Or sign in with</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      
      <!-- Social Login Buttons -->
      <div class="grid grid-cols-2 gap-4">
        <button 
          @click="handleGoogleSignIn" 
          :disabled="googleLoading"
          class="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >

          <svg v-if="!googleLoading" class="h-5 w-5 mr-2" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path id="Icon_awesome-google" d="M24,12.843c0,6.847-4.766,11.719-11.8,11.719a12.085,12.085,0,0,1-12.2-12,12.085,12.085,0,0,1,12.2-12A11.834,11.834,0,0,1,20.375,3.7l-3.32,3.14C12.713,2.721,4.638,5.817,4.638,12.563A7.577,7.577,0,0,0,12.2,20.14c4.83,0,6.639-3.406,6.925-5.173H12.2V10.84H23.808A10.356,10.356,0,0,1,24,12.843Z" data-name="Icon awesome-google" fill="#DB4437" transform="translate(0 -0.563)"></path>
          </svg>
          
          <svg v-if="googleLoading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ googleLoading ? 'Signing in...' : 'Google' }}
        </button>
        
        <button 
          @click="handleMicrosoftSignIn" 
          :disabled="msLoading"
          class="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!msLoading" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022"/>
            <path d="M24 24H12.6V12.6H24V24z" fill="#00A4EF"/>
            <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#7FBA00"/>
            <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900"/>
          </svg>
          <svg v-if="msLoading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ msLoading ? 'Signing in...' : 'Microsoft' }}
        </button>
      </div>
      
      <!-- Error messages -->
      <div v-if="msError" class="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ typeof msError === 'string' ? msError : 'Microsoft authentication error. Please try again.' }}
      </div>
      
      <div v-if="googleError" class="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ typeof googleError === 'string' ? googleError : 'Google authentication error. Please try again.' }}
      </div>

       
    </div>
  </div>
</template>

<script setup>

import { useMsalAuth } from '~/composables/useMsalAuth';
import { useGoogleAuth } from '~/composables/useGoogleAuth';
import { useAuthStore } from '~/stores/auth';
import * as msal from '@azure/msal-browser';
import { useRuntimeConfig } from '#imports';

const email = ref('');
const password = ref('');
const remember = ref(false);
const route = useRoute();
const authStore = useAuthStore();
const config = useRuntimeConfig();

// Track Microsoft auth state
const msAuth = useMsalAuth();
const msLoading = computed(() => msAuth.loading.value);
const msError = computed(() => msAuth.error.value);

// Track Google auth state
const googleAuth = useGoogleAuth();
const googleLoading = computed(() => googleAuth.loading.value);
const googleError = computed(() => googleAuth.error.value);

// Build redirect URL with the current page as the redirectTo parameter
const getRedirectUrl = () => {
  //const baseRedirectUrl = 'https://trade.rhyoliteprime.com/ms-login';
  const baseRedirectUrl = 'http://localhost:3060/ms-login';
  const currentPath = route?.fullPath || '/';
  // Only add the redirectTo parameter if we're not already on the home page
  if (currentPath !== '/') {
    return `${baseRedirectUrl}?redirectTo=${encodeURIComponent(currentPath)}`;
  }
  return baseRedirectUrl;
};

const handleEmailSignIn = () => {
  // Here you would implement your email authentication logic
  console.log('Signing in with email:', email.value);
  // After successful authentication:
  // authStore.setUser(userObject, 'email');
  // $emit('close');
};

const handleGoogleSignIn = async () => {
  console.log('Signing in with Google');
  try {
    // Get current path to redirect back after authentication
    const currentPath = route?.fullPath || '/';
    
    // Start Google OAuth flow
    await googleAuth.signInWithGoogle(currentPath);
    
    // The page will redirect, so we don't need to handle anything after this
  } catch (err) {
    console.error('Google sign-in error:', err);
  }
};

// Use redirect flow instead of popup for Microsoft sign-in
const handleMicrosoftSignIn = async () => {
  console.log('Signing in with Microsoft');
  try {
    msAuth.loading.value = true;
    msAuth.error.value = null;
    
    // Create a new MSAL instance for redirect
    const msalInstance = new msal.PublicClientApplication({
      auth: {
        clientId: config.public.microsoftClientId,
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: getRedirectUrl(),
        navigateToLoginRequestUrl: true,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
      },
    });
    
    await msalInstance.initialize();
    
    // Check if user is already signed in
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      // User already logged in
      msalInstance.setActiveAccount(accounts[0]);
      authStore.setUser(accounts[0], 'microsoft');
      
      // Try to silently acquire a token
      try {
        const silentRequest = {
          scopes: ['User.Read'],
          account: accounts[0]
        };
        
        const silentResult = await msalInstance.acquireTokenSilent(silentRequest);
        authStore.setAccessToken(silentResult.accessToken);
        
        // Close the modal since we're already authenticated
        msAuth.loading.value = false;
        $emit('close');
        return;
      } catch (silentErr) {
        console.warn('Could not acquire token silently:', silentErr);
        // Will proceed to redirect login
      }
    }
    
    // Redirect to Microsoft login
    await msalInstance.loginRedirect({
      scopes: ['User.Read'],
      redirectStartPage: window.location.href
    });
    
    // The page will redirect, so we don't need to handle anything after this
  } catch (err) {
    console.error('Microsoft sign-in error:', err);
    msAuth.error.value = err;
    msAuth.loading.value = false;
  }
};
</script>