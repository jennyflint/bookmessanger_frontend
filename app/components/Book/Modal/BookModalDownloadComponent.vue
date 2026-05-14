<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        @click="closeModal"
      />
      <div
        class="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
      >
        <div
          class="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between"
        >
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 truncate pr-4">
            {{ modelValue.original_name }}
          </h3>
          <button
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
            @click="closeModal"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            {{ $t("book.ready_to_download") }}:
          </p>
          <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            <a
              v-for="(cb, index) in modelValue.complete_books"
              :key="cb.id || index"
              :href="`/download/complete-book/${cb.name}`"
              download
              class="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl hover:scale-[1.02] transition-transform group"
            >
              <div class="flex items-center space-x-3 overflow-hidden">
                <svg
                  class="w-5 h-5 text-emerald-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span
                  class="text-sm font-medium text-emerald-900 dark:text-emerald-300 truncate"
                  :title="cb.name"
                >
                  {{ cb.name || `${$t("book.entity")} #${cb.id}` }}
                </span>
              </div>
              <div
                class="shrink-0 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase text-[10px] font-bold"
              >
                {{ $t("download")}}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { BookDetailResponse } from "~/types/book";
const modelValue = defineModel<BookDetailResponse | null>({ required: true })
const emit = defineEmits<{
  (e: "update:modelValue", value: null): void;
}>();

const closeModal = (): void => {
  emit("update:modelValue", null);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
