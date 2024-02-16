export const UrlUtil = {
  makeUrl(pathname, query) {
    const url = new URL(pathname, typeof window !== 'undefined' ? window.origin : '')
    for (const paramName in query) {
      if (query[paramName] != null) {
        url.searchParams.set(paramName, query[paramName])
      }
    }
    return url
  },
}
