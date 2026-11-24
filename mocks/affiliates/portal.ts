import type { Component } from 'vue'
import {
  BanknotesIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'

/**
 * Shared affiliate member-portal data.
 *
 * The member portal (`/affiliates/dashboard`, `/commissions`, `/payouts`,
 * `/stats`, `/links`) and the admin "View Profile" page both read from this
 * module so an administrator sees exactly what the affiliate sees. The backend
 * does not yet expose per-affiliate portal endpoints; when it does, replace
 * these exports with API-backed composables and both surfaces update together.
 */

export type AffiliatePeriod = '7days' | '30days' | 'month'

export interface AffiliateQuickStat {
  label: string
  value: string
  growth: number
  prefix: string
  icon: Component
  bgColor: string
  iconColor: string
}

export interface AffiliateDashboardPayout {
  id: number
  amount: number
  date: string
  status: string
}

export interface AffiliateDashboardCommission {
  id: number
  customer: string
  email: string
  plan: string
  amount: number
  status: string
  date: string
}

export interface AffiliateCommission {
  id: number
  customer: string
  email: string
  plan: string
  revenue: number
  commission: number
  status: string
  date: string
}

export interface AffiliatePayout {
  id: string
  method: string
  amount: number
  status: string
  date: string
}

export interface AffiliateTrafficSource {
  name: string
  percentage: number
  barColor: string
}

export interface AffiliateDevice {
  name: string
  icon: Component
  percentage: number
  bgColor: string
  iconColor: string
}

export interface AffiliateDailyStat {
  date: string
  clicks: number
  visitors: number
  conversions: number
  rate: number
  earnings: number
}

export interface AffiliateTrackedLink {
  id: number
  target: string
  url: string
  clicks: number
  conversions: number
  lastUsed: string
}

// --- Dashboard -------------------------------------------------------------

export function getAffiliateDashboardStats(period: AffiliatePeriod): AffiliateQuickStat[] {
  if (period === '7days') {
    return [
      { label: 'Total Revenue', value: '4,520', growth: 12.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Commissions', value: '1,240', growth: 8.2, prefix: '₵', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '12,450', growth: -2.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Referrals', value: '156', growth: 15.1, prefix: '', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    ]
  }
  if (period === '30days') {
    return [
      { label: 'Total Revenue', value: '18,500', growth: 5.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
      { label: 'Commissions', value: '5,100', growth: 4.2, prefix: '₵', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
      { label: 'Total Clicks', value: '52,100', growth: 1.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      { label: 'Referrals', value: '620', growth: 8.1, prefix: '', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
    ]
  }
  return [
    { label: 'Total Revenue', value: '14,200', growth: -1.5, prefix: '₵', icon: CurrencyDollarIcon, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Commissions', value: '4,000', growth: -2.2, prefix: '₵', icon: BanknotesIcon, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
    { label: 'Total Clicks', value: '38,000', growth: -5.4, prefix: '', icon: CursorArrowRaysIcon, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Referrals', value: '450', growth: -3.1, prefix: '', icon: UsersIcon, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
  ]
}

export function getAffiliateDashboardChart(period: AffiliatePeriod): { data: number[]; xAxisData: string[] } {
  if (period === '7days') {
    return { data: [40, 60, 45, 90, 75, 80, 55], xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
  }
  if (period === '30days') {
    return {
      data: [38, 46, 52, 49, 64, 71, 68, 55, 62, 74, 83, 79, 66, 70, 88, 92, 85, 73, 69, 77, 84, 91, 86, 78, 72, 81, 89, 95, 87, 93],
      xAxisData: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    }
  }
  return { data: [300, 400, 250, 450], xAxisData: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] }
}

export function getAffiliateDashboardPayouts(period: AffiliatePeriod): AffiliateDashboardPayout[] {
  if (period === '7days') {
    return [
      { id: 1, amount: 450, date: 'Feb 12, 2026', status: 'Paid' },
      { id: 2, amount: 120, date: 'Feb 05, 2026', status: 'Paid' },
      { id: 3, amount: 840, date: 'Jan 28, 2026', status: 'Paid' },
      { id: 4, amount: 300, date: 'Jan 10, 2026', status: 'Paid' },
    ]
  }
  return [
    { id: 1, amount: 1200, date: 'Jan 31, 2026', status: 'Paid' },
    { id: 2, amount: 850, date: 'Dec 31, 2025', status: 'Paid' },
    { id: 3, amount: 940, date: 'Nov 30, 2025', status: 'Paid' },
    { id: 4, amount: 730, date: 'Oct 31, 2025', status: 'Paid' },
  ]
}

export function getAffiliateDashboardCommissions(period: AffiliatePeriod): AffiliateDashboardCommission[] {
  if (period === '7days') {
    return [
      { id: 1, customer: 'John Doe', email: 'john@example.com', plan: 'Premium Yearly', amount: 120, status: 'Completed', date: 'Just now' },
      { id: 2, customer: 'Sarah Amponsah', email: 'sarah.am@example.com', plan: 'Basic Monthly', amount: 15, status: 'Completed', date: '2 hours ago' },
      { id: 3, customer: 'Akwasi Mensah', email: 'akwasi@network.com', plan: 'Standard Quarterly', amount: 45, status: 'Pending', date: 'Yesterday' },
      { id: 4, customer: 'Evelyn White', email: 'ev.white@gmail.com', plan: 'Premium Monthly', amount: 30, status: 'Completed', date: 'Feb 15, 2026' },
      { id: 5, customer: 'Michael Kojo', email: 'mkojo@yahoo.com', plan: 'Premium Yearly', amount: 120, status: 'Completed', date: 'Feb 14, 2026' },
    ]
  }
  return [
    { id: 1, customer: 'Kofi Annan', email: 'kofi@example.com', plan: 'Premium Yearly', amount: 120, status: 'Completed', date: 'Jan 10, 2026' },
    { id: 2, customer: 'Ama Serwaa', email: 'ama.s@example.com', plan: 'Basic Monthly', amount: 15, status: 'Completed', date: 'Jan 12, 2026' },
    { id: 3, customer: 'Yaw Osei', email: 'yaw@network.com', plan: 'Standard Quarterly', amount: 45, status: 'Pending', date: 'Jan 15, 2026' },
  ]
}

// --- Commissions -----------------------------------------------------------

export const affiliateCommissions: AffiliateCommission[] = [
  { id: 1, customer: 'John Doe', email: 'john@example.com', plan: 'Premium Yearly', revenue: 600, commission: 120, status: 'Completed', date: 'Feb 17, 2026' },
  { id: 2, customer: 'Sarah Amponsah', email: 'sarah.am@example.com', plan: 'Basic Monthly', revenue: 75, commission: 15, status: 'Completed', date: 'Feb 17, 2026' },
  { id: 3, customer: 'Akwasi Mensah', email: 'akwasi@network.com', plan: 'Standard Quarterly', revenue: 225, commission: 45, status: 'Pending', date: 'Feb 16, 2026' },
  { id: 4, customer: 'Evelyn White', email: 'ev.white@gmail.com', plan: 'Premium Monthly', revenue: 150, commission: 30, status: 'Completed', date: 'Feb 15, 2026' },
  { id: 5, customer: 'Michael Kojo', email: 'mkojo@yahoo.com', plan: 'Premium Yearly', revenue: 600, commission: 120, status: 'Completed', date: 'Feb 14, 2026' },
  { id: 6, customer: 'Ama Serwaa', email: 'ama.s@test.com', plan: 'Standard Yearly', revenue: 450, commission: 90, status: 'Completed', date: 'Feb 12, 2026' },
  { id: 7, customer: 'Kofi Owusu', email: 'kofi.oo@gmail.com', plan: 'Basic Monthly', revenue: 75, commission: 15, status: 'Completed', date: 'Feb 10, 2026' },
  { id: 8, customer: 'Abena Mansa', email: 'abena.m@test.com', plan: 'Premium Quarterly', revenue: 300, commission: 60, status: 'Completed', date: 'Feb 08, 2026' },
  { id: 9, customer: 'Yaw Boakye', email: 'yaw.b@gmail.com', plan: 'Basic Yearly', revenue: 300, commission: 60, status: 'Completed', date: 'Feb 05, 2026' },
  { id: 10, customer: 'Efua Mensah', email: 'efua.m@test.com', plan: 'Standard Quarterly', revenue: 225, commission: 45, status: 'Completed', date: 'Feb 01, 2026' },
]

// --- Payouts ---------------------------------------------------------------

export const affiliatePayoutSummary = {
  available: 1240,
  pending: 0,
  total: 5840,
  minimum: 50,
  lastPayoutDate: 'Feb 12, 2026',
}

export const affiliatePayouts: AffiliatePayout[] = [
  { id: 'PAY-8921', method: 'Mobile Money (MTN)', amount: 450.0, status: 'Paid', date: 'Feb 12, 2026' },
  { id: 'PAY-7742', method: 'Bank Transfer', amount: 120.0, status: 'Paid', date: 'Feb 05, 2026' },
  { id: 'PAY-6531', method: 'Mobile Money (Telecel)', amount: 840.0, status: 'Paid', date: 'Jan 28, 2026' },
  { id: 'PAY-5520', method: 'Mobile Money (MTN)', amount: 300.0, status: 'Paid', date: 'Jan 10, 2026' },
]

// --- Stats / performance ---------------------------------------------------

export const affiliateStatsBreakdown = [
  { label: 'Total Clicks', value: '42,910', trend: 14.2 },
  { label: 'Conversions', value: '1,562', trend: 8.5 },
  { label: 'Engagement', value: '28.4%', trend: -2.1 },
  { label: 'EPC (Avg)', value: '₵1.05', trend: 4.8 },
]

export const affiliateTrafficSources: AffiliateTrafficSource[] = [
  { name: 'X / Twitter', percentage: 42, barColor: 'bg-blue-500' },
  { name: 'Facebook', percentage: 28, barColor: 'bg-blue-700' },
  { name: 'Direct Links', percentage: 15, barColor: 'bg-green-500' },
  { name: 'Instagram', percentage: 10, barColor: 'bg-pink-500' },
  { name: 'Others', percentage: 5, barColor: 'bg-gray-400' },
]

export const affiliateDevices: AffiliateDevice[] = [
  { name: 'Mobile', icon: DevicePhoneMobileIcon, percentage: 74, bgColor: 'bg-primary-50', iconColor: 'text-primary-600' },
  { name: 'Desktop', icon: ComputerDesktopIcon, percentage: 21, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { name: 'Tablet', icon: DeviceTabletIcon, percentage: 5, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' },
]

export const affiliateDailyStats: AffiliateDailyStat[] = [
  { date: 'Feb 17, 2026', clicks: 1240, visitors: 1102, conversions: 45, rate: 3.6, earnings: 450 },
  { date: 'Feb 16, 2026', clicks: 980, visitors: 856, conversions: 28, rate: 2.8, earnings: 280 },
  { date: 'Feb 15, 2026', clicks: 1450, visitors: 1320, conversions: 52, rate: 3.5, earnings: 520 },
  { date: 'Feb 14, 2026', clicks: 1100, visitors: 980, conversions: 38, rate: 3.4, earnings: 380 },
  { date: 'Feb 13, 2026', clicks: 750, visitors: 680, conversions: 21, rate: 2.8, earnings: 210 },
]

// --- Links & widgets -------------------------------------------------------

export const affiliateTrackedLinks: AffiliateTrackedLink[] = [
  { id: 1, target: 'Home Page', url: 'https://graphicnewsplus.com/?ref=aff_2938', clicks: 8420, conversions: 85, lastUsed: '2 mins ago' },
  { id: 2, target: 'Daily Graphic', url: 'https://graphicnewsplus.com/daily-graphic?ref=aff_2938', clicks: 3150, conversions: 42, lastUsed: '1 hour ago' },
  { id: 3, target: 'Graphic Showbiz', url: 'https://graphicnewsplus.com/showbiz?ref=aff_2938', clicks: 880, conversions: 29, lastUsed: 'Yesterday' },
]

export const affiliateReferralSummary = {
  successRate: 65,
  totalReferrals: 156,
  paidReferrals: 102,
}

export const getAffiliateWidgetHeight = (type: 'carousel' | 'grid') => (type === 'carousel' ? '500px' : '800px')

export const getAffiliateWidgetUrl = (affiliateId: string, type: 'carousel' | 'grid') =>
  `https://new.graphicnewsplus.com/affiliates/${affiliateId}?type=${type}`

export const getAffiliateWidgetEmbedCode = (affiliateId: string, type: 'carousel' | 'grid') =>
  `<iframe src="${getAffiliateWidgetUrl(affiliateId, type)}" width="100%" height="${getAffiliateWidgetHeight(type)}" frameborder="0" allowfullscreen></iframe>`
