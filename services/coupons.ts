import type { Coupon, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getCoupons(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Coupon[]>>>('admin/get-all-coupons', "", { query });
    return response.result;
}

export async function createCoupon(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-coupon', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateCoupon(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/update-coupon', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteCoupon(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/delete-coupon', "", { query, method: "delete", });
    return response.success;
}