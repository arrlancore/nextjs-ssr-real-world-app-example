/**
 * Generate config parameter for pagination of rest api
 * @param {number} pageNumber
 * @param {number} limit
 * @returns {object}
 */
export const getPage = (pageNumber = 1, limit = 10) => {
  const offset = limit * pageNumber - limit
  return { limit, offset, pageNumber }
}
