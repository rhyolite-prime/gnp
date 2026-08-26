import type { NewsPaper, Publication, Payment, CommercialPartner, AdminUser, PartnerSubscriberSubscriptionSummary,Permission, Role, PartnerInvoiceStat, SubscriptionSummary, Subscriber, CommercialPartnerStat, NewsPaperIngestionResponse, BaseApiResponse, BasePaginationModel, CommercialPartnerApiKey, PartnerInvoice } from "~/models";

//publication setups

export async function getPublications(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Publication[]>>>('admin/get-all-publications', "", { query });
    return response.result;
}


export async function createPublication(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-publication', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updatePublication(payload: object, id: string) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/update-publication/${id}`, "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deletePublication(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/delete-publication', "", { query, method: "delete", });
    return response.success;
}


export async function getNewsPaperPublications(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('admin/get-all-newspapers', "", { query });
    return response.result;
}


export async function getArchivedNewsPaperPublications(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('admin/get-all-archived-newspapers', "", { query });
    return response.result;
}


export async function uploadFileAsset(publicationFile: File, id: string) {
  
  const formData = new FormData();
  
  formData.append("bucketName", "gnp-master-documents");
  
  formData.append("file", publicationFile);

  const response = await gnpAdminUserHttpClient<{ status: string, fileName: string }>(`g3/upload-file/${id}`, "", {
    method: "post",
    body: formData,
  });
    
  return response;
}

const blobCache: Record<string, string> = {};

const DB_NAME = 'GNP_Thumbnails';
const STORE_NAME = 'blobs';

const getDB = (): Promise<IDBDatabase | null> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            return resolve(null);
        }
        try {
            const request = window.indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = (e.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
};

const deleteBlobFromDB = async (id: string) => {
    const db = await getDB();
    if (!db) return;
    try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
    } catch (e) {
        console.error("IDB Delete Error", e);
    }
};

const saveBlobToDB = async (id: string, blob: Blob) => {
    const db = await getDB();
    if (!db) return;
    try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(blob, id);
    } catch (e) {
        console.error("IDB Save Error", e);
    }
};

const getBlobFromDB = async (id: string): Promise<Blob | null> => {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(id);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
};

export async function getNewsPaperThumbnail(fileId: string, forceReload: boolean = false) {
    if (forceReload) {
        if (blobCache[fileId]) {
            URL.revokeObjectURL(blobCache[fileId]);
            delete blobCache[fileId];
        }
        await deleteBlobFromDB(fileId);
    }

    // 1. Check in-memory fast cache
    if (blobCache[fileId]) {
        return blobCache[fileId];
    }

    try {
        // 2. Check IndexedDB persistent cache
        const cachedBlob = await getBlobFromDB(fileId);
        if (cachedBlob) {
            const url = URL.createObjectURL(cachedBlob);
            blobCache[fileId] = url;
            return url;
        }

        // 3. Fallback to network request
        const response = await gnpAdminUserHttpClient<Blob>(`g3/get-file/gnp-thumbnails/${fileId}.png`, "", { responseType: 'blob' });

        // 4. Save to both caches
        saveBlobToDB(fileId, response); // Fire-and-forget IDB save
        const url = URL.createObjectURL(response);
        blobCache[fileId] = url; 
        return url;

    } catch (error) {
        console.error("Failed to load secure image:", error);
        return 'https://archive.graphic.com.gh/img/news-avatar.png';
    }
}

export async function createNewsPaper(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<NewsPaperIngestionResponse>>('admin/ingest-newspaper', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function publishNewspaperPublication(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/publish-newspaper', "", { query });
    return response.success;
}

export async function getPartnerSubscriberInfo(partnerId: string, userId: string) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<PartnerSubscriberSubscriptionSummary>>(`admin/get-partner-subscriber-info/${partnerId}/${userId}`, "");
    return response.result;
}

export async function unPublishNewspaperPublication(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/unpublish-newspaper', "", { query });
    return response.success;
}

export async function getAdminNewsPaperDetails(id: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<NewsPaper>>(`admin/get-newspaper-details/${id}`, "");
    return response.result;
}

export async function updateNewsPaper(payload: object, id: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/update-newspaper/${id}`, "", {
        method: "put",
        body: payload,
    });
    return response.success;
}

 
export async function getPayments(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Payment[]>>>('admin/get-all-payments', "", { query });
    return response.result;
}

// commercial partners

export async function getCommercialPartners(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<CommercialPartner[]>>>('admin/get-all-partners', "", { query });
    return response.result;
}

export async function getCommercialPartnerDetails(partnerId: string) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<CommercialPartner>>(`admin/get-partner-details?partnerId=${partnerId}`, "");
    return response.result;
}

export async function getCommercialPartnerStats() {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<CommercialPartnerStat[]>>('admin/get-partner-stats', "");
    return response.result;
}

export async function createCommercialPartner(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-partner', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}


export async function updateCommercialPartner(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/update-partner', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

 
export async function deleteCommercialPartner(id: string) {
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/delete-partner?partnerId=${id}`, "", {
    method: "delete",
  });
  return response.success;
}

