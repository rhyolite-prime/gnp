<template>
  <div class="flex gap-8 min-h-[calc(100vh-200px)]">

    <!-- Sidebar -->
    <aside class="hidden lg:block w-64 shrink-0">
      <div class="sticky top-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-1">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Getting Started</p>
        <button
          v-for="section in sections"
          :key="section.id"
          @click="activeSection = section.id"
          :class="[
            'w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2',
            activeSection === section.id
              ? 'bg-primary-50 text-primary-700 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <component :is="section.icon" class="w-4 h-4 shrink-0" />
          {{ section.label }}
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 min-w-0 space-y-10">

      <!-- Mobile section picker -->
      <div class="lg:hidden">
        <select v-model="activeSection" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500">
          <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </div>

      <!-- SECTION: Overview -->
      <section v-show="activeSection === 'overview'" class="space-y-6">
        <DocHeader
          title="Partner API Integration"
          description="The Graphic NewsPlus Partner API lets you integrate subscriber onboarding, subscription checks, and affiliate services directly into your own systems."
          badge="v1.0"
        />
        <StepCard number="1" title="Create a Partner Account" icon="UserPlusIcon">
          <p>Visit the <strong>Partner Portal</strong> and sign up for an institutional account. Once approved by an administrator, you will gain access to the partner dashboard.</p>
        </StepCard>
        <StepCard number="2" title="Generate API Credentials" icon="KeyIcon">
          <p>Navigate to <strong>API Settings</strong> in the top menu. Click <em>Generate New API Key</em> to receive a <code class="code-inline">client_id</code> and <code class="code-inline">client_secret</code>. Store these securely — the secret is only shown once.</p>
        </StepCard>
        <StepCard number="3" title="Authenticate &amp; Call Endpoints" icon="ShieldCheckIcon">
          <p>Use your credentials to obtain a bearer token, then include it in the <code class="code-inline">Authorization</code> header of every API request.</p>
        </StepCard>
      </section>

      <!-- SECTION: Authentication -->
      <section v-show="activeSection === 'auth'" class="space-y-6">
        <DocHeader title="Authentication" description="The API supports two authentication strategies. Use a short-lived bearer token for server-to-server flows, or pass your credentials directly as request headers when managing a token lifecycle isn't feasible." />

        <DocBlock title="Base URL">
          <CodeBlock lang="text" :code="baseUrl" />
        </DocBlock>

        <DocBlock title="Option 1 — Obtain an Access Token">
          <p class="text-sm text-slate-600 mb-4">Exchange your <code class="code-inline">client_id</code> and <code class="code-inline">client_secret</code> for a short-lived JWT token.</p>
          <EndpointBadge method="POST" path="/auth/token" />
          <CodeBlock lang="json" label="Request Body" :code="authRequest" />
          <CodeBlock lang="json" label="Response" :code="authResponse" />
        </DocBlock>

        <DocBlock title="Using the Token">
          <p class="text-sm text-slate-600 mb-4">Pass the token in the <code class="code-inline">Authorization</code> header of every subsequent request:</p>
          <CodeBlock lang="http" :code="authUsage" />
        </DocBlock>

        <DocBlock title="Option 2 — Direct Header Credentials">
          <div class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
            <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
            <p class="text-sm text-amber-800">Use this method only in trusted server-to-server environments. Never expose your <code class="code-inline">client_secret</code> in client-side or browser code.</p>
          </div>
          <p class="text-sm text-slate-600 mb-4">
            For scenarios where managing a token lifecycle isn't practical (e.g. internal scripts, webhook validators, USSD back-ends), you can authenticate by including your credentials directly as HTTP headers on every request:
          </p>
          <CodeBlock lang="http" label="Request Headers" :code="authHeaderUsage" />
          <div class="mt-2 space-y-2 text-sm text-slate-600">
            <p><code class="code-inline">ClientId</code> — Your partner <strong>Client ID</strong> from the API Settings page.</p>
            <p><code class="code-inline">ClientSecret</code> — Your partner <strong>Client Secret</strong> from the API Settings page.</p>
          </div>
        </DocBlock>
      </section>

      <!-- SECTION: Subscriber Onboarding -->
      <section v-show="activeSection === 'onboarding'" class="space-y-6">
        <DocHeader title="Subscriber Onboarding" description="Onboard subscribers on behalf of your organisation directly via the API." />

        <DocBlock title="Create a Subscriber">
          <EndpointBadge method="POST" path="/subscribers/onboard" />
          <p class="text-sm text-slate-500 mb-3">
            <code class="code-inline">startDate</code> and <code class="code-inline">endDate</code> must be formatted as <code class="code-inline">dd-MM-yyyy</code> (e.g. <code class="code-inline">27-04-2025</code>).
          </p>
          <CodeBlock lang="json" label="Request Body" :code="createSubscriberRequest" />
          <CodeBlock lang="json" label="Response" :code="createSubscriberResponse" />
        </DocBlock>

        <DocBlock title="Bulk Upload Subscribers">
          <EndpointBadge method="POST" path="/subscribers/bulk-upload" />
          <p class="text-sm text-slate-600 mb-3">Send an array of subscriber objects to onboard multiple users at once.</p>
          <CodeBlock lang="json" label="Request Body" :code="bulkUploadRequest" />
          <CodeBlock lang="json" label="Response" :code="bulkUploadResponse" />
        </DocBlock>
      </section>

      <!-- SECTION: Subscription Check -->
      <section v-show="activeSection === 'subscription'" class="space-y-6">
        <DocHeader title="Check Subscriber Subscription" description="Verify whether a subscriber has an active subscription and retrieve their plan details." />

        <DocBlock title="Check by Email">
          <EndpointBadge method="GET" path="/partner/subscribers/subscription-status?email={email}" />
          <CodeBlock lang="json" label="Response" :code="subscriptionStatusResponse" />
        </DocBlock>

        <DocBlock title="Check by Phone">
          <EndpointBadge method="GET" path="/partner/subscribers/subscription-status?phone={phone}" />
          <p class="text-sm text-slate-600">Same response shape as email lookup above.</p>
        </DocBlock>
      </section>

      <!-- SECTION: Affiliate Services -->
      <section v-show="activeSection === 'affiliate'" class="space-y-6">
        <DocHeader title="Affiliate &amp; Other Services" description="Additional endpoints available to integration partners." />

        <DocBlock title="List Available Plans">
          <EndpointBadge method="GET" path="/partner/plans" />
          <p class="text-sm text-slate-600 mb-3">Returns the subscription plans your partner account can offer to subscribers.</p>
          <CodeBlock lang="json" label="Response" :code="plansResponse" />
        </DocBlock>

        <DocBlock title="Get Subscriber Directory">
          <EndpointBadge method="GET" path="/partner/subscribers?pageNo=1&amp;pageSize=20" />
          <CodeBlock lang="json" label="Response" :code="subscriberListResponse" />
        </DocBlock>

        <DocBlock title="Update Subscriber">
          <EndpointBadge method="PUT" path="/partner/subscribers/{subscriberId}" />
          <CodeBlock lang="json" label="Request Body" :code="updateSubscriberRequest" />
        </DocBlock>

        <DocBlock title="Delete Subscriber">
          <EndpointBadge method="DELETE" path="/partner/subscribers/{subscriberId}" />
          <p class="text-sm text-slate-600">Returns <code class="code-inline">204 No Content</code> on success.</p>
        </DocBlock>
      </section>

      <!-- SECTION: Error Codes -->
      <section v-show="activeSection === 'errors'" class="space-y-6">
        <DocHeader title="Error Codes" description="Standard HTTP error responses returned by the API." />
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left font-bold text-slate-600">Code</th>
                <th class="px-6 py-3 text-left font-bold text-slate-600">Meaning</th>
                <th class="px-6 py-3 text-left font-bold text-slate-600">Common Cause</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="err in errorCodes" :key="err.code">
                <td class="px-6 py-3 font-mono font-bold" :class="err.color">{{ err.code }}</td>
                <td class="px-6 py-3 text-slate-700 font-medium">{{ err.meaning }}</td>
                <td class="px-6 py-3 text-slate-500">{{ err.cause }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from 'vue'
import {
  BookOpenIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  CheckCircleIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  KeyIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'default', middleware: 'partner-auth' })
