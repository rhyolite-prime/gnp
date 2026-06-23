import type { UserSubscription, SubscriptionResponseModel, NewsPaperEntitlementResponseModel, BaseApiResponse, BasePaginationModel, NewsPaper } from "~/models";


export async function getUserSubscription(query: object) {

    const response = await httpClient<BaseApiResponse<BasePaginationModel<UserSubscription[]>>>('subscription/get-all', "", { query });
    return response.result;
}


export async function guestSubscription(payload: object) {
    
  const response = await httpClient<BaseApiResponse<SubscriptionResponseModel>>('subscription/guest', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}


export async function initializeUserOneTimeBuy(newsPaperId: string) {
  const response = await httpClient<BaseApiResponse<SubscriptionResponseModel>>(`subscription/user-onetime-buy?newsPaperId=${newsPaperId}`, "",);
  if (!response.result) {
    return {
      success: false,
      message: response.message,
    };
  }

  return {
    success: true,
    data: response.result,
  };
}

export async function buyCopy(payload: object) {
  
  const response = await httpClient<BaseApiResponse<SubscriptionResponseModel>>('subscription/buy-copy', "", {
    method: "post",
    body: payload,
  });
  
  if (!response.result) {
    return {
      success: false,
      message: response.message,
    };
  }

  return {
    success: true,
    data: response.result,
  };
}

export async function guestOneTimePurchase(payload: object) {
    
  const response = await httpClient<BaseApiResponse<SubscriptionResponseModel>>('subscription/guest-onetime-buy', "", {
    method: "post",
    body: payload,
  });
  
  if (!response.result) {
    return {
      success: false,
      message: response.message,
    };
  }

  return {
    success: true,
    data: response.result,
  };
}

export async function fulfillGuestOneTimePurchase(query: object) {
    
  const response = await httpClient<BaseApiResponse<string>>('subscription/fulfill-guest-onetime', "", { query });
  return response.result;
}

export async function fulfillUserOneTimePurchase(query: object) {
    
  const response = await httpClient<BaseApiResponse<string>>('subscription/fulfill-user-onetime', "", { query });
  return response.result;
}

export async function fulfillBuyCopy(query: object) {
    
  const response = await httpClient<BaseApiResponse<string>>('subscription/fulfill-buy-copy', "", { query });
  return response.success;
}

export async function validateNewsPaperEntitlement(query: object) {
    
  const response = await gnpUserHttpClient<BaseApiResponse<NewsPaperEntitlementResponseModel>>('subscription/validate-newspaper-entitlement', "", { query });
  return response.result;
}

export async function userSubscription(payload: object) {

  const response = await httpClient<BaseApiResponse<object>>('subscription/user', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

 


export async function getRedactedNewsPaperDetailsViaUniqueId(id: string) {
  const response = await httpClient<BaseApiResponse<NewsPaper>>(`subscription/get-newspaper-redacted-details-via-unique-id?id=${id}`, "",);
  return {
    success: response.success,
    data: response.result,
  };
}

export async function findNewspaperByDate(publicationId: string,publicationDate: string) {
  const response = await httpClient<BaseApiResponse<NewsPaper>>(`subscription/find-newspaper-by-date?publicationId=${publicationId}&publicationDate=${publicationDate}`, "",);
  return {
    success: response.success,
    data: response.result,
  };
}