export async function enablePartnerSubaccount(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/enable-partner-subaccount', "", { query });
    return response.success;
}

export async function updateCommercialPartnerStatus(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/update-partner-status', "", { query });
    return response.success;
}

export async function disablePartnerSubaccount(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/disable-partner-subaccount', "", { query });
    return response.success;
}

export async function getCommercialPartnerSubscribers(query: object) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Subscriber[]>>>('admin/get-partner-subscribers', "", { query });
    return response.result;
}

export async function getCommercialPartnerSubscriptionSummary(partnerId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<SubscriptionSummary[]>>(`admin/get-partner-subscription-summary?partnerId=${partnerId}`, "");
    return response.result;
}

export async function uploadCommercialPartnerSubscribers(payload: object, partnerId: string ) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/upload-partner-subscribers/${partnerId}`, "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function updateCommercialPartnerQuota(payload: object, partnerId: string ) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/update-partner-quota/${partnerId}`, "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function removeCommercialPartnerSubscriber(partnerId: string,subscriberId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/delete-partner-subscriber?partnerId=${partnerId}&subscriberId=${subscriberId}`, "", {
        method: "delete",
    });
    return response.success;
}

export async function resetCommercialPartnerSubscriberPassword(partnerId: string,subscriberId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/reset-partner-subscriber-password/${partnerId}/${subscriberId}`, "", {
        method: "delete",
    });
    return response.success;
}

export async function updateCommercialPartnerSubscriberStatus(query: { partnerId: string, subscriberId: string, status: string }) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/update-partner-subscriber-status', "", { query });
    return response.success;
}

export async function createPartnerSubscriber(payload: object) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-partner-subscriber', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function assignSubscriptionToCommercialPartnerSubscribers(payload: object) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/assign-partner-subscribers-plan', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

//admin roles

export async function getAdminRoles(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Role[]>>>('admin/get-all-roles', "", { query });
    return response.result;
}

export async function getAdminPermissions() {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<Permission[]>>('admin/get-all-permissions', "");
    return response.result;
}

export async function createAdminRole(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-role', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateAdminRole(payload: object, roleId: string) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/update-role/${roleId}`, "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteAdminRole(roleId: string) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/delete-role/${roleId}`, "", { method: "delete", });
    return response.success;
}



// admin users

export async function getAdminUsers(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<AdminUser[]>>>('admin/get-all-users', "", { query });
    return response.result;
}

export async function getPartnerApiKeys(partnerId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<CommercialPartnerApiKey[]>>(`admin/get-partner-api-keys?partnerId=${partnerId}`, "");
    return response.result;
}

export async function generatePartnerApiKey(payload: object) {
    const response = await httpClient<BaseApiResponse<CommercialPartnerApiKey>>('admin/generate-partner-api-key', "", {
        method: "post",
        body: payload,
    });
    return response.result;
}

export async function revokePartnerApiKey(keyId: string) {
    const response = await httpClient<BaseApiResponse<object>>(`admin/revoke-partner-api-key?keyId=${keyId}`, "", {
        method: "delete",
    });
    return response.success;
}

export async function updatePartnerApiKey(payload: object) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/update-partner-api-key', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function getPartnerInvoices(query: object) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<PartnerInvoice[]>>>('admin/get-all-partner-invoices', "", { query });
    return response.result;
}

export async function getPartnerInvoiceStats() {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<PartnerInvoiceStat>>('admin/get-partner-invoice-stats', "");
    return response.result;
}



export async function markPartnerInvoiceAsPaid(invoiceId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/mark-partner-invoice-paid?id=${invoiceId}`, "", {
        method: "get",
    });
    return response.success;
}

export async function createPartnerInvoice(payload: object) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-partner-invoice', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function deletePartnerInvoice(invoiceId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/delete-partner-invoice?id=${invoiceId}`, "", {
        method: "delete",
    });
    return response.success;
}

export async function deleteFileAsset(id: string, bucketName: string) {
    const response = await gnpAdminUserHttpClient<{ status: string }>(`g3/delete-file/${id}?bucketName=${bucketName}`, "", {
        method: "delete",
    });
    return response;
}

// subscribers

export async function getSubscribers(query: object) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Subscriber[]>>>('admin/get-subscribers', "", { query });
    return response.result;
}

export async function getsubscriberSubscriptionSummary(subscriberId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<SubscriptionSummary[]>>(`admin/get-subscriber-subscription-summary/${subscriberId}`, "");
    return response.result;
}


export async function resetStandardSubscriberPassword(subscriberId: string) {
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/reset-subscriber-password/${subscriberId}`, "");
    return response.success;
}


// affiliate
export async function getAffiliates(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<object[]>>>('admin/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function createAffiliate(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-subscription-plan', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function updateAffiliate(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/update-affiliate', "", {
    method: "put",
    body: payload,
  });
  return response.success;
}

export async function deleteAffiliate(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/delete-affiliate', "", { query, method: "delete", });
    return response.success;
}

export async function updateAffiliateAccountStatus(id: string, status:number) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(`admin/delete-affiliate/${id}/${status}`, "");
    return response.success;
}