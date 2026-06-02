import type { BookModel } from "~/types/bookModel";
import type { AvatarItems } from "~/types/avatar";

export const useBookModelStore = defineStore('bookModel', () => {
  const bookModel = ref<BookModel | null>(null)
  const availableAvatars = ref<string[]>([])

  const setBookModel = (data: BookModel): void => {
    bookModel.value = data
  }

  const updateCharacterAvatar = (characterId: number, newAvatarUrl: string): void => {
    if (!bookModel.value) return

    const character = bookModel.value.characters.find(c => c.id === characterId)
    
    if (character) {
      character.avatar = newAvatarUrl
    } else {
      console.warn(`Character with ID ${characterId} not found`)
    }
  }

  const getCharacterAvatar = (characterId: number | null): string | null => {
    if (!bookModel.value || !characterId) return null
    const character = bookModel.value.characters.find(c => c.id === characterId)
    return character ? character.avatar : null
  }

  const setAvailableAvatars = (avatars: AvatarItems): void => {
    availableAvatars.value = avatars.items
  }

  const assignAvatarsToCharacters = (): void => {
    if (!bookModel.value) return

    let avatarIndex = 0;
    for (const character of bookModel.value.characters) {
      if (avatarIndex < availableAvatars.value.length) {
        const newAvatarUrl = availableAvatars.value[avatarIndex];
        if (newAvatarUrl) {
          character.avatar = newAvatarUrl;
          avatarIndex++;
        }
      }
    }
  }

  const getPreparedCharacters = (): object[] => {
    if (!bookModel.value) return []
    return bookModel.value.characters.map(character => ({
      id: character.id,
      name: character.name,
      avatar: character.avatar
    }))
  }

  const clearBookModel = (): void => {
    bookModel.value = null
    availableAvatars.value = []
  }

  return {
    bookModel,
    availableAvatars,
    setBookModel,
    updateCharacterAvatar,
    getCharacterAvatar,
    setAvailableAvatars,
    assignAvatarsToCharacters,
    getPreparedCharacters,
    clearBookModel
  }
})