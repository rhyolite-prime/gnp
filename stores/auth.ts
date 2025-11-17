import { defineStore } from 'pinia';
import type { AccountInfo } from '@azure/msal-browser';

// Enhanced user interface with additional profile info
export interface EnhancedUserInfo extends AccountInfo {

  displayName?: string;
  photoUrl?: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  graphProfile?: any;
   
}

 

export const useAuthStore = defineStore('auth', () => {
  const user = ref<EnhancedUserInfo | null>(null);
  const isAuthenticated = ref(false);
  const authProvider = ref<'microsoft' | 'google' | 'email' | null>(null);
  const accessToken = ref<string | null>(null);
  const userPhotoUrl = ref<string>(null);
  
  // Set user info after successful authentication
  function setUser(userInfo: EnhancedUserInfo | null, provider: 'microsoft' | 'google' | 'email' | null = null) {
    console.log('Setting user info:', userInfo);
    user.value = userInfo;
    isAuthenticated.value = !!userInfo;
    authProvider.value = provider;
    
    if (provider == "google" && userInfo) {
      userPhotoUrl.value = userInfo.idTokenClaims?.picture;
    }

    // Set user photo URL if available in the userInfo object
    // But don't overwrite an existing photo URL if it's already set (e.g., from Microsoft Graph API)
    if (provider == "microsoft" && userInfo && !userPhotoUrl.value) {
      userPhotoUrl.value = userInfo?.photoUrl;
    }
    
    // You could store this info in localStorage/sessionStorage for persistence
    if (userInfo) {
      sessionStorage.setItem('authUser', JSON.stringify({
        user: userInfo,
        provider,
        isAuthenticated: true,
        photoUrl: userPhotoUrl.value
      }));
    }
  }
  
  // Set access token
  function setAccessToken(token: string | null) {
    accessToken.value = token;
    if (token) {
      sessionStorage.setItem('accessToken', token);
    } else {
      sessionStorage.removeItem('accessToken');
    }
  }
  
  // Restore user session from storage on app initialization
  function initializeFromStorage() {
    try {
      const storedAuth = sessionStorage.getItem('authUser');
      const storedToken = sessionStorage.getItem('accessToken');
      
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        user.value = parsedAuth.user;
        authProvider.value = parsedAuth.provider;
        isAuthenticated.value = parsedAuth.isAuthenticated;
        
        // Make sure we set the photo URL properly
        if (parsedAuth.photoUrl) {
          console.log('Restoring user photo URL from session storage');
          userPhotoUrl.value = parsedAuth.photoUrl;
          
          // Also ensure it's set in the user object
          if (parsedAuth.user && !parsedAuth.user.photoUrl) {
            parsedAuth.user.photoUrl = parsedAuth.photoUrl;
            user.value = parsedAuth.user;
          }
        } else {
          userPhotoUrl.value = null;
        }
      }
      
      if (storedToken) {
        accessToken.value = storedToken;
      }
    } catch (e) {
      console.error('Failed to restore auth from storage:', e);
      // Clear potentially corrupted storage
      sessionStorage.removeItem('authUser');
      sessionStorage.removeItem('accessToken');
    }
  }
  
  // Set user photo URL
  function setUserPhotoUrl(url: string | null) {
    console.log('Setting user photo URL:', url ? 'URL provided' : 'null');
    userPhotoUrl.value = url;
    
    // Update in session storage and user object if user exists
    if (user.value) {
      // Update the photoUrl in the user object
      user.value = {
        ...user.value,
        photoUrl: url
      };
      
      // Update in session storage
      const storedAuth = sessionStorage.getItem('authUser');
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        parsedAuth.photoUrl = url;
        
        // Also update the photoUrl in the stored user object
        if (parsedAuth.user) {
          parsedAuth.user.photoUrl = url;
        }
        
        sessionStorage.setItem('authUser', JSON.stringify(parsedAuth));
      }
    }
  }

  // Clear user session on logout
  function clearUser() {
    user.value = null;
    isAuthenticated.value = false;
    authProvider.value = null;
    accessToken.value = null;
    userPhotoUrl.value = null;
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('accessToken');
  }
  
  // Initialize from storage when store is created
  if (typeof window !== 'undefined') {
    initializeFromStorage();
  }
  
  return {
    user,
    isAuthenticated,
    authProvider,
    accessToken,
    userPhotoUrl,
    setUser,
    setAccessToken,
    setUserPhotoUrl,
    clearUser,
    initializeFromStorage
  };
});
