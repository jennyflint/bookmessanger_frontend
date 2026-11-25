import type {
  AvatarItems,
  DeleteAvatarResponse,
  UserBookAvatar,
  UserBookAvatarList,
} from '@/types/avatar'

export const useAvatarService = (): {
  getAvatarList: (limit?: number) => Promise<AvatarItems>
  uploadAvatar: (file: File) => Promise<UserBookAvatar>
  getMyAvatars: () => Promise<UserBookAvatarList>
  deleteAvatar: (id: number) => Promise<DeleteAvatarResponse>
} => {
  const api = useApi()

  const getAvatarList = async (limit = 30): Promise<AvatarItems> => {
    const response = await api.get<AvatarItems>(
      `/avatar/list?limit=${limit}`
    );
    return response || {};
  }

  const uploadAvatar = (file: File): Promise<UserBookAvatar> => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<UserBookAvatar>('/avatar/upload', formData)
  }

  const getMyAvatars = async (): Promise<UserBookAvatarList> => {
    const response = await api.get<UserBookAvatarList>('/avatar/my')
    return { items: response?.items ?? [] }
  }

  const deleteAvatar = (id: number): Promise<DeleteAvatarResponse> => {
    return api.delete<DeleteAvatarResponse>(`/avatar/my/${id}`)
  }

  return {
    getAvatarList,
    uploadAvatar,
    getMyAvatars,
    deleteAvatar,
  }
}
