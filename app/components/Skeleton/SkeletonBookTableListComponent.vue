<template>
  <div class="divide-y divide-slate-100 dark:divide-slate-700">
    <!--
      Text placeholders repeat the font and spacing classes of BookListRowsComponent,
      so a skeleton row is exactly as tall as a real one
    -->
    <div
      v-for="i in count"
      :key="i"
      class="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 gap-4 md:gap-0 animate-pulse"
    >
      <div class="col-span-1 md:col-span-6 flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0"/>

        <div class="flex-1 min-w-0">
          <div>
            <span class="inline-block w-3/4 text-xs rounded bg-slate-200 dark:bg-slate-700">&nbsp;</span>
          </div>
          <span class="inline-block mt-1 w-14 px-1.5 py-0.5 rounded text-[10px] border border-transparent bg-slate-100 dark:bg-slate-700/50">&nbsp;</span>
        </div>
      </div>

      <div class="col-span-1 md:col-span-2 flex md:block items-center justify-between">
        <span class="md:hidden text-xs text-slate-400 font-medium mr-2">{{ $t("book.status") }}:</span>
        <span class="inline-block w-20 px-2 py-1 rounded text-[10px] border border-transparent bg-slate-200 dark:bg-slate-700">&nbsp;</span>
      </div>

      <div class="col-span-1 md:col-span-2 text-xs flex md:block items-center justify-between">
        <span class="md:hidden text-xs text-slate-400 font-medium mr-2">{{ $t("book.date") }}:</span>
        <span class="inline-block w-24 rounded bg-slate-200 dark:bg-slate-700">&nbsp;</span>
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