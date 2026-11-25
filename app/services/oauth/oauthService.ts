import type { OauthService } from '~/types/oauth' 
import { withQuery } from 'ufo'

export const useOauthService = (): OauthService => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const apiVersion = config.public.defaultApiVersion
  const appUrl = config.public.appUrl
  const baseURL = `${apiBase}/${apiVersion}`
  const localePath = useLocalePath()
  const loginViaGoogle = async (): Promise<void> => {
    // Built on click: the language can be switched on the login page
    const redirect_url = `${appUrl}${localePath('/dashboard')}`
    // There is no /auth/error page for localePath to resolve, so only the language prefix is reused
    const localePrefix = localePath('/dashboard').replace(/\/dashboard$/, '')
    const fallback_url = `${appUrl}${localePrefix}/auth/error`
    const url = withQuery(`${baseURL}/auth/login-via-google`, {
      redirect_url: redirect_url,
      fallback_url: fallback_url
    })
    navigateTo(url, {external: true})
  }
  
  const loginFromProvider = async (provider: string): Promise<void> => {
    if (provider === 'google') {
      await loginViaGoogle();
    }
  }
  
  return {
    loginFromProvider
  }
}