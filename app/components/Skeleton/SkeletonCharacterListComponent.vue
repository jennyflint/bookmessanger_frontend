<template>
    
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center space-x-4 animate-pulse"
    >
      <div class="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0"/>

      <div class="flex-1 space-y-2">
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"/>
        <div class="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"/>
        
        <div class="flex gap-1.5 mt-2">
          <div class="h-4 w-10 bg-slate-100 dark:bg-slate-700/50 rounded-md"/>
          <div class="h-4 w-12 bg-slate-100 dark:bg-slate-700/50 rounded-md"/>
          <div class="h-4 w-8 bg-slate-100 dark:bg-slate-700/50 rounded-md"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), {
  count: 8
});
</script>