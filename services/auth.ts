import type { AccountStatusResponseModel, AdminSigninResponseModel, AffiliateSigninResponseModel, OtpResponseModel, VerifyOtpResponseModel, SigninResponseModel, BaseApiResponse, PartnerSigninResponseModel, BasePaginationModel } from "~/models";

 
export async function checkAccountStatus(query: object) {
 
    const response = await httpClient<BaseApiResponse<AccountStatusResponseModel>>('auth/check-account-status', "", { query });
    
   return response.result;
}


export async function sendOtp(query: object) {
    
  const response = await httpClient<BaseApiResponse<OtpResponseModel>>('auth/send-otp', "", { query });
  return response.result;
}


export async function changePartnerAdminPassword(payload: object) {
    
  const response = await partnerHttpClient<BaseApiResponse<object>>('auth/change-partner-admin-user-password', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function changeUserPassword(payload: object) {
    
  const response = await gnpUserHttpClient<BaseApiResponse<object>>('auth/change-public-user-password', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function validateOtp(payload: object) {
    
  const response = await httpClient<BaseApiResponse<VerifyOtpResponseModel>>('auth/verify-otp', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function signIn(payload: object) {
    
  const response = await httpClient<BaseApiResponse<SigninResponseModel>>('auth/login', "", {
    method: "post",
    body: payload,
  });
  return response;
}

export async function adminSignIn(payload: object) {
    
  const response = await httpClient<BaseApiResponse<AdminSigninResponseModel>>('auth/admin-login', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function partnerSignIn(payload: object) {
    
  const response = await httpClient<BaseApiResponse<PartnerSigninResponseModel>>('auth/partner-login', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function affiliateSignIn(payload: object) {
    
  const response = await httpClient<BaseApiResponse<AffiliateSigninResponseModel>>('auth/affiliate-login', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}


export async function setPassword(payload: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('auth/set-password', "", {
        method: "post",
        body: payload,
    });
    
   return response.success;
}

export async function verifyPasskeyLogin(payload: object) {
    
  const response = await httpClient<BaseApiResponse<SigninResponseModel>>('auth/login-via-pass-keys', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}