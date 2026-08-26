import { defineStore } from 'pinia';
import type { PartnerSigninResponseModel } from '../models';

export const usePartnerAuthStore = defineStore('partnerAuth', () => {
    const partner = ref<PartnerSigninResponseModel | null>(null);
    const isAuthenticated = ref(false);
    const accessToken = ref<string | null>(null);
    const gnpPartnerUserIdentityCookie = useCookie('gnp-partner-user-identity');
    /**
     * Sets the partner authentication data and persists it to storage
     * @param partnerInfo The sign-in response data for the partner
     */
    function setPartner(partnerInfo: PartnerSigninResponseModel | null) {
        partner.value = partnerInfo;
        isAuthenticated.value = !!partnerInfo;
        accessToken.value = partnerInfo?.token || null;

        if (partnerInfo) {
            sessionStorage.setItem('partnerAuth', JSON.stringify({
                partner: partnerInfo,
                accessToken: partnerInfo.token,
                isAuthenticated: true,
            }));
        } else {
            sessionStorage.removeItem('partnerAuth');
        }
    }

    /**
     * Clears the partner authentication session
     */
    function clearPartner() {
        partner.value = null;
        isAuthenticated.value = false;
        accessToken.value = null;
        sessionStorage.removeItem('partnerAuth');
         
        gnpPartnerUserIdentityCookie.value = null;
    }

    /**
     * Restores the partner session from storage
     */
    function initializeFromStorage() {
        try {
            const storedAuth = sessionStorage.getItem('partnerAuth');
            if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth);
                partner.value = parsedAuth.partner;
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
        partner,
        isAuthenticated,
        accessToken,
        setPartner,
        clearPartner,
        initializeFromStorage
    };
});
