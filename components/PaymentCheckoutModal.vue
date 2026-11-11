<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/80 p-4" role="dialog" aria-modal="true" aria-label="Complete your payment">
    <div class="w-full max-w-2xl">
      <div class="mb-2 flex items-center justify-between text-white">
        <p class="text-sm font-medium">Complete your payment</p>
        <button
          type="button"
          class="rounded-md px-2.5 py-1 text-sm font-medium hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          @click="emit('close')"
        >
          Close
        </button>
      </div>

      <iframe
        title="Payment"
        :src="paymentUrl"
        class="h-[600px] w-full rounded-lg border-0 bg-white"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Paystack checkout overlay. Kept separate from <BuySubscriptionModal> so the
 * buy/subscription modal can be dismissed while payment is in progress instead
 * of showing two stacked dialogs.
 */
defineProps<{
  /** Paystack checkout URL returned by the subscription API. */
  paymentUrl: string;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();
</script>
