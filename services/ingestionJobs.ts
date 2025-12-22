import type { IngestionJob, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getIngestionJobs(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<IngestionJob[]>>>('admin/get-all-ingestion-jobs', "", { query });
    return response.result;
}

export async function deleteIngestionJob(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<IngestionJob[]>>>('admin/delete-ingestion-job', "", { query });
    return response.success;
}


export async function createIngestionJob(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('admin/create-ingestion-job', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}
