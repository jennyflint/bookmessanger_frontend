<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6"/>
  <div class="divide-y divide-slate-100 dark:divide-slate-700">
    <div
      v-for="i in count"
      :key="i"
      class="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 gap-4 md:gap-0 animate-pulse"
    >
      <div class="col-span-1 md:col-span-6 flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0"/>
        
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"/>
          <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/4"/>
        </div>
      </div>
      
      <div class="col-span-1 md:col-span-2 flex md:block items-center justify-between">
        <span class="md:hidden text-xs text-slate-400 font-medium mr-2">{{ $t("book.status") }}:</span>
        <div class="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded"/>
      </div>
      
      <div class="col-span-1 md:col-span-2 flex md:block items-center justify-between">
        <span class="md:hidden text-xs text-slate-400 font-medium mr-2">{{ $t("book.date") }}:</span>
        <div class="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"/>
      </div>

      <div class="col-span-1 md:col-span-2 flex items-center justify-end space-x-2">
        <div class="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700"/>
        <div class="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), {
  count: 5
});
</script>