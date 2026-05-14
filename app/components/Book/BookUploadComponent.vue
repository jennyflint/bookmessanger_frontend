<template>
  <div
    class="max-w-6xl mx-auto p-4 sm:p-6 rounded-3xl shadow-2xl bg-white/85 backdrop-blur-xl border border-white"
  >
    <div
      :class="[
        'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ease-in-out',
        isDragging
          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/50',
      ]"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-sm"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{ $t("upload.add_new_book") }}
        </h2>
        <p class="mt-2 text-gray-600 font-medium">
          {{ $t("upload.upload_file_to_convert") }}
        </p>
      </div>

      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept=".epub,.pdf,.txt"
        @change="handleFileSelect"
      >

      <div v-if="!selectedFile" class="space-y-4 pointer-events-none">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="text-gray-600">
          <span class="font-semibold text-indigo-600">{{
            $t("upload.click_to_select_file")
          }}</span>
          {{ $t("upload.or_drag_and_drop") }}
        </div>
        <p class="text-xs text-gray-500">{{ $t("upload.supported_formats") }}</p>
      </div>

      <div v-else class="flex flex-col items-center space-y-4">
        <div class="p-4 bg-green-50 rounded-full text-green-600">
          <svg
            class="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="text-lg font-medium text-gray-900 truncate max-w-xs mx-auto">
            {{ selectedFile.name }}
          </p>
          <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
        </div>
      </div>
    </div>
    <div
      v-if="error"
      class="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium flex items-center"
    >
      <svg
        class="w-5 h-5 mr-2 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </div>

    <div class="mt-8 flex gap-4">
      <button
        v-if="selectedFile"
        class="flex-1 px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        @click="removeFile"
      >
        {{ $t("cancel") }}
      </button>

      <button
        :disabled="!selectedFile || isUploading"
        :class="[
          'flex-1 flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-semibold rounded-xl text-white transition-all',
          !selectedFile || isUploading
            ? 'bg-indigo-300 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        ]"
        @click="uploadBook"
      >
        <span v-if="isUploading" class="flex">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
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
          {{ $t("processing") }}...
        </span>
        <span v-else>{{ $t("upload.task_description") }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const bookService = useBookService();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const error = ref("");
const isUploading = ref(false);

const ALLOWED_EXTENSIONS = new Set(["txt"]);
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const triggerFileInput = (): void => {
  if (!selectedFile.value && fileInput.value) {
    fileInput.value.click();
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateFile = (file: File | null): boolean => {
  error.value = "";

  if (!file) {
    return false;
  }

  const fileName = file.name;
  if (!fileName) {
    return false;
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) {
    return false;
  }
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    error.value = $t("upload.invalid_file_format");
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    error.value = $t("upload.file_too_large");

    return false;
  }

  return true;
};

const handleDrop = (e: DragEvent): void => {
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  const file = files?.[0];
  if (file && validateFile(file)) {
    selectedFile.value = file;
  }
};

const handleFileSelect = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    const file = files[0];

    if (file && validateFile(file)) {
      selectedFile.value = file;
    }
  }
};

const removeFile = (): void => {
  selectedFile.value = null;
  error.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const uploadBook = async (): Promise<void> => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  error.value = "";

  try {
    await bookService.uploadBook(selectedFile.value);

    removeFile();

    await refreshNuxtData("books-list");
  } catch (err) {
    error.value = $t("upload.upload_error");
    console.error(err);
  } finally {
    isUploading.value = false;
  }
};
</script>
