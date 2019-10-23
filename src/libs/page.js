export const getPage = (pageNumber = 1, limit = 10) => {
  const offset = limit * pageNumber - limit
  return { limit, offset, pageNumber }
}
