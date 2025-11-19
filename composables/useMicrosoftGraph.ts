import { useAuthStore } from '~/stores/auth';

export interface MicrosoftUserProfile {
  id: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  userPrincipalName: string;
  email?: string;
  jobTitle?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  officeLocation?: string;
  preferredLanguage?: string;
  mail?: string;
  photoUrl?: string;
}

export function useMicrosoftGraph() {
  const loading = ref(false);
  const error = ref<unknown | null>(null);
  const userProfile = ref<MicrosoftUserProfile | null>(null);
  const userPhoto = ref<string | null>(null);
  const authStore = useAuthStore();
  
  // Fetch user profile from Microsoft Graph API
  const fetchUserProfile = async (providedToken?: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Use provided token or fall back to the stored token
      const accessToken = providedToken || authStore.accessToken;
      if (!accessToken) {
        throw new Error('No access token available');
      }
      
      console.log('Fetching user profile with token:', accessToken.substring(0, 10) + '...');
      
      // Fetch user profile from Microsoft Graph API
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
      }
      
      const profileData = await response.json();
      userProfile.value = profileData;
      console.log('Profile data retrieved:', profileData.displayName);
      
      // Try to fetch user photo
      await fetchUserPhoto(accessToken);
      
      // Update user info in the auth store with additional details
      if (authStore.user && authStore.authProvider === 'microsoft') {
        const enhancedUser = {
          ...authStore.user,
          displayName: profileData.displayName,
          givenName: profileData.givenName,
          surname: profileData.surname,
          jobTitle: profileData.jobTitle,
          photoUrl: userPhoto.value,
          graphProfile: profileData
        };
        
        authStore.setUser(enhancedUser, 'microsoft');
      }
      
      return profileData;
    } catch (e) {
      console.error('Error fetching Microsoft user profile:', e);
      error.value = e;
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  // Fetch user photo from Microsoft Graph API
  const fetchUserPhoto = async (accessToken?: string | null) => {
    try {
      const token = accessToken || authStore.accessToken;
      if (!token) {
        throw new Error('No access token available');
      }
      
      console.log('Fetching user photo...');
      
      const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('User has no profile photo');
          // User has no profile photo, this is not an error
          return null;
        }
        throw new Error(`Failed to fetch user photo: ${response.status} ${response.statusText}`);
      }
      
      // Get the photo as blob and convert to data URL
      const photoBlob = await response.blob();
      const photoUrl = URL.createObjectURL(photoBlob);
      userPhoto.value = photoUrl;
      
      console.log('User photo retrieved successfully');
      
      // Set the photo URL in our auth store
      authStore.setUserPhotoUrl(photoUrl);
      
      // Update the user object in the auth store with the photo URL directly
      if (authStore.user) {
        const updatedUser = {
          ...authStore.user,
          photoUrl: photoUrl
        };
        
        // We pass 'microsoft' as the provider to maintain the current auth provider
        // But we set the existing photoUrl to ensure it's persisted
        authStore.setUser(updatedUser, 'microsoft');
      }
      
      return photoUrl;
    } catch (e) {
      console.error('Error fetching Microsoft user photo:', e);
      // We don't set the error value here as the photo is not essential
      return null;
    }
  };
  
  // Parse JWT token to extract claims
  const parseJwt = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return null;
    }
  };
  
  // Extract user information from auth code and token
  const processAuthCode = (code: string, clientInfo?: string) => {
    try {
      if (!code) return null;
      
      // Parse client_info if available (contains user information)
      if (clientInfo) {
        const decodedClientInfo = JSON.parse(atob(clientInfo));
        console.log('Decoded client info:', decodedClientInfo);
        
        return {
          name: decodedClientInfo.name,
          username: decodedClientInfo.preferred_username,
          oid: decodedClientInfo.oid,
          tid: decodedClientInfo.tid
        };
      }
      
      return null;
    } catch (e) {
      console.error('Error processing auth code:', e);
      return null;
    }
  };
  
  return {
    loading,
    error,
    userProfile,
    userPhoto,
    fetchUserProfile,
    fetchUserPhoto,
    parseJwt,
    processAuthCode
  };
}
