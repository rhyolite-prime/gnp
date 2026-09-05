import { defineStore } from 'pinia';
import type { AccountInfo } from '@azure/msal-browser';



export const useBasicAuthStore = defineStore('auth',  () => {
  
  const user = ref<EnhancedUserInfo | null>(null);
  const isAuthenticated = ref(false);
  const isAuthLoading = ref(false);
  const authProvider = ref<'microsoft' | 'google' | 'gnp' | null>(null);
  const accessToken = ref<string | null>(null);
  const userPhotoUrl = ref<string>();
  const gnpUserIdentityCookie = useCookie('gnp-user-identity', {
    maxAge: 60 * 60 * 24 * 366,
    secure: true,
    httpOnly: false,
    sameSite: 'strict',
  });
  
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
      sessionStorage.setItem('authUser', JSON.stringify({
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
        sessionStorage.setItem('accessToken', token);
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
          sessionStorage.setItem('authUser', JSON.stringify(userInfo));
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
        sessionStorage.removeItem('accessToken');
      }
    }
  }
  
  // Restore user session from storage on app initialization
  function initializeFromStorage() {

    isAuthLoading.value = true;

    try {

      const storedAuth = sessionStorage.getItem('authUser');
      const storedToken = sessionStorage.getItem('accessToken');
      
      if (storedAuth && storedToken) {

        const parsedAuth = JSON.parse(storedAuth);
        user.value = parsedAuth;
        isAuthenticated.value = true;
        accessToken.value = storedToken;
        sessionStartedAt.value = Date.now();
       
        
      } else if (gnpUserIdentityCookie.value) {
        // Fallback to cookie if sessionStorage is empty (e.g. browser was closed and reopened)
        setAccessToken(gnpUserIdentityCookie.value as string);

         
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
      const storedAuth = sessionStorage.getItem('authUser');
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        parsedAuth.photoUrl = url;
        
        // Also update the photoUrl in the stored user object
        if (parsedAuth.user) {
          parsedAuth.user.photoUrl = url || undefined;
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
    userPhotoUrl.value = undefined;
    sessionStartedAt.value = null;

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('authUser');
      sessionStorage.removeItem('accessToken');
    }

    // Expire the cookie so the browser removes it
    gnpUserIdentityCookie.value = null;

    // CRITICAL: also clear the shared useState that gnpUserHttpClient reads from.
    // Without this, the stale JWT persists in memory even though the cookie is gone,
    // causing authenticated API calls to fire on pages visited after logout.
    const gnpUserAuthState = useState<string | null>('gnpUserAuth');
    gnpUserAuthState.value = null;
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
    setUser,
    setAccessToken,
    setUserPhotoUrl,
    clearUser,
    initializeFromStorage
  };
});
