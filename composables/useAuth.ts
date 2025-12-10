 import type {BaseApiResponse, GnpUserAuthModel } from "~/models";
  

export const useAuth = () => {
    const router = useRouter();

    const { $generateAlertError } = useNuxtApp();

    const gnpUserIdentityCookie = useCookie("gnp-user-identity", {
        maxAge: 60 * 60 * 24,
    });

    const gnpUserAuthIdentity = useGnpUserAuthIdentity();

    const config = useRuntimeConfig();

    const getBusinessAuth = async (payload: Object) => {
        const response = await $fetch<BaseApiResponse<GnpUserAuthModel>>(
            "users/generate-jwt-token",
            {
                method: "POST",
                body: payload,
                baseURL: config.public.proxyApiAuthBaseURL,
            }
        );

        if (response.success) {
            //save to cookie
            
            gnpUserIdentityCookie.value = JSON.stringify(response.result);

            await router.push("/");
        }
        return response;
    };

    const signOut = () => {
        gnpUserIdentityCookie.value = null;

        window.location.href = "/";

        //router.push("/");
    };

    return {
        getBusinessAuth,
        signOut,
    };
};
