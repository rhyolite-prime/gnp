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

export interface GnpUser extends BaseEntityModel  {
    email: string;
    firstName: string;
    lastName: string;
    userId: string;
    username: string;
    country: string;

    
}

export interface GnpUserAuthModel {
    email: string;
    fullName: string;
    token: number;
    userId: string;
    username: number
    
}

export interface SubscriptionResponseModel {
    paymentUrl: string;
    reference: string;
    userId: string;
}

export interface NewsPaperEntitlementResponseModel {
    hasAccess: boolean;
    newsPaperId: string;
    uniqueId: string;
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

export interface PartnerSigninResponseModel {
    partnerEmail: string;
    fullName: string;
    token: string;
    partnerName: string;
    partnerUserId: string;
    requiresTwoFactorAuth: boolean;
    requestId: string;
}

//partner sub account
export interface PartnerStats {
    activeMembers: number;
    activeMembersChange: number;
    activeMembersChangeType: string;
    activeSessions: number;
    activeSessionsChange: number;
    activeSessionsChangeType: string;
    engagementRate: number;
    engagementRateChange: number;
    engagementRateChangeType: string;
    remainingQuota: number;
    totalQuota: number;
    
}

export interface PartnerEngagementReport {
    totalReads: number;
    totalReadsChange: number;
    totalReadsChangeType: string;
    avgSessionDuration: string;
    avgSessionDurationChange: string;
    avgSessionDurationChangeType: string;
    newMembersOnboarded: number;
    newMembersOnboardedChange: number;
    newMembersOnboardedChangeType: string;
    activeReaders: number;
    activeReadersChange: number;
    activeReadersChangeType: string;
}


export interface PartnerAnalyticsCharts {
    partnerEmail: string;
    fullName: string;
    engagementData: { date: string, reads: number }[];
    topPublications: { name: string, reads: number, change: number }[];
}

export interface ApiUsageStats {
    totalRequests: number;
    successRate: number;
    avgLatency: number;
    errorCount: number;
    usageByEndpoint: { endpoint: string, count: number, successRate: number }[];
    usageOverTime: { date: string, count: number }[];
}

export interface PartnerSubscriber {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profileImageUrl: string;
    isActive: string;
    lastActive: string;
    activatedOn: string;
    validUntil: string;
    
}


export interface NewsPaperIngestionResponse {
    id: string;
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
    publicationDate: string;
    publishedDate: string;
    slug: string;
    storageService: string;
    thumbnailId: string;
    featuredStories: FeaturedStory[]
    tags: []
    categories: []
    title: string;
    isPublished: boolean;
    createdAt: string;
    views: number;
    sales: number;
    uniqueId: string;
    isFree: boolean;
    isPopular: boolean;
    isArchived: boolean;
    
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

export interface Coupon extends BaseEntityModel {

    code: string;
    userId: string;
    username: string;
    discount: string;
    description: string
    discountAsPercentage: boolean;
    validTill: string;
    usageQuota: number;
    usageCount: number;
    status: string;
    
}

export interface IngestionJob extends BaseEntityModel {

    publicationDate: string;
    ingestedBy: string;
    percentageCompletion: string;
    status: string;
    createdAt: string;
}

export interface SubscriptionSummary {
    subscriptionPlanDescription: string;
    subscriberCount: number;
    subscriptionPlanId: string;
}


export interface CommercialPartner extends BaseEntityModel {

    name: string;
    partnerIdentifier: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    billingEmail: string;
    organizationLogo: string;
    defaultSubscriptionPlanId: string;
    defaultSubscriptionPlanName: string;
    currency: string;
    status: string;
    subscriberQuota: number;
    remainingQuota: number;
    subAccountEnabled: boolean;
    requireTwoFactorAuth: boolean;
    createdAt: string;
}

export interface UserAccountMetaData {
  subscriptions: [];
  transactions: [];
  bioData: BioData;
}


export interface BioData {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
}

export interface Subscriber extends BaseEntityModel {

    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    createdAt: string;
    partnerId: string;
    subscriptionPlanDescription: string;
    status: string;
}

export interface AdminUser extends BaseEntityModel {

    firstName: string;
    lastName: string;
    email: string;
    username: string;
    phoneNumber?: string;
    roles: [];
    createdAt: string;
}


export interface Publication extends BaseEntityModel {

    description: string;
    isActive: boolean;
    name: string;
    price: number;
    publishingDays: []
}


export interface CommercialPartnerStat extends BaseEntityModel {

    name: string;
    value: number;
    change: string;
    changeType: string;
    icon: any;
    bgColor: string;
    iconColor: string;
    prefix: string;
    suffix: string;
     
}

export interface GnpDocumentResponseModel extends BaseEntityModel {

    documentId: string;
    thumbnailId: string;
    success: true;
    message: string;
    
}



export interface CommercialPartnerApiKey extends BaseEntityModel {
    partnerId: string;
    partnerName: string;
    clientId: string;
    clientSecret?: string; // Only present on creation result
    label: string;
    scopes: string[];
    allowedIps: string[];
    isActive: boolean;
    expiresAt?: string;
    lastUsedAt?: string;
}

export interface Role extends BaseEntityModel {
    name: string;
    description: string;
    partnerId: string;
    permissions: string[]
    
}

export interface Permission {

    systemName: string;
    friendlyName: string;
    subPermissions: SubPermission[];
    
}

export interface SubPermission {
    
    id: number;
    systemName: string;
    friendlyName: string;
     
    
}

export interface PartnerInvoice extends BaseEntityModel {
    partnerId: string;
    partnerName: string;
    partnerEmail: string;
    invoiceNumber: string;
    description: string;
    invoiceAmount: string;
    balance: string;
    billingCycle: string;
    currency: string;
    status: string;
    dueDate: string;
    paidAt?: string;
}

export interface PartnerInvoiceStat {
    overdueAmount: number;
    pendingInvoices: number;
    totalInvoiced: number;
    totalPaid: number;
    
}

export interface PartnerSubscriberSubscriptionSummary {
    subscriptionSummary: SubscriberSubscriptionSummary;
    renewalHistory: RenewalHistory[];
}


export interface SubscriberSubscriptionSummary {
    billingCycle: string;
    daysRemaining: number;
    activatedOn: string;
    validUntil: string;
    package: string;
    subscriptionId: string;
}

export interface RenewalHistory {
    amount: string;
    date: string;
    package: string;
    reference: string;
    status: string;
}

