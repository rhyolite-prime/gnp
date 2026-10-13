import { defu } from "defu";

export const gnpAdminUserHttpClient = async <T>(urlPath: string, baseURL?: string, options?: any) => {

  const config = useRuntimeConfig().public;
  
  const gnpAdminUserAuthIdentity = useGnpAdminUserAuthIdentity();
  const authToken = gnpAdminUserAuthIdentity.value;
    
  const defaultOptions = {
    lazy: false,
    immediate: true,
    server: false,
    baseURL: baseURL || config.proxyApiBaseURL,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    mode: "cors",
  };

  if (options?.query) {
    options.query = filterQueryParams(options.query);
  }
  
  return await $fetch<T>(urlPath, {
    ...defu(options, defaultOptions),

     onRequestError({ request, error, options }) {
         console.log(error);
    },

     onResponseError({ request, response, options }) {
        console.log(response);
        
        // Show error message using the global $toast plugin
        if (import.meta.client) {
            const { $toast } = useNuxtApp();
          const data = response._data;
            
            if (data?.message) {
                $toast.error(data.message);
            } else if (data?.error?.detail) {
                $toast.error(data.error.detail);
            } else {
                $toast.error("An unexpected error occurred");
            }
        }
    },
  });
};
