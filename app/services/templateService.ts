import type { TemplateList } from '@/types/template'


export const useTemplateService = (): {
  getTemplateList: () => Promise<TemplateList[]>,
  getTemplateByValue: (value: string) => Promise<string | null>
} => {
  const api = useApi()

  const getTemplateList = async (): Promise<TemplateList[]> => {
    const response = await api.get<TemplateList[]>(
      `/template/list`
    );
    return response || [];
  }

  const getTemplateByValue = async (value: string): Promise<string | null> => {
    const response = await api.get<string>(
      `/template/code/${value}`
    );
    return response || null;
  }

  return {
    getTemplateList,
    getTemplateByValue,
  }
}
