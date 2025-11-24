import type { UserSubscription, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getUserSubscription(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<UserSubscription[]>>>('subscription/get-all', "", { query });
    return response.result;
}


export async function guestSubscription(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('subscription/guest', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function userSubscription(payload: object) {

  const response = await httpClient<BaseApiResponse<object>>('subscription/user', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}