import type { BookModel } from "~/types/bookModel";
import type { AvatarItems } from "~/types/avatar";

export const useBookStore = defineStore('book', () => {
  const book = ref<BookModel | null>(null)
  const availableAvatars = ref<string[]>([])

  const setBook = (data: BookModel): void => {
    book.value = data
  }

  const updateCharacterAvatar = (characterId: number, newAvatarUrl: string): void => {
    if (!book.value) return

    const character = book.value.characters.find(c => c.id === characterId)
    
    if (character) {
      character.avatar = newAvatarUrl
    } else {
      console.warn(`Character with ID ${characterId} not found`)
    }
  }

  const getCharacterAvatar = (characterId: number | null): string | null => {
    if (!book.value || !characterId) return null
    const character = book.value.characters.find(c => c.id === characterId)
    return character ? character.avatar : null
  }

  const setAvailableAvatars = (avatars: AvatarItems): void => {
    availableAvatars.value = avatars.items
  }

  const assignAvatarsToCharacters = (): void => {
    if (!book.value) return

    let avatarIndex = 0;
    for (const character of book.value.characters) {
      if (avatarIndex < availableAvatars.value.length) {
        const newAvatarUrl = availableAvatars.value[avatarIndex];
        if (newAvatarUrl) {
          character.avatar = newAvatarUrl;
          avatarIndex++;
        }
      }
    }
  }

  const clearBook = (): void => {
    book.value = null
    availableAvatars.value = []
  }

  return {
    book,
    setBook,
    updateCharacterAvatar,
    getCharacterAvatar,
    setAvailableAvatars,
    assignAvatarsToCharacters,
    clearBook
  }
})