import type { AccountStatusResponseModel, OtpResponseModel, VerifyOtpResponseModel, SigninResponseModel, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function checkAccountStatus(query: object) {
 
    const response = await httpClient<BaseApiResponse<AccountStatusResponseModel>>('auth/check-account-status', "", { query });
    
   return response.result;
}


export async function sendOtp(query: object) {
    
  const response = await httpClient<BaseApiResponse<OtpResponseModel>>('auth/send-otp', "", { query });
  return response.result;
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
  return response.result;
}

export async function adminSignIn(payload: object) {
    
  const response = await httpClient<BaseApiResponse<SigninResponseModel>>('auth/admin-login', "", {
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