<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-gray-100">
              <!-- Top Graphic Brand Header -->
              <div class="bg-gradient-to-r from-primary-800 via-primary-700 to-gray-900 px-8 py-5 text-white flex items-center justify-between border-b border-primary-900">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-400/30 flex items-center justify-center text-primary-300">
                    <SparklesIcon class="w-6 h-6" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold uppercase tracking-wider text-primary-300">Graphic NewsPlus Research Intelligence</span>
                      <span class="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">Premium Dossier Export</span>
                    </div>
                    <DialogTitle as="h3" class="text-lg font-bold text-white mt-0.5">
                      Export Executive Research Dossier as PDF
                    </DialogTitle>
                  </div>
                </div>

                <button
                  type="button"
                  @click="closeModal"
                  class="rounded-lg p-1.5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Main Content Grid -->
              <div class="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
                <!-- LEFT COLUMN: Tiers & Payment (7 Cols) -->
                <div class="lg:col-span-7 space-y-6">
                  <!-- STEP 1: Select Export Report Tier -->
                  <div>
                    <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span class="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">1</span>
                      Select Research Report Tier
                    </h4>

                    <div class="space-y-3">
                      <div
                        v-for="tier in PDF_EXPORT_TIERS"
                        :key="tier.id"
                        @click="selectedTier = tier"
                        :class="[
                          'p-4 rounded-2xl border-2 cursor-pointer transition-all relative',
                          selectedTier.id === tier.id
                            ? 'border-primary-600 bg-primary-50/40 shadow-md ring-1 ring-primary-500/20'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                        ]"
                      >
                        <div class="flex items-start justify-between">
                          <div>
                            <div class="flex items-center gap-2">
                              <h5 class="text-sm font-bold text-gray-900">{{ tier.name }}</h5>
                              <span
                                v-if="tier.isPopular"
                                class="bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded-full"
                              >
                                ★ Recommended
                              </span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1">{{ tier.description }}</p>
                          </div>

                          <div class="text-right">
                            <span class="text-base font-black text-gray-900">GHS {{ tier.priceGhs.toFixed(2) }}</span>
                            <span class="block text-[10px] text-gray-600">~ ${{ tier.priceUsd.toFixed(2) }} USD</span>
                          </div>
                        </div>

                        <!-- Feature list preview -->
                        <div class="mt-3 pt-3 border-t border-gray-200/60 grid grid-cols-2 gap-1.5 text-[11px] text-gray-600">
                          <div v-for="feat in tier.features.slice(0, 4)" :key="feat" class="flex items-center gap-1.5">
                            <CheckIcon class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span class="truncate">{{ feat }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- STEP 2: Select Payment Method -->
                  <div>
                    <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span class="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">2</span>
                      Select Payment Channel
                    </h4>

                    <div class="grid grid-cols-3 gap-3">
                      <!-- Wallet Credits -->
                      <button
                        type="button"
                        @click="selectedPayment = 'credits'"
                        :class="[
                          'p-3.5 rounded-xl border text-left transition-all',
                          selectedPayment === 'credits'
                            ? 'border-primary-600 bg-primary-50/60 ring-1 ring-primary-500/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        ]"
                      >
                        <div class="flex items-center justify-between">
                          <BanknotesIcon class="w-5 h-5 text-primary-600" />
                          <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Active</span>
                        </div>
                        <p class="text-xs font-bold text-gray-900 mt-2">Wallet Credits</p>
                        <p class="text-[11px] text-gray-500">Bal: GHS {{ userCredits.toFixed(2) }}</p>
                      </button>

                      <!-- Mobile Money -->
                      <button
                        type="button"
                        @click="selectedPayment = 'momo'"
                        :class="[
                          'p-3.5 rounded-xl border text-left transition-all',
                          selectedPayment === 'momo'
                            ? 'border-primary-600 bg-primary-50/60 ring-1 ring-primary-500/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        ]"
                      >
                        <DevicePhoneMobileIcon class="w-5 h-5 text-primary-600" />
                        <p class="text-xs font-bold text-gray-900 mt-2">Mobile Money</p>
                        <p class="text-[11px] text-gray-500">MTN / Telecel / AT</p>
                      </button>

                      <!-- Card Payment -->
                      <button
                        type="button"
                        @click="selectedPayment = 'card'"
                        :class="[
                          'p-3.5 rounded-xl border text-left transition-all',
                          selectedPayment === 'card'
                            ? 'border-primary-600 bg-primary-50/60 ring-1 ring-primary-500/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        ]"
                      >
                        <CreditCardIcon class="w-5 h-5 text-primary-600" />
                        <p class="text-xs font-bold text-gray-900 mt-2">Debit / Credit Card</p>
                        <p class="text-[11px] text-gray-500">Visa / Mastercard</p>
                      </button>
                    </div>

                    <!-- MoMo / Card Inputs -->
                    <div v-if="selectedPayment === 'momo'" class="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Network Provider</label>
                          <select v-model="momoNetwork" class="w-full text-xs p-2 border rounded-lg bg-white outline-none">
                            <option value="MTN">MTN MoMo</option>
                            <option value="Telecel">Telecel Cash</option>
                            <option value="AT">AT Money</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Mobile Number</label>
                          <input v-model="momoNumber" type="tel" placeholder="024 123 4567" class="w-full text-xs p-2 border rounded-lg outline-none bg-white" />
                        </div>
                      </div>
                    </div>

                    <div v-if="selectedPayment === 'card'" class="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                      <div>
                        <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Card Number</label>
                        <input v-model="cardNumber" type="text" placeholder="4123 4567 8901 2345" class="w-full text-xs p-2 border rounded-lg outline-none bg-white" />
                      </div>
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Expiry Date</label>
                          <input v-model="cardExpiry" type="text" placeholder="MM/YY" class="w-full text-xs p-2 border rounded-lg outline-none bg-white" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">CVV</label>
                          <input v-model="cardCvv" type="password" placeholder="123" maxlength="4" class="w-full text-xs p-2 border rounded-lg outline-none bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- RIGHT COLUMN: Order Summary & Live Preview (5 Cols) -->
                <div class="lg:col-span-5 bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col justify-between space-y-6">
                  <div>
                    <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <ReceiptPercentIcon class="w-4 h-4 text-primary-600" />
                      Order Summary & Fee Calculation
                    </h4>

                    <!-- Summary Card -->
                    <div class="bg-white rounded-xl p-4 border border-gray-200 space-y-3 text-xs">
                      <div class="flex justify-between text-gray-600">
                        <span>Research Topic</span>
                        <span class="font-bold text-gray-900 text-right truncate max-w-[160px]">
                          {{ activeSession?.title || 'Executive Dossier' }}
                        </span>
                      </div>
                      <div class="flex justify-between text-gray-600">
                        <span>Selected Tier</span>
                        <span class="font-bold text-gray-900">{{ selectedTier.name }}</span>
                      </div>
                      <div class="flex justify-between text-gray-600">
                        <span>Bookmarked Findings</span>
                        <span class="font-bold text-gray-900">{{ savedFindings.length }} items</span>
                      </div>
                      <div class="flex justify-between text-gray-600">
                        <span>High-Res Vector Rendering</span>
                        <span class="text-emerald-700 font-bold">Included</span>
                      </div>
                      <div class="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center text-sm font-black text-gray-900">
                        <span>Total Payable Fee</span>
                        <span class="text-primary-600 text-lg">GHS {{ selectedTier.priceGhs.toFixed(2) }}</span>
                      </div>
                    </div>

                    <!-- Security Badge -->
                    <div class="mt-4 p-3 bg-white rounded-xl border border-gray-200 text-[11px] text-gray-500 flex items-center gap-2">
                      <ShieldCheckIcon class="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Encrypted SSL payment • Graphic Communications Group official seal included.</span>
                    </div>

                    <!-- Progress Indicator while Generating PDF -->
                    <div v-if="isProcessing || isExporting" class="mt-4 p-4 bg-white rounded-xl border border-primary-200 space-y-2">
                      <div class="flex justify-between text-xs font-bold text-gray-800">
                        <span>{{ isProcessing ? 'Processing Transaction...' : 'Compiling Executive Vector PDF...' }}</span>
                        <span>{{ exportProgress }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          class="bg-primary-600 h-2 transition-all duration-300"
                          :style="{ width: `${exportProgress || (isProcessing ? 40 : 10)}%` }"
                        ></div>
                      </div>
                    </div>

                    <!-- Success Message -->
                    <div v-if="successMessage" class="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-semibold">
                      <CheckCircleIcon class="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{{ successMessage }}</span>
                    </div>

                    <!-- Error Message -->
                    <div v-if="errorMessage" class="mt-4 p-3.5 bg-primary-50 border border-primary-200 rounded-xl text-xs text-primary-800 flex items-center gap-2 font-semibold">
                      <ExclamationCircleIcon class="w-5 h-5 text-primary-600 shrink-0" />
                      <span>{{ errorMessage }}</span>
                    </div>
                  </div>

                  <!-- Checkout Button -->
                  <div class="space-y-2">
                    <button
                      type="button"
                      @click="handlePayAndExport"
                      :disabled="isProcessing || isExporting"
                      class="w-full py-3.5 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                    >
                      <ArrowPathIcon v-if="isProcessing || isExporting" class="w-5 h-5 animate-spin" />
                      <ArrowDownTrayIcon v-else class="w-5 h-5" />
                      <span>{{ isProcessing || isExporting ? 'Generating Dossier...' : `Pay GHS ${selectedTier.priceGhs.toFixed(2)} & Download PDF` }}</span>
                    </button>

                    <button
                      type="button"
                      @click="handleTopUp"
                      class="w-full text-center text-xs text-gray-500 hover:text-primary-600 font-semibold py-1 transition-colors"
                    >
                      + Top Up Research Credits (+ GHS 100)
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { 
  XMarkIcon, 
  SparklesIcon, 
  CheckIcon, 
  BanknotesIcon, 
  DevicePhoneMobileIcon, 
  CreditCardIcon, 
  ReceiptPercentIcon, 
  ShieldCheckIcon, 
  ArrowDownTrayIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from '@heroicons/vue/24/outline';
import { PDF_EXPORT_TIERS } from '~/composables/useRagChat';
import type { PdfExportTier, PaymentChannel } from '~/models/rag';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { 
  activeSession, 
  savedFindings, 
  userCredits, 
  processExportPayment, 
  topUpCredits 
} = useRagChat();

const { isExporting, exportProgress, generateResearchPdf } = usePdfExport();

const selectedTier = ref<PdfExportTier>(PDF_EXPORT_TIERS[1]); // Default to Executive Dossier
const selectedPayment = ref<PaymentChannel>('credits');

const momoNetwork = ref('MTN');
const momoNumber = ref('024 456 7890');
const cardNumber = ref('4123 4567 8901 2345');
const cardExpiry = ref('12/28');
const cardCvv = ref('345');

const isProcessing = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const closeModal = () => {
  if (!isProcessing.value && !isExporting.value) {
    emit('close');
  }
};

const handleTopUp = () => {
  topUpCredits(100.00);
  successMessage.value = 'Added GHS 100.00 complimentary research credits!';
  setTimeout(() => {
    successMessage.value = '';
  }, 2500);
};

const handlePayAndExport = async () => {
  if (!activeSession.value) return;

  isProcessing.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  const paymentResult = await processExportPayment(selectedTier.value, selectedPayment.value, {
    phone: momoNumber.value,
    email: 'researcher@graphicnewsplus.com'
  });

  isProcessing.value = false;

  if (!paymentResult.success) {
    errorMessage.value = paymentResult.message || 'Payment could not be processed.';
    return;
  }

  successMessage.value = `${paymentResult.message} Compiling PDF dossier...`;

  const pdfSuccess = await generateResearchPdf(
    activeSession.value,
    savedFindings.value,
    selectedTier.value,
    paymentResult.order
  );

  if (pdfSuccess) {
    successMessage.value = '✓ PDF Downloaded successfully! Receipt saved to your account.';
    setTimeout(() => {
      closeModal();
      successMessage.value = '';
    }, 2500);
  } else {
    errorMessage.value = 'Failed to generate PDF document. Please try again.';
  }
};
</script>
