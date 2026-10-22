<template>
  <div class="max-w-7xl mx-auto">
    <CampaignsSubNav
      title="New Broadcast Wizard"
      subtitle="Create and send a coordinated Browser/In-App Notification, Email, or SMS broadcast in 4 steps."
    />

    <!-- 4-Step Progress Bar -->
    <nav aria-label="Progress" class="bg-white rounded-xl border border-gray-200 shadow-xs p-4 mb-6">
      <ol class="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <li v-for="(step, idx) in steps" :key="step.number">
          <button
            type="button"
            @click="goToStep(step.number)"
            class="w-full text-left flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer"
            :class="
              currentStep === step.number
                ? 'bg-red-50/80 border border-red-200'
                : currentStep > step.number
                  ? 'bg-gray-50 hover:bg-gray-100'
                  : 'hover:bg-gray-50'
            "
          >
            <span
              class="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              :class="
                currentStep === step.number
                  ? 'bg-primary-600 text-white'
                  : currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
              "
            >
              <CheckIcon v-if="currentStep > step.number" class="h-4 w-4" />
              <span v-else>{{ idx + 1 }}</span>
            </span>
            <div class="min-w-0">
              <p
                class="text-xs font-semibold truncate"
                :class="currentStep === step.number ? 'text-primary-700' : 'text-gray-900'"
              >
                {{ step.title }}
              </p>
              <p class="text-[11px] text-gray-500 truncate">{{ step.caption }}</p>
            </div>
          </button>
        </li>
      </ol>
    </nav>

    <!-- STEP 1: BASICS & DELIVERY CHANNELS -->
    <div v-if="currentStep === 1" class="space-y-6">
      <!-- Quick Template Starter Bar -->
      <div v-if="presets.length" class="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-sm font-semibold text-gray-900">Quick-Start Templates (Optional)</h2>
            <p class="text-xs text-gray-500">Prefill channels and copy from a standard newsroom or retention workflow</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            v-for="preset in presets"
            :key="preset.id"
            type="button"
            @click="applyPreset(preset)"
            class="text-left p-3.5 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-red-50/30 transition-colors cursor-pointer"
          >
            <span class="text-[11px] font-semibold uppercase tracking-wide text-primary-600">
              {{ preset.channels.join(' + ') }}
            </span>
            <p class="text-sm font-semibold text-gray-900 mt-1">{{ preset.label }}</p>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ preset.pushBody }}</p>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g., Daily Graphic Morning Edition — Oct 22"
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              v-model="form.category"
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="morning_edition">Morning Edition</option>
              <option value="breaking_news">Breaking News</option>
              <option value="weekend_digest">Weekend Digest</option>
              <option value="subscription">Subscription & Retention</option>
              <option value="promo_offer">Promotional Offer</option>
              <option value="system">System Announcement</option>
            </select>
          </div>
        </div>

        <!-- Multi-Channel Selector Cards -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Delivery Channels <span class="text-red-600">*</span>
          </label>
          <p class="text-xs text-gray-500 mb-3">
            Select one or combine multiple channels in a single broadcast.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              v-for="ch in channelCards"
              :key="ch.id"
              type="button"
              @click="toggleChannel(ch.id)"
              class="text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5"
              :class="
                form.channels.includes(ch.id)
                  ? 'border-primary-600 bg-red-50/40'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              "
            >
              <div
                class="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                :class="
                  form.channels.includes(ch.id)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                "
              >
                <component :is="ch.icon" class="h-5 w-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-900">{{ ch.title }}</span>
                  <CheckCircleIcon
                    v-if="form.channels.includes(ch.id)"
                    class="h-5 w-5 text-primary-600 shrink-0"
                  />
                </div>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ ch.description }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 2: AUDIENCE TARGETING (All Users | User Groups | Single/Specific Users by Name/Email) -->
    <div v-else-if="currentStep === 2" class="space-y-6">
      <div class="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Choose Target Audience</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Broadcast to your entire subscriber base, targeted user groups, or individual subscribers by name or email.
          </p>
        </div>

        <!-- 3 Audience Mode Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="mode in audienceModes"
            :key="mode.id"
            type="button"
            @click="form.audienceType = mode.id"
            class="text-left p-4 rounded-xl border-2 transition-all cursor-pointer"
            :class="
              form.audienceType === mode.id
                ? 'border-primary-600 bg-red-50/40'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            "
          >
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-semibold text-gray-900">{{ mode.title }}</span>
              <span
                class="h-4 w-4 rounded-full border flex items-center justify-center"
                :class="
                  form.audienceType === mode.id
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                "
              >
                <span v-if="form.audienceType === mode.id" class="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>
            <p class="text-xs text-gray-500 leading-relaxed">{{ mode.description }}</p>
          </button>
        </div>

        <!-- MODE A: ALL USERS SUMMARY -->
        <div
          v-if="form.audienceType === 'all'"
          class="rounded-xl bg-gray-50 border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p class="text-sm font-semibold text-gray-900">All Active Graphic NewsPlus Subscribers</p>
            <p class="text-xs text-gray-500 mt-1">
              Automatically deduplicates recipients and respects per-channel opt-out preferences.
            </p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-2xl font-bold text-gray-900">48,920</p>
            <p class="text-xs text-gray-500">Total reachable accounts</p>
          </div>
        </div>

        <!-- MODE B: TARGETED USER GROUPS -->
        <div v-else-if="form.audienceType === 'groups'" class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="relative flex-1 max-w-md">
              <MagnifyingGlassIcon class="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                v-model="groupSearch"
                type="text"
                placeholder="Filter user groups..."
                class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <span class="text-xs text-gray-600 font-medium">
              Selected: <strong>{{ selectedGroups.length }}</strong> group(s) · Est.
              <strong>{{ estimatedAudienceCount.toLocaleString() }}</strong> subscribers
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label
              v-for="grp in filteredGroups"
              :key="grp.id"
              class="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors"
              :class="
                isGroupSelected(grp.id)
                  ? 'border-primary-600 bg-red-50/30'
                  : 'border-gray-200 hover:bg-gray-50'
              "
            >
              <input
                type="checkbox"
                :checked="isGroupSelected(grp.id)"
                @change="toggleGroup(grp)"
                class="mt-1 rounded text-primary-600 focus:ring-primary-500"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-semibold text-gray-900">{{ grp.name }}</span>
                  <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {{ grp.memberCount.toLocaleString() }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ grp.description }}</p>
                <div class="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-400">
                  <span>Email: {{ grp.channels.email.toLocaleString() }}</span>
                  <span>SMS: {{ grp.channels.sms.toLocaleString() }}</span>
                  <span>Push: {{ grp.channels.push.toLocaleString() }}</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- MODE C: SINGLE / SPECIFIC USERS (SEARCH BY NAME OR EMAIL) -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Search Subscriber by Name or Email <span class="text-red-600">*</span>
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                v-model="userSearchQuery"
                type="text"
                placeholder="Type a name or email (e.g. Kwame Mensah, kojo.boateng@ecobank.com)..."
                class="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <!-- Selected User Chips -->
          <div v-if="selectedUsers.length" class="space-y-2">
            <p class="text-xs font-medium text-gray-600">
              Selected Recipient{{ selectedUsers.length === 1 ? '' : 's' }} ({{ selectedUsers.length }})
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="user in selectedUsers"
                :key="user.id"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-900 border border-red-200"
              >
                <span class="font-semibold">{{ user.name }}</span>
                <span class="text-red-600/80">&lt;{{ user.email }}&gt;</span>
                <button
                  type="button"
                  @click="removeSelectedUser(user.id)"
                  class="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <XMarkIcon class="h-3.5 w-3.5" />
                </button>
              </span>
            </div>
          </div>

          <!-- Search Results List -->
          <div class="border border-gray-200 rounded-xl divide-y divide-gray-200 overflow-hidden">
            <div v-if="searchingUsers" class="p-6 text-center text-xs text-gray-500">
              Searching subscribers...
            </div>
            <div v-else-if="userSearchResults.length === 0" class="p-6 text-center text-xs text-gray-500">
              No subscribers matched "{{ userSearchQuery }}".
            </div>
            <div
              v-for="user in userSearchResults"
              :key="user.id"
              class="px-4 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="h-9 w-9 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs flex items-center justify-center shrink-0">
                  {{ getInitials(user.name) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ user.email }} · {{ user.phone }} · <span class="text-gray-700">{{ user.plan }}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                @click="toggleUser(user)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shrink-0 cursor-pointer"
                :class="
                  isUserSelected(user.id)
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                "
              >
                {{ isUserSelected(user.id) ? 'Selected' : 'Select' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 3: COMPOSE MESSAGE + LIVE INTERACTIVE MULTI-CHANNEL PREVIEW -->
    <div v-else-if="currentStep === 3" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-7 space-y-6">
        <!-- Browser & In-App Notification Composer -->
        <div
          v-if="form.channels.includes('push')"
          class="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4"
        >
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-sm font-semibold text-gray-900">Browser & In-App Notification Copy</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 font-medium">Web Push + In-App</span>
          </div>

          <div>
            <div class="flex justify-between text-xs mb-1">
              <label class="font-medium text-gray-700">Notification Headline *</label>
              <span class="text-gray-400">{{ form.pushTitle.length }}/90</span>
            </div>
            <input
              v-model="form.pushTitle"
              maxlength="90"
              type="text"
              placeholder="e.g., Daily Graphic Morning Edition Is Live"
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <div class="flex justify-between text-xs mb-1">
              <label class="font-medium text-gray-700">Notification Summary *</label>
              <span class="text-gray-400">{{ form.pushBody.length }}/220</span>
            </div>
            <textarea
              v-model="form.pushBody"
              rows="3"
              maxlength="220"
              placeholder="Write a concise alert summary (supports {{first_name}})..."
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Action Button Label</label>
              <input
                v-model="form.ctaLabel"
                type="text"
                placeholder="Read Edition"
                class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Target URL / Deep Link</label>
              <input
                v-model="form.ctaUrl"
                type="text"
                placeholder="/newspapers"
                class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Rich Banner Image URL (Optional)</label>
            <input
              v-model="form.imageUrl"
              type="url"
              placeholder="https://..."
              class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <!-- Email Composer -->
        <div
          v-if="form.channels.includes('email')"
          class="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4"
        >
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-sm font-semibold text-gray-900">Email Message Copy</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">Email Channel</span>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Email Subject Line *</label>
            <input
              v-model="form.subject"
              type="text"
              placeholder="e.g., Good morning {{first_name}} — Today's Daily Graphic e-Paper"
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Inbox Preview Text (Preheader)</label>
            <input
              v-model="form.preheader"
              type="text"
              placeholder="Optional summary shown beside the subject line in Gmail/Outlook"
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Email Body *</label>
            <textarea
              v-model="form.emailBody"
              rows="6"
              placeholder="Hello {{first_name}}, write your email message here..."
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div v-if="!form.channels.includes('push')" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">CTA Button Text</label>
              <input
                v-model="form.ctaLabel"
                type="text"
                placeholder="Read Now"
                class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">CTA Destination URL</label>
              <input
                v-model="form.ctaUrl"
                type="text"
                placeholder="/newspapers"
                class="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- SMS Composer -->
        <div
          v-if="form.channels.includes('sms')"
          class="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4"
        >
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-sm font-semibold text-gray-900">SMS Broadcast Copy</h3>
            <span class="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium">
              {{ form.smsBody.length }} chars · {{ Math.max(1, Math.ceil((form.smsBody.length || 1) / 160)) }} segment(s)
            </span>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">SMS Text Message *</label>
            <textarea
              v-model="form.smsBody"
              rows="3"
              maxlength="320"
              placeholder="Graphic NewsPlus: Hi {{first_name}}, your message here..."
              class="block w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <p class="mt-1 text-[11px] text-gray-400">
              Standard single SMS segment is 160 characters (Sender ID: <code>GraphicNews</code>).
            </p>
          </div>
        </div>
      </div>

      <!-- Sticky Live Preview Column -->
      <div class="lg:col-span-5 lg:sticky lg:top-6">
        <CampaignMessagePreview
          :channels="form.channels"
          :category="form.category"
          :subject="form.subject"
          :preheader="form.preheader"
          :push-title="form.pushTitle"
          :push-body="form.pushBody"
          :email-body="form.emailBody"
          :sms-body="form.smsBody"
          :cta-label="form.ctaLabel"
          :cta-url="form.ctaUrl"
          :image-url="form.imageUrl"
          :sample-user="selectedUsers[0] || null"
        />
      </div>
    </div>

    <!-- STEP 4: SCHEDULE OR SEND NOW + FINAL REVIEW -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-7 space-y-6">
        <!-- Delivery Timing Choice -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-5">
          <div>
            <h2 class="text-base font-semibold text-gray-900">Delivery Timing</h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Dispatch immediately or schedule for an exact date and time (Africa/Accra GMT).
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              @click="form.deliveryMode = 'now'"
              class="text-left p-4 rounded-xl border-2 transition-all cursor-pointer"
              :class="
                form.deliveryMode === 'now'
                  ? 'border-primary-600 bg-red-50/40'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <p class="text-sm font-semibold text-gray-900">Send Immediately</p>
              <p class="text-xs text-gray-500 mt-1">
                Queue and deliver across all selected channels right away.
              </p>
            </button>

            <button
              type="button"
              @click="form.deliveryMode = 'scheduled'"
              class="text-left p-4 rounded-xl border-2 transition-all cursor-pointer"
              :class="
                form.deliveryMode === 'scheduled'
                  ? 'border-primary-600 bg-red-50/40'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <p class="text-sm font-semibold text-gray-900">Schedule for Later</p>
              <p class="text-xs text-gray-500 mt-1">
                Pick a future date & time to dispatch automatically.
              </p>
            </button>
          </div>

          <div v-if="form.deliveryMode === 'scheduled'" class="pt-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date & Time (GMT) <span class="text-red-600">*</span>
            </label>
            <input
              v-model="form.scheduledAt"
              type="datetime-local"
              class="block w-full sm:w-80 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Final Broadcast Summary Checklist -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
          <h3 class="text-base font-semibold text-gray-900">Broadcast Summary</h3>

          <dl class="divide-y divide-gray-100 text-sm">
            <div class="py-3 flex justify-between gap-4">
              <dt class="text-gray-500">Campaign Name</dt>
              <dd class="font-medium text-gray-900 text-right">{{ form.name }}</dd>
            </div>
            <div class="py-3 flex justify-between gap-4">
              <dt class="text-gray-500">Channels</dt>
              <dd class="font-medium text-gray-900 text-right">
                {{ form.channels.map(channelLabel).join(' + ') }}
              </dd>
            </div>
            <div class="py-3 flex justify-between gap-4">
              <dt class="text-gray-500">Target Audience</dt>
              <dd class="font-medium text-gray-900 text-right">{{ computedAudienceSummary }}</dd>
            </div>
            <div class="py-3 flex justify-between gap-4">
              <dt class="text-gray-500">Estimated Reach</dt>
              <dd class="font-semibold text-gray-900 text-right">
                {{ estimatedAudienceCount.toLocaleString() }} recipient(s)
              </dd>
            </div>
            <div class="py-3 flex justify-between gap-4">
              <dt class="text-gray-500">Delivery Mode</dt>
              <dd class="font-medium text-primary-700 text-right">
                {{
                  form.deliveryMode === 'scheduled' && form.scheduledAt
                    ? `Scheduled · ${new Date(form.scheduledAt).toLocaleString()}`
                    : 'Immediate Dispatch (Send Now)'
                }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Final Live Preview -->
      <div class="lg:col-span-5 lg:sticky lg:top-6">
        <CampaignMessagePreview
          :channels="form.channels"
          :category="form.category"
          :subject="form.subject"
          :preheader="form.preheader"
          :push-title="form.pushTitle"
          :push-body="form.pushBody"
          :email-body="form.emailBody"
          :sms-body="form.smsBody"
          :cta-label="form.ctaLabel"
          :cta-url="form.ctaUrl"
          :image-url="form.imageUrl"
          :sample-user="selectedUsers[0] || null"
        />
      </div>
    </div>

    <!-- Step Navigation Footer -->
    <div class="mt-6 bg-white rounded-xl border border-gray-200 shadow-xs px-6 py-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <button
          v-if="currentStep > 1"
          type="button"
          @click="currentStep--"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1.5" />
          Previous Step
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          :disabled="submitting"
          @click="handleSubmit('draft')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
        >
          Save as Draft
        </button>

        <button
          v-if="currentStep < 4"
          type="button"
          @click="handleNextStep"
          class="inline-flex items-center px-5 py-2 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 cursor-pointer"
        >
          Continue
          <ArrowRightIcon class="h-4 w-4 ml-1.5" />
        </button>

        <button
          v-else
          type="button"
          :disabled="submitting"
          @click="handleSubmit(form.deliveryMode)"
          class="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 cursor-pointer"
        >
          <PaperAirplaneIcon class="h-4 w-4 mr-2" />
          {{
            submitting
              ? 'Processing...'
              : form.deliveryMode === 'scheduled'
                ? 'Schedule Broadcast'
                : 'Send Broadcast Now'
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import {
  BellAlertIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline';
import CampaignsSubNav from '~/components/campaigns/CampaignsSubNav.vue';
import CampaignMessagePreview from '~/components/campaigns/CampaignMessagePreview.vue';
import {
  fetchCampaignsOverview,
  fetchCampaignById,
  fetchTargetUserGroups,
  searchTargetSubscribers,
  submitCampaignBroadcast,
  type MessagingChannel,
  type AudienceType,
  type DeliveryMode,
  type CampaignPreset,
  type TargetUserGroup,
  type TargetUserSummary,
} from '~/services/campaigns';

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
});

const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();

const steps = [
  { number: 1, title: '1. Basics & Channels', caption: 'Name & delivery channels' },
  { number: 2, title: '2. Target Audience', caption: 'All, groups, or specific users' },
  { number: 3, title: '3. Compose & Preview', caption: 'Message copy & live preview' },
  { number: 4, title: '4. Schedule & Send', caption: 'Timing & final review' },
];

const channelCards: {
  id: MessagingChannel;
  title: string;
  description: string;
  icon: any;
}[] = [
  {
    id: 'push',
    title: 'Browser & In-App Notification',
    description: 'Instant Web Push alert on desktop/mobile browsers plus in-app notification center.',
    icon: BellAlertIcon,
  },
  {
    id: 'email',
    title: 'Email Broadcast',
    description: 'Rich formatted Graphic NewsPlus email with hero banner, personalized greeting, and CTA.',
    icon: EnvelopeIcon,
  },
  {
    id: 'sms',
    title: 'SMS Alert',
    description: 'Direct mobile text message via GraphicNews sender ID for high-urgency reach.',
    icon: DevicePhoneMobileIcon,
  },
];

const audienceModes: { id: AudienceType; title: string; description: string }[] = [
  {
    id: 'all',
    title: 'All Users',
    description: 'Send to every active subscriber opted in to the chosen channels (48,920 users).',
  },
  {
    id: 'groups',
    title: 'User Groups',
    description: 'Target one or more curated subscriber segments or corporate reader cohorts.',
  },
  {
    id: 'users',
    title: 'Single / Specific Users',
    description: 'Search and pick one individual user or a hand-picked list by Name or Email.',
  },
];

const currentStep = ref(1);
const submitting = ref(false);
const editingId = ref<string | undefined>(undefined);

const presets = ref<CampaignPreset[]>([]);
const allGroups = ref<TargetUserGroup[]>([]);
const groupSearch = ref('');

const userSearchQuery = ref('');
const searchingUsers = ref(false);
const userSearchResults = ref<TargetUserSummary[]>([]);

const selectedGroups = ref<TargetUserGroup[]>([]);
const selectedUsers = ref<TargetUserSummary[]>([]);

const form = reactive({
  name: '',
  category: 'morning_edition',
  channels: ['push', 'email'] as MessagingChannel[],
  audienceType: 'all' as AudienceType,
  deliveryMode: 'now' as DeliveryMode,
  scheduledAt: '',
  subject: '',
  preheader: '',
  pushTitle: '',
  pushBody: '',
  emailBody: '',
  smsBody: '',
  ctaLabel: 'Read Edition',
  ctaUrl: '/newspapers',
  imageUrl: '',
});

const filteredGroups = computed(() => {
  const q = groupSearch.value.trim().toLowerCase();
  if (!q) return allGroups.value;
  return allGroups.value.filter(
    (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
  );
});

const estimatedAudienceCount = computed(() => {
  if (form.audienceType === 'all') return 48920;
  if (form.audienceType === 'groups') {
    return selectedGroups.value.reduce((sum, g) => sum + g.memberCount, 0);
  }
  return selectedUsers.value.length;
});

const computedAudienceSummary = computed(() => {
  if (form.audienceType === 'all') return 'All Active Subscribers';
  if (form.audienceType === 'groups') {
    return selectedGroups.value.map((g) => g.name).join(', ') || 'No groups selected';
  }
  if (selectedUsers.value.length === 1) {
    return `${selectedUsers.value[0].name} (${selectedUsers.value[0].email})`;
  }
  return selectedUsers.value.map((u) => u.name).join(', ') || 'No users selected';
});

function channelLabel(ch: MessagingChannel): string {
  if (ch === 'push') return 'Browser & In-App';
  if (ch === 'email') return 'Email';
  return 'SMS';
}

function toggleChannel(ch: MessagingChannel) {
  const idx = form.channels.indexOf(ch);
  if (idx >= 0) {
    if (form.channels.length > 1) {
      form.channels.splice(idx, 1);
    }
  } else {
    form.channels.push(ch);
  }
}

function applyPreset(preset: CampaignPreset) {
  form.name = preset.name;
  form.category = preset.category;
  form.channels = [...preset.channels];
  form.subject = preset.subject;
  form.preheader = preset.preheader;
  form.pushTitle = preset.pushTitle;
  form.pushBody = preset.pushBody;
  form.emailBody = preset.emailBody;
  form.smsBody = preset.smsBody;
  form.ctaLabel = preset.ctaLabel;
  form.ctaUrl = preset.ctaUrl;
  $toast?.info?.(`Loaded "${preset.label}" template.`);
}

function isGroupSelected(id: string) {
  return selectedGroups.value.some((g) => g.id === id);
}

function toggleGroup(group: TargetUserGroup) {
  const idx = selectedGroups.value.findIndex((g) => g.id === group.id);
  if (idx >= 0) {
    selectedGroups.value.splice(idx, 1);
  } else {
    selectedGroups.value.push(group);
  }
}

function isUserSelected(id: string) {
  return selectedUsers.value.some((u) => u.id === id);
}

function toggleUser(user: TargetUserSummary) {
  const idx = selectedUsers.value.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    selectedUsers.value.splice(idx, 1);
  } else {
    selectedUsers.value.push(user);
  }
}

function removeSelectedUser(id: string) {
  selectedUsers.value = selectedUsers.value.filter((u) => u.id !== id);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(userSearchQuery, (q) => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    searchingUsers.value = true;
    try {
      userSearchResults.value = await searchTargetSubscribers(q);
    } finally {
      searchingUsers.value = false;
    }
  }, 180);
});

function validateStep(step: number): boolean {
  if (step === 1) {
    if (!form.name.trim()) {
      $toast?.error?.('Please enter a campaign name.');
      return false;
    }
    if (form.channels.length === 0) {
      $toast?.error?.('Select at least one delivery channel.');
      return false;
    }
  }
  if (step === 2) {
    if (form.audienceType === 'groups' && selectedGroups.value.length === 0) {
      $toast?.error?.('Please select at least one user group.');
      return false;
    }
    if (form.audienceType === 'users' && selectedUsers.value.length === 0) {
      $toast?.error?.('Search and select at least one subscriber.');
      return false;
    }
  }
  if (step === 3) {
    if (form.channels.includes('push') && (!form.pushTitle.trim() || !form.pushBody.trim())) {
      $toast?.error?.('Enter a headline and summary for Browser & In-App notification.');
      return false;
    }
    if (form.channels.includes('email') && (!form.subject.trim() || !form.emailBody.trim())) {
      $toast?.error?.('Enter an email subject line and email body.');
      return false;
    }
    if (form.channels.includes('sms') && !form.smsBody.trim()) {
      $toast?.error?.('Enter your SMS message copy.');
      return false;
    }
  }
  return true;
}

function handleNextStep() {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
  }
}

function goToStep(targetStep: number) {
  if (targetStep <= currentStep.value) {
    currentStep.value = targetStep;
    return;
  }
  for (let s = currentStep.value; s < targetStep; s++) {
    if (!validateStep(s)) return;
  }
  currentStep.value = targetStep;
}

async function handleSubmit(mode: DeliveryMode) {
  if (mode !== 'draft') {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
    if (mode === 'scheduled' && !form.scheduledAt) {
      $toast?.error?.('Please choose a scheduled date and time.');
      return;
    }
  } else if (!form.name.trim()) {
    form.name = 'Untitled Campaign Draft';
  }

  submitting.value = true;
  try {
    await submitCampaignBroadcast({
      id: editingId.value,
      name: form.name,
      category: form.category,
      channels: form.channels,
      audienceType: form.audienceType,
      selectedGroups: selectedGroups.value.map((g) => ({
        id: g.id,
        name: g.name,
        memberCount: g.memberCount,
      })),
      selectedUsers: selectedUsers.value,
      deliveryMode: mode,
      scheduledAt: mode === 'scheduled' ? new Date(form.scheduledAt).toISOString() : null,
      subject: form.subject,
      preheader: form.preheader,
      pushTitle: form.pushTitle,
      pushBody: form.pushBody,
      emailBody: form.emailBody,
      smsBody: form.smsBody,
      ctaLabel: form.ctaLabel,
      ctaUrl: form.ctaUrl,
      imageUrl: form.imageUrl,
    });

    const msg =
      mode === 'draft'
        ? 'Broadcast saved as draft.'
        : mode === 'scheduled'
          ? 'Broadcast scheduled successfully.'
          : 'Broadcast dispatched across selected channels!';
    $toast?.success?.(msg);
    await router.push('/admin/campaigns/history');
  } catch (err: any) {
    $toast?.error?.(err?.message || 'Failed to save broadcast.');
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  // Default schedule picker tomorrow at 06:00 GMT
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
  tomorrow.setHours(6, 0, 0, 0);
  form.scheduledAt = tomorrow.toISOString().slice(0, 16);

  const [overviewRes, groupsRes, usersRes] = await Promise.all([
    fetchCampaignsOverview('14d'),
    fetchTargetUserGroups(),
    searchTargetSubscribers(''),
  ]);

  presets.value = overviewRes.presets || [];
  allGroups.value = groupsRes;
  userSearchResults.value = usersRes;

  // Hydrate if duplicating or editing an existing broadcast
  const sourceId = (route.query.edit || route.query.duplicate) as string | undefined;
  if (sourceId) {
    const existing = await fetchCampaignById(sourceId);
    if (existing) {
      if (route.query.edit) editingId.value = existing.id;
      form.name = route.query.duplicate ? `${existing.name} (Copy)` : existing.name;
      form.category = existing.category;
      form.channels = [...existing.channels];
      form.audienceType = existing.audienceType;
      form.deliveryMode = existing.deliveryMode === 'draft' ? 'now' : existing.deliveryMode;
      form.subject = existing.subject || '';
      form.preheader = existing.preheader || '';
      form.pushTitle = existing.pushTitle || '';
      form.pushBody = existing.pushBody || '';
      form.emailBody = existing.emailBody || '';
      form.smsBody = existing.smsBody || '';
      form.ctaLabel = existing.ctaLabel || 'Read Edition';
      form.ctaUrl = existing.ctaUrl || '/newspapers';
      form.imageUrl = existing.imageUrl || '';

      if (existing.selectedGroups?.length) {
        selectedGroups.value = allGroups.value.filter((g) =>
          existing.selectedGroups?.some((sg) => sg.id === g.id)
        );
      }
      if (existing.selectedUsers?.length) {
        selectedUsers.value = [...existing.selectedUsers];
      }
    }
  }
});
</script>
