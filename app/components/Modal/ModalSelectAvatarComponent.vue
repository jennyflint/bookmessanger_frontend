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

          <div class="px-6 pt-4">
            <div class="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl gap-1">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                :class="[
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.value
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                ]"
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
                <span
                  v-if="tab.value === 'my' && userAvatarsStore.avatars.length > 0"
                  class="ml-1 text-xs text-slate-400"
                >
                  {{ userAvatarsStore.avatars.length }}
                </span>
              </button>
            </div>
          </div>

          <div class="p-6 overflow-y-auto flex-1">
            <template v-if="activeTab === 'stock'">
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
            </template>

            <template v-else>
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {{ $t("select_avatar_modal.my.hint", { formats: AVATAR_FORMATS_LABEL, size: MAX_AVATAR_SIZE_LABEL }) }}
              </p>

              <input
                ref="fileInput"
                type="file"
                class="hidden"
                :accept="AVATAR_ACCEPT"
                @change="onFileChange"
              >

              <div
                v-if="userAvatarsStore.isLoading && !userAvatarsStore.isLoaded"
                class="flex justify-center py-10 text-slate-400"
              >
                <svg
                  class="w-6 h-6 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24">
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
              </div>

              <div
                v-else-if="loadError"
                class="text-center py-10"
              >
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {{ $t("select_avatar_modal.my.load_error") }}
                </p>
                <button
                  class="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                  @click="loadMyAvatars"
                >
                  {{ $t("select_avatar_modal.my.retry") }}
                </button>
              </div>

              <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                <button
                  type="button"
                  class="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-wait"
                  :disabled="userAvatarsStore.isUploading"
                  :title="$t('select_avatar_modal.my.upload')"
                  @click="openFilePicker"
                >
                  <svg
                    v-if="userAvatarsStore.isUploading"
                    class="w-6 h-6 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24">
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
                  <svg
                    v-else
                    class="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-xs font-medium px-1 text-center">
                    {{ userAvatarsStore.isUploading ? $t("select_avatar_modal.my.uploading") : $t("select_avatar_modal.my.upload") }}
                  </span>
                </button>

                <div
                  v-for="avatar in userAvatarsStore.avatars"
                  :key="avatar.id"
                  class="group relative aspect-square rounded-xl border-2 border-transparent hover:border-indigo-500 cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-900 transition-all shadow-sm hover:shadow-md"
                  :title="avatar.original_name"
                  @click="handleSelect(avatar.url)"
                >
                  <img
                    :src="avatar.url"
                    :alt="avatar.original_name"
                    class="w-full h-full object-contain"
                    loading="lazy"
                  >
                  <button
                    type="button"
                    class="absolute top-1 right-1 p-1 rounded-lg bg-white/90 dark:bg-slate-800/90 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    :title="$t('buttons.delete')"
                    @click.stop="askDelete(avatar)"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <p
                v-if="userAvatarsStore.isLoaded && userAvatarsStore.avatars.length === 0"
                class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6"
              >
                {{ $t("select_avatar_modal.my.empty") }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <modal-confirm-component
    v-model="isDeleteModalOpen"
    z-index-class="z-[110]"
    :title="$t('select_avatar_modal.my.delete_title')"
    :message="deleteMessage"
    :is-loading="avatarToDelete !== null && userAvatarsStore.deletingId === avatarToDelete.id"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";
import type { UserBookAvatar } from "~/types/avatar";
import { useUserAvatarsStore } from "~/stores/userAvatars";
import { getApiErrorMessage, getApiErrorStatus } from "~/utils/apiError";
import {
  AVATAR_ACCEPT,
  AVATAR_FORMATS_LABEL,
  MAX_AVATAR_SIZE_LABEL,
  validateAvatarFile,
} from "~/utils/avatarUpload";

type AvatarTab = "stock" | "my";

const isOpen = defineModel<boolean>({ default: false });
defineProps<{
  availableAvatars: string[];
}>();

const emit = defineEmits<{
  (e: "select", avatarUrl: string): void;
}>();

const { t } = useI18n();
const userAvatarsStore = useUserAvatarsStore();
const bookModelStore = useBookModelStore();

const activeTab = ref<AvatarTab>("stock");
const tabs = computed<{ value: AvatarTab; label: string }[]>(() => [
  { value: "stock", label: t("select_avatar_modal.tabs.stock") },
  { value: "my", label: t("select_avatar_modal.tabs.my") },
]);

const fileInput = ref<HTMLInputElement | null>(null);
const loadError = ref(false);

const isDeleteModalOpen = ref(false);
const avatarToDelete = ref<UserBookAvatar | null>(null);

const withMessage = (err: unknown): { description?: string } => {
  const message = getApiErrorMessage(err);
  return message ? { description: message } : {};
};

const loadMyAvatars = async (): Promise<void> => {
  loadError.value = false;
  try {
    await userAvatarsStore.fetchMyAvatars();
  } catch (err) {
    loadError.value = true;
    toast.error(t("select_avatar_modal.my.load_error"), withMessage(err));
  }
};

// The store loads them only once, later opens reuse the cached list
watch(isOpen, (open) => {
  if (open) loadMyAvatars();
}, { immediate: true });

const closeModal = (): void => {
  isOpen.value = false;
};

const handleSelect = (avatarUrl: string): void => {
  emit("select", avatarUrl);
  closeModal();
};

const openFilePicker = (): void => {
  fileInput.value?.click();
};

const onFileChange = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  // Reset so picking the same file again still fires "change"
  input.value = "";
  if (!file) return;

  const validationError = validateAvatarFile(file);
  if (validationError) {
    toast.error(t(`select_avatar_modal.my.errors.${validationError}`, {
      formats: AVATAR_FORMATS_LABEL,
      size: MAX_AVATAR_SIZE_LABEL,
    }));
    return;
  }

  const toastId = toast.loading(t("select_avatar_modal.my.uploading"));
  try {
    await userAvatarsStore.uploadAvatar(file);
    toast.success(t("select_avatar_modal.my.uploaded"), { id: toastId });
  } catch (err) {
    toast.error(
      getApiErrorMessage(err) ?? t("select_avatar_modal.my.errors.upload_failed"),
      { id: toastId }
    );
  }
};

const charactersUsingAvatar = computed(() =>
  avatarToDelete.value ? bookModelStore.getCharactersByAvatar(avatarToDelete.value.url) : []
);

const deleteMessage = computed<string>(() => {
  const characters = charactersUsingAvatar.value;
  if (characters.length === 0) return t("select_avatar_modal.my.delete_message");
  return t("select_avatar_modal.my.delete_in_use", {
    names: characters.map((character) => character.name).join(", "),
  });
});

const askDelete = (avatar: UserBookAvatar): void => {
  avatarToDelete.value = avatar;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async (): Promise<void> => {
  const avatar = avatarToDelete.value;
  if (!avatar) return;

  const finish = (): void => {
    // The file is gone on the backend, so its URL would show a broken image
    bookModelStore.replaceAvatarWithStock(avatar.url);
    isDeleteModalOpen.value = false;
    avatarToDelete.value = null;
  };

  try {
    await userAvatarsStore.deleteAvatar(avatar.id);
    finish();
    toast.success(t("select_avatar_modal.my.deleted"));
  } catch (err) {
    const message = getApiErrorMessage(err);
    if (getApiErrorStatus(err) === 404) {
      // Already deleted (e.g. in another tab): drop the stale entry anyway
      userAvatarsStore.removeLocal(avatar.id);
      finish();
    }
    toast.error(message ?? t("select_avatar_modal.my.errors.delete_failed"));
  }
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
