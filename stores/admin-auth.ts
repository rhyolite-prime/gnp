import { defineStore } from 'pinia';
import type { AccountInfo } from '@azure/msal-browser';

// sessionStorage keys are namespaced per auth domain. The consumer store
// (stores/basic-user-auth.ts) owns the generic 'authUser' / 'accessToken' keys,
// so the admin store must NOT reuse them: an admin JWT written there would be
// hydrated into the public-site session on the next page load (and vice versa).
const ADMIN_USER_STORAGE_KEY = 'adminAuthUser';
const ADMIN_TOKEN_STORAGE_KEY = 'adminAccessToken';

// Enhanced user interface with additional profile info
export interface EnhancedUserInfo extends AccountInfo {

  displayName?: string;
  email?: string;
  photoUrl?: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  graphProfile?: any;
  provider: string;
  isAuthenticated: boolean;
  idTokenClaims: {
    email: string;
    name: string;
    picture: string;
    sub: string;
    userId: string;
    username: string;
  }
   
}

 

 

// NOTE: this id MUST stay unique across the app. Pinia caches store instances by
// id (pinia._s), so a second defineStore('auth', ...) would silently shadow this
// one and useAdminAuthStore() would hand back the other store's instance.
export const useAdminAuthStore = defineStore('adminAuth',  () => {
  
  const user = ref<EnhancedUserInfo | null>(null);
  const isAuthenticated = ref(false);
  const isAuthLoading = ref(false);
  const authProvider = ref<'microsoft' | 'google' | 'gnp' | null>(null);
  const accessToken = ref<string | null>(null);
  const userPhotoUrl = ref<string>();
  const permissions = ref<string[]>([]);
  const gnpAdminUserIdentityCookie = useCookie('gnp-admin-user-identity');

  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('gnp_admin_db', 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('auth')) {
          db.createObjectStore('auth');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const setIDB = async (key: string, value: any) => {
    try {
      const db = await initDB();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction('auth', 'readwrite');
        const store = tx.objectStore('auth');
        const request = store.put(value, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('IDB set error', e);
    }
  };

  const getIDB = async (key: string): Promise<any> => {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('auth', 'readonly');
        const store = tx.objectStore('auth');
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('IDB get error', e);
      return null;
    }
  };

  const removeIDB = async (key: string) => {
    try {
      const db = await initDB();
      return new Promise<void>((resolve, reject) => {
        const tx = db.transaction('auth', 'readwrite');
        const store = tx.objectStore('auth');
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('IDB remove error', e);
    }
  };

  async function savePermissions(perms: string[]) {
    permissions.value = perms || [];
    if (typeof window !== 'undefined') {
      await setIDB('permissions', permissions.value);
    }
  }

  function setPermissions(perms: string[]) {
    permissions.value = perms || [];
  }
  
  // Track session start time for session-duration-on-logout metric
  const sessionStartedAt = ref<number | null>(null);

  // Set user info after successful authentication
  function setUser(userInfo: EnhancedUserInfo | null, provider: 'microsoft' | 'google' | 'gnp' | null = null) {
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
      userPhotoUrl.value = userInfo.photoUrl;
    }
    
    // You could store this info in localStorage/sessionStorage for persistence
    if (userInfo && typeof window !== 'undefined') {
      sessionStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify({
        user: userInfo,
        provider,
        isAuthenticated: true,
        photoUrl: userPhotoUrl.value
      }));

      
    }
  }
  
  // Set access token
  function setAccessToken(token: string) {
    accessToken.value = token;
    if (token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
      }

      //decode the jwt and store object in authUser in key in localstorage
      // Decode JWT and store in localStorage
      try {

        const [, payloadBase64] = token.split('.');
        const decodedPayload = JSON.parse(atob(payloadBase64));

        const userInfo = {
            email: decodedPayload.email,
            givenName: decodedPayload.firstName,
            surname: decodedPayload.surName,
            jobTitle:  "",
            photoUrl: "https://res.cloudinary.com/rhyoliteprime/image/upload/v1533814738/images_6.png",
            provider: "gnp",
            isAuthenticated: true,
            idTokenClaims: {
              email: decodedPayload.email,
              name: decodedPayload.fullName,
              picture: decodedPayload.picture,
              sub: decodedPayload.sub || "",
              userId: decodedPayload.userId,
              username: decodedPayload.username
            }
        };

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(userInfo));
        }
        
        // Update state reactively
        user.value = userInfo as any;
        isAuthenticated.value = true;
        authProvider.value = 'gnp';
        userPhotoUrl.value = userInfo.photoUrl;
        
         

      } catch (err) {
        console.error('Failed to decode JWT:', err);

         
      }

    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      }
    }
  }
  
  // Restore user session from storage on app initialization
  function initializeFromStorage() {

    isAuthLoading.value = true;

    try {

      const storedAuth = sessionStorage.getItem(ADMIN_USER_STORAGE_KEY);
      const storedToken = sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
      
      if (storedAuth && storedToken) {

        const parsedAuth = JSON.parse(storedAuth);
        user.value = parsedAuth;
        isAuthenticated.value = true;
        accessToken.value = storedToken;
        sessionStartedAt.value = Date.now();
       
        // Read permissions asynchronously from IndexedDB
        if (typeof window !== 'undefined') {
          getIDB('permissions').then((perms) => {
            if (perms) permissions.value = perms;
          });
        }
        
      } else if (gnpAdminUserIdentityCookie.value) {
        // Fallback to cookie if sessionStorage is empty (e.g. browser was closed and reopened)
        setAccessToken(gnpAdminUserIdentityCookie.value as string);
        // We still need to load permissions from IDB
        if (typeof window !== 'undefined') {
          getIDB('permissions').then((perms) => {
            if (perms) permissions.value = perms;
          });
        }
         
      }

      isAuthLoading.value = false;
    } catch (e) {
      console.error('Failed to restore auth from storage:', e);
      // Clear potentially corrupted storage
       
    }
  }
  
  // Set user photo URL
  function setUserPhotoUrl(url: string | null) {
    console.log('Setting user photo URL:', url ? 'URL provided' : 'null');
    userPhotoUrl.value = url || undefined;
    
    // Update in session storage and user object if user exists
    if (user.value && typeof window !== 'undefined') {
      // Update the photoUrl in the user object
      user.value = {
        ...user.value,
        photoUrl: url || undefined
      };
      
      // Update in session storage
      const storedAuth = sessionStorage.getItem(ADMIN_USER_STORAGE_KEY);
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        parsedAuth.photoUrl = url;
        
        // Also update the photoUrl in the stored user object
        if (parsedAuth.user) {
          parsedAuth.user.photoUrl = url || undefined;
        }
        
        sessionStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(parsedAuth));
      }
    }
  }

  // Clear user session on logout
  function clearUser() {
    

    user.value = null;
    isAuthenticated.value = false;
    authProvider.value = null;
    accessToken.value = null;
    userPhotoUrl.value = undefined;
    sessionStartedAt.value = null;

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_USER_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    }

    permissions.value = [];
    if (typeof window !== 'undefined') {
      removeIDB('permissions');
    }

    // Expire the cookie so the browser removes it
    gnpAdminUserIdentityCookie.value = null;

    // CRITICAL: also clear the shared useState that gnpAdminUserHttpClient reads from.
    // Without this, the stale JWT persists in memory even though the cookie is gone,
    // causing authenticated admin API calls to fire after logout.
    const gnpAdminUserAuthState = useState<string | null>('gnpAdminUserAuth');
    gnpAdminUserAuthState.value = null;
  }
  
  // Initialize from storage when store is created
  if (typeof window !== 'undefined') {
    initializeFromStorage();
  }
  
  return {
    user,
    isAuthenticated,
    isAuthLoading,
    authProvider,
    accessToken,
    userPhotoUrl,
    permissions,
    savePermissions,
    setPermissions,
    setUser,
    setAccessToken,
    setUserPhotoUrl,
    clearUser,
    initializeFromStorage
  };
});
