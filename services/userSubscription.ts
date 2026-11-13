import type {
  UserSubscription,
  SubscriptionResponseModel,
  NewsPaperEntitlementResponseModel,
  BaseApiResponse,
  BasePaginationModel,
  NewsPaper,
  GuestSubscriptionPayload,
  MemberSubscriptionPayload,
} from "~/models";


export async function getUserSubscription(query: object) {

    const response = await gnpUserHttpClient<BaseApiResponse<BasePaginationModel<UserSubscription[]>>>('subscription/get-all', "", { query });
    return response.result;
}

export async function validateArchiveAccess(id: string) {

    const response = await gnpUserHttpClient<BaseApiResponse<any>>('subscription/validate-archive-access', "");
    return response.result;
}


export async function guestSubscription(payload: GuestSubscriptionPayload) {

  const response = await gnpUserHttpClient<BaseApiResponse<SubscriptionResponseModel>>('subscription/guest', "", {
    method: "post",
    body: payload,
  });

  // The API creates the reader account + identity token even when the envelope's
  // `success` is false (e.g. "Failed to initialize payment"). `data` is therefore
  // returned whenever the result payload exists, and `success` tells the caller
  // whether checkout actually started; the token lets them sign the buyer in
  // either way instead of losing it.
  if (!response.result) {
    return {
      success: false,
      message: response.message,
    };
  }

  return {
    success: response.success !== false,
    message: response.message,
    data: response.result,
  };
}


export async function initializeUserOneTimeBuy(newsPaperId: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<SubscriptionResponseModel>>(`subscription/user-onetime-buy?newsPaperId=${newsPaperId}`, "",);
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
  
  const response = await gnpUserHttpClient<BaseApiResponse<SubscriptionResponseModel>>('subscription/buy-copy', "", {
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
    
  const response = await gnpUserHttpClient<BaseApiResponse<SubscriptionResponseModel>>('subscription/guest-onetime-buy', "", {
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
    
  const response = await gnpUserHttpClient<BaseApiResponse<string>>('subscription/fulfill-guest-onetime', "", { query });
  return response.result;
}

export async function fulfillUserOneTimePurchase(query: object) {
    
  const response = await gnpUserHttpClient<BaseApiResponse<string>>('subscription/fulfill-user-onetime', "", { query });
  return response.result;
}

export async function fulfillBuyCopy(query: object) {
    
  const response = await gnpUserHttpClient<BaseApiResponse<string>>('subscription/fulfill-buy-copy', "", { query });
  return response.success;
}

export async function validateNewsPaperEntitlement(query: object) {
  // check if user is logged in
  const gnpUserAuthIdentity = useGnpUserAuthIdentity();

  //if user is logged, use the gnpUserHttpClient
  if (gnpUserAuthIdentity.value) {
    const response = await gnpUserHttpClient<BaseApiResponse<NewsPaperEntitlementResponseModel>>('subscription/validate-newspaper-entitlement', "", { query });
    return response.result;
  }

  // user isnt logged in return a well formatted response
  return {
    hasAccess: false,
    uniqueId: ""
  } as NewsPaperEntitlementResponseModel;
}

/**
 * Starts a subscription purchase for an already signed-in reader.
 *
 * The bearer token from `gnp-user-identity` identifies the buyer, so the payload
 * only describes the package (see `MemberSubscriptionPayload`). Mirrors
 * `guestSubscription`'s contract: `{ success, message, data }`, with `data`
 * carrying the Paystack handles (`paymentUrl`, `reference`) when present.
 */
export async function userSubscription(payload: MemberSubscriptionPayload) {

  const response = await gnpUserHttpClient<BaseApiResponse<SubscriptionResponseModel>>('subscription/user', "", {
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
    success: response.success !== false,
    message: response.message,
    data: response.result,
  };
}


export async function getRedactedNewsPaperDetailsViaUniqueId(id: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<NewsPaper>>(`subscription/get-newspaper-redacted-details-via-unique-id?id=${id}`, "",);
  return {
    success: response.success,
    data: response.result,
  };
}

export async function findNewspaperByDate(publicationId: string,publicationDate: string) {
  const response = await gnpUserHttpClient<BaseApiResponse<NewsPaper>>(`subscription/find-newspaper-by-date?publicationId=${publicationId}&publicationDate=${publicationDate}`, "",);
  return {
    success: response.success,
    data: response.result,
  };
}