<template>
  <div class="space-y-6 pb-14">
    <!-- Feedback Banner Toast -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="feedbackMessage"
        class="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700"
      >
        <Icon name="lucide:check-circle-2" class="h-4 w-4 text-emerald-400 shrink-0" />
        <span>{{ feedbackMessage }}</span>
      </div>
    </Transition>

    <!-- Header & Instant Browser Diagnostics Toolbar -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
              Web Push & Real-Time Broadcast Engine
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1.5"
              :class="
                sseConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              "
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="sseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"
              />
              {{
                sseConnected
                  ? `Live Stream Active (${dashboard?.summary.liveConnectedClients || 1} connected)`
                  : 'Connecting Stream...'
              }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              W3C Push API + VAPID P-256 + `sw-push.js`
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">
            Browser Push Notification Dispatch Studio
          </h1>
          <p class="mt-1 text-sm text-gray-500 max-w-3xl">
            Compose, preview, schedule, and dispatch encrypted Web Push notifications & real-time platform updates across desktop and mobile browsers.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            :disabled="isSubscribing"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
            :class="
              isSubscribed
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            "
            @click="handleToggleCurrentBrowser"
          >
            <Icon :name="isSubscribed ? 'lucide:bell-ring' : 'lucide:bell-plus'" class="h-4 w-4 text-red-600" />
            <span>{{ isSubscribed ? 'My Browser: Subscribed' : 'Subscribe My Browser' }}</span>
          </button>

          <button
            type="button"
            :disabled="sendingTest"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            @click="handleSendTestPush"
          >
            <Icon name="lucide:zap" class="h-4 w-4 text-amber-400" />
            <span>{{ sendingTest ? 'Sending Test...' : 'Send Live Test Push' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 4 Executive KPI Sparkline Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <ReportKpiSparkCard v-for="m in kpiCards" :key="m.key" :metric="m" />
    </div>

    <!-- MAIN WORKBENCH: Composer (7 cols) + Multi-OS Live Preview & Diagnostics (5 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT: Rich Push Notification & Update Composer -->
      <div class="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <h2 class="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Icon name="lucide:send" class="h-4 w-4 text-red-600" />
              <span>Compose Notification or Platform Update</span>
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Click a quick newsroom preset below or craft a custom notification payload.
            </p>
          </div>
        </div>

        <!-- Quick Presets -->
        <div class="space-y-1.5">
          <span class="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
            1-Click Newsroom & Update Templates
          </span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="preset in COMPOSER_PRESETS"
              :key="preset.id"
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer"
              :class="
                activePresetId === preset.id
                  ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              "
              @click="applyTemplatePreset(preset)"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="handleDispatchBroadcast">
          <!-- Category + Urgency + Target Audience -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Alert Category
              </label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-red-500"
              >
                <option v-for="t in PUSH_TOPIC_DEFINITIONS" :key="t.id" :value="t.id">
                  {{ t.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Delivery Priority
              </label>
              <select
                v-model="form.urgency"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-red-500"
              >
                <option value="high">High — Urgent / Persistent</option>
                <option value="normal">Normal — Standard Alert</option>
                <option value="low">Low — Silent Inbox Update</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Target Segment
              </label>
              <select
                v-model="form.targetSegment"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-red-500"
              >
                <option value="all_subscribers">All Browsers (14,820)</option>
                <option value="paid_active">Active Paid Subscribers (11,240)</option>
                <option value="free_readers">Free Registered Readers (3,580)</option>
                <option value="corporate_b2b">Corporate B2B Seats (4,315)</option>
                <option value="ghana_local">Ghana Readers (11,190)</option>
                <option value="diaspora">Diaspora Readers (3,630)</option>
              </select>
            </div>
          </div>

          <!-- Notification Headline -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Notification Headline *
              </label>
              <span
                class="text-[11px] font-mono"
                :class="form.title.length > 75 ? 'text-amber-600 font-bold' : 'text-gray-400'"
              >
                {{ form.title.length }} / 90 chars
              </span>
            </div>
            <input
              v-model="form.title"
              type="text"
              required
              maxlength="120"
              placeholder="e.g. BREAKING: Parliament Passes 2027 Digital Economy Bill"
              class="w-full px-3.5 py-2.5 text-sm font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <!-- Notification Body -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Notification Message Body *
              </label>
              <span class="text-[11px] font-mono text-gray-400">
                {{ form.body.length }} / 180 chars
              </span>
            </div>
            <textarea
              v-model="form.body"
              rows="3"
              required
              maxlength="240"
              placeholder="Concise summary shown in the browser banner and lockscreen notification..."
              class="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <!-- Deep Link + Rich Hero Image -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Click Deep-Link Route / URL
              </label>
              <div class="flex gap-1.5">
                <input
                  v-model="form.deepLink"
                  type="text"
                  placeholder="/newspapers"
                  class="flex-1 px-3 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
                <select
                  class="px-2.5 py-2 text-xs border border-gray-300 rounded-xl bg-gray-50"
                  @change="form.deepLink = ($event.target as HTMLSelectElement).value"
                >
                  <option value="/newspapers">Newspapers</option>
                  <option value="/archives">Archives</option>
                  <option value="/originals">Originals</option>
                  <option value="/games">Games</option>
                  <option value="/pricing">Pricing</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Optional Hero Image Banner
              </label>
              <div class="flex gap-1.5">
                <input
                  v-model="form.imageUrl"
                  type="text"
                  placeholder="Optional /welcome-1.png or HTTPS URL"
                  class="flex-1 px-3 py-2 text-xs font-mono border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  class="px-2.5 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer shrink-0"
                  @click="form.imageUrl = form.imageUrl ? '' : '/welcome-1.png'"
                >
                  {{ form.imageUrl ? 'Clear' : 'Sample Img' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Interactive Action Buttons -->
          <div class="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Interactive Notification Action Buttons (Max 2 — Service Worker)
              </span>
              <label class="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                <input
                  v-model="form.requireInteraction"
                  type="checkbox"
                  class="rounded text-red-600 focus:ring-red-500"
                />
                <span>Keep on screen until clicked</span>
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div class="flex gap-1.5">
                <input
                  v-model="action1Title"
                  type="text"
                  placeholder="Button 1 e.g. Read Story"
                  class="w-1/2 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                />
                <input
                  v-model="action1Url"
                  type="text"
                  placeholder="/newspapers"
                  class="w-1/2 px-2.5 py-1.5 text-xs font-mono border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div class="flex gap-1.5">
                <input
                  v-model="action2Title"
                  type="text"
                  placeholder="Button 2 (Optional)"
                  class="w-1/2 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                />
                <input
                  v-model="action2Url"
                  type="text"
                  placeholder="/archives"
                  class="w-1/2 px-2.5 py-1.5 text-xs font-mono border border-gray-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          <!-- Delivery Timing: Instant vs Scheduled -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <div class="flex flex-wrap items-center gap-3">
              <label class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  v-model="form.scheduleMode"
                  type="radio"
                  value="now"
                  class="text-red-600 focus:ring-red-500"
                />
                <span>Dispatch Immediately</span>
              </label>

              <label class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-800 cursor-pointer">
                <input
                  v-model="form.scheduleMode"
                  type="radio"
                  value="scheduled"
                  class="text-red-600 focus:ring-red-500"
                />
                <span>Schedule Delivery</span>
              </label>

              <input
                v-if="form.scheduleMode === 'scheduled'"
                v-model="form.scheduledAt"
                type="datetime-local"
                class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
              />
            </div>

            <div class="flex items-center gap-2 ml-auto">
              <button
                type="button"
                :disabled="sendingTest"
                class="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
                @click="handlePreviewTestFromForm"
              >
                Test Payload on My Browser
              </button>

              <button
                type="submit"
                :disabled="dispatching"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <Icon
                  :name="form.scheduleMode === 'scheduled' ? 'lucide:calendar-clock' : 'lucide:send'"
                  class="h-4 w-4"
                />
                <span>
                  {{
                    dispatching
                      ? 'Dispatching...'
                      : form.scheduleMode === 'scheduled'
                      ? 'Schedule Broadcast'
                      : 'Dispatch Broadcast Now'
                  }}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- RIGHT: Live Multi-Platform Browser Preview & VAPID Diagnostics -->
      <div class="lg:col-span-5 space-y-5">
        <!-- Multi-OS Preview Card -->
        <div class="bg-slate-950 text-white rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h3 class="text-sm font-bold text-white">Live Browser Notification Preview</h3>
              <p class="text-[11px] text-slate-400">Real-time rendering across desktop & mobile OS shells</p>
            </div>

            <div class="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] font-bold">
              <button
                v-for="os in (['macos', 'windows', 'android'] as const)"
                :key="os"
                type="button"
                class="px-2.5 py-1 rounded-md uppercase transition-colors cursor-pointer"
                :class="previewOs === os ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'"
                @click="previewOs = os"
              >
                {{ os === 'macos' ? 'macOS' : os === 'windows' ? 'Win 11' : 'Android' }}
              </button>
            </div>
          </div>

          <!-- Simulated Desktop / Mobile Wallpaper Stage -->
          <div class="rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 border border-slate-700/70">
            <!-- macOS Banner Style -->
            <div
              v-if="previewOs === 'macos'"
              class="bg-white/95 backdrop-blur-md text-gray-900 rounded-2xl p-3.5 shadow-xl border border-gray-200 space-y-2.5"
            >
              <div class="flex items-start gap-3">
                <img src="/pwa-icons/pwa-192x192.png" alt="GN+" class="w-10 h-10 rounded-xl shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between text-[11px] text-gray-500">
                    <span class="font-bold text-gray-800">Graphic NewsPlus • Chrome</span>
                    <span>Now</span>
                  </div>
                  <p class="text-xs font-extrabold text-gray-900 mt-0.5 leading-snug">
                    {{ form.title || 'Notification headline preview' }}
                  </p>
                  <p class="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-snug">
                    {{ form.body || 'Notification message preview appears here...' }}
                  </p>
                </div>
              </div>
              <img
                v-if="form.imageUrl"
                :src="form.imageUrl"
                alt=""
                class="w-full h-28 object-cover rounded-xl border border-gray-200"
              />
            </div>

            <!-- Windows 11 Action Center Style -->
            <div
              v-else-if="previewOs === 'windows'"
              class="bg-slate-900 text-slate-100 rounded-xl p-4 shadow-xl border border-slate-700 space-y-3"
            >
              <div class="flex items-center justify-between text-[11px] text-slate-400">
                <div class="flex items-center gap-2">
                  <img src="/pwa-icons/pwa-64x64.png" alt="" class="w-4 h-4 rounded" />
                  <span>Microsoft Edge • graphicnewsplus.com</span>
                </div>
                <span>Just now</span>
              </div>
              <img
                v-if="form.imageUrl"
                :src="form.imageUrl"
                alt=""
                class="w-full h-28 object-cover rounded-lg"
              />
              <div>
                <p class="text-sm font-bold text-white leading-snug">{{ form.title }}</p>
                <p class="text-xs text-slate-300 mt-1 leading-relaxed">{{ form.body }}</p>
              </div>
              <div class="grid grid-cols-2 gap-2 pt-1">
                <span class="py-1.5 px-3 rounded bg-slate-800 text-center text-xs font-semibold text-white border border-slate-700">
                  {{ action1Title || 'Read Story' }}
                </span>
                <span
                  v-if="action2Title"
                  class="py-1.5 px-3 rounded bg-slate-800 text-center text-xs font-semibold text-white border border-slate-700"
                >
                  {{ action2Title }}
                </span>
              </div>
            </div>

            <!-- Android Lockscreen Card -->
            <div
              v-else
              class="bg-white text-gray-900 rounded-3xl p-4 shadow-xl space-y-2.5"
            >
              <div class="flex items-center justify-between text-[11px] text-gray-500">
                <span class="font-bold text-red-600 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-red-600" />
                  Graphic NewsPlus • {{ form.urgency.toUpperCase() }}
                </span>
                <span>now</span>
              </div>
              <p class="text-xs font-extrabold text-gray-900">{{ form.title }}</p>
              <p class="text-xs text-gray-600 leading-snug">{{ form.body }}</p>
              <img
                v-if="form.imageUrl"
                :src="form.imageUrl"
                alt=""
                class="w-full h-28 object-cover rounded-2xl"
              />
              <div class="flex items-center gap-4 pt-1 text-xs font-extrabold text-red-600">
                <span>{{ action1Title || 'OPEN' }}</span>
                <span v-if="action2Title">{{ action2Title }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- VAPID & Service Worker Diagnostics Card -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Icon name="lucide:shield-check" class="h-4 w-4 text-emerald-600" />
              <span>W3C Web Push & VAPID Configuration</span>
            </h3>
            <button
              type="button"
              class="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
              @click="copyVapidKey"
            >
              {{ copiedVapid ? 'Copied Key!' : 'Copy VAPID Public Key' }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2.5 text-xs">
            <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <span class="text-[10px] font-bold uppercase text-gray-400 block">Service Worker</span>
              <span class="font-bold text-gray-900">
                {{ swReady ? '/sw-push.js Active' : 'Initializing...' }}
              </span>
            </div>
            <div class="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <span class="text-[10px] font-bold uppercase text-gray-400 block">OS Permission</span>
              <span class="font-bold uppercase text-gray-900">{{ permissionState }}</span>
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] break-all">
            {{ dashboard?.vapidPublicKey || 'Loading ECDSA P-256 VAPID Public Key...' }}
          </div>
        </div>
      </div>
    </div>

    <!-- APACHE ECHARTS TELEMETRY GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div class="lg:col-span-7">
        <EChartCanvas
          title="14-Day Browser Push Delivery & Click-Through Velocity"
          subtitle="Encrypted Web Push + SSE deliveries vs verified reader deep-link clicks"
          chart-type-badge="Dual-Axis Bar + Area"
          :option="deliveryVelocityOption"
          :height="310"
          export-filename="push-delivery-velocity"
        />
      </div>

      <div class="lg:col-span-5">
        <EChartCanvas
          title="Subscribed Endpoints by Browser & OS"
          subtitle="Active W3C PushSubscription user-agent distribution"
          chart-type-badge="Donut"
          :option="browserMixOption"
          :height="310"
          export-filename="push-browser-mix"
        />
      </div>

      <div class="lg:col-span-12">
        <EChartCanvas
          title="Click-Through Rate (CTR %) Across Notification Categories"
          subtitle="Morning Edition drops (05:30 GMT) and Breaking News alerts drive highest reader engagement"
          chart-type-badge="Horizontal Bar"
          :option="categoryCtrOption"
          :height="270"
          export-filename="push-category-ctr"
        />
      </div>
    </div>

    <!-- BOTTOM TABS: Broadcast History / Scheduled Queue / Registered Devices / C++ & SQL Blueprint -->
    <div class="space-y-4">
      <div class="border-b border-gray-200 flex flex-wrap gap-6">
        <button
          v-for="tab in bottomTabs"
          :key="tab.id"
          type="button"
          class="pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer"
          :class="
            activeBottomTab === tab.id
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          "
          @click="activeBottomTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- TAB 1: Broadcast Ledger & Scheduled Queue -->
      <div v-if="activeBottomTab === 'broadcasts'" class="space-y-4">
        <!-- Scheduled Queue Quick Action Strip -->
        <div
          v-if="scheduledBroadcasts.length"
          class="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2.5"
        >
          <p class="text-xs font-extrabold uppercase tracking-wider text-amber-900">
            Scheduled Broadcast Queue ({{ scheduledBroadcasts.length }})
          </p>
          <div
            v-for="sched in scheduledBroadcasts"
            :key="sched.id"
            class="bg-white rounded-xl p-3.5 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <p class="text-sm font-bold text-gray-900">{{ sched.title }}</p>
              <p class="text-xs text-gray-500">
                Scheduled: <strong>{{ sched.scheduledAt }}</strong> • Segment:
                <code class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{{ sched.targetSegment }}</code>
                ({{ sched.targetedDevices.toLocaleString() }} devices)
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                @click="handleTriggerScheduledNow(sched.id)"
              >
                Dispatch Now
              </button>
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                @click="handleCancelScheduled(sched.id)"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <ReportDataTable
          title="Dispatched & Scheduled Browser Push Broadcasts"
          :columns="broadcastColumns"
          :rows="dashboard?.recentBroadcasts || []"
          filename="gnp-push-broadcast-history"
        />
      </div>

      <!-- TAB 2: Subscribed Browsers Registry -->
      <div v-else-if="activeBottomTab === 'devices'">
        <ReportDataTable
          title="Registered Browser Push Endpoints (`web_push_subscriptions`)"
          :columns="deviceColumns"
          :rows="deviceRows"
          filename="gnp-push-subscribed-devices"
        />
      </div>

      <!-- TAB 3: C++ Drogon & PostgreSQL Backend Blueprint -->
      <div v-else class="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-white">
              `rhyolite-prime/gnp-api` — Web Push Module Implementation Guide
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Extends existing `controllers/NotificationsHub.{h,cc}` with persistent W3C VAPID Web Push + PostgreSQL storage
            </p>
          </div>
          <button
            type="button"
            class="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
            @click="copySqlBlueprint"
          >
            {{ copiedSql ? 'Copied PostgreSQL DDL!' : 'Copy PostgreSQL DDL' }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              PostgreSQL Tables (`web_push_subscriptions` & `push_broadcasts`)
            </p>
            <pre class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">{{ dashboard?.backendBlueprint.sqlDdl }}</pre>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
              Drogon Controller Header (`controllers/PushNotificationsController.h`)
            </p>
            <pre class="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">{{ dashboard?.backendBlueprint.cppControllerHeader }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import type {
  DispatchPushRequestDto,
  PushDashboardPayload,
  ReportKpiMetric,
  ReportTableColumn,
} from '~/models';
import {
  PUSH_TOPIC_DEFINITIONS,
  cancelScheduledBroadcastApi,
  dispatchPushBroadcastApi,
  fetchPushDashboard,
  triggerScheduledBroadcastApi,
} from '~/services/pushNotifications';
import { usePushNotifications } from '~/composables/usePushNotifications';
import {
  BASE_TOOLTIP,
  BOTTOM_LEGEND,
  DUAL_AXIS_GRID,
  GNP_PALETTE,
  areaGradient,
  barGradient,
  categoryXAxis,
  valueYAxis,
} from '~/utils/echartsHelpers';
import EChartCanvas from '~/components/reports/EChartCanvas.vue';
import ReportKpiSparkCard from '~/components/reports/ReportKpiSparkCard.vue';
import ReportDataTable from '~/components/reports/ReportDataTable.vue';

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
});

const {
  permissionState,
  isSubscribed,
  isSubscribing,
  swReady,
  sseConnected,
  enableBrowserPush,
  disableBrowserPush,
  triggerLiveTestNotification,
} = usePushNotifications();

const dashboard = ref<PushDashboardPayload | null>(null);
const previewOs = ref<'macos' | 'windows' | 'android'>('macos');
const activeBottomTab = ref<'broadcasts' | 'devices' | 'blueprint'>('broadcasts');
const activePresetId = ref('breaking');
const dispatching = ref(false);
const sendingTest = ref(false);
const feedbackMessage = ref('');
const copiedVapid = ref(false);
const copiedSql = ref(false);

const COMPOSER_PRESETS = [
  {
    id: 'breaking',
    label: 'Breaking News',
    title: 'BREAKING: Bank of Ghana Announces New FX Market Guidelines for Importers',
    body: 'Tap to read Graphic Business’ instant breakdown of commercial bank settlement rules taking effect Monday.',
    category: 'breaking_news' as const,
    urgency: 'high' as const,
    deepLink: '/newspapers',
    imageUrl: '/welcome-1.png',
    a1Title: 'Read Full Story',
    a1Url: '/newspapers',
    a2Title: 'Archive Context',
    a2Url: '/archives',
  },
  {
    id: 'edition',
    label: '05:30 AM Edition Ready',
    title: 'Daily Graphic Digital Edition (22 Oct 2026) Is Now Live',
    body: 'Read all 48 crisp pages including Parliament highlights, business brief, editorials & sports.',
    category: 'morning_edition' as const,
    urgency: 'normal' as const,
    deepLink: '/newspapers',
    imageUrl: '',
    a1Title: 'Open Today’s Paper',
    a1Url: '/newspapers',
    a2Title: 'Play Crossword',
    a2Url: '/games',
  },
  {
    id: 'update',
    label: 'Platform Update',
    title: 'New Feature: Instant AI Archive Summaries & Offline Reading',
    body: 'Search 75+ years of Ghanaian history faster with citation export and instant page bookmarking.',
    category: 'platform_updates' as const,
    urgency: 'normal' as const,
    deepLink: '/archives',
    imageUrl: '',
    a1Title: 'Try Archives Now',
    a1Url: '/archives',
    a2Title: '',
    a2Url: '',
  },
  {
    id: 'renewal',
    label: 'Renewal Nudge',
    title: 'Keep Your All-Access Reading Streak Going — Renew in 1 Tap via MoMo',
    body: 'Upgrade to Annual Pro today and save 15% across Daily Graphic, Business, Mirror & Archives.',
    category: 'subscriptions_billing' as const,
    urgency: 'normal' as const,
    deepLink: '/pricing',
    imageUrl: '',
    a1Title: 'View Plans',
    a1Url: '/pricing',
    a2Title: 'My Account',
    a2Url: '/account',
  },
  {
    id: 'games',
    label: 'Daily Games Drop',
    title: 'Today’s Accra Newsroom Crossword & Sudoku Challenge Are Live!',
    body: 'Protect your daily solver streak before midnight GMT and climb the subscriber leaderboard.',
    category: 'games_daily' as const,
    urgency: 'low' as const,
    deepLink: '/games',
    imageUrl: '',
    a1Title: 'Play Now',
    a1Url: '/games',
    a2Title: '',
    a2Url: '',
  },
];

const form = ref<DispatchPushRequestDto>({
  title: COMPOSER_PRESETS[0].title,
  body: COMPOSER_PRESETS[0].body,
  category: COMPOSER_PRESETS[0].category,
  urgency: COMPOSER_PRESETS[0].urgency,
  deepLink: COMPOSER_PRESETS[0].deepLink,
  imageUrl: COMPOSER_PRESETS[0].imageUrl,
  requireInteraction: true,
  targetSegment: 'all_subscribers',
  scheduleMode: 'now',
  scheduledAt: dayjs().add(3, 'hour').format('YYYY-MM-DDTHH:mm'),
});

const action1Title = ref(COMPOSER_PRESETS[0].a1Title);
const action1Url = ref(COMPOSER_PRESETS[0].a1Url);
const action2Title = ref(COMPOSER_PRESETS[0].a2Title);
const action2Url = ref(COMPOSER_PRESETS[0].a2Url);

function applyTemplatePreset(p: (typeof COMPOSER_PRESETS)[number]) {
  activePresetId.value = p.id;
  form.value.title = p.title;
  form.value.body = p.body;
  form.value.category = p.category;
  form.value.urgency = p.urgency;
  form.value.deepLink = p.deepLink;
  form.value.imageUrl = p.imageUrl;
  form.value.requireInteraction = p.urgency === 'high';
  action1Title.value = p.a1Title;
  action1Url.value = p.a1Url;
  action2Title.value = p.a2Title;
  action2Url.value = p.a2Url;
}

function buildActionsPayload() {
  const list = [];
  if (action1Title.value.trim()) {
    list.push({ action: 'primary', title: action1Title.value.trim(), url: action1Url.value || form.value.deepLink });
  }
  if (action2Title.value.trim()) {
    list.push({ action: 'secondary', title: action2Title.value.trim(), url: action2Url.value || form.value.deepLink });
  }
  return list;
}

function showBanner(msg: string) {
  feedbackMessage.value = msg;
  setTimeout(() => {
    feedbackMessage.value = '';
  }, 4000);
}

async function refreshDashboard() {
  dashboard.value = await fetchPushDashboard();
}

async function handleToggleCurrentBrowser() {
  if (isSubscribed.value) {
    await disableBrowserPush();
    showBanner('Paused browser push alerts on this device.');
  } else {
    const res = await enableBrowserPush();
    showBanner(res.message);
  }
  await refreshDashboard();
}

async function handleSendTestPush() {
  sendingTest.value = true;
  try {
    await triggerLiveTestNotification();
    showBanner('Live test notification dispatched! Check your browser popup & toast.');
    await refreshDashboard();
  } finally {
    sendingTest.value = false;
  }
}

async function handlePreviewTestFromForm() {
  sendingTest.value = true;
  try {
    await triggerLiveTestNotification({
      ...form.value,
      actions: buildActionsPayload(),
    });
    showBanner('Composer payload delivered live to your browser!');
    await refreshDashboard();
  } finally {
    sendingTest.value = false;
  }
}

async function handleDispatchBroadcast() {
  dispatching.value = true;
  try {
    const res = await dispatchPushBroadcastApi({
      ...form.value,
      actions: buildActionsPayload(),
    });
    showBanner(
      res.status === 'SCHEDULED'
        ? `Scheduled "${res.title.slice(0, 38)}..." for delivery.`
        : `Broadcast delivered across ${res.deliveredCount.toLocaleString()} subscribed browsers!`
    );
    await refreshDashboard();
  } finally {
    dispatching.value = false;
  }
}

async function handleTriggerScheduledNow(id: string) {
  await triggerScheduledBroadcastApi(id);
  showBanner('Scheduled broadcast dispatched immediately!');
  await refreshDashboard();
}

async function handleCancelScheduled(id: string) {
  await cancelScheduledBroadcastApi(id);
  showBanner('Scheduled broadcast cancelled.');
  await refreshDashboard();
}

async function copyVapidKey() {
  if (!import.meta.client || !dashboard.value?.vapidPublicKey) return;
  await navigator.clipboard.writeText(dashboard.value.vapidPublicKey);
  copiedVapid.value = true;
  setTimeout(() => (copiedVapid.value = false), 2000);
}

async function copySqlBlueprint() {
  if (!import.meta.client || !dashboard.value?.backendBlueprint.sqlDdl) return;
  await navigator.clipboard.writeText(dashboard.value.backendBlueprint.sqlDdl);
  copiedSql.value = true;
  setTimeout(() => (copiedSql.value = false), 2000);
}

onMounted(() => {
  refreshDashboard();
});

const scheduledBroadcasts = computed(() =>
  (dashboard.value?.recentBroadcasts || []).filter((b) => b.status === 'SCHEDULED')
);

const kpiCards = computed<ReportKpiMetric[]>(() => {
  const s = dashboard.value?.summary;
  const c = dashboard.value?.charts;
  return [
    {
      key: 'subs',
      label: 'Subscribed Browsers',
      value: (s?.activeBrowserSubscriptions ?? 14820).toLocaleString(),
      rawValue: s?.activeBrowserSubscriptions ?? 14820,
      changePercent: 19.4,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: `${s?.optInRatePct ?? 42.6}% reader opt-in rate`,
      sparkline: c?.dailyNewOptIns || [94, 112, 138, 156, 149, 178, 164],
    },
    {
      key: 'deliv',
      label: 'Push Delivery Rate',
      value: `${s?.avgDeliveryRatePct ?? 98.1}%`,
      rawValue: s?.avgDeliveryRatePct ?? 98.1,
      changePercent: 1.3,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: 'Auto-prunes HTTP 410 expired tokens',
      sparkline: c?.dailyDelivered || [24100, 26800, 28900, 31200, 32100, 34900, 31800],
    },
    {
      key: 'ctr',
      label: 'Avg Click-Through Rate',
      value: `${s?.avgCtrPct ?? 17.5}%`,
      rawValue: s?.avgCtrPct ?? 17.5,
      changePercent: 4.8,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: '22.4% on 05:30 GMT edition drops',
      sparkline: c?.dailyClicked || [4120, 4890, 5420, 6180, 6240, 6910, 6080],
    },
    {
      key: 'queue',
      label: 'Broadcasts Sent (30D)',
      value: String(s?.totalBroadcastsSent ?? 41),
      rawValue: s?.totalBroadcastsSent ?? 41,
      changePercent: 12.0,
      changeDirection: 'up',
      positiveIsGood: true,
      subtitle: `${s?.scheduledQueueCount ?? 1} scheduled in queue`,
    },
  ];
});

const deliveryVelocityOption = computed(() => {
  const c = dashboard.value?.charts;
  return {
    color: ['#2563eb', '#dc2626'],
    tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
    legend: BOTTOM_LEGEND,
    grid: DUAL_AXIS_GRID,
    xAxis: categoryXAxis(c?.days || []),
    yAxis: [valueYAxis('Delivered'), valueYAxis('Clicks')],
    series: [
      {
        name: 'Notifications Delivered',
        type: 'bar',
        barMaxWidth: 20,
        itemStyle: { color: barGradient('#3b82f6', '#1d4ed8'), borderRadius: [5, 5, 0, 0] },
        data: c?.dailyDelivered || [],
      },
      {
        name: 'Deep-Link Clicks',
        type: 'line',
        yAxisIndex: 1,
        smooth: 0.35,
        lineStyle: { width: 3, color: '#dc2626' },
        areaStyle: { color: areaGradient('#dc2626', 0.2) },
        data: c?.dailyClicked || [],
      },
    ],
  };
});

const browserMixOption = computed(() => ({
  color: GNP_PALETTE,
  tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}<br/><b>{c} devices</b> ({d}%)' },
  legend: BOTTOM_LEGEND,
  series: [
    {
      name: 'Subscribed Endpoints',
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '44%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: dashboard.value?.charts.platformBreakdown || [],
    },
  ],
}));

const categoryCtrOption = computed(() => {
  const list = [...(dashboard.value?.charts.categoryPerformance || [])].reverse();
  return {
    tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 18, right: 32, bottom: 24, left: 16, containLabel: true },
    xAxis: valueYAxis('CTR %', '', '%'),
    yAxis: categoryXAxis(list.map((i) => i.label)),
    series: [
      {
        name: 'Click-Through Rate (%)',
        type: 'bar',
        barMaxWidth: 20,
        itemStyle: { color: barGradient('#dc2626', '#f97316'), borderRadius: [0, 6, 6, 0] },
        data: list.map((i) => i.ctrPct),
      },
    ],
  };
});

const bottomTabs = computed(() => [
  {
    id: 'broadcasts' as const,
    label: `Broadcast History & Queue (${dashboard.value?.recentBroadcasts.length || 0})`,
  },
  {
    id: 'devices' as const,
    label: `Subscribed Browser Endpoints (${dashboard.value?.subscriptions.length || 0})`,
  },
  {
    id: 'blueprint' as const,
    label: '`gnp-api` C++ & PostgreSQL Blueprint',
  },
]);

const broadcastColumns: ReportTableColumn[] = [
  { key: 'id', label: 'Broadcast ID', format: 'code' },
  { key: 'title', label: 'Headline', format: 'text' },
  { key: 'category', label: 'Topic', format: 'badge', align: 'center' },
  { key: 'targetSegment', label: 'Audience', format: 'code' },
  { key: 'deliveredCount', label: 'Delivered', format: 'number', align: 'right' },
  { key: 'clickedCount', label: 'Clicks', format: 'number', align: 'right' },
  { key: 'ctrPercent', label: 'CTR %', format: 'percent', align: 'right' },
  { key: 'status', label: 'Status', format: 'badge', align: 'center' },
];

const deviceColumns: ReportTableColumn[] = [
  { key: 'userLabel', label: 'Reader / Session', format: 'text' },
  { key: 'browserOs', label: 'Browser & OS', format: 'text' },
  { key: 'segment', label: 'Segment', format: 'code' },
  { key: 'topicsCount', label: 'Topics Enabled', format: 'number', align: 'right' },
  { key: 'mode', label: 'Transport Mode', format: 'badge', align: 'center' },
  { key: 'lastSeenFormatted', label: 'Last Active', format: 'text' },
];

const deviceRows = computed(() =>
  (dashboard.value?.subscriptions || []).map((s) => ({
    userLabel: s.userLabel || s.id,
    browserOs: `${s.browserName} • ${s.osName}`,
    segment: s.segment,
    topicsCount: s.topics.length,
    mode: s.isSimulated ? 'LIVE STREAM' : 'ENCRYPTED VAPID',
    lastSeenFormatted: dayjs(s.lastSeenAt).format('DD MMM HH:mm'),
  }))
);

useHead({
  title: 'Browser Push Dispatch Studio | Graphic NewsPlus Admin',
});
</script>
