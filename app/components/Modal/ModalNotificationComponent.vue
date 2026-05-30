<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closePopup"
      >
        <div
          class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all"
        >
          <div class="p-5">
            <div class="flex items-start mb-4">
              <div
                v-if="type !== 'default'"
                class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4"
                :class="iconBackgroundClass"
              >
                <svg
                  v-if="type === 'success'"
                  class="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>

                <svg
                  v-if="type === 'error'"
                  class="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div class="flex-1">
                <div class="flex justify-between items-start mb-1">
                  <h3
                    v-if="title"
                    class="text-lg font-bold text-slate-800 dark:text-slate-100"
                  >
                    {{ title }}
                  </h3>
                  <button
                    class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-4 -mt-1 -mr-1 p-1"
                    @click="closePopup"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div class="text-sm text-slate-600 dark:text-slate-300">
                  {{ message }}
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-2">
              <button
                class="px-5 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="buttonClass"
                @click="closePopup"
              >
                {{ $t("buttons.close") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { NotificationProps } from "~/types/propsComponent";

const isOpen = defineModel<boolean>()

const props = withDefaults(
  defineProps<NotificationProps>(),
  {
    type: "default",
  }
);

const closePopup = (): void => {
  isOpen.value = false;
};

const iconBackgroundClass = computed(() => {
  if (props.type === "success") return "bg-emerald-100 dark:bg-emerald-900/30";
  if (props.type === "error") return "bg-red-100 dark:bg-red-900/30";
  return "";
});

const buttonClass = computed(() => {
  if (props.type === "success") {
    return "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400";
  }
  if (props.type === "error") {
    return "bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400";
  }
  return "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200";
});
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
