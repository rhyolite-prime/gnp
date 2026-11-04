import { defineStore, skipHydrate } from 'pinia';
import type { AffiliateSigninResponseModel } from '../models';

const STORAGE_KEY = 'affiliateAuth';
const IDENTITY_COOKIE = 'gnp-affiliate-user-identity';
const PROFILE_COOKIE = 'gnp-affiliate-user-profile';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const COOKIE_OPTIONS = {
    maxAge: COOKIE_MAX_AGE,
    secure: true,
    sameSite: 'strict' as const,
    priority: 'medium' as const,
};

/**
 * The subset of the sign-in response we persist for display. The token lives in
 * its own cookie; the transient two-factor fields are not needed after login.
 */
type AffiliateProfile = Pick<
    AffiliateSigninResponseModel,
    'affiliateNo' | 'affiliateEmail' | 'affiliateName' | 'affiliateId'
>;

function toProfile(info: AffiliateSigninResponseModel): AffiliateProfile {
    return {
        affiliateNo: info.affiliateNo,
        affiliateEmail: info.affiliateEmail,
        affiliateName: info.affiliateName,
        affiliateId: info.affiliateId,
    };
}

function isProfile(value: unknown): value is AffiliateProfile {
    return !!value && typeof value === 'object' && 'affiliateName' in value && 'affiliateEmail' in value;
}

export const useAffiliateAuthStore = defineStore('affiliateAuth', () => {
    const gnpAffiliateUserIdentityCookie = useCookie<string | null>(IDENTITY_COOKIE, COOKIE_OPTIONS);

    // Persist the display metadata in a cookie as well as sessionStorage. A cookie
    // is readable during SSR and survives reloads, new tabs and browser restarts;
    // sessionStorage alone is per-tab and invisible to the server, which let
    // Pinia's SSR hydration wipe the restored name/email on every reload.
    const affiliateProfileCookie = useCookie<AffiliateProfile | null>(PROFILE_COOKIE, {
        ...COOKIE_OPTIONS,
        default: () => null,
    });

    const affiliateUser = ref<AffiliateSigninResponseModel | null>(null);
    const isAuthenticated = ref(false);
    const accessToken = ref<string | null>(null);
    // The complete login response (including affiliateNo) is persisted in affiliateAuth.
    const affiliateNo = computed(() => affiliateUser.value?.affiliateNo || null);

    /**
     * Writes the session to every persistence layer so the next reload, a new
     * tab, or a server render can all restore it.
     */
    function persistSession(info: AffiliateSigninResponseModel) {
        gnpAffiliateUserIdentityCookie.value = info.token;
        affiliateProfileCookie.value = toProfile(info);
        if (import.meta.client) {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                    affiliate: info,
                    accessToken: info.token,
                    isAuthenticated: true,
                }));
            } catch {
                // sessionStorage can throw (e.g. private browsing); the cookies
                // above still persist the session.
            }
        }
    }

    /**
     * Sets the affiliate authentication data and persists it to storage.
     * @param affiliateInfo The sign-in response data for the affiliate
     */
    function setAffiliate(affiliateInfo: AffiliateSigninResponseModel | null) {
        if (!affiliateInfo) {
            clearAffiliate();
            return;
        }
        affiliateUser.value = affiliateInfo;
        isAuthenticated.value = true;
        accessToken.value = affiliateInfo.token || null;
        persistSession(affiliateInfo);
    }

    /**
     * Clears the affiliate authentication session from every persistence layer.
     */
    function clearAffiliate() {
        affiliateUser.value = null;
        isAuthenticated.value = false;
        accessToken.value = null;
        gnpAffiliateUserIdentityCookie.value = null;
        affiliateProfileCookie.value = null;
        if (import.meta.client) {
            try {
                sessionStorage.removeItem(STORAGE_KEY);
            } catch {
                // Ignore storage failures on logout.
            }
        }
    }

    /**
     * Restores the affiliate session. Prefers the freshest same-tab source
     * (sessionStorage, client only), then falls back to the cookies, which are
     * also readable during SSR and survive new tabs / browser restarts.
     */
    function initializeFromStorage() {
        let info: AffiliateSigninResponseModel | null = null;
        let token: string | null = null;

        if (import.meta.client) {
            try {
                const raw = sessionStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed?.affiliate && parsed?.accessToken) {
                        info = parsed.affiliate;
                        token = parsed.accessToken;
                    }
                }
            } catch {
                // Clear corrupted storage so it can't keep breaking restoration.
                try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
            }
        }

        const cookieToken = gnpAffiliateUserIdentityCookie.value;
        if (!token && cookieToken) {
            token = cookieToken;
        }
        if (!info && cookieToken && isProfile(affiliateProfileCookie.value)) {
            info = {
                ...affiliateProfileCookie.value,
                token: cookieToken,
                requiresTwoFactorAuth: false,
                requestId: '',
            };
        }

        if (!token) return;

        accessToken.value = token;
        isAuthenticated.value = true;
        if (info) affiliateUser.value = info;

        // Re-sync the persistence layers on the client only (never send Set-Cookie
        // from SSR). This also migrates legacy sessions that only had sessionStorage.
        if (import.meta.client && info) {
            persistSession(info);
        }
    }

    // Initialize on both server and client. Cookies are readable in both
    // environments, so SSR renders the correct metadata and the client restores
    // the session after a reload instead of being overwritten by hydration.
    initializeFromStorage();

    return {
        gnpAffiliateUserIdentityCookie,
        // These refs are restored from cookie/sessionStorage above. Skip Pinia's
        // SSR hydration so the server's (possibly empty) payload cannot wipe them.
        affiliateUser: skipHydrate(affiliateUser),
        affiliateNo,
        isAuthenticated: skipHydrate(isAuthenticated),
        accessToken: skipHydrate(accessToken),
        setAffiliate,
        clearAffiliate,
        initializeFromStorage,
    };
});
