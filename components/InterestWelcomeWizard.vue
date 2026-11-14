<template>
  <section class="border-y border-primary-100 bg-primary-50/60" aria-label="Personalise your news">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <p class="font-bold text-stone-900">Follow what matters to you.</p>
        <p class="mt-1 text-sm text-stone-600">A few interests. A more personal way to explore Graphic NewsPlus.</p>
      </div>
      <button type="button" class="wizard-primary" @click="start">Personalise my news <span aria-hidden="true">→</span></button>
    </div>
  </section>

  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-[70]" @close="dismiss">
      <TransitionChild as="template" enter="duration-200 ease-out motion-reduce:transition-none" enter-from="opacity-0" enter-to="opacity-100" leave="duration-150 ease-in motion-reduce:transition-none" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-stone-950/65 backdrop-blur-sm" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-3 sm:p-6">
          <TransitionChild as="template" enter="duration-200 ease-out motion-reduce:transition-none" enter-from="opacity-0 translate-y-3" enter-to="opacity-100 translate-y-0" leave="duration-150 ease-in motion-reduce:transition-none" leave-from="opacity-100" leave-to="opacity-0 translate-y-3">
            <DialogPanel class="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <button type="button" aria-label="Close welcome guide" class="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl text-stone-600 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600" :disabled="submitting" @click="dismiss">×</button>
              <div class="border-b border-stone-100 px-6 pb-5 pt-8 sm:px-10">
                <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">Welcome to Graphic NewsPlus</p>
                <ol v-if="step < 3" aria-label="Your setup progress" class="mt-5 flex gap-3 text-xs sm:text-sm">
                  <li v-for="(label, index) in steps" :key="label" class="flex flex-1 items-center gap-2" :aria-current="step === index ? 'step' : undefined" :class="step === index ? 'font-bold text-primary-700' : 'text-stone-500'">
                    <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full" :class="step >= index ? 'bg-primary-600 text-white' : 'bg-stone-100'">{{ index + 1 }}</span>{{ label }}
                  </li>
                </ol>
              </div>
              <div class="px-6 py-7 sm:px-10 sm:py-8">
                <DialogTitle ref="heading" as="h2" tabindex="-1" class="text-3xl font-bold leading-tight tracking-tight text-stone-900 outline-none" aria-live="polite">{{ titles[step] }}</DialogTitle>
                <DialogDescription class="mt-3 text-sm leading-7 text-stone-600">{{ descriptions[step] }}</DialogDescription>

                <div v-if="step === 0">
                  <div class="mt-6 grid grid-cols-3 gap-2" aria-hidden="true">
                    <div v-for="label in ['Opportunities', 'News & ideas', 'Business & sport']" :key="label" class="rounded-xl bg-stone-50 px-2 py-5 text-center text-xs font-semibold text-stone-700">{{ label }}</div>
                  </div>
                  <button type="button" class="wizard-primary mt-7 w-full" @click="advance(1)">Let’s find your interests →</button>
                  <button type="button" class="wizard-secondary mt-2 w-full" @click="dismiss">Maybe later</button>
                </div>

                <form v-else-if="step === 1" class="mt-6" @submit.prevent="continueToRegistration">
                  <fieldset>
                    <legend class="sr-only">Select at least one content interest</legend>
                    <div class="grid max-h-[38vh] grid-cols-2 gap-2 overflow-y-auto p-1 sm:grid-cols-3">
                      <label v-for="category in CONTENT_CATEGORIES" :key="category.id" class="flex min-h-[52px] cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors" :class="interests.includes(category.id) ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-stone-200 text-stone-700 hover:bg-stone-50'">
                        <input v-model="interests" type="checkbox" :value="category.id" class="rounded border-stone-300 text-primary-600 focus:ring-primary-600" />{{ category.label }}
                      </label>
                    </div>
                  </fieldset>
                  <p class="mt-3 text-xs text-stone-500" role="status">{{ interests.length }} selected. You can change these later.</p>
                  <div class="mt-5 flex gap-3">
                    <button type="button" class="wizard-secondary" @click="advance(0)">Back</button>
                    <button type="submit" class="wizard-primary flex-1" :disabled="!interests.length">Continue →</button>
                  </div>
                </form>

                <form v-else-if="step === 2" class="mt-5 space-y-4" @submit.prevent="register">
                  <div>
                    <label for="welcome-name" class="wizard-label">Full name</label>
                    <input id="welcome-name" v-model="form.fullName" name="name" autocomplete="name" required minlength="2" maxlength="120" class="wizard-input" :disabled="submitting" />
                  </div>
                  <div>
                    <label for="welcome-email" class="wizard-label">Email</label>
                    <input id="welcome-email" v-model="form.email" name="email" type="email" autocomplete="email" required maxlength="254" class="wizard-input" :disabled="submitting" />
                  </div>
                  <div>
                    <label for="welcome-phone" class="wizard-label">Phone number</label>
                    <input id="welcome-phone" v-model="form.phoneNumber" name="tel" type="tel" autocomplete="tel" required maxlength="25" placeholder="e.g. +233 24 123 4567" class="wizard-input" :disabled="submitting" />
                  </div>
                  <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm" :class="!expressAvailable ? 'opacity-60' : ''">
                    <input v-model="form.expressLoginRequested" type="checkbox" class="mt-1 rounded border-stone-300 text-primary-600 focus:ring-primary-600" :disabled="!expressAvailable || submitting" aria-describedby="express-description" />
                    <span><span class="font-semibold text-stone-900">Opt in to Express Login</span><span id="express-description" class="mt-1 block text-xs leading-6 text-stone-600">Use your device’s security—such as a fingerprint, face recognition, or device PIN—to sign in without remembering a password. After registration, confirm setup in your account. {{ expressAvailable ? 'Your biometric information stays on your device.' : 'A compatible device and secure browser connection are required.' }}</span></span>
                  </label>
                  <p class="text-xs leading-6 text-stone-500">This creates a reader account, not a paid subscription. Choosing interests does not enable notifications or marketing messages.</p>
                  <div class="flex gap-3">
                    <button type="button" class="wizard-secondary" :disabled="submitting" @click="advance(1)">Back</button>
                    <button type="submit" class="wizard-primary flex-1" :disabled="submitting">{{ submitting ? 'Creating your account…' : 'Create my account' }}</button>
                  </div>
                  <button type="button" class="wizard-secondary w-full" :disabled="submitting" @click="browseAsVisitor">Browse my interests without registering</button>
                </form>

                <div v-else class="mt-6">
                  <p class="rounded-xl bg-emerald-50 p-4 text-sm leading-7 text-emerald-800">Your account is registered and your interests are saved. {{ form.expressLoginRequested ? 'Express Login is not enabled yet. Continue to your account to confirm it using your device security.' : 'You’re ready to explore your selected content.' }}</p>
                  <button v-if="form.expressLoginRequested" type="button" class="wizard-primary mt-6 w-full" @click="finish('/account?setupExpressLogin=1')">Set up Express Login →</button>
                  <button type="button" :class="form.expressLoginRequested ? 'wizard-secondary' : 'wizard-primary'" class="mt-3 w-full" @click="finish('/interests')">Explore my interests →</button>
                </div>
                <p v-if="error" role="alert" class="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">{{ error }}</p>
                <p v-if="storageWarning" role="status" class="mt-3 text-xs leading-6 text-amber-800">{{ storageWarning }}</p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, DialogDescription, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { CONTENT_CATEGORIES, normalizeContentSelection, type ContentCategoryId } from '~/utils/contentCategories';
