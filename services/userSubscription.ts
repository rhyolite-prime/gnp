import type { UserSubscription, GuestSubscriptionResponseModel, NewsPaperEntitlementResponseModel, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getUserSubscription(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<UserSubscription[]>>>('subscription/get-all', "", { query });
    return response.result;
}


export async function guestSubscription(payload: object) {
    
  const response = await httpClient<BaseApiResponse<GuestSubscriptionResponseModel>>('subscription/guest', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function guestOneTimePurchase(payload: object) {
    
  const response = await httpClient<BaseApiResponse<GuestSubscriptionResponseModel>>('subscription/guest-onetime', "", {
    method: "post",
    body: payload,
  });
  
  return response.result;
}

export async function fulfillGuestOneTimePurchase(query: object) {
    
  const response = await httpClient<BaseApiResponse<string>>('subscription/fulfill-guest-onetime', "", { query });
  return response.result;
}

export async function validateNewsPaperEntitlement(query: object) {
    
  const response = await httpClient<BaseApiResponse<NewsPaperEntitlementResponseModel>>('subscription/validate-newspaper-entitlement', "", { query });
  return response.result;
}

export async function userSubscription(payload: object) {

  const response = await httpClient<BaseApiResponse<object>>('subscription/user', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}