<template>
  <div v-if="shouldShow" class="mt-6 flex items-center justify-between">
    <p class="text-sm text-slate-500">{{ $t("pagination.page") }} {{ currentPage }}</p>
    <div class="flex space-x-2">
      <button
        :disabled="isFirstPage || pending"
        class="p-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
        @click="emit('prev')"
      >
        {{ $t("pagination.prev") }}
      </button>

      <button
        :disabled="isLastPage || pending"
        class="p-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
        @click="emit('next')"
      >
        {{ $t("pagination.next") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookPaginationProps } from "@/types/propsComponent";

const props = withDefaults(defineProps<BookPaginationProps>(), {
  pending: false,
  offset: 0,
  limit: 10,
  total: 0,
});

const emit = defineEmits<{
  (e: 'next' | 'prev'): void
}>()

const safeOffset = computed(() => props.offset ?? 0);
const safeLimit = computed(() => props.limit ?? 10);
const safeTotal = computed(() => props.total ?? 0);

const currentPage = computed(() => Math.floor(safeOffset.value / safeLimit.value) + 1);
const isFirstPage = computed(() => safeOffset.value === 0);
const isLastPage = computed(() => safeOffset.value + safeLimit.value >= safeTotal.value);

const shouldShow = computed(() => !props.pending && safeTotal.value > 0);
</script>
