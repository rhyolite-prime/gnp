import type {  BaseApiResponse, BasePaginationModel } from "~/models";

 

export async function registerAffiliate(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('affiliate/submit-application', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}