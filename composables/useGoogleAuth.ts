import { ref } from 'vue';
import { useRuntimeConfig } from '#imports';
import { useAuthStore } from '~/stores/auth';

export function useGoogleAuth() {
  const config = useRuntimeConfig();
  const isAuthenticated = ref(false);
  const user = ref<any | null>(null);
  const error = ref<unknown | null>(null);
  const loading = ref(false);

  // Get auth store if we're on the client side
  let authStore: ReturnType<typeof useAuthStore> | null = null;
  if (typeof window !== 'undefined') {
    try {
      authStore = useAuthStore();
    } catch (e) {
      console.warn('Auth store not available:', e);
    }
  }

  // Google OAuth configuration
  const googleAuthConfig = {
    client_id: config.public.googleClientId,
    // Use production URL in production, and localhost in development
    redirect_uri: process.env.NODE_ENV === 'production' 
      ? 'https://dev.graphicnewsplus.com/google-login'
      : 'http://localhost:3009/google-login',
    response_type: 'token',
    scope: 'email profile',
    include_granted_scopes: 'true',
    state: generateRandomState(),
  };

  // Generate random state string for CSRF protection
  function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  // Construct Google OAuth URL
  function getGoogleAuthUrl(redirectPath = '/') {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    // Add OAuth parameters
    authUrl.searchParams.append('client_id', googleAuthConfig.client_id);
    authUrl.searchParams.append('redirect_uri', googleAuthConfig.redirect_uri);
    authUrl.searchParams.append('response_type', googleAuthConfig.response_type);
    authUrl.searchParams.append('scope', googleAuthConfig.scope);
    authUrl.searchParams.append('include_granted_scopes', googleAuthConfig.include_granted_scopes);
    
    // Generate and store state in session storage for security
    const state = generateRandomState();
    sessionStorage.setItem('googleOAuthState', state);
    
    // Store the redirect path to return after authentication
    sessionStorage.setItem('googleOAuthRedirectPath', redirectPath);
    
    authUrl.searchParams.append('state', state);
    
    return authUrl.toString();
  }

  // Sign in with Google
  const signInWithGoogle = async (redirectPath = '/') => {
    loading.value = true;
    error.value = null;

    try {
      const authUrl = getGoogleAuthUrl(redirectPath);
      window.location.href = authUrl;
      // The rest of the authentication flow will be handled by the google-login.vue page
    } catch (e) {
      console.error('Error during Google authentication setup:', e);
      error.value = e;
      loading.value = false;
    }
  };

  // Process Google auth response
  const processGoogleAuthResponse = async (params: URLSearchParams) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Check if there's an error response
      const errorParam = params.get('error');
      if (errorParam) {
        throw new Error(`Google auth error: ${errorParam}`);
      }
      
      // Get auth tokens
      const accessToken = params.get('access_token');
      if (!accessToken) {
        throw new Error('No access token returned');
      }
      
      // Verify state parameter to prevent CSRF attacks
      const state = params.get('state');
      const storedState = sessionStorage.getItem('googleOAuthState');
      sessionStorage.removeItem('googleOAuthState'); // Clear it after use
      
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }
      
      // Get user info with the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userInfo = await userInfoResponse.json();
      
      // Update local state
      user.value = userInfo;
      isAuthenticated.value = true;
      
      // Update auth store
      if (authStore) {
        // Create an account object compatible with our auth store
        const account = {
          name: userInfo.name,
          username: userInfo.email,
          idTokenClaims: {
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            sub: userInfo.sub,
          }
        };
        
        authStore.setUser(account, 'google');
        authStore.setAccessToken(accessToken);
      }
      
      return userInfo;
    } catch (e) {
      console.error('Error processing Google auth response:', e);
      error.value = e;
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Clear local state
      user.value = null;
      isAuthenticated.value = false;
      
      // Clear auth store
      if (authStore) {
        authStore.clearUser();
      }
      
      // Google doesn't need a specific sign-out API call when using implicit flow
    } catch (e) {
      console.error('Error during sign out:', e);
      error.value = e;
    }
  };

  return {
    signInWithGoogle,
    processGoogleAuthResponse,
    signOut,
    isAuthenticated,
    user,
    error,
    loading,
  };
}
