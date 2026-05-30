<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden transform transition-all"
        >
          <div
            class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center"
          >
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
              {{ $t("select_avatar_modal.title") }}
            </h3>
            <button
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              @click="closeModal"
            >
              <svg
                class="w-6 h-6"
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

          <div class="p-6 overflow-y-auto flex-1">
            <div
              v-if="availableAvatars.length === 0"
              class="text-center text-slate-500 py-10"
            >
              {{ $t("select_avatar_modal.not_found") }}
            </div>

            <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <div
                v-for="(avatarUrl, index) in availableAvatars"
                :key="index"
                class="aspect-square rounded-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-900 transition-all shadow-sm hover:shadow-md"
                @click="handleSelect(avatarUrl)"
              >
                <img
                  :src="avatarUrl"
                  class="w-full h-full object-contain"
                  loading="lazy"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false });
defineProps<{
  availableAvatars: string[];
}>();

const emit = defineEmits<{
  (e: "select", avatarUrl: string): void;
}>();

const closeModal = (): void => {
  isOpen.value = false;
};

const handleSelect = (avatarUrl: string): void => {
  emit("select", avatarUrl);
  closeModal();
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
