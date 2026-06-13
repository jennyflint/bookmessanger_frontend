<template>
  <div class="divide-y divide-slate-100 dark:divide-slate-700">
    <div
      v-for="book in bookStore.books"
      :key="book.id"
      :class="[
        'grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 transition-all gap-4 md:gap-0',
        isBookCompleted(book)
          ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-sm'
          : 'hover:bg-slate-50/30 dark:hover:bg-slate-700/10 opacity-85',
      ]"
      @click="navigateToBook(book)"
    >
      <div class="col-span-1 md:col-span-6 flex items-center space-x-3 overflow-hidden">
        <div
          :class="[
            'p-2 rounded-lg shrink-0',
            isBookCompleted(book)
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
          ]"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="truncate font-medium text-slate-800 dark:text-slate-200" :title="book.original_name">
          {{ book.original_name }}
          <p class="text-[10px] text-slate-400 font-normal">ID: {{ book.id }}</p>
        </div>
      </div>
      
      <div class="col-span-1 md:col-span-2 flex md:block items-center justify-between">
        <span class="md:hidden text-xs text-slate-400 font-medium mr-2">{{ $t("book.status") }}:</span>
        <span :class="getStatusClass(book)" class="px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-tight">
          {{ getStatusLabel(book) }}
        </span>
      </div>
      
      <div class="col-span-1 md:col-span-2 text-xs text-slate-500 dark:text-slate-400 flex md:block items-center justify-between">
        <span class="md:hidden text-xs text-slate-400 font-medium mr-2">{{ $t("book.date") }}:</span>
        <ClientOnly fallback-tag="span" fallback="...">
          {{ formatDate(book.created_at) }}
        </ClientOnly>
      </div>

      <div class="col-span-1 md:col-span-2 flex items-center justify-end space-x-2" @click.stop>
        <button
          v-if="isBookCompleted(book)"
          class="p-2 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          @click="openDownloadPopup(book)"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>

        <button
          class="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          @click="$emit('delete', book)"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <modal-download-component
      v-if="selectedBook"
      v-model="isOpenDownloadPopup"
      :book-id="selectedBook.id" 
    />
  </div>
</template>

<script setup lang="ts">
import { useBookStore } from '~/stores/book';
import type { BookDetailResponse } from "~/types/book";
const bookStore = useBookStore();

defineEmits<{
  'delete': [book: BookDetailResponse];
}>();

const selectedBook = ref<BookDetailResponse | null>(null);
const isOpenDownloadPopup = ref(false);

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const getLatestActionStatus = (book: BookDetailResponse): string | null => {
  if (!book.actions || book.actions.length === 0) return null;
  const sortedActions = [...book.actions].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  return sortedActions[0]?.status || null;
};

const getStatusLabel = (book: BookDetailResponse): string => {
  if (book.complete_books?.length > 0) return $t("status_list.completed");
  const latestStatus = getLatestActionStatus(book);
  
  const statuses: Record<string, string> = {
    new: $t("status_list.new"),
    pending: $t("status_list.pending"),
    processing: $t("status_list.processing"),
    completed: $t("status_list.completed"),
    failed: $t("status_list.failed")
  };
  
  return latestStatus ? (statuses[latestStatus] || $t("status_list.pending")) : $t("status_list.pending");
};

const getStatusClass = (book: BookDetailResponse): string => {

  const latestStatus = getLatestActionStatus(book);
  if (latestStatus === "processing") {
    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800";
  } else if (latestStatus === "failed") {
    return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800";
  } else if (latestStatus === "completed") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800";
  }
  return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800";
};

const isBookCompleted = (book: BookDetailResponse): boolean => {
  if (book.complete_books && book.complete_books.length > 0) return true;
  return getLatestActionStatus(book) === "completed";
};

const navigateToBook = (book: BookDetailResponse): void => {
  if (isBookCompleted(book)) {
    navigateTo(`/book/model/${book.id}`);
  }
};

const openDownloadPopup = (book: BookDetailResponse): void => {
  isOpenDownloadPopup.value = true;
  selectedBook.value = book;
};
</script>