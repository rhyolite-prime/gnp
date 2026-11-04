import { defineStore } from 'pinia';
import type { AffiliateSigninResponseModel } from '../models';

export const useAffiliateAuthStore = defineStore('affiliateAuth', () => {
    const affiliateUser = ref<AffiliateSigninResponseModel | null>(null);
    const isAuthenticated = ref(false);
    const accessToken = ref<string | null>(null);

    const gnpAffiliateUserIdentityCookie = useCookie<string | null>('gnp-affiliate-user-identity', { maxAge: 60 * 60 * 24 * 30, secure: true, sameSite: 'strict', priority: 'medium' });
    /**
     * Sets the affiliate authentication data and persists it to storage
     * @param affiliateInfo The sign-in response data for the affiliate
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
     * Clears the affiliate authentication session
     */
    function clearAffiliate() {
        affiliateUser.value = null;
        isAuthenticated.value = false;
        accessToken.value = null;
        sessionStorage.removeItem('affiliateAuth');
        
        gnpAffiliateUserIdentityCookie.value = null;
    }

    /**
     * Restores the affiliate session from storage
     */
    function initializeFromStorage() {
        try {
            const storedAuth = sessionStorage.getItem('affiliateAuth');
            if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth);
                affiliateUser.value = parsedAuth.affiliate;
                isAuthenticated.value = parsedAuth.isAuthenticated;
                accessToken.value = parsedAuth.accessToken;
            }
        } catch (e) {
            console.error('Failed to restore affiliate auth from storage:', e);
            // Clear storage if it's corrupted
            sessionStorage.removeItem('affiliateAuth');
        }
    }

    // Initialize the store from session storage when it's created on the client side
    if (typeof window !== 'undefined') {
        initializeFromStorage();
    }

    return {
        gnpAffiliateUserIdentityCookie,
        affiliateUser,
        isAuthenticated,
        accessToken,
        setAffiliate,
        clearAffiliate,
        initializeFromStorage
    };
});