import { ONBOARDING_SEEN_KEY, INTERESTS_STORAGE_KEY, validateOnboardingRegistration } from '~/utils/onboarding';
import { useBasicAuthStore } from '~/stores/basic-user-auth';
import { useBiometrics } from '~/composables/useBiometrics';
import type { SigninResponseModel } from '~/models';

const auth = useBasicAuthStore();
const router = useRouter();
const identityCookie = useCookie<string | null>('gnp-user-identity', {
  maxAge: 60 * 60 * 24 * 366, secure: true, httpOnly: false, sameSite: 'strict',
});
const sharedIdentity = useState<string | null>('gnpUserAuth');
const seenThisSession = useState('interest-welcome-seen', () => false);
const open = ref(false);
const step = ref(0);
const heading = ref<{ $el: HTMLElement } | null>(null);
const interests = ref<ContentCategoryId[]>([]);
const form = reactive({ fullName: '', email: '', phoneNumber: '', expressLoginRequested: false });
const expressAvailable = ref(false);
const submitting = ref(false);
const error = ref('');
const storageWarning = ref('');
const steps = ['Welcome', 'Interests', 'Register'];
const titles = ['Follow what matters to you.', 'What interests you?', 'Make it yours.', 'Welcome aboard.'];
const descriptions = [
  'Build a reading experience around your world. Discover opportunities, stay informed, and find the stories you care about.',
  'Choose one or more topics. We’ll save your choices so you can browse matching newspaper content.',
  'Register with your details. Express Login is optional, and you can browse as a visitor instead.',
  'Your personal starting point for Graphic NewsPlus is ready.',
];
function markSeen() {
  seenThisSession.value = true;
  try { localStorage.setItem(ONBOARDING_SEEN_KEY, '1'); } catch { /* Session state still suppresses repeat prompts. */ }
}
function start() {
  if (auth.isAuthenticated || auth.accessToken || identityCookie.value) { router.push('/interests'); return; }
  step.value = 0;
  error.value = '';
  open.value = true;
  markSeen();
}
function dismiss() {
  if (submitting.value) return;
  markSeen();
  open.value = false;
  // Do not persist contact details or registration drafts on this device.
  form.fullName = ''; form.email = ''; form.phoneNumber = ''; form.expressLoginRequested = false;
}
async function advance(value: number) {
  error.value = '';
  step.value = value;
  await nextTick();
  heading.value?.$el?.focus();
}
function saveInterests() {
  try { localStorage.setItem(INTERESTS_STORAGE_KEY, JSON.stringify(interests.value)); }
  catch { storageWarning.value = 'This browser could not save your interests. You can select them again on the interests page.'; }
}
function continueToRegistration() {
  if (!interests.value.length) return;
  saveInterests();
  advance(2);
}
async function browseAsVisitor() {
  saveInterests();
  await finish('/interests');
}
async function finish(path: string) {
  dismiss();
  await router.push(path);
}
async function register() {
  if (submitting.value) return;
  error.value = '';
  try {
    const payload = validateOnboardingRegistration({ ...form, interests: interests.value });
    submitting.value = true;
    const response = await $fetch<{ success: boolean; result: SigninResponseModel }>('/api/v1/onboarding/register', { method: 'POST', body: payload, retry: 0 });
    if (!response.success || !response.result?.token) throw new Error('Registration was not confirmed. Please try again.');
    identityCookie.value = response.result.token;
    sharedIdentity.value = response.result.token;
    auth.setAccessToken(response.result.token);
    saveInterests();
    await advance(3);
  } catch (cause: any) {
    error.value = cause?.data?.statusMessage || cause?.message || 'Could not create your account. Please try again.';
  } finally { submitting.value = false; }
}
onMounted(async () => {
  let seen = false;
  try {
    seen = localStorage.getItem(ONBOARDING_SEEN_KEY) === '1';
    interests.value = normalizeContentSelection(JSON.parse(localStorage.getItem(INTERESTS_STORAGE_KEY) || '[]'));
  } catch { /* The visitor can still use the wizard without browser storage. */ }
  if (!seen && !seenThisSession.value && !auth.isAuthenticated && !auth.accessToken && !identityCookie.value) start();
  try { expressAvailable.value = window.isSecureContext && await useBiometrics().isBiometricsAvailable(); }
  catch { expressAvailable.value = false; }
});
</script>

<style scoped>
.wizard-primary { @apply inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50; }
.wizard-secondary { @apply inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 disabled:opacity-50; }
.wizard-label { @apply mb-1.5 block text-sm font-semibold text-stone-700; }
.wizard-input { @apply w-full rounded-xl border-stone-300 text-sm focus:border-primary-500 focus:ring-primary-500; }
</style>
