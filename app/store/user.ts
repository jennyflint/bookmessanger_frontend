import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value && !!token.value)

  function setUser(newUser: User, newToken: string): void {
    user.value = newUser
    token.value = newToken

    const authCookie = useCookie('auth_token')
    authCookie.value = newToken
  }

  function logout(): void {
    user.value = null
    token.value = null
    const authCookie = useCookie('auth_token')
    authCookie.value = null
    navigateTo('/login')
  }

  return {
    user,
    token,
    isLoggedIn,
    setUser,
    logout
  }
})