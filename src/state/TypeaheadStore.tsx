import {FluxStore} from '@/state/Flux'
import {jsonOnOk} from '@util/FetchUtil'
import {Present} from '@util/Present'

class TypeaheadFetcher {
  constructor(fieldName) {
    this.fieldName = fieldName
  }

  fetch(keyword) {
    if (keyword === this.lastKeyword) {
      return new Promise(_resolve => {})
    }
    this.lastKeyword = keyword

    if (this.aborter) {
      this.aborter.abort()
    }
    this.aborter = new AbortController()

    return fetch(`/api/${this.fieldName}/typeahead?keyword=${encodeURIComponent(keyword)}`, {
      signal: this.aborter.signal,
    })
      .finally(() => delete this.aborter)
      .then(jsonOnOk)
  }
}

export class TypeaheadStore extends FluxStore {
  constructor(fieldName) {
    super()
    this.byKey = {}
    this.items = Present.pend
    this.fetcher = new TypeaheadFetcher(fieldName)
  }

  search = keyword => {
    if (typeof window !== 'undefined') {
      this.fetcher.fetch(keyword)
        .then(items => {
          for (const item of items) {
            this.byKey[item.name] = item
          }
          this.items = Present.resolve(items)
          this.notify()
        })
    }

    return this.items.orElse(() => [])
  }

  getByKey = name => this.byKey[name]
}
