<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Preview Header + Channel Switcher -->
    <div class="px-5 py-4 border-b border-gray-200 bg-gray-50/70 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h3 class="text-sm font-semibold text-gray-900">Live Message Preview</h3>
        <p class="text-xs text-gray-500">Previewing as {{ previewRecipientName }}</p>
      </div>

      <div class="inline-flex rounded-lg bg-gray-200/75 p-0.5">
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          type="button"
          @click="activeChannel = tab.id"
          class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer"
          :class="
            activeChannel === tab.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          "
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="p-5 bg-gray-50 min-h-[340px] flex flex-col justify-between">
      <!-- 1. BROWSER & IN-APP NOTIFICATION PREVIEW -->
      <div v-if="activeChannel === 'push'" class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-gray-500">Browser & In-App Surface</span>
          <div class="inline-flex rounded-md border border-gray-200 bg-white p-0.5 text-[11px]">
            <button
              type="button"
              @click="pushSurface = 'desktop'"
              class="px-2 py-0.5 rounded cursor-pointer"
              :class="pushSurface === 'desktop' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-500'"
            >
              Desktop Web
            </button>
            <button
              type="button"
              @click="pushSurface = 'mobile'"
              class="px-2 py-0.5 rounded cursor-pointer"
              :class="pushSurface === 'mobile' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-500'"
            >
              Lock Screen
            </button>
            <button
              type="button"
              @click="pushSurface = 'inapp'"
              class="px-2 py-0.5 rounded cursor-pointer"
              :class="pushSurface === 'inapp' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-500'"
            >
              In-App Feed
            </button>
          </div>
        </div>

        <!-- Desktop Browser Notification Card -->
        <div
          v-if="pushSurface === 'desktop'"
          class="bg-white rounded-xl p-4 shadow-md border border-gray-200 mx-auto max-w-sm"
        >
          <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-5 w-5 items-center justify-center rounded bg-primary-600 text-[10px] font-bold text-white">
                G
              </span>
              <span class="font-medium text-gray-800">Graphic NewsPlus · Chrome</span>
            </div>
            <span>now</span>
          </div>

          <p class="text-sm font-semibold text-gray-900 leading-snug">
            {{ interpolate(pushTitle) || 'Notification headline preview' }}
          </p>
          <p class="mt-1 text-xs text-gray-600 leading-relaxed">
            {{ interpolate(pushBody) || 'Your browser & in-app notification summary will appear here.' }}
          </p>

          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Notification banner"
            class="mt-3 h-32 w-full rounded-lg object-cover border border-gray-100"
          />

          <div v-if="ctaLabel" class="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-primary-600">{{ ctaLabel }} &rarr;</span>
            <span class="text-[11px] text-gray-400 truncate max-w-[150px]">{{ ctaUrl || '/newspapers' }}</span>
          </div>
        </div>

        <!-- Mobile Lock Screen Card -->
        <div
          v-else-if="pushSurface === 'mobile'"
          class="bg-slate-900 rounded-2xl p-4 text-white shadow-xl border border-slate-700 mx-auto max-w-xs"
        >
          <div class="flex items-start gap-3">
            <div class="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
              <span class="text-xs font-bold">GN+</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <span class="text-xs font-semibold text-slate-200">Graphic NewsPlus</span>
                <span class="text-[11px] text-slate-400">now</span>
              </div>
              <p class="text-sm font-semibold text-white leading-snug">
                {{ interpolate(pushTitle) || 'Notification headline' }}
              </p>
              <p class="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-3">
                {{ interpolate(pushBody) || 'Notification message preview...' }}
              </p>
            </div>
          </div>
          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Mobile banner"
            class="mt-3 h-28 w-full rounded-lg object-cover"
          />
        </div>

        <!-- In-App Notification Drawer Item -->
        <div
          v-else
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mx-auto max-w-sm"
        >
          <div class="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold flex items-center justify-between">
            <span>In-App Notification Center</span>
            <span class="px-1.5 py-0.5 text-[10px] rounded bg-red-600">1 Unread</span>
          </div>
          <div class="p-4 bg-red-50/40 flex items-start gap-3">
            <span class="mt-1.5 h-2 w-2 rounded-full bg-red-600 shrink-0" />
            <div class="min-w-0 flex-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-red-600">
                {{ (category || 'update').replace(/_/g, ' ') }}
              </span>
              <p class="text-sm font-bold text-gray-900 mt-0.5">
                {{ interpolate(pushTitle) || 'In-app alert title' }}
              </p>
              <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                {{ interpolate(pushBody) || 'In-app message body...' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. EMAIL CLIENT PREVIEW -->
      <div v-else-if="activeChannel === 'email'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Window Chrome -->
        <div class="bg-gray-100 px-3.5 py-2 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span class="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span class="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span class="text-[11px] text-gray-500">Email Client Preview</span>
        </div>

        <!-- Email Envelope Metadata -->
        <div class="px-4 py-3 border-b border-gray-100 space-y-1 text-xs">
          <p class="text-gray-500">
            <span class="font-medium text-gray-700">From:</span> Graphic NewsPlus &lt;alerts@graphic.com.gh&gt;
          </p>
          <p class="text-gray-500 truncate">
            <span class="font-medium text-gray-700">To:</span> {{ previewRecipientEmail }}
          </p>
          <p class="text-gray-900 font-semibold">
            {{ interpolate(subject) || 'Email Subject Line' }}
          </p>
          <p v-if="preheader" class="text-[11px] text-gray-400 truncate">
            {{ interpolate(preheader) }}
          </p>
        </div>

        <!-- Branded Email Body -->
        <div class="p-5 space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div class="w-7 h-7 rounded bg-primary-600 text-white font-bold text-xs flex items-center justify-center">
              G
            </div>
            <span class="font-bold text-gray-900 text-sm">Graphic NewsPlus</span>
          </div>

          <img
            v-if="imageUrl"
            :src="imageUrl"
            alt="Email hero"
            class="w-full h-32 object-cover rounded-lg border border-gray-100"
          />

          <div class="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
            {{ interpolate(emailBody) || 'Write your email message body to preview how subscribers see it.' }}
          </div>

          <div v-if="ctaLabel" class="pt-1">
            <span class="inline-block px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold">
              {{ ctaLabel }}
            </span>
          </div>

          <div class="pt-3 border-t border-gray-100 text-[10px] text-gray-400">
            Graphic Communications Group Ltd · Graphic Road, Accra · Manage Preferences
          </div>
        </div>
      </div>

      <!-- 3. SMS HANDSET PREVIEW -->
      <div v-else class="space-y-3">
        <div class="mx-auto max-w-xs bg-white rounded-3xl border-4 border-gray-800 shadow-lg overflow-hidden">
          <div class="bg-gray-900 text-white px-4 py-2.5 text-center">
            <p class="text-[10px] text-gray-400">SMS Sender ID</p>
            <p class="text-xs font-semibold tracking-wide">GraphicNews</p>
          </div>

          <div class="p-4 bg-gray-50 min-h-[190px] flex flex-col justify-end">
            <p class="text-[10px] text-center text-gray-400 mb-3">Text Message · Today</p>
            <div class="bg-gray-200/90 text-gray-900 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs leading-relaxed shadow-xs">
              {{ interpolate(smsBody) || 'Graphic NewsPlus SMS message preview appears here...' }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-gray-500 px-2">
          <span>Length: <strong class="text-gray-800">{{ interpolate(smsBody).length }}</strong> chars</span>
          <span>
            Est. <strong class="text-gray-800">{{ Math.max(1, Math.ceil((interpolate(smsBody).length || 1) / 160)) }}</strong>
            SMS segment(s)
          </span>
        </div>
      </div>

      <p class="mt-4 pt-3 border-t border-gray-200/80 text-[11px] text-gray-400 flex items-center justify-between">
        <span>Active channels: {{ channelSummary }}</span>
        <span>Merge tag: <code>{{ '{' + '{first_name}' + '}' }}</code></span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { MessagingChannel, TargetUserSummary } from '~/services/campaigns';

const props = withDefaults(
  defineProps<{
    channels: MessagingChannel[];
    category?: string;
    subject?: string;
    preheader?: string;
    pushTitle?: string;
    pushBody?: string;
    emailBody?: string;
    smsBody?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    imageUrl?: string;
    sampleUser?: TargetUserSummary | null;
  }>(),
  {
    channels: () => ['push'],
    category: 'morning_edition',
    subject: '',
    preheader: '',
    pushTitle: '',
    pushBody: '',
    emailBody: '',
    smsBody: '',
    ctaLabel: 'Read Now',
    ctaUrl: '/newspapers',
    imageUrl: '',
    sampleUser: null,
  }
);

const ALL_TABS: { id: MessagingChannel; label: string }[] = [
  { id: 'push', label: 'Browser & In-App' },
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
];

const activeChannel = ref<MessagingChannel>(props.channels[0] || 'push');
const pushSurface = ref<'desktop' | 'mobile' | 'inapp'>('desktop');

const availableTabs = computed(() => {
  const selected = ALL_TABS.filter((t) => props.channels.includes(t.id));
  return selected.length ? selected : ALL_TABS;
});

watch(
  () => props.channels,
  (next) => {
    if (next?.length && !next.includes(activeChannel.value)) {
      activeChannel.value = next[0];
    }
  },
  { deep: true }
);

const previewRecipientName = computed(() => props.sampleUser?.name || 'Kwame Mensah');
const previewRecipientEmail = computed(() => props.sampleUser?.email || 'kwame.mensah@gmail.com');

const firstName = computed(() => previewRecipientName.value.split(' ')[0] || 'Reader');

function interpolate(raw?: string): string {
  if (!raw) return '';
  return raw.replace(/\{\{\s*first_name\s*\}\}/gi, firstName.value);
}

const channelSummary = computed(() => {
  const labels: Record<MessagingChannel, string> = {
    push: 'Browser/In-App',
    email: 'Email',
    sms: 'SMS',
  };
  return (props.channels.length ? props.channels : (['push'] as MessagingChannel[]))
    .map((c) => labels[c])
    .join(' + ');
});
</script>
