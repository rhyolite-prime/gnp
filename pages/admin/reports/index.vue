<template>
  <div class="p-6 max-w-8xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between print:hidden">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Platform Reports</h1>
        <p class="text-gray-500 mt-1 text-sm">Generate and download detailed reports for the News Plus platform.</p>
      </div>
      <button 
        v-if="selectedGroup" 
        @click="selectedGroup = null; selectedReport = null"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Report Groups
      </button>
    </div>

    <!-- Main Groupings Grid -->
    <div v-if="!selectedGroup" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
      <div 
        v-for="group in reportGroups" 
        :key="group.id"
        @click="selectGroup(group)"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-primary-300 transition-all duration-200 group relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          <component :is="group.icon" class="w-24 h-24" />
        </div>
        <div class="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4 text-primary-600 group-hover:scale-110 transition-transform duration-200">
          <component :is="group.icon" class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ group.title }}</h3>
        <p class="text-gray-500 text-sm mb-4">{{ group.description }}</p>
        <div class="text-sm font-medium text-primary-600 flex items-center">
          View Reports
          <ArrowRight class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
        </div>
      </div>
    </div>

    <!-- Detailed Report View -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none print:bg-transparent">
      <div class="p-6 border-b border-gray-200 bg-gray-50/50 print:hidden">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-primary-100 text-primary-700 rounded-lg">
            <component :is="selectedGroup.icon" class="w-5 h-5" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900">{{ selectedGroup.title }}</h2>
        </div>
        <p class="text-gray-500 text-sm">{{ selectedGroup.description }}</p>
      </div>

      <div class="p-6 print:p-0">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Configuration Sidebar -->
          <div class="lg:col-span-1 space-y-6 print:hidden">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Report Type</label>
              <select 
                v-model="selectedReport" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 border bg-white"
              >
                <option :value="null" disabled>Choose a report...</option>
                <option v-for="report in selectedGroup.reports" :key="report.id" :value="report">
                  {{ report.name }}
                </option>
              </select>
            </div>

            <!-- Dynamic Parameters -->
            <div v-if="selectedReport" class="space-y-4 pt-4 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Report Parameters</h3>
              
              <!-- Partner Dropdown -->
              <div v-if="selectedReport.parameters.includes('partner')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Select Partner</label>
                <select v-model="params.partnerId" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
                  <option value="" disabled>Choose a partner...</option>
                  <option v-for="partner in partnerList" :key="partner.id" :value="partner.id">
                    {{ partner.name }}
                  </option>
                </select>
              </div>

              <!-- Date Range -->
              <div v-if="selectedReport.parameters.includes('dateRange')" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="date" v-model="params.startDate" class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar class="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="date" v-model="params.endDate" class="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border" />
                  </div>
                </div>
              </div>

              <!-- Status Dropdown -->
              <!-- <div v-if="selectedReport.parameters.includes('status')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="params.status" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Statuses</option>
                  <option value="active">Active / Completed</option>
                  <option value="inactive">Inactive / Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div> -->

              <!-- Package / Plan Dropdown -->
              <div v-if="selectedReport.parameters.includes('plan')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select v-model="params.plan" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Plans</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <!-- Channel Dropdown -->
              <div v-if="selectedReport.parameters.includes('channel')">
                <label class="block text-sm font-medium text-gray-700 mb-1">Marketing Channel</label>
                <select v-model="params.channel" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border bg-white">
                  <option value="all">All Channels</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
              
            </div>
            
            <div v-else class="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-100">
              Please select a report type to view available parameters.
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-col gap-3" v-if="selectedReport">
              <button 
                @click="generateReport" 
                :disabled="selectedReport.id === 'partner_invoices' && !isValidInvoice"
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Activity class="w-4 h-4 mr-2" />
                Run Report
              </button>
              
              <button 
                v-if="selectedReport.id === 'partner_invoices'" 
                @click="handleDownloadPDF" 
                :disabled="!invoiceGenerated"
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DocumentArrowDownIcon class="w-4 h-4 mr-2 text-gray-500" />
                Download PDF
              </button>

              <button 
                v-else
                @click="downloadReport" 
                class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Download class="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          <!-- Preview & Actions -->
          <div class="lg:col-span-2 flex flex-col h-full min-h-[400px]">
            
            <!-- Partner Invoice View -->
            <div v-if="selectedReport?.id === 'partner_invoices' && invoiceGenerated" class="bg-white rounded-xl border border-gray-200 overflow-hidden print:border-none shadow-sm">
              <!-- Report Viewer Header (Hidden on Print) -->
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between print:hidden">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Report Generated
                  </span>
                  <span class="text-sm text-gray-500">Previewing Invoice #{{ generatedInvoiceId }}</span>
                </div>
                
                <div class="flex space-x-3">
                  <button @click="handlePrint" class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <PrinterIcon class="h-4 w-4 mr-2 text-gray-500" />
                    Print Viewer
                  </button>
                  <button @click="handleEmail" class="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    <EnvelopeIcon v-if="!isSendingInvoice" class="h-4 w-4 mr-2" />

                    <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSendingInvoice ? 'Sending...' : 'Email Partner' }}
                    
                  </button>
                </div>
              </div>

              <!-- Printable Invoice Content -->
              <div class="p-8 sm:p-12 print:p-0">
                <!-- Invoice Header -->
                <div class="flex justify-between items-start mb-12">
                  <div>
                    <div class="flex items-center space-x-2 mb-4">
                      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                        G
                      </div>
                      <span class="text-2xl font-bold text-gray-900 tracking-tight">NewsPlus<span class="text-primary-600">.</span></span>
                    </div>
                    <p class="text-sm text-gray-500">Graphic Communications Group Ltd.</p>
                    <p class="text-sm text-gray-500">Graphic Road, Accra, Ghana</p>
                    <p class="text-sm text-gray-500">billing@graphic.com.gh</p>
                  </div>
                  
                  <div class="text-right">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
                    <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Invoice No:</span> {{ generatedInvoiceId }}</p>
                    <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Date:</span> {{ new Date().toLocaleDateString() }}</p>
                    <p class="text-sm text-gray-500"><span class="font-medium text-gray-700">Due Date:</span> {{ new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString() }}</p>
                  </div>
                </div>

                <!-- Billed To -->
                <div class="mb-12 grid grid-cols-2 gap-8">
                  <div>
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
                    <p class="text-base font-semibold text-gray-900">{{ selectedPartnerDetails?.name }}</p>
                    <p class="text-sm text-gray-500 whitespace-pre-line">{{ selectedPartnerDetails?.address }}</p>
                    <p class="text-sm text-gray-500">{{ selectedPartnerDetails?.email }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-5 border border-gray-100">
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Period</h3>
                    <p class="text-sm font-medium text-gray-900">
                      {{ new Date(params.startDate).toLocaleDateString() }} - {{ new Date(params.endDate).toLocaleDateString() }}
                    </p>
                  </div>
                </div>

                <!-- Invoice Items -->
                <div class="mb-10 overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty / Imps</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (₵)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₵)</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(item, index) in invoiceData.items" :key="index" class="hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ item.description }}</div>
                          <div class="text-xs text-gray-500">{{ item.details }}</div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">{{ toNumber( item.quantity) }}</td>
                        <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">{{ _currency(item.unitPrice) }}</td>
                        <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{{ _currency(item.quantity * item.unitPrice) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Totals -->
                <div class="flex justify-end">
                  <div class="w-full max-w-sm space-y-3">
                    <div class="flex justify-between text-sm text-gray-600 px-4">
                      <span>Subtotal</span>
                      <span class="font-medium text-gray-900">GHS {{ _currency(invoiceData.subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 px-4">
                      <span>VAT (15%)</span>
                      <span class="font-medium text-gray-900">GHS {{ _currency(invoiceData.vat) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 px-4">
                      <span>Discount</span>
                      <span class="font-medium text-red-600"> GHS {{ _currency(invoiceData.discount) }}</span>
                    </div>
                    <div class="pt-3 border-t border-gray-200 flex justify-between px-4">
                      <span class="text-base font-bold text-gray-900">Total Due</span>
                      <span class="text-xl font-bold text-primary-600">GHS {{ _currency(invoiceData.totalDue) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Footer Notes -->
                <div class="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-500">
                  <p class="font-medium text-gray-700 mb-1">Payment Instructions:</p>
                  <p>Please make payment to Graphic Communications Group Ltd. via Bank Transfer.</p>
                  <p>Bank: Ghana Commercial Bank (GCB)<br>Account No: 3201001382531<br>Branch: High Street</p>
                  <p class="mt-4 text-xs">If you have any questions concerning this invoice, please contact billing@graphic.com.gh.</p>
                </div>
              </div>
            </div>

            <!-- Newspaper Engagement View -->
            <div v-else-if="selectedReport?.id === 'newspaper_engagement' && engagementReportGenerated" class="bg-white rounded-xl border border-gray-200 overflow-hidden print:border-none shadow-sm flex flex-col h-full">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between print:hidden">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Report Generated
                  </span>
                  <span class="text-sm text-gray-500">Newspaper Engagement & Sales</span>
                </div>
                <div class="flex space-x-3">
                  <button @click="handlePrint" class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <PrinterIcon class="h-4 w-4 mr-2 text-gray-500" />
                    Print
                  </button>
                </div>
              </div>
              <div class="p-6 flex-1 overflow-auto">
                <!-- Stats Grid -->
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Partner Enrollment Quotas</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div v-for="partner in engagementData.partners" :key="partner.name" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div class="text-sm font-medium text-gray-500 mb-1 truncate" :title="partner.name">{{ partner.name }}</div>
                    <div class="text-2xl font-bold text-gray-900 mb-2">{{ partner.enrolled }} <span class="text-sm font-normal text-gray-500">/ {{ partner.quota }}</span></div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-primary-600 h-2 rounded-full" :style="{ width: Math.min((partner.enrolled / partner.quota) * 100, 100) + '%' }"></div>
                    </div>
                  </div>
                </div>

                <!-- Charts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 class="text-base font-medium text-gray-900 mb-4">Quota Utilization</h3>
                    <div id="quotaChart" class="h-64 w-full"></div>
                  </div>
                  <div>
                    <h3 class="text-base font-medium text-gray-900 mb-4">Engagement & Sales (7 Days)</h3>
                    <div id="engagementChart" class="h-64 w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Generic Empty / Ready State -->
            <div v-else class="flex-1 bg-gray-50 rounded-lg border border-gray-200 border-dashed flex flex-col items-center justify-center text-center p-8 print:hidden">
              <template v-if="!selectedReport">
                <FileBarChart2 class="w-16 h-16 text-gray-300 mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-1">No Report Selected</h3>
                <p class="text-gray-500 max-w-sm text-sm">Select a report type from the sidebar to configure its parameters and generate the data.</p>
              </template>
              <template v-else>
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                  <component :is="selectedGroup.icon" class="w-8 h-8" />
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ selectedReport.name }} Ready</h3>
                <p class="text-gray-500 max-w-md text-sm mb-6">
                  {{ selectedReport.description }}<br/>
                  Click "Run Report" to process the data based on your selected parameters.
                </p>
              </template>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
 
import { 
  ArrowLeft, ArrowRight, Activity, Download, Calendar, 
  FileBarChart2, DollarSign, Users, BookOpen, Briefcase, 
  Megaphone, ShieldCheck 
} from 'lucide-vue-next'
import { 
  PrinterIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'

import type { CommercialPartner, CommercialPartnerStat, CommercialPartnerApiKey } from "~/models";
import * as echarts from 'echarts';
import { nextTick } from 'vue';

const { $toast } = useNuxtApp();

definePageMeta({
  layout: 'admin'
})

// Mock notification function
const notify = (msg: string) => alert(msg);

const params = reactive({
  startDate: '',
  endDate: '',
  status: 'all',
  plan: 'all',
  channel: 'all',
  partnerId: ''
})

const isSendingInvoice = ref(false);

interface ReportParameter {
  id: string;
  name: string;
  description: string;
  parameters: string[];
}

interface ReportGroup {
  id: string;
  title: string;
  description: string;
  icon: any;
  reports: ReportParameter[];
}

const reportGroups: ReportGroup[] = [
  {
    id: 'financial',
    title: 'Revenue & Financial',
    description: 'Track sales, subscriptions, invoices, and overall platform revenue.',
    icon: DollarSign,
    reports: [
      { id: 'sales_revenue', name: 'Sales & Revenue Overview', description: 'Breakdown of total revenue generated over time.', parameters: ['dateRange', 'plan'] },
      { id: 'payment_transactions', name: 'Payment Transactions Log', description: 'Detailed log of all payments grouped by status.', parameters: ['dateRange', 'status'] },
      { id: 'partner_invoices', name: 'Partner Invoices', description: 'B2B/Commercial Partner financials and outstanding balances.', parameters: ['partner', 'dateRange', 'status'] },
      { id: 'subscription_renewals', name: 'Subscription Renewals & Churn', description: 'Analysis of active subscriptions and churn rates.', parameters: ['dateRange'] }
    ]
  },
  {
    id: 'users',
    title: 'User & Subscriber',
    description: 'Analyze user demographics, account statuses, and plan distributions.',
    icon: Users,
    reports: [
      { id: 'subscriber_demographics', name: 'Subscriber Demographics & Status', description: 'Summary of all registered users and their account states.', parameters: ['status', 'dateRange'] },
      { id: 'plan_distribution', name: 'Subscription Plan Distribution', description: 'Number of subscribers per plan type.', parameters: ['plan'] }
    ]
  },
  {
    id: 'content',
    title: 'Content & Newspaper',
    description: 'Monitor publication engagement, sales, and catalog inventory.',
    icon: BookOpen,
    reports: [
      { id: 'newspaper_engagement', name: 'Newspaper Engagement & Sales', description: 'Metrics on individual publications views and sales.', parameters: ['dateRange'] },
      { id: 'content_inventory', name: 'Content Inventory Status', description: 'Overview of the newspaper catalog (Archived, Published, etc).', parameters: ['status'] },
      { id: 'ingestion_jobs', name: 'Ingestion Job Logs', description: 'Track the status of daily newspaper uploads.', parameters: ['dateRange', 'status'] }
    ]
  },
  {
    id: 'partners',
    title: 'Commercial Partner (B2B)',
    description: 'Insights into partner engagement, API usage, and member quotas.',
    icon: Briefcase,
    reports: [
      { id: 'partner_engagement', name: 'Partner Sub-account Engagement', description: 'Granular insights into reads and active sessions per partner.', parameters: ['dateRange'] },
      { id: 'partner_quota', name: 'Partner Quota & Usage', description: 'Tracking of assigned quotas vs remaining allocations.', parameters: [] },
      { id: 'partner_api_usage', name: 'Partner API Usage Stats', description: 'Metrics on API requests, latency, and success rates.', parameters: ['dateRange'] }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & Campaigns',
    description: 'Evaluate campaign performance and coupon redemptions.',
    icon: Megaphone,
    reports: [
      { id: 'campaign_performance', name: 'Campaign Performance', description: 'Track reach, clicks, and engagement across marketing channels.', parameters: ['dateRange', 'channel'] },
      { id: 'coupon_usage', name: 'Coupon Usage & Effectiveness', description: 'Track issued coupons and redemption rates.', parameters: ['status', 'dateRange'] }
    ]
  },
  {
    id: 'admin',
    title: 'Admin & Security Audits',
    description: 'Review admin roles, permissions, and partner API key accesses.',
    icon: ShieldCheck,
    reports: [
      { id: 'admin_roles', name: 'Admin Roles & Access', description: 'Audit of current admin users and their assigned permissions.', parameters: [] },
      { id: 'api_key_audit', name: 'Partner API Key Audit', description: 'List of active, expired, and recently used API keys.', parameters: ['status'] }
    ]
  }
]

const selectedGroup = ref<ReportGroup | null>(null)
const selectedReport = ref<ReportParameter | null>(null)
const invoiceGenerated = ref(false)
const generatedInvoiceId = ref('')
const engagementReportGenerated = ref(false)
const engagementData = ref<any>(null)


const partnerList = ref<CommercialPartner[]>([]);

const getAllPartners = async () => {

    try {

        let result = await getCommercialPartners({ pageNo:1, pageSize: 100});

        partnerList.value = result.data;

    } catch (error) {
        $toast.error('Unable to fetch commercial partners !');
    } 

 }

 

const invoiceItems = ref<any[]>([])
const invoiceData = ref<any>();

const selectGroup = (group: ReportGroup) => {
  selectedGroup.value = group
  selectedReport.value = null
  resetParams()
}

watch(selectedReport, () => {
  invoiceGenerated.value = false
  engagementReportGenerated.value = false
})

const resetParams = () => {
  params.startDate = ''
  params.endDate = ''
  params.status = 'all'
  params.plan = 'all'
  params.channel = 'all'
  params.partnerId = ''
  invoiceGenerated.value = false
  engagementReportGenerated.value = false
}

const isValidInvoice = computed(() => {
  return params.partnerId !== '' && params.startDate !== '' && params.endDate !== '' && params.startDate <= params.endDate
})

const selectedPartnerDetails = computed(() => {
  return partnerList.value.find(p => p.id === params.partnerId)
})



const discount = computed(() => 0)
//const discount = computed(() => subtotal.value > 10000 ? subtotal.value * 0.05 : 0)



const reportHandlers: Record<string, (params: typeof params) => Promise<any>> = {
  // ==========================================
  // 1. Revenue & Financial
  // ==========================================
  sales_revenue: async (p) => {
    return await generateSalesReport({
      startDate: p.startDate,
      endDate: p.endDate,
      plan: p.plan !== 'all' ? p.plan : undefined
    });
  },
  payment_transactions: async (p) => {
    return await generatePaymentTransactionsReport({
      startDate: p.startDate,
      endDate: p.endDate,
      status: p.status !== 'all' ? p.status : undefined
    });
  },
  partner_invoices: async (p) => {
    return await generatePartnerInvoice({
      partnerId: p.partnerId,
      startDate: p.startDate,
      endDate: p.endDate
    });
  },
  subscription_renewals: async (p) => {
    return await generateSubscriptionRenewalsReport({
      startDate: p.startDate,
      endDate: p.endDate
    });
  },

  // ==========================================
  // 2. User & Subscriber
  // ==========================================
  subscriber_demographics: async (p) => {
    return await generateSubscriberDemographicsReport({
      status: p.status !== 'all' ? p.status : undefined,
      startDate: p.startDate,
      endDate: p.endDate
    });
  },
  plan_distribution: async (p) => {
    return await generatePlanDistributionReport({
      plan: p.plan !== 'all' ? p.plan : undefined
    });
  },

  // ==========================================
  // 3. Content & Newspaper
  // ==========================================
  newspaper_engagement: async (p) => {
    return {
      partners: [
        { name: 'MTN', enrolled: 3692, quota: 5000 },
        { name: 'Graphic Communications Group', enrolled: 2, quota: 200 },
        { name: 'GNAT', enrolled: 372, quota: 400 }
      ],
      engagementTimeSeries: {
        dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        views: [1500, 2300, 2240, 2180, 1350, 1470, 2600],
        sales: [120, 200, 150, 80, 70, 110, 130]
      }
    };
  },
  content_inventory: async (p) => {
    return await generateContentInventoryReport({
      status: p.status !== 'all' ? p.status : undefined
    });
  },
  ingestion_jobs: async (p) => {
    return await generateIngestionJobLogsReport({
      startDate: p.startDate,
      endDate: p.endDate,
      status: p.status !== 'all' ? p.status : undefined
    });
  },

  // ==========================================
  // 4. Commercial Partner (B2B)
  // ==========================================
  partner_engagement: async (p) => {
    return await generatePartnerEngagementReport({
      startDate: p.startDate,
      endDate: p.endDate
    });
  },
  partner_quota: async () => {
    return await generatePartnerQuotaReport();
  },
  partner_api_usage: async (p) => {
    return await generatePartnerApiUsageReport({
      startDate: p.startDate,
      endDate: p.endDate
    });
  },

  // ==========================================
  // 5. Marketing & Campaigns
  // ==========================================
  campaign_performance: async (p) => {
    return await generateCampaignPerformanceReport({
      startDate: p.startDate,
      endDate: p.endDate,
      channel: p.channel !== 'all' ? p.channel : undefined
    });
  },
  coupon_usage: async (p) => {
    return await generateCouponUsageReport({
      status: p.status !== 'all' ? p.status : undefined,
      startDate: p.startDate,
      endDate: p.endDate
    });
  },

  // ==========================================
  // 6. Admin & Security Audits
  // ==========================================
  admin_roles: async () => {
    return await generateAdminRolesReport();
  },
  api_key_audit: async (p) => {
    return await generateApiKeyAuditReport({
      status: p.status !== 'all' ? p.status : undefined
    });
  }
};


const generateReport = async () => {
  if (!selectedReport.value) return;

  const reportId = selectedReport.value.id;
  const handler = reportHandlers[reportId];


  // Handle specific validation requirements
  if (reportId === 'partner_invoices' && !isValidInvoice.value) {
    $toast.error('Please fill out all invoice parameters correctly (Partner, Start Date, End Date).');
    return;
  }

  try {
    const data = await handler(params);
    console.log(`${reportId} Report Data ->`, data);

    if (reportId === 'partner_invoices') {
      invoiceData.value = data;
      generatedInvoiceId.value = data?.invoiceNo;
      invoiceGenerated.value = true;
    } else if (reportId === 'newspaper_engagement') {
      engagementData.value = data;
      engagementReportGenerated.value = true;
      nextTick(() => {
        initEngagementCharts();
      });
    } else {
      notify(`Successfully generated ${selectedReport.value.name}`);
    }

  } catch (error) {
    console.log('error->', error);
    $toast.error('An error occurred while running report.');
  }
};

const initEngagementCharts = () => {
  if (!engagementData.value) return;

  const quotaChartDom = document.getElementById('quotaChart');
  const engagementChartDom = document.getElementById('engagementChart');

  if (quotaChartDom) {
    const quotaChart = echarts.init(quotaChartDom);
    quotaChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: 'Enrolled',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 5, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
          labelLine: { show: false },
          data: engagementData.value.partners.map((p: any) => ({
            value: p.enrolled,
            name: p.name
          }))
        }
      ]
    });
  }

  if (engagementChartDom) {
    const engagementChart = echarts.init(engagementChartDom);
    engagementChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0 },
      xAxis: { type: 'category', data: engagementData.value.engagementTimeSeries.dates },
      yAxis: [
        { type: 'value', name: 'Views' },
        { type: 'value', name: 'Sales' }
      ],
      series: [
        {
          name: 'Views',
          type: 'bar',
          data: engagementData.value.engagementTimeSeries.views,
          itemStyle: { color: '#60a5fa' }
        },
        {
          name: 'Sales',
          type: 'line',
          yAxisIndex: 1,
          data: engagementData.value.engagementTimeSeries.sales,
          itemStyle: { color: '#f97316' },
          smooth: true
        }
      ]
    });
  }
};

const downloadReport = () => {
  if (!selectedReport.value) return
  console.log('Downloading report:', selectedReport.value.id, 'with params:', params)
  notify(`Exporting ${selectedReport.value.name} as CSV...`)
}

const handlePrint = () => {
  window.print()
}

const handleDownloadPDF = () => {

  $toast.success("PDF downloaded ");
  
}

const handleEmail = async () => {

  isSendingInvoice.value = true;
  try {

    let payload = {
      partnerId: params.partnerId,
      startDate: params.startDate,
      endDate: params.endDate
    };

    let success = await sendPartnerInvoiceAsEmail(payload);

    if (success) {
      $toast.success("Invoice sent to partner via email.");
    }
    
  } catch (error) {
    $toast.success("Failed to send partner invoice via email.");
    isSendingInvoice.value = false;
  }
  finally {
    isSendingInvoice.value = false; 
  }
  
}

onMounted(async () => {
    
    await getAllPartners();

});
  
</script>

<style scoped>
/* Print-specific styles to ensure the invoice looks good when printed */
@media print {
  body {
    background-color: white !important;
  }
  .print\:hidden {
    display: none !important;
  }
  .print\:shadow-none {
    box-shadow: none !important;
  }
  .print\:border-none {
    border: none !important;
  }
  .print\:p-0 {
    padding: 0 !important;
  }
  .print\:bg-transparent {
    background-color: transparent !important;
  }
}
</style>
