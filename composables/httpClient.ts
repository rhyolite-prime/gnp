import { defu } from "defu";

export const httpClient = async <T>(urlPath: string, baseURL?: string, options?: any) => {

  const config = useRuntimeConfig().public;
  
    
  const defaultOptions = {
    lazy: false,
    immediate: true,
    server: false,
    baseURL: baseURL || config.proxyApiBaseURL,
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
    },
  });
};
