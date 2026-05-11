export interface OauthService {
  loginFromProvider: (provider: string) => Promise<void>
}