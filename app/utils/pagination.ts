export const DEFAULT_ITEMS_PER_PAGE = 10

export function getPaginationData(arr: unknown[]) {
  const loadedPages = Math.ceil(arr.length / DEFAULT_ITEMS_PER_PAGE) || 1

  const lastPageIsFull = arr.length % DEFAULT_ITEMS_PER_PAGE === 0

  const quantityToCompleteLastPage = lastPageIsFull
    ? 0
    : DEFAULT_ITEMS_PER_PAGE - arr.length % DEFAULT_ITEMS_PER_PAGE

  return {
    loadedPages,
    lastPageIsFull,
    quantityToCompleteLastPage,
  }
}
