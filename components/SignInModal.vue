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

      <!-- Guest Purchase Notice -->
      <!-- <div class="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-sm">
        If you purchased a newspaper as a guest, please set your password to access your account.
        <button 
          @click="beginPasswordReset" 
          class="underline text-red-600 hover:text-red-500 ml-1"
        >
          Set Password
        </button>
      </div> -->
      
      <!-- Step 1: Enter Email -->
      <form v-if="step === 1" @submit.prevent="checkEmailStatus">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            v-model="usernameOrEmail" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            required
          />
        </div>

        <button 
          type="submit"
          class="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center justify-center"
          :disabled="emailCheckLoading"
        >
          <svg v-if="emailCheckLoading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ emailCheckLoading ? 'Checking...' : 'Continue' }}
        </button>
      </form>

      <!-- Step 2: Email has password → Show password form -->
      <form v-if="step === 2 && emailHasPassword" @submit.prevent="handleEmailSignIn">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            v-model="password" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            required
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Sign in
        </button>
      </form>

      <!-- Step 2: Email has NO password → Show set-password prompt -->
      <div v-if="step === 2 && !emailHasPassword" class="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-md">
        You need to set a password on your account to continue.
        <button 
          @click="beginPasswordReset" 
          :disabled="otpLoading"
          class="underline text-red-600 hover:text-red-500 ml-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <svg v-if="otpLoading" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ otpLoading ? 'Please wait...' : 'Set Password' }}
        </button>
      </div>
      
      <!-- Step 3: Enter OTP -->
      <form v-if="step === 3" @submit.prevent="verifyOtp">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
          <input 
            type="text" 
            v-model="otp" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            required
          />
        </div>

        <button 
          type="submit"
          class="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
          :disabled="verifyOtpLoading"
        >
          <svg v-if="verifyOtpLoading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ verifyOtpLoading ? 'Verifying...' : 'Verify OTP' }}
        </button>
      </form>

      <!-- Step 4: Set New Password -->
      <form v-if="step === 4" @submit.prevent="submitNewPassword">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            type="password" 
            v-model="newPassword" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password" 
            v-model="confirmPassword" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
            required
          />
        </div>

        <button 
          type="submit"
          class="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
          :disabled="passwordResetLoading"
        >
          <svg v-if="passwordResetLoading" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ passwordResetLoading ? 'Saving...' : 'Set Password' }}
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

const emit = defineEmits(['close', 'set-password']);

const password = ref('');
const remember = ref(false);
const isGuestUser = ref(false);
const route = useRoute();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const step = ref(1);
const emailCheckLoading = ref(false);
const emailHasPassword = ref(false);
const usernameOrEmail = ref('');
const otpRequestId = ref('');
const userId = ref('');
const sessionId = ref('');

// New state variables for OTP and password reset flow
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const otpLoading = ref(false);
const verifyOtpLoading = ref(false);
const passwordResetLoading = ref(false);
const isSigningIn = ref(false);

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
  const baseRedirectUrl = 'http://localhost:3009/ms-login';
  const currentPath = route?.fullPath || '/';
  // Only add the redirectTo parameter if we're not already on the home page
  if (currentPath !== '/') {
    return `${baseRedirectUrl}?redirectTo=${encodeURIComponent(currentPath)}`;
  }
  return baseRedirectUrl;
};

const checkEmailStatus = async () => {
  emailCheckLoading.value = true;
  try {
    // Determine identifierType by checking if value is an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const identifierType = emailRegex.test(usernameOrEmail.value) ? "email" : "username";

    let response = await checkAccountStatus({ 
      identifier: usernameOrEmail.value, 
      identifierType 
    });

    emailHasPassword.value = response.hasPassword;
    step.value = 2;
  } catch (err) {
    console.error('Email check error:', err);
  } finally {
    emailCheckLoading.value = false;
  }
};

// Functions for OTP and password reset flow
const beginPasswordReset = async () => {
  otpLoading.value = true;
  try {
     
    let response = await sendOtp({email: usernameOrEmail.value , sessionId: "b13ef0e1-1c73-4615-a331-1c4b92a51c11" });

    if (response.requestId) {
      otpRequestId.value = response.requestId;
      step.value = 3;
    }

  } catch (err) {
    console.error('OTP send error:', err);
  } finally {
    otpLoading.value = false;
  }
};

const verifyOtp = async () => {

  verifyOtpLoading.value = true;

  try {

    let response = await validateOtp({email: usernameOrEmail.value, otp: otp.value, requestId: otpRequestId.value });

    if (response.isValid) {
      userId.value = response.userId;
      sessionId.value = response.sessionId;
      step.value = 4;
    }
  } catch (err) {
    console.error('OTP verify error:', err);
  } finally {
    verifyOtpLoading.value = false;
  }
};

const submitNewPassword = async () => {
  passwordResetLoading.value = true;

  try {

    let isSuccessful = await setPassword({ email: usernameOrEmail.value, userId: userId.value , sessionId: sessionId.value, password: newPassword.value, confirmPassword: confirmPassword.value })

    // go back to normal login flow
    if (isSuccessful) {
      step.value = 1;
      emailHasPassword.value = true;
    }

    //use toast to display error message.
    
  } catch (err) {
    console.error('Password reset error:', err);
  } finally {
    passwordResetLoading.value = false;
  }
};

const handleEmailSignIn = async () => {

  isSigningIn.value = true;
  console.log('Signing in with email:', usernameOrEmail.value);

  try {

    let response = await SignIn({ usernameOrEmail: usernameOrEmail.value, password: password.value })
    if (response && response.token) {

      const gnpUserIdentityCookie = useCookie("gnp-user-identity", {
        maxAge: 60 * 60 * 24,
        secure: true,
        httpOnly: false,
        priority: "medium",
        sameSite: "strict"
      });
      
      gnpUserIdentityCookie.value = response.token;
      authStore.setAccessToken(response.token);
      emit('close');
    }
    
    //use toast to display error message.
    
  } catch (err) {
    console.error('Email signin error:', err);
    isSigningIn.value = false;
  } finally {
    isSigningIn.value = false;
  }

  
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