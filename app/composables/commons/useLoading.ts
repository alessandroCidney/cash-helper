export function useLoading<T = Record<string, boolean>>(initialValues: T) {
  const loadingStatuses = ref(initialValues)

  const somethingIsLoading = computed(() => Object.values(loadingStatuses.value).some(item => item === true))

  return {
    loadingStatuses,
    somethingIsLoading,
  }
}
