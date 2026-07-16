<template>
  <div>
    <div class="max-w-6xl mx-auto p-4 sm:p-6">
      <div class="pb-2">
        <book-model-character-list-component
          v-if="!isAvatarPending"
          :avatars="avatarResponse?.items || []"
        />
        <skeleton-character-list-component v-else :count="16" />
      </div>

      <book-model-sentence-component />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BookModel } from "~/types/bookModel";
import type { AvatarItems } from "~/types/avatar";

const route = useRoute();
const id = computed(() => route.params.id);

const bookModelService = useBookModelService();
const avatarService = useAvatarService();
const bookModelStore = useBookModelStore();

const { data: response } = await useAsyncData<BookModel>(
  () => `book-model-${id.value}`,
  () => bookModelService.getBookModel(Number(id.value)),
  { lazy: true }
);

const {
  data: avatarResponse,
  pending: isAvatarPending,
} = await useAsyncData<AvatarItems>(
  "avatar-list",
  () => avatarService.getAvatarList(100),
  { lazy: true }
);

watch(
  response,
  (newData) => {
    if (newData) {
      bookModelStore.setBookModel(newData);
      if (bookModelStore.availableAvatars) {
        bookModelStore.assignAvatarsToCharacters();
      }
    }
  },
  { immediate: true }
);

watch(
  avatarResponse,
  (newData) => {
    if (newData && newData.items) {
      bookModelStore.setAvailableAvatars(newData);
      if (bookModelStore.bookModel) {
        bookModelStore.assignAvatarsToCharacters();
      }
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  bookModelStore.clearBookModel();
});
</script>