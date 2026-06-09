<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import type { WebSocketPayload } from '~/types/event'
import type { DownloadBookStatus } from '~/types/book'
import { useDownloadStore } from '~/stores/downloadBook' 
import { useBookStore } from '~/stores/book'

const { connect } = useNotificationSocket()
const downloadStore = useDownloadStore() 
const bookStore = useBookStore()

let unsubscribe: (() => void) | null = null
const mapSocketStatus = (socketStatus: string): DownloadBookStatus => {
  if (socketStatus === 'processing') return 'pending'
  return socketStatus as DownloadBookStatus
}

onMounted(() => {
  unsubscribe = connect<WebSocketPayload>((payload: WebSocketPayload) => {
    if (payload?.type === 'book_converted') {
      const normalizedStatus = mapSocketStatus(payload.status)
      downloadStore.updateDownloadStatus(payload.convert_item_id, normalizedStatus)
    } 
    else if (payload?.type === 'create_book_model') {
      bookStore.updateBookActionStatus(payload.book_id, "book_parsing", payload.status)
    }
    
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>