import type { SubscriptionPlan, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getAffiliates(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<SubscriptionPlan[]>>>('admin/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function createAffiliate(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('admin/create-subscription-plan', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateAffiliate(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('admin/update-affiliate', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteAffiliate(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('admin/delete-affiliate', "", { query, method: "delete", });
    return response.success;
}