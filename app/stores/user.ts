import type { User } from "~/types/user"

export const useUserStore = defineStore('user', () => {
  const config = useRuntimeConfig()
  const appHost = config.public.appHost
  const cookieOptions = {
    domain: appHost,
    default: (): null => null
  }

  const accessToken = useCookie<string | null>('access_token', cookieOptions)
  const refreshToken = useCookie<string | null>('refresh_token', cookieOptions)
  const user = useCookie<User | null>('user_data', cookieOptions)
  const isAuthenticated = computed(() => !!accessToken.value || !!refreshToken.value)

  const logout = (): void => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

  }

  const refreshSession = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      logout()
    }
    return true
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    logout,
    refreshSession
  }
})
