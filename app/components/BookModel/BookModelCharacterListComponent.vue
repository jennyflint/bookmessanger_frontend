<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg
            class="w-6 h-6 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {{ $t("book_model.characters.title") }}
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ $t("book_model.characters.description") }}
        </p>
      </div>
      <span class="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full text-sm font-semibold border border-indigo-100 dark:border-indigo-800">
        {{ book?.characters?.length || 0 }}
      </span>
    </div>

    <div v-if="!book?.characters || book.characters.length === 0" class="text-center py-12 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      {{ $t("book_model.characters.not_found") }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="char in book.characters"
        :key="char.id"
        class="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center space-x-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300"
      >
        <div class="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
          <img
            v-if="char.avatar"
            :src="char.avatar" 
            :alt="char.name" 
            class="w-full h-full object-contain"
            loading="lazy"
          >
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ char.name }}
          </h3>
          <p v-if="char.full_name" class="text-xs text-slate-400 truncate mt-0.5">
            {{ char.full_name }}
          </p>
          
          <div class="flex flex-wrap gap-1 mt-1.5 overflow-hidden max-h-[18px]">
            <span 
              v-for="(alias, index) in char.names.slice(0, 3)" 
              :key="index"
              class="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded-md font-medium"
            >
              {{ alias }}
            </span>
            <span v-if="char.names.length > 3" class="text-[9px] text-indigo-500 font-semibold px-0.5 self-center">
              +{{ char.names.length - 3 }}
            </span>
          </div>
        </div>
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900/95 dark:bg-slate-950/95 text-white text-xs rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-20 backdrop-blur-sm">
          <p class="font-bold border-b border-slate-700 pb-1 mb-1.5 text-indigo-400">{{ $t("book_model.characters.name_forms") }}:</p>
          <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
            <span 
              v-for="(alias, index) in char.names" 
              :key="index"
              class="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded text-[10px]"
            >
              {{ alias }}
            </span>
          </div>
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900/95 dark:bg-slate-950/95 rotate-45"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const bookStore = useBookStore()
const { book } = storeToRefs(bookStore)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 9999px;
}
</style>