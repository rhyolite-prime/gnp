export interface BaseApiResponse<T> {
    result: T;
    success: boolean;
    message: string;
    unAuthorizedRequest: boolean;
    error: Error;
}
  

export interface Error {
    code: boolean;
    details: boolean;
    message: any;
    validationErrors: any;
}

export interface BaseEntityModel {
    id: string;
    createdAt: string;
}


export interface BasePaginationModel<T> {
    pageNo: number;
    totalCount: number;
    totalPages: number;
    data: T;

    lowerBound: number;
    upperBound: number;
}

export interface GnpUserAuthModel {
    email: string;
    fullName: string;
    token: number;
    userId: string;
    username: number
    
}

export interface GuestSubscriptionResponseModel {
    paymentUrl: string;
    reference: string;
    userId: string;
}

export interface NewsPaperEntitlementResponseModel {
    hasAccess: boolean;
    newsPaperId: string;
}

export interface AccountStatusResponseModel {
    hasPassword: boolean;
    hasUsername: boolean;
    email: string;
}

export interface OtpResponseModel {
    requestId: string;
    expiry: string;
    email: string;
}


export interface VerifyOtpResponseModel {
    isValid: boolean;
    sessionId: string;
}


export interface SigninResponseModel {
    email: string;
    fullName: string;
    token: string;
    userId: string;
    username: string;
}




export interface NewsPaper {
    documentId: string;
    editionNumber: string;
    fileType: string;
    fullDescription: string;
    publicationId: string;
    publicationName: string;
    id: string;
    price: string;
    publishedDate: string;
    slug: string;
    thumbnailId: string;
    featuredStories: FeaturedStory[]
    title: string;
    isPublished: boolean;
    createdAt: string;
    views: number;
    sales: number;
    
}

export interface FeaturedStory {
    title: string;
    description: string;
}



export interface UserSubscription extends BaseEntityModel {
    subscriptionIdentifier: string;
    userId: string;
    username: string;
    email: string;
    currentSubscriptionPlanId: string;
    startDate: string;
    endDate: string;
    currentBillingCycle: string;
    isActive: boolean;
    nextRenewalDate: string;
    fee: number;
}

export interface SubscriptionPlan extends BaseEntityModel {
    name: string;
    description: string;
    targetPublications: [],
    planType: string;
    createdAt: string;
    pricing: Record<string, { price: number ,savePercentage: number }>;
}

export interface Campaign extends BaseEntityModel {

    channel: string;
    isActive: boolean;
    messageBody: string;
    name: string;
    subject: string;
    targetAudience: string;
    status: string;
    scheduledTime: string;
    campaignType: string;
    engagement: number; // number of people who received it/number of people who clicked
    reach: number; // number of people who received it
    clicks: number; // number of people who clicks

}

export interface Payment extends BaseEntityModel {

    userName: string;
    userEmail: string;
    packageName: string;
    amountPaid: string;
    receiptNo: string;
    transactionReference: string;
    status: string;
}

export interface IngestionJob extends BaseEntityModel {

    publicationDate: string;
    ingestedBy: string;
    percentageCompletion: string;
    status: string;
    createdAt: string;
}

export interface CommercialPartner extends BaseEntityModel {

    name: string;
    identifier: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    billingEmail: string;
    billingCycle: string;
    currency: string;
    status: string;
    subaccountEnabled: boolean;
    createdAt: string;
}

export interface Publication extends BaseEntityModel {

    createdAt: string;
    description: string;
    isActive: boolean;
    name: string;
    price: number;
}


export interface CommercialPartnerStat extends BaseEntityModel {

    createdAt: string;
    description: string;
    isActive: boolean;
    name: string;
    price: number;
}

export interface GnpDocumentResponseModel extends BaseEntityModel {

    documentId: string;
    thumbnailId: string;
    success: true;
    message: string;
    
}




