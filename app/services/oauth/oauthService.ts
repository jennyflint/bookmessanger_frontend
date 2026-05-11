import type { OauthService } from '~/types/oauth' 
import { withQuery } from 'ufo'

export const useOauthService = (): OauthService => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const apiVersion = config.public.defaultApiVersion
  const appUrl = config.public.appUrl
  const baseURL = `${apiBase}/${apiVersion}`
  const redirect_url = `${appUrl}/dashboard`
  const fallback_url = `${appUrl}/auth/error`
  const loginViaGoogle = async (): Promise<void> => {
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