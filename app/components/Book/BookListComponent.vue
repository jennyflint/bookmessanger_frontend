<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {{ $t("book_list.uploaded_books") }}
      </h2>
      <span
        v-if="response?.meta"
        class="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full text-sm font-semibold"
      >
        {{ $t("total") }}: {{ response.meta.total }}
      </span>
    </div>

    <div
      v-if="error"
      class="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200"
    >
      <p class="font-semibold">
        {{ $t("error.loading") }}
        <button class="underline" @click="refresh()">{{ $t("error.retry") }}</button>
      </p>
    </div>

    <div
      v-else-if="pending"
      class="flex justify-center py-20 animate-pulse text-slate-500"
    >
      {{ $t("upload.loading") }}
    </div>
    <div
      v-else-if="response?.data"
      class="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider"
          >
            <tr>
              <th class="px-6 py-4">{{ $t("book.name") }}</th>
              <th class="px-6 py-4">{{ $t("book.status") }}</th>
              <th class="px-6 py-4">{{ $t("book.jobs") }}</th>
              <th class="px-6 py-4">{{ $t("book.date") }}</th>
              <th class="px-6 py-4 text-right">{{ $t("book.actions") }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr
              v-for="book in response.data"
              :key="book.id"
              class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3 overflow-hidden">
                  <div
                    class="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 shrink-0"
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
                        stroke-width="1.5"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div
                    class="truncate font-medium text-slate-800 dark:text-slate-200"
                    :title="book.original_name"
                  >
                    {{ book.original_name }}
                    <p class="text-[10px] text-slate-400 font-normal">
                      ID: {{ book.id }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusClass(book)"
                  class="px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-tight"
                >
                  {{ getStatusLabel(book) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex -space-x-1 overflow-hidden">
                  <div
                    v-for="job in book.jobs"
                    :key="job.id"
                    :class="job.count_attempts > 0 ? 'bg-red-500' : 'bg-emerald-500'"
                    class="inline-block h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-800"
                    :title="`Job #${job.id}: ${$t('try')} ${job.count_attempts}`"
                  />
                  <span v-if="!book.jobs?.length" class="text-xs text-slate-400">—</span>
                </div>
              </td>
              <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                <ClientOnly fallback-tag="span" fallback="{{ $t('downloading') }}...">
                  {{ formatDate(book.created_at) }}
                </ClientOnly>
              </td>
              <td class="px-6 py-4 text-right text-sm">
                <button
                  v-if="book.complete_books?.length"
                  class="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg transition-colors border border-emerald-200/50 dark:border-emerald-800/50"
                  @click="selectedBook = book"
                >
                  <svg
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
                  <span>{{ $t("files") }} ({{ book.complete_books.length }})</span>
                </button>
                <span v-else class="text-xs text-slate-300 dark:text-slate-600 italic">{{
                  $t("upload.loading")
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <book-pagination-component
      :offset="params.offset"
      :limit="params.limit"
      :total="response?.meta?.total"
      :pending="pending"
      @next="nextPage"
      @prev="prevPage"
    />

    <book-modal-download-component v-model="selectedBook" />
  </div>
</template>

<script setup lang="ts">
import type { RequestParams } from "~/types/api";
import type { BookDetailResponse } from "~/types/book";
const bookService = useBookService();

const selectedBook = ref<BookDetailResponse | null>(null);

const params = ref<RequestParams>({
  limit: 5,
  offset: 0,
  sort_by: "created_at",
  sort_desc: true,
});

const { data: response, pending, error, refresh } = await useAsyncData("books-list", () =>
  bookService.getBooks(params.value)
);

const nextPage = async (): Promise<void> => {
  if (params.value.offset === undefined || params.value.limit === undefined) return;

  if (
    response.value?.meta &&
    params.value.offset + params.value.limit < response.value.meta.total
  ) {
    params.value.offset += params.value.limit;
    await refresh();
  }
};

const prevPage = async (): Promise<void> => {
  if (params.value.offset === undefined || params.value.limit === undefined) return;

  if (params.value.offset > 0) {
    params.value.offset = Math.max(0, params.value.offset - params.value.limit);
    await refresh();
  }
};

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const getStatusLabel = (book: BookDetailResponse): string => {
  if (book.complete_books?.length > 0) return $t("done");
  if (book.jobs?.length > 0) return $t("processing");
  return $t("pending");
};

const getStatusClass = (book: BookDetailResponse): string => {
  if (book.complete_books?.length > 0)
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800";
  if (book.jobs?.length > 0)
    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800";
  return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800";
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
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
