import type { TemplateList } from '@/types/template'

export const useTemplateStore = defineStore('template', () => {
  const templateService = useTemplateService()

  const templates = ref<TemplateList[]>([])
  const currentTemplateCode = ref<string | null>(null)
  
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchTemplates = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      templates.value = await templateService.getTemplateList()
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message || 'Cannot fetch template list'
      } else {
        error.value = 'Cannot fetch template list'
      }
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchTemplateByValue = async (value: string): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      currentTemplateCode.value = await templateService.getTemplateByValue(value)
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message || `Cannot fetch template: ${value}`
      } else {
        error.value = `Cannot fetch template: ${value}`
      }
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  const clearCurrentTemplate = (): void => {
    currentTemplateCode.value = null
  }

  return {
    templates,
    currentTemplateCode,
    isLoading,
    error,
    
    fetchTemplates,
    fetchTemplateByValue,
    clearCurrentTemplate
  }
})