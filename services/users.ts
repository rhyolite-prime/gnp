import type { BaseApiResponse } from "~/models";

export interface UserProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hasPasskey: boolean;
}

export async function getUserProfile() {
    
    const response = await httpClient<BaseApiResponse<UserProfileResponse>>('users/profile', "");
    return response.result;
}

export async function changePassword(payload: object) {
    
    const response = await httpClient<BaseApiResponse<object>>('auth/change-password', "", {
        method: "post",
        body: payload,
    });
    
    return response.success;
}

export async function updateProfile(payload: object) {
    
    const response = await httpClient<BaseApiResponse<object>>('users/update-profile', "", {
        method: "post",
        body: payload,
    });
    
    return response.success;
}
