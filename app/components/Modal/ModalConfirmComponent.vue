<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        :class="zIndexClass"
        class="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all relative">
          
          <button
            class="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            @click="closeModal"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            :class="[
              'mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4',
              variant === 'primary'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
            ]"
          >
            <svg
              v-if="variant === 'primary'"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            {{ title }}
          </h3>
          
          <p v-if="message" class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {{ message }}
          </p>

          <div v-if="$slots.default" class="mb-6">
            <slot />
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors font-medium disabled:opacity-50"
              :disabled="isLoading"
              @click="closeModal"
            >
              {{ $t("cancel") }}
            </button>
            <button
              :class="[
                'flex-1 px-4 py-2 text-white rounded-xl transition-colors font-medium flex justify-center items-center disabled:opacity-50',
                variant === 'primary' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700',
              ]"
              :disabled="isLoading"
              @click="confirm"
            >
              <svg
                v-if="isLoading"
                class="w-5 h-5 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4" />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ confirmLabel || $t("buttons.delete") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    message?: string;
    isLoading?: boolean;
    /** Text of the confirm button, "Delete" by default */
    confirmLabel?: string;
    /** "danger" for destructive actions, "primary" for everything else */
    variant?: "danger" | "primary";
    /** Tailwind z-index class, raise it when opening on top of another modal */
    zIndexClass?: string;
  }>(),
  {
    title: "",
    message: "",
    isLoading: false,
    confirmLabel: "",
    variant: "danger",
    zIndexClass: "z-[60]",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "confirm": [];
}>();

const closeModal = (): void => {
  if (!props.isLoading) {
    emit("update:modelValue", false);
  }
};

const confirm = (): void => {
  emit("confirm");
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>