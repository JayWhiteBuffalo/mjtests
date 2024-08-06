import {parse} from 'path'

export const UrlUtil = {
  makeUrl(pathname, query) {
    const url = new URL(
      pathname,
      typeof window !== 'undefined' ? window.origin : '',
    )
    for (const paramName in query) {
      if (query[paramName] != null) {
        url.searchParams.set(paramName, query[paramName])
      }
    }
    return url
  },

  parseQuery(search: string) {
    const result: Record<string, string> = {}
    for (const [key, value] of new URLSearchParams(search)) {
      result[key] = value
    }
    return result
  },

  getVendorId(url: string) {
    const { pathname } = new URL(url);
    const parts = pathname.split('/');
    return parts.length > 2 && parts[1] === 'vendors' ? parts[2] : null;
  },

  getCurrentUrl() {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return null;
  }
};

