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
const bookStore = useBookStore()

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
    bookStore.setBook(newData)
  }
}, { immediate: true })

watch(avatarResponse, (newData) => {
  if (newData && newData.items) {
    
    bookStore.setAvailableAvatars(newData)

    bookStore.assignAvatarsToCharacters()
  }
}, { immediate: true })

onUnmounted(() => {
  bookStore.clearBook()
})
</script>