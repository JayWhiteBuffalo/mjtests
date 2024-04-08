import {FluxStore} from '@/state/Flux'
import {jsonOnOk} from '@util/FetchUtil'
import {Present} from '@util/Present'
import {SerialFetcher} from '@/state/SerialFetcher'

export class TypeaheadStore extends FluxStore {
  constructor(fieldName) {
    super()
    this.byKey = {}
    this.items = Present.pend
    this.fieldName = fieldName
    this.searchFetcher = new SerialFetcher((keyword, signal) =>
      fetch(`/api/${this.fieldName}/typeahead?keyword=${encodeURIComponent(keyword)}`, {signal})
    )
    this.lookupFetcher = new LookupFetcher(fieldName)
  }

  search = keyword => {
    if (this.lastKeyword !== keyword) {
      this.valid = false
      this.lastKeyword = keyword
    }

    if (!this.valid && typeof window !== 'undefined') {
      this.valid = true
      this.searchFetcher.fetch(keyword)
        .then(jsonOnOk)
        .then(items => {
          for (const item of items) {
            this.byKey[item.key] = Present.resolve(item)
          }
          this.items = Present.resolve(items)
        })
        .finally(() => this.notify())
    }

    return this.items.orElse(() => [])
  }

  getByKeys = keys => keys.map(key =>
    this.byKey[key]?.get() ?? {key, name: key}
  )
}

class LookupFetcher {
  constructor(fieldName) {
    this.fieldName = fieldName
  }

  async fetch(keys) {
    const response = await fetch(`/api/${this.fieldName}/items`, {
      method: 'POST',
      body: JSON.stringify({keys}),
    })
    return await response.json()
  }
}


export class KeyedTypeaheadStore extends TypeaheadStore {
  constructor(fieldName) {
    super(fieldName)
    this.lookupFetcher = new LookupFetcher(fieldName)
  }

  getByKeys = keys => {
    const missing = []

    const items = keys.map(key => {
      if (!(key in this.byKey)) {
        this.byKey[key] = Present.pend
        missing.push(key)
      }
      return this.byKey[key].orElse({key, name: key})
    })

    if (missing.length !== 0) {
      this.lookupFetcher.fetch(missing)
        .then(items => items.forEach(item =>
          this.byKey[item.key] = Present.resolve(item)
        ))
        .finally(() => this.notify())
    }

    return items
  }
}
