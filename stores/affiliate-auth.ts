import { defineStore } from 'pinia';
import type { AffiliateSigninResponseModel } from '../models';

export const useAffiliateAuthStore = defineStore('affiliateAuth', () => {
    const affiliateUser = ref<AffiliateSigninResponseModel | null>(null);
    const isAuthenticated = ref(false);
    const accessToken = ref<string | null>(null);

    const gnpAffiliateUserIdentityCookie = useCookie('gnp-affiliate-user-identity');
    /**
     * Sets the partner authentication data and persists it to storage
     * @param affiliateInfo The sign-in response data for the partner
     */
    function setAffiliate(affiliateInfo: AffiliateSigninResponseModel | null) {
        affiliateUser.value = affiliateInfo;
        isAuthenticated.value = !!affiliateInfo;
        accessToken.value = affiliateInfo?.token || null;

        if (affiliateInfo) {
            sessionStorage.setItem('affiliateAuth', JSON.stringify({
                affiliate: affiliateInfo,
                accessToken: affiliateInfo.token,
                isAuthenticated: true,
            }));
        } else {
            sessionStorage.removeItem('affiliateAuth');
        }
    }

    /**
     * Clears the partner authentication session
     */
    function clearPartner() {
        affiliateUser.value = null;
        isAuthenticated.value = false;
        accessToken.value = null;
        sessionStorage.removeItem('affiliateAuth');
        
        gnpAffiliateUserIdentityCookie.value = null;
    }

    /**
     * Restores the partner session from storage
     */
    function initializeFromStorage() {
        try {
            const storedAuth = sessionStorage.getItem('partnerAuth');
            if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth);
                affiliateUser.value = parsedAuth.affiliate;
                isAuthenticated.value = parsedAuth.isAuthenticated;
                accessToken.value = parsedAuth.accessToken;
            }
        } catch (e) {
            console.error('Failed to restore partner auth from storage:', e);
            // Clear storage if it's corrupted
            sessionStorage.removeItem('partnerAuth');
        }
    }

    // Initialize the store from session storage when it's created on the client side
    if (typeof window !== 'undefined') {
        initializeFromStorage();
    }

    return {
        affiliateUser,
        isAuthenticated,
        accessToken,
        setAffiliate,
        clearPartner,
        initializeFromStorage
    };
});
