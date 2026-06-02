<template>
  <div>
    <book-model-character-list-component :avatars="avatarResponse?.items || []" />
    <book-model-sentence-component />
  </div>
</template>

<script setup lang="ts">

import type { BookModel } from "~/types/bookModel"
import type { AvatarItems } from "~/types/avatar"

const route = useRoute()
const id = route.params.id

const bookModelService = useBookModelService()
const avatarService = useAvatarService()
const bookModelStore = useBookModelStore()

const { data: response} = await useAsyncData<BookModel>(
  "book-model", 
  () => bookModelService.getBookModel(Number(id))
);

const { data: avatarResponse } = await useAsyncData<AvatarItems>(
  "avatar-list", 
  () => avatarService.getAvatarList(100)
);

watch(response, (newData) => {
  if (newData) {
    bookModelStore.setBookModel(newData)
  }
}, { immediate: true })

watch(avatarResponse, (newData) => {
  if (newData && newData.items) {
    
    bookModelStore.setAvailableAvatars(newData)
    bookModelStore.assignAvatarsToCharacters()
  }
}, { immediate: true })

onUnmounted(() => {
  bookModelStore.clearBookModel()
})
</script>