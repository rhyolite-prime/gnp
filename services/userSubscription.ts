import type {
  UserSubscription,
  SubscriptionResponseModel,
  NewsPaperEntitlementResponseModel,
  BaseApiResponse,
  BasePaginationModel,
  NewsPaper,
  GuestSubscriptionPayload,
  MemberSubscriptionPayload,
  ArchiveAccessResponse,
} from "~/models";
// Type-only import (erased at build time); `toArchiveAccessState` itself is
// auto-imported from `utils/` like every other helper in this project.
import type { ArchiveAccessState } from "~/utils/archiveAccess";


export async function getUserSubscription(query: object) {

    const response = await gnpUserHttpClient<BaseApiResponse<BasePaginationModel<UserSubscription[]>>>('subscription/get-all', "", { query });
    return response.result;
}

/**
 * Checks whether the current reader may open an archived document.
 *
 * GET `subscription/validate-archive-access/{id}` answers with
 * `{ success, message, result: { metadata: { hasAccess, fileType, ... } } }`.
 * The envelope is flattened into `ArchiveAccessState` so the detail page can
 * branch on `hasAccess` alone — a failed request, a missing result or a null
 * metadata block all resolve to `hasAccess: false` (the paywall) instead of
 * throwing and blanking the page.
 */
export async function validateArchiveAccess(id: string): Promise<ArchiveAccessState> {
  const archiveId = typeof id === 'string' ? id.trim() : '';

  if (!archiveId) {
    return toArchiveAccessState(null);
  }

  try {
    const response = await gnpUserHttpClient<ArchiveAccessResponse>(
      `subscription/validate-archive-access/${encodeURIComponent(archiveId)}`,
      "",
    );

    return toArchiveAccessState(response);
  } catch (error) {
    // 401/403/network: the reader is not verified, which is exactly what the
    // paywall is for. Log for diagnostics and let the page render the upsell.
    console.error('Archive access validation failed:', error);
    return toArchiveAccessState(null);
  }
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