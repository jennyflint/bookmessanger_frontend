import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserBookAvatar } from '@/types/avatar'
import { useAvatarService } from '~/services/avatarService'

/**
 * Avatars uploaded by the current user (GET /avatar/my).
 * Loaded once, on the first open of the avatar modal, and then kept in sync
 * locally after uploads and deletes.
 */
export const useUserAvatarsStore = defineStore('userAvatars', () => {
  const avatars = ref<UserBookAvatar[]>([])
  const isLoaded = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const isUploading = ref<boolean>(false)
  const deletingId = ref<number | null>(null)

  let pendingRequest: Promise<void> | null = null

  /** Throws on failure so the caller can show the error. */
  const fetchMyAvatars = (force = false): Promise<void> => {
    if (isLoaded.value && !force) return Promise.resolve()

    pendingRequest ??= (async (): Promise<void> => {
      isLoading.value = true
      try {
        const response = await useAvatarService().getMyAvatars()
        avatars.value = response.items
        isLoaded.value = true
      } finally {
        isLoading.value = false
        pendingRequest = null
      }
    })()

    return pendingRequest
  }

  const uploadAvatar = async (file: File): Promise<UserBookAvatar> => {
    isUploading.value = true
    try {
      const avatar = await useAvatarService().uploadAvatar(file)
      // The backend lists newest first, keep the same order
      avatars.value = [avatar, ...avatars.value.filter((item) => item.id !== avatar.id)]
      return avatar
    } finally {
      isUploading.value = false
    }
  }

  /** Drops an avatar from the local list without calling the API. */
  const removeLocal = (id: number): void => {
    avatars.value = avatars.value.filter((item) => item.id !== id)
  }

  const deleteAvatar = async (id: number): Promise<void> => {
    deletingId.value = id
    try {
      await useAvatarService().deleteAvatar(id)
      removeLocal(id)
    } finally {
      deletingId.value = null
    }
  }

  const reset = (): void => {
    avatars.value = []
    isLoaded.value = false
  }

  return {
    avatars,
    isLoaded,
    isLoading,
    isUploading,
    deletingId,
    fetchMyAvatars,
    uploadAvatar,
    deleteAvatar,
    removeLocal,
    reset,
  }
})
