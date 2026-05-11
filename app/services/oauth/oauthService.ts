import type { OauthService } from '~/types/oauth' 

export const useOauthService = (): OauthService => {
  const loginViaGoogle = async (): Promise<void> => {}
  
  const loginFromProvider = async (provider: string): Promise<void> => {
    if (provider === 'google') {
      await loginViaGoogle();
    }
  }
  
  return {
    loginFromProvider
  }
}