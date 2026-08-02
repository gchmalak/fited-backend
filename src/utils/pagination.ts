/**
 * Pagination utilities
 *
 * Extracted from recipes.controller and users.controller where the
 * skip/limit calculation and response envelope were duplicated verbatim.
 */

/**
 * Compute the MongoDB skip value from page and limit.
 * Use the returned skip directly in `.skip()` query calls.
 */
export function getPaginationSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Compute the total number of pages, always at least 1.
 */
export function getTotalPages(totalCount: number, limit: number): number {
  return Math.max(1, Math.ceil(totalCount / limit));
}