import type { AvatarItems } from '@/types/avatar'

export const useAvatarService = (): {
  getAvatarList: (limit?: number) => Promise<AvatarItems>
} => {
  const api = useApi()

  const getAvatarList = async (limit = 30): Promise<AvatarItems> => {
    const response = await api.get<AvatarItems>(
      `/avatar/list?limit=${limit}`
    );
    return response || {};
  }

  return {
    getAvatarList,
  }
}
