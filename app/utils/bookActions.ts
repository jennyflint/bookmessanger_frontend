import type { ActionResponse } from '~/types/action'

export const BOOK_PARSING_ACTION = 'book_parsing'

/**
 * Newest action of the given type. The backend returns actions newest first,
 * but a book can have several parsing jobs after re-parsing, so pick the
 * highest id explicitly instead of relying on the order.
 */
export const getLatestAction = (
  actions: ActionResponse[] | null | undefined,
  type: string
): ActionResponse | undefined => {
  let latest: ActionResponse | undefined
  for (const action of actions ?? []) {
    if (action.type === type && (!latest || action.id > latest.id)) {
      latest = action
    }
  }
  return latest
}
