<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {{ $t("book_list.uploaded_books") }}
      </h2>
      <span
        v-if="meta"
        class="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full text-sm font-semibold"
      >
        {{ $t("total") }}: {{ meta.total }}
      </span>
    </div>

    <div v-if="error" class="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
      <p class="font-semibold">
        {{ $t("error.loading") }}
        <button class="underline" @click="refresh()">{{ $t("error.retry") }}</button>
      </p>
    </div>
    <div v-else-if="isLoading" class="flex justify-center py-20 animate-pulse text-slate-500">
      {{ $t("upload.loading") }}
    </div>

    <div v-else-if="books && books.length > 0" class="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <div class="hidden md:grid grid-cols-12 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider px-6 py-4">
        <div class="col-span-6">{{ $t("book.name") }}</div>
        <div class="col-span-2">{{ $t("book.status") }}</div>
        <div class="col-span-2">{{ $t("book.date") }}</div>
        <div class="col-span-2 text-right">{{ $t("book.actions") }}</div>
      </div>
      <book-list-rows-component/>
    </div>

    <book-pagination-component
      :offset="params.offset"
      :limit="params.limit"
      :total="meta?.total"
      :pending="isLoading"
      @next="nextPage"
      @prev="prevPage"
    />
  </div>
</template>

<script setup lang="ts">
import type { RequestParams } from "~/types/api";

const bookStore = useBookStore();
const { books, meta, isLoading, error } = storeToRefs(bookStore);

const params = ref<RequestParams>({
  limit: 5,
  offset: 0,
  sort_by: "created_at",
  sort_desc: true,
});

await useAsyncData("books-list", () => bookStore.fetchBooks(params.value));

const refresh = async (): Promise<void> => {
  await bookStore.fetchBooks(params.value);
};

const nextPage = async (): Promise<void> => {
  if (params.value.offset === undefined || params.value.limit === undefined) return;
  if (meta.value && params.value.offset + params.value.limit < meta.value.total) {
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