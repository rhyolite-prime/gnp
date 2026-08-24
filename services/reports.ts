import type { BaseApiResponse, BasePaginationModel } from "~/models";

export async function generatePartnerInvoice(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/partner-invoice', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function sendPartnerInvoiceAsEmail(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/send-partner-invoice-email', "", {
        method: "post",
        body: payload,
    });

    return response.success;
}


export async function generateSalesReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/sales', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}


export async function generatePaymentTransactionsReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/transactions', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function generateSubscriptionRenewalsReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function generateSubscriberDemographicsReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function generatePlanDistributionReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}


export async function generateNewspaperEngagementReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/newspaper-engagement', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}


export async function generateContentInventoryReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}


export async function generateIngestionJobLogsReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}


export async function generatePartnerEngagementReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}


export async function generatePartnerQuotaReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function generatePartnerApiUsageReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function generateCampaignPerformanceReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}


export async function generateCouponUsageReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function generateAdminRolesReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}

export async function generateApiKeyAuditReport(payload: object) {

    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('reports/subscription-renewals', "", {
        method: "post",
        body: payload,
    });

    return response.result;
}