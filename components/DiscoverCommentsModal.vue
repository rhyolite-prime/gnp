<template>
  <TransitionRoot :show="modelValue" as="template">
    <Dialog as="div" class="relative z-[90]" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-8 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-8 sm:scale-95"
          >
            <DialogPanel
              class="flex max-h-[85vh] sm:max-h-[88vh] w-full max-w-xl flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl transition-all"
            >
              <!-- Modal Header -->
              <div class="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-6">
                <div class="flex items-center gap-2.5">
                  <ChatBubbleBottomCenterTextIcon class="h-6 w-6 text-primary-600" />
                  <DialogTitle class="text-lg font-bold text-stone-900">
                    Discussion
                    <span class="ml-1.5 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                      {{ engagement.commentsCount }}
                    </span>
                  </DialogTitle>
                </div>
                <button
                  type="button"
                  class="grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors"
                  aria-label="Close comments"
                  @click="closeModal"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>

              <!-- Context Item Banner -->
              <div v-if="item" class="flex items-center gap-3 border-b border-stone-100 bg-stone-50/80 px-5 py-3 sm:px-6">
                <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-200 border border-stone-300">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    alt=""
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="flex h-full w-full items-center justify-center text-stone-400">
                    <ChatBubbleBottomCenterTextIcon class="h-6 w-6" />
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <span>{{ labels[item.kind] || item.kind }}</span>
                    <span>·</span>
                    <span>{{ item.source }}</span>
                  </div>
                  <p class="truncate text-xs font-semibold text-stone-900 sm:text-sm">
                    {{ item.title }}
                  </p>
                </div>
              </div>

              <!-- Comments List Scrollable Region -->
              <div ref="commentsContainer" class="flex-1 overflow-y-auto px-5 py-4 sm:px-6 space-y-4">
                <div v-if="!comments.length" class="flex flex-col items-center justify-center py-10 text-center">
                  <div class="grid h-14 w-14 place-items-center rounded-full bg-stone-100 text-stone-400 mb-3">
                    <ChatBubbleLeftEllipsisIcon class="h-8 w-8" />
                  </div>
                  <h4 class="text-sm font-semibold text-stone-800">No comments yet</h4>
                  <p class="mt-1 max-w-xs text-xs text-stone-500">
                    Be the first to share your thoughts, insights, or questions about this discovery!
                  </p>
                </div>

                <article
                  v-for="comment in comments"
                  :key="comment.id"
                  class="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-stone-50"
                >
                  <!-- Author Avatar -->
                  <div class="shrink-0">
                    <img
                      v-if="comment.authorAvatar"
                      :src="comment.authorAvatar"
                      alt=""
                      class="h-9 w-9 rounded-full object-cover ring-1 ring-stone-200"
                    />
                    <div
                      v-else
                      class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                      :class="getAvatarColor(comment.authorName)"
                    >
                      {{ getInitials(comment.authorName) }}
                    </div>
                  </div>

                  <!-- Comment Body -->
                  <div class="min-w-0 flex-1">
                    <div class="flex items-baseline justify-between gap-2">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-xs font-bold text-stone-900">{{ comment.authorName }}</span>
                        <span
                          v-if="comment.isCurrentUser"
                          class="rounded bg-primary-100 px-1.5 py-0.2 text-[10px] font-bold text-primary-800"
                        >
                          You
                        </span>
                        <span class="text-[11px] text-stone-400">· {{ formatDate(comment.createdAt) }}</span>
                      </div>
                      <!-- Delete button if owned by user -->
                      <button
                        v-if="comment.isCurrentUser"
                        type="button"
                        class="text-xs text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete comment"
                        aria-label="Delete comment"
                        @click="handleDelete(comment.id)"
                      >
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </div>

                    <p class="mt-1 whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-stone-700">
                      {{ comment.content }}
                    </p>

                    <!-- Comment Like Action -->
                    <div class="mt-2 flex items-center gap-4 text-xs text-stone-500">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 font-medium transition-colors hover:text-red-600"
                        :class="comment.isLiked ? 'text-red-600 font-semibold' : ''"
                        @click="handleCommentLike(comment.id)"
                      >
                        <HeartSolid v-if="comment.isLiked" class="h-3.5 w-3.5 text-red-600" />
                        <HeartIcon v-else class="h-3.5 w-3.5" />
                        <span>{{ comment.likes || 0 }}</span>
                      </button>
                    </div>
                  </div>
                </article>
              </div>

              <!-- Comment Input Form (Pinned to bottom) -->
              <div class="border-t border-stone-200 bg-white p-4 sm:p-5">
                <!-- User Identity Strip -->
                <div class="mb-2.5 flex items-center justify-between text-xs text-stone-600">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      :class="getAvatarColor(currentUserName)"
                    >
                      {{ getInitials(currentUserName) }}
                    </div>
                    <span v-if="!isEditingName">
                      Commenting as <strong class="font-semibold text-stone-900">{{ currentUserName }}</strong>
                    </span>
                    <div v-else class="flex items-center gap-1.5">
                      <input
                        ref="nameInput"
                        v-model="tempName"
                        type="text"
                        maxlength="40"
                        class="rounded border border-stone-300 px-2 py-0.5 text-xs text-stone-900 focus:border-primary-500 focus:outline-none"
                        placeholder="Your display name"
                        @keydown.enter.prevent="saveName"
                      />
                      <button
                        type="button"
                        class="text-xs font-semibold text-primary-700 hover:underline"
                        @click="saveName"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <button
                    v-if="!isEditingName"
                    type="button"
                    class="text-[11px] font-medium text-stone-500 hover:text-stone-900 hover:underline"
                    @click="startEditName"
                  >
                    Change name
                  </button>
                </div>

                <!-- Input area -->
                <form @submit.prevent="submitComment">
                  <div class="relative">
                    <textarea
                      ref="textareaRef"
                      v-model="commentText"
                      rows="2"
                      maxlength="500"
                      class="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-2.5 pr-20 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-primary-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-600"
                      placeholder="Share your thoughts on this discovery…"
                      @keydown.ctrl.enter="submitComment"
                      @keydown.meta.enter="submitComment"
                    />
                    <div class="absolute bottom-2.5 right-2 flex items-center gap-2">
                      <button
                        type="submit"
                        :disabled="!canSubmit || submitting"
                        class="inline-flex h-8 items-center justify-center rounded-full bg-primary-600 px-3 text-xs font-bold text-white shadow hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
                      >
                        <span v-if="submitting">Posting…</span>
                        <span v-else class="flex items-center gap-1">
                          Post <PaperAirplaneIcon class="h-3 w-3" />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div class="mt-1 flex justify-between text-[10px] text-stone-400 px-1">
                    <span>Press Ctrl+Enter to post</span>
                    <span>{{ commentText.length }} / 500</span>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import {
  XMarkIcon,
  TrashIcon,
  PaperAirplaneIcon,
  HeartIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/vue/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid';
import type { DiscoverItem } from '~/utils/discoverFeed';
import { useDiscoverEngagement } from '~/composables/useDiscoverEngagement';

const props = defineProps<{
  modelValue: boolean;
  item: DiscoverItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const { $toast } = useNuxtApp();
const {
  getEngagement,
  addComment,
  deleteComment,
  toggleCommentLike,
  currentUserName,
  formatDate,
} = useDiscoverEngagement();

const labels: Record<string, string> = {
  archive: 'From the archives',
  newspaper: 'Newspaper',
  video: 'Watch',
  story: 'Top story',
};

const commentText = ref('');
const submitting = ref(false);
const isEditingName = ref(false);
const tempName = ref('');
const commentsContainer = ref<HTMLElement | null>(null);
const nameInput = ref<HTMLInputElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const itemKey = computed(() => props.item?.key || '');
const engagement = computed(() => getEngagement(itemKey.value));
const comments = computed(() => engagement.value.comments || []);

const canSubmit = computed(() => {
  const trimmed = commentText.value.trim();
  return trimmed.length >= 2 && trimmed.length <= 500;
});

function closeModal() {
  emit('update:modelValue', false);
}

function startEditName() {
  tempName.value = currentUserName.value;
  isEditingName.value = true;
  nextTick(() => {
    nameInput.value?.focus();
  });
}

function saveName() {
  if (tempName.value.trim()) {
    currentUserName.value = tempName.value.trim();
  }
  isEditingName.value = false;
}

async function submitComment() {
  if (!canSubmit.value || submitting.value || !itemKey.value) return;
  submitting.value = true;
  try {
    await addComment(itemKey.value, commentText.value);
    commentText.value = '';
    $toast?.success?.('Comment published!');
    await nextTick();
    if (commentsContainer.value) {
      commentsContainer.value.scrollTop = 0;
    }
  } catch (err: any) {
    $toast?.error?.(err?.message || 'Failed to post comment.');
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(commentId: string) {
  if (!itemKey.value) return;
  try {
    await deleteComment(itemKey.value, commentId);
    $toast?.info?.('Comment removed.');
  } catch (err: any) {
    $toast?.error?.(err?.message || 'Failed to delete comment.');
  }
}

async function handleCommentLike(commentId: string) {
  if (!itemKey.value) return;
  await toggleCommentLike(itemKey.value, commentId);
}

function getInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return (name[0] || 'U').toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-primary-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-sky-600',
    'bg-rose-600',
    'bg-violet-600',
    'bg-teal-600',
    'bg-indigo-600',
  ];
  let sum = 0;
  for (let i = 0; i < (name || '').length; i++) {
    sum += name.charCodeAt(i);
  }
  return colors[sum % colors.length]!;
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      nextTick(() => {
        textareaRef.value?.focus();
      });
    }
  }
);
</script>
