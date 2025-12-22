import type { SubscriptionPlan, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getSubscriptionPlans(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<SubscriptionPlan[]>>>('admin/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function createSubscriptionPlan(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('admin/create-subscription-plan', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteSubscriptionPlan(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('admin/delete-subscription-plan', "", { query, method: "delete", });
    return response.success;
}