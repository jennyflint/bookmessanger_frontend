<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        @click.self="closeModal()"
      >
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all relative flex flex-col max-h-[90vh]"
        >
          <div
            class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center flex-shrink-0"
          >
            <h3
              class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
            >
              <button
                v-if="step === 'theme'"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -ml-2"
                @click="goBackToFormats"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {{
                step === "format"
                  ? $t("download_modal.title")
                  : $t("template.select_to_preview")
              }}
            </h3>
            <button
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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

          <div
            v-if="step === 'format'"
            class="p-4 flex flex-col overflow-y-auto custom-scrollbar"
          >
            <div class="space-y-3">
              <button
                class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleFormatSelect('pdf')"
              >
                <div
                  class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform"
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
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div class="text-left flex-1">
                  <div class="font-bold text-slate-800 dark:text-slate-200">
                    {{ $t("download_modal.pdf_document") }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ $t("download_modal.for_reading_and_printing") }}
                  </div>
                </div>
              </button>

              <button
                v-if="htmlContent"
                class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleFormatSelect('html')"
              >
                <div
                  class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform"
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
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div class="text-left flex-1">
                  <div class="font-bold text-slate-800 dark:text-slate-200">
                    {{ $t("download_modal.html_page") }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ $t("download_modal.opens_in_browser") }}
                  </div>
                </div>
              </button>

              <button
                v-if="jsonContent"
                class="w-full flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                @click="downloadJson()"
              >
                <div
                  class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform"
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
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                </div>
                <div class="text-left flex-1">
                  <div class="font-bold text-slate-800 dark:text-slate-200">
                    {{ $t("download_modal.raw_data_json") }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ $t("download_modal.for_developers_and_api") }}
                  </div>
                </div>
              </button>
            </div>

            <div v-if="!props.templateName" class="mt-4 text-center flex-shrink-0">
              <NuxtLink
                :to="`/book/model/${props.bookId}`"
                class="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline transition-all"
                @click="closeModal"
              >
                {{ $t("download_modal.extended_mode") }}
              </NuxtLink>
            </div>

            <div
              class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col min-h-[100px]"
            >
              <div class="flex items-center justify-between mb-3 px-1 flex-shrink-0">
                <div class="flex items-center gap-2">
                  <h4
                    class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {{ $t("download_modal.previous_downloads") }}
                  </h4>
                  <span
                    v-if="isHistoryLoading && downloadedBooks.length > 0"
                    class="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
                  />
                </div>

                <div
                  v-if="totalPages > 1"
                  class="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800/50 p-0.5 rounded-lg border border-slate-100 dark:border-slate-700"
                >
                  <button
                    class="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-transparent"
                    :disabled="currentPage === 1 || isHistoryLoading"
                    @click="changePage(currentPage - 1)"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span
                    class="text-[10px] font-medium text-slate-500 min-w-[28px] text-center font-mono"
                  >
                    {{ currentPage }}/{{ totalPages }}
                  </span>
                  <button
                    class="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-transparent"
                    :disabled="currentPage === totalPages || isHistoryLoading"
                    @click="changePage(currentPage + 1)"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                v-if="isHistoryLoading && downloadedBooks.length === 0"
                class="flex-1 flex items-center justify-center py-6"
              >
                <div
                  class="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400 dark:border-slate-500"
                />
              </div>

              <div v-else-if="historyError" class="text-xs text-center text-red-500 py-4">
                {{ historyError }}
              </div>

              <div
                v-else-if="downloadedBooks.length === 0"
                class="text-xs text-center text-slate-400 dark:text-slate-500 py-6 italic"
              >
                {{ $t("download_modal.no_downloads_yet") }}
              </div>

              <div
                v-else
                class="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1"
              >
                <div
                  v-for="file in downloadedBooks"
                  :key="file.id"
                  class="flex items-center p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center font-bold text-[10px] uppercase"
                    :class="
                      file.format === 'pdf'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                        : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'
                    "
                  >
                    {{ file.format }}
                  </div>

                  <div class="ml-3 flex-1 min-w-0">
                    <div
                      class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate"
                      :title="file.name"
                    >
                      {{ file.name }}
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-[10px] text-slate-500">{{
                        formatDate(file.created_at)
                      }}</span>
                      <span
                        class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        :class="statusColors[file.status]"
                      >
                        {{ file.status }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center ml-2 gap-1">
                    <button
                      v-if="file.status === 'completed'"
                      class="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors disabled:opacity-50"
                      :disabled="activeActionId === file.id"
                      :title="$t('buttons.download')"
                      @click="handleDownloadExisting(file)"
                    >
                      <svg
                        v-if="activeActionId === file.id && currentAction === 'download'"
                        class="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>

                    <button
                      class="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      :disabled="activeActionId === file.id"
                      :title="$t('buttons.delete')"
                      @click="handleDeleteExisting(file)"
                    >
                      <svg
                        v-if="activeActionId === file.id && currentAction === 'delete'"
                        class="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        />
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="step === 'theme'" class="p-4 flex flex-col h-[300px]">
            <div
              v-if="templateStore.isLoading"
              class="flex-1 flex items-center justify-center"
            >
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"
              />
            </div>

            <div
              v-else-if="templateStore.error"
              class="flex-1 flex items-center justify-center text-red-500 text-sm text-center"
            >
              {{ templateStore.error }}
            </div>

            <div v-else class="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
              <button
                v-for="template in templateStore.templates"
                :key="template.value"
                class="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                :class="
                  selectedTemplate === template.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                "
                @click="selectedTemplate = template.value"
              >
                <span class="font-medium text-slate-800 dark:text-slate-200">{{
                  template.value
                }}</span>
                <svg
                  v-if="selectedTemplate === template.value"
                  class="w-5 h-5 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                :disabled="!selectedTemplate || isStartingDownload"
                @click="executeDownload"
              >
                <svg
                  v-if="isStartingDownload"
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
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {{ $t("buttons.download") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { BookModel } from "@/types/bookModel";
import type {
  DownloadBook,
  DownloadBookParams,
  DownloadBookStatus,
  ExportBookFormat,
} from "@/types/book";

const downloadStore = useDownloadStore();

const {
  downloads: downloadedBooks,
  meta,
  isLoading: isHistoryLoading,
  error: historyError,
} = storeToRefs(downloadStore);

const downloadService = useDownloadService();
const bookModelStore = useBookModelStore();
const templateStore = useTemplateStore();

const props = defineProps<{
  modelValue: boolean;
  htmlContent?: string;
  jsonContent?: BookModel | null;
  bookId: number;
  fileName?: string;
  templateName?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  success: [];
  advanced: [];
}>();

type Step = "format" | "theme";
const step = ref<Step>("format");
const selectedFormat = ref<ExportBookFormat | null>(null);
const selectedTemplate = ref<string | null>(null);

const isStartingDownload = ref(false);

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = computed(() =>
  Math.max(1, Math.ceil((meta.value?.total || 0) / itemsPerPage.value))
);
const activeActionId = ref<number | null>(null);
const currentAction = ref<"download" | "delete" | null>(null);

const statusColors: Record<DownloadBookStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  removed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

const fetchDownloadHistory = async (): Promise<void> => {
  const offset = (currentPage.value - 1) * itemsPerPage.value;

  await downloadStore.fetchDownloadList(props.bookId, {
    limit: itemsPerPage.value,
    offset: offset,
    sort_by: "created_at",
    sort_desc: true,
  });
};

const changePage = async (page: number): Promise<void> => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await fetchDownloadHistory();
};

const handleDownloadExisting = async (file: DownloadBook): Promise<void> => {
  activeActionId.value = file.id;
  currentAction.value = "download";
  try {
    await downloadService.downloadCompleteBook(props.bookId, file.id);
  } catch (error) {
    console.error("Failed to download existing file:", error);
  } finally {
    activeActionId.value = null;
    currentAction.value = null;
  }
};

const handleDeleteExisting = async (file: DownloadBook): Promise<void> => {
  activeActionId.value = file.id;
  currentAction.value = "delete";
  try {
    await downloadStore.removeDownload(props.bookId, file.id);
    if (downloadedBooks.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
    await fetchDownloadHistory();
  } catch (error) {
    console.error("Failed to delete file:", error);
  } finally {
    activeActionId.value = null;
    currentAction.value = null;
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

if (!props.templateName && templateStore.templates.length === 0) {
  templateStore.fetchTemplates();
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      step.value = "format";
      selectedFormat.value = null;
      selectedTemplate.value = null;
      currentPage.value = 1;
      fetchDownloadHistory();
    }

    if (!props.templateName && templateStore.templates.length === 0) {
      templateStore.fetchTemplates();
    }
  },
  { immediate: true }
);

const closeModal = (): void => {
  emit("update:modelValue", false);
};

const goBackToFormats = (): void => {
  step.value = "format";
  selectedFormat.value = null;
};

const handleFormatSelect = async (format: ExportBookFormat): Promise<void> => {
  selectedFormat.value = format;

  if (props.templateName) {
    selectedTemplate.value = props.templateName;
    await executeDownload();
  } else {
    step.value = "theme";
  }
};

const triggerDownloadBlob = (blob: Blob, extension: string): void => {
  const name = props.fileName || "book-export";
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const downloadJson = async (): Promise<void> => {
  const blob = new Blob([JSON.stringify(props.jsonContent, null, 2)], {
    type: "application/json",
  });
  triggerDownloadBlob(blob, "json");
  currentPage.value = 1;
  await fetchDownloadHistory();
  closeModal();
};

const executeDownload = async (): Promise<void> => {
  if (!selectedTemplate.value || !selectedFormat.value) return;

  try {
    if (selectedFormat.value === "pdf") {
      isStartingDownload.value = true;
      const params: DownloadBookParams = {
        format: "pdf",
        characters: bookModelStore.getPreparedCharacters(),
        template: selectedTemplate.value,
      };
      await downloadService.downloadBookStart(props.bookId, params);
      emit("success");
    } else if (selectedFormat.value === "html" && props.htmlContent) {
      const blob = new Blob([props.htmlContent], { type: "text/html;charset=utf-8" });
      triggerDownloadBlob(blob, "html");
      emit("success");
    }
    currentPage.value = 1;
    await fetchDownloadHistory();
    closeModal();
  } catch (error) {
    console.error("Download start failed:", error);
  } finally {
    isStartingDownload.value = false;
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
