<template>
  <div class="flex items-center justify-between mb-6">
    <div>
      <div class="flex items-center gap-3">
        <navigation-back-component />
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
      </div>
    
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-11">
        {{ $t("book_model.characters.description") }}
      </p>
    </div>

    <span class="px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full text-sm font-semibold border border-indigo-100 dark:border-indigo-800">
      {{ bookModel?.characters?.length || 0 }}
    </span>
  </div>

  <div v-if="!bookModel?.characters || bookModel.characters.length === 0" class="text-center py-12 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
    {{ $t("book_model.characters.not_found") }}
  </div>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <div
      v-for="char in bookModel.characters"
      :key="char.id"
      class="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center space-x-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300"
    >
      <div
        class="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer relative"
        @click="openAvatarModal(char.id)"
      >
        <img
          v-if="char.avatar"
          :src="char.avatar" 
          :alt="char.name" 
          class="w-full h-full object-contain"
          loading="lazy"
        >
        <div class="absolute inset-0 bg-black/40 z-20 hidden group-hover:flex items-center justify-center text-white">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        
        <div v-if="editingCharId === char.id" class="flex flex-col gap-1.5 z-10 relative">
          <div class="flex items-center gap-1">
            <input 
              v-model="tempCharName" 
              class="w-full text-sm font-semibold px-2 py-1 border border-indigo-300 dark:border-indigo-600 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
              autofocus
              @keyup.enter="saveName(char)"
              @keyup.esc="cancelEditing"
            >
            <button
              class="p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-md transition-colors"
              :title="$t('buttons.save')"
              @click="saveName(char)">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M5 13l4 4L19 7"/></svg>
            </button>
            <button
              class="p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
              :title="$t('cancel')"
              @click="cancelEditing">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div v-if="char.names.length > 0" class="flex flex-wrap gap-1 mt-0.5">
            <span class="text-[10px] text-slate-400 flex items-center mr-1">{{ $t('select') }}:</span>
            <button 
              v-for="(alias, index) in char.names" 
              :key="index"
              class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors border border-slate-200 dark:border-slate-600"
              @click="tempCharName = alias"
            >
              {{ alias }}
            </button>
          </div>
        </div>

        <div
          v-else
          class="group/name flex items-start justify-between cursor-pointer"
          @click="startEditingName(char)">
          <div class="relative">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors inline-block mr-1">
              {{ char.name }}
            </h3>
            <svg
              class="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover/name:opacity-100 inline-block transition-opacity -translate-y-0.5 absolute top-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            
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
        </div>
      </div>
    </div>
  </div>
  <modal-select-avatar-component
    v-model="isAvatarModalOpen"
    :available-avatars="bookModelStore.availableAvatars"
    @select="onAvatarSelected"
  />
</template>

<script setup lang="ts">

import type { CharacterModel } from '@/types/bookModel'

const bookModelStore = useBookModelStore()
const { bookModel } = storeToRefs(bookModelStore)
const isAvatarModalOpen = ref(false)
const selectedCharacterId = ref<number | null>(null)

const editingCharId = ref<number | null>(null)
const tempCharName = ref<string>('')

const startEditingName = (char: CharacterModel): void => {
  editingCharId.value = char.id
  tempCharName.value = char.name
}

const saveName = (char: CharacterModel): void => {
  if (tempCharName.value.trim()) {
    char.name = tempCharName.value.trim()
  }
  editingCharId.value = null
}

const cancelEditing = (): void => {
  editingCharId.value = null
}
const openAvatarModal = (characterId: number): void => {
  selectedCharacterId.value = characterId
  isAvatarModalOpen.value = true
}

const onAvatarSelected = (newAvatarUrl: string): void => {
  if (selectedCharacterId.value !== null) {
    bookModelStore.updateCharacterAvatar(selectedCharacterId.value, newAvatarUrl)
  }
}
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