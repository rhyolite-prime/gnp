import type { BaseApiResponse, GnpUser, BasePaginationModel, UserProfileResponse } from "~/models";

export async function getUsers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<GnpUser[]>>>('admin/get-all-users', "", { query });
    return response.result;
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
