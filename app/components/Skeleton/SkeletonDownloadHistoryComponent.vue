<template>
  <div class="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
    <div
      v-for="i in count"
      :key="i"
      class="flex items-center p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 animate-pulse"
    >
      <div class="flex-shrink-0 w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700"/>

      <div class="ml-3 flex-1 min-w-0 space-y-2">
        <div class="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"/>
        
        <div class="flex items-center gap-2 mt-0.5">
          <div class="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-20"/> <div class="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full w-16"/> </div>
      </div>

      <div class="flex items-center ml-2 gap-1">
        <div class="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700"/>
        <div class="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), {
  count: 5
});
</script>

<style scoped>
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