useHead({ title: 'Help & API Docs | Partner Portal' })

const activeSection = ref('overview')

const sections = [
  { id: 'overview',     label: 'Overview',              icon: BookOpenIcon },
  { id: 'auth',         label: 'Authentication',         icon: ShieldCheckIcon },
  { id: 'onboarding',   label: 'Subscriber Onboarding',  icon: UserPlusIcon },
  { id: 'subscription', label: 'Subscription Check',     icon: CheckCircleIcon },
  { id: 'affiliate',    label: 'Other Services',         icon: LinkIcon },
  { id: 'errors',       label: 'Error Codes',            icon: ExclamationTriangleIcon },
]

const baseUrl = `https://dev-api.graphicnewsplus.com/api/v1/partner`

const authRequest = `{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret"
}`

const authResponse = `{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}`

const authUsage = `GET /subscribers HTTP/1.1
Host: dev-api.graphicnewsplus.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

const authHeaderUsage = `GET /subscribers HTTP/1.1
Host: dev-dev-api.graphicnewsplus.com
ClientId: your_client_id
ClientSecret: your_client_secret`

const createSubscriberRequest = `{
  "fullName": "Kofi Mensah",
  "email": "kofi.mensah@example.com",
  "phoneNumber": "0241234567",
  "startDate": "27-04-2025",  // dd-MM-yyyy
  "endDate": "27-05-2025"     // dd-MM-yyyy
}`

const createSubscriberResponse = `{
  "success": true,
  "data": {
    "subscriberId": "sub_abc123",
    "email": "kofi.mensah@example.com",
    "status": "Active",
    "createdAt": "2025-04-27T10:00:00Z"
  }
}`

const bulkUploadRequest = `{
  "subscribers": [
    { "fullName": "Ama Asante", "email": "ama@example.com",  "phoneNumber": "0551234567",  "startDate": "02-04-2026", "endDate": "02-05-2026" },
    { "fullName": "Kweku Boateng", "email": "kweku@example.com", "phoneNumber": "0261234567", "startDate": "02-04-2026", "endDate": "02-05-2026" }
  ]
}`

const bulkUploadResponse = `{
  "success": true,
  "created": 2,
  "failed": 0,
  "errors": []
}`

const subscriptionStatusResponse = `{
  "success": true,
  "data": {
    "isActive": true,
    "planName": "Premium Monthly",
    "startDate": "2025-04-01",
    "endDate": "2025-05-01",
    "nextRenewalDate": "2025-05-01"
  }
}`

const plansResponse = `{
  "success": true,
  "data": [
    { "id": "plan_001", "name": "Basic",   "price": 9.99,  "currency": "GHS", "duration": "Monthly" },
    { "id": "plan_002", "name": "Premium", "price": 24.99, "currency": "GHS", "duration": "Monthly" }
  ]
}`

const subscriberListResponse = `{
  "success": true,
  "data": [...],
  "totalCount": 120,
  "totalPages": 6,
  "pageNo": 1
}`

const updateSubscriberRequest = `{
  "firstName": "Kofi",
  "lastName": "Mensah",
  "phoneNumber": "0241111111"
}`

const errorCodes = [
  { code: '400', meaning: 'Bad Request',      cause: 'Missing or invalid fields in the request body',    color: 'text-yellow-600' },
  { code: '401', meaning: 'Unauthorized',     cause: 'Missing, expired, or invalid bearer token',        color: 'text-red-600' },
  { code: '403', meaning: 'Forbidden',        cause: 'Your account lacks permission for this action',    color: 'text-red-600' },
  { code: '404', meaning: 'Not Found',        cause: 'The requested resource does not exist',            color: 'text-slate-500' },
  { code: '409', meaning: 'Conflict',         cause: 'Subscriber already exists with that email/phone',  color: 'text-orange-600' },
  { code: '422', meaning: 'Unprocessable',    cause: 'Quota exceeded or business rule violation',        color: 'text-orange-600' },
  { code: '500', meaning: 'Server Error',     cause: 'Internal server error — contact support',          color: 'text-red-700' },
]

// ── Inline child components ────────────────────────────────────────────────

const DocHeader = defineComponent({
  props: { title: String, description: String, badge: String },
  setup(props) {
    return () => h('div', { class: 'pb-2 border-b border-slate-100' }, [
      h('div', { class: 'flex items-center gap-3 mb-2' }, [
        h('h2', { class: 'text-2xl font-bold text-slate-900' }, props.title),
        props.badge ? h('span', { class: 'px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold' }, props.badge) : null
      ]),
      h('p', { class: 'text-slate-500 text-sm leading-relaxed' }, props.description)
    ])
  }
})

const StepCard = defineComponent({
  props: { number: String, title: String },
  setup(props, { slots }) {
    return () => h('div', { class: 'bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex gap-5' }, [
      h('div', { class: 'shrink-0 w-9 h-9 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center shadow' }, props.number),
      h('div', { class: 'flex-1' }, [
        h('h3', { class: 'font-bold text-slate-900 mb-2' }, props.title),
        h('div', { class: 'text-sm text-slate-600 leading-relaxed' }, slots.default?.())
      ])
    ])
  }
})

const DocBlock = defineComponent({
  props: { title: String },
  setup(props, { slots }) {
    return () => h('div', { class: 'bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4' }, [
      h('h3', { class: 'font-bold text-slate-900 text-base' }, props.title),
      ...(slots.default?.() ?? [])
    ])
  }
})

const EndpointBadge = defineComponent({
  props: { method: String, path: String },
  setup(props) {
    const colors: Record<string, string> = {
      GET: 'bg-sky-100 text-sky-700',
      POST: 'bg-green-100 text-green-700',
      PUT: 'bg-yellow-100 text-yellow-700',
      DELETE: 'bg-red-100 text-red-700',
    }
    return () => h('div', { class: 'flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 mb-4 border border-slate-100 font-mono text-sm' }, [
      h('span', { class: `px-2 py-0.5 rounded-md font-bold text-xs ${colors[props.method!] ?? ''}` }, props.method),
      h('span', { class: 'text-slate-700' }, props.path)
    ])
  }
})

const CodeBlock = defineComponent({
  props: { code: String, lang: String, label: String },
  setup(props) {
    return () => h('div', {}, [
      props.label ? h('p', { class: 'text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5' }, props.label) : null,
      h('pre', { class: 'bg-slate-900 text-slate-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed mb-4' },
        h('code', {}, props.code)
      )
    ])
  }
})
</script>

<style scoped>
.code-inline {
  @apply bg-slate-100 text-primary-700 rounded px-1.5 py-0.5 font-mono text-[0.8em] font-semibold;
}
</style>
