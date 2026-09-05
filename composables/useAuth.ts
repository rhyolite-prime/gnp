 import type {BaseApiResponse, GnpUserAuthModel } from "~/models";
  

export const useAuth = () => {
    const router = useRouter();

    const { $generateAlertError } = useNuxtApp();

    const gnpUserIdentityCookie = useCookie("gnp-user-identity", {
        maxAge: 60 * 60 * 24 * 366,
    });

    const gnpUserAuthIdentity = useGnpUserAuthIdentity();

    const config = useRuntimeConfig();

    const getBusinessAuth = async (payload: Object) => {
         

        try {
            const response = await $fetch<BaseApiResponse<GnpUserAuthModel>>(
                "users/generate-jwt-token",
                {
                    method: "POST",
                    body: payload,
                    baseURL: config.public.proxyApiBaseURL,
                }
            );

            if (response.success) {
                //save to cookie
                gnpUserIdentityCookie.value = JSON.stringify(response.result);
 

                await router.push("/");
            }
            return response;
        } catch (err: any) {
             
        }
    };

    const signOut = () => {
        // Delegate to the store so ALL auth state (cookie, useState, sessionStorage)
        // is cleared atomically from one place.
        const authStore = useBasicAuthStore();
        authStore.clearUser();

        window.location.href = '/';
    };

    return {
        getBusinessAuth,
        signOut,
    };
};
