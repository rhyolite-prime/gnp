import { ref } from 'vue';
import * as msal from '@azure/msal-browser';
import { useRuntimeConfig } from '#imports';
import { useBasicAuthStore } from '~/stores/basic-user-auth';

export function useMsalAuth() {
  const config = useRuntimeConfig();
  const isAuthenticated = ref(false);
  const user = ref<msal.AccountInfo | null>(null);
  const error = ref<unknown | null>(null);
  const loading = ref(false);

  // Get auth store if we're on the client side
  let authStore: ReturnType<typeof useBasicAuthStore> | null = null;
  if (typeof window !== 'undefined') {
    try {
      authStore = useBasicAuthStore();
    } catch (e) {
      console.warn('Auth store not available:', e);
    }
  }

  // MSAL configuration
  const msalConfig = {
    auth: {
      clientId: config.public.microsoftClientId,
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: 'https://dev.graphicnewsplus.com/ms-login',
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  };

  // Create the MSAL application object
  let msalInstance: msal.PublicClientApplication | null = null;
  
  // Initialize MSAL instance
  const initializeMsal = async () => {
    if (typeof window !== 'undefined' && !msalInstance) {
      try {
        msalInstance = new msal.PublicClientApplication(msalConfig);
        await msalInstance.initialize();
        
        // Check if there's a cached account after initialization
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0]);
          user.value = accounts[0];
          isAuthenticated.value = true;
        }
        
        return msalInstance;
      } catch (e) {
        console.error('Failed to initialize MSAL:', e);
        error.value = 'Failed to initialize Microsoft authentication.';
        return null;
      }
    }
    return msalInstance;
  };

  // Initialize on client side if possible
  if (typeof window !== 'undefined') {
    initializeMsal();
  }

  // Login scopes
  const loginRequest = {
    scopes: ['User.Read'],
  };

  // Sign in with Microsoft
  const signInWithMicrosoft = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Initialize MSAL if it hasn't been initialized yet
      const msalApp = await initializeMsal();
      
      if (!msalApp) {
        error.value = 'MSAL not initialized';
        return null;
      }

      // Check if users are in the cache
      const accounts = msalApp.getAllAccounts();
      if (accounts.length > 0) {
        // User already logged in
        msalApp.setActiveAccount(accounts[0]);
        const currentAccount = msalApp.getActiveAccount();
        user.value = currentAccount;
        isAuthenticated.value = true;
        
        // Update auth store if available
        if (authStore) {
          authStore.setUser(currentAccount, 'microsoft');
        }
        
        return currentAccount;
      }

      // Login popup
      const authResult = await msalApp.loginPopup(loginRequest);
      if (authResult) {
        user.value = authResult.account;
        isAuthenticated.value = true;
        
        // Update auth store if available
        if (authStore) {
          authStore.setUser(authResult.account, 'microsoft');
          authStore.setAccessToken(authResult.accessToken);
        }
        
        return authResult.account;
      }
      return null;
    } catch (e) {
      console.error('Error during MSAL authentication:', e);
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const msalApp = await initializeMsal();
      if (!msalApp) {
        return;
      }
      
      const logoutRequest = {
        account: msalApp.getActiveAccount(),
      };
      
      // Clear local state
      user.value = null;
      isAuthenticated.value = false;
      
      // Clear auth store if available
      if (authStore) {
        authStore.clearUser();
      }
      
      // Log out from MSAL
      await msalApp.logout(logoutRequest);
    } catch (e) {
      console.error('Error during sign out:', e);
      error.value = e;
    }
  };

  // Get user details
  const getUserInfo = async () => {
    try {
      const msalApp = await initializeMsal();
      if (!msalApp) {
        return null;
      }
      
      const account = msalApp.getActiveAccount();
      return account;
    } catch (e) {
      console.error('Error getting user info:', e);
      error.value = e;
      return null;
    }
  };

  return {
    signInWithMicrosoft,
    signOut,
    getUserInfo,
    isAuthenticated,
    user,
    error,
    loading,
  };
}
