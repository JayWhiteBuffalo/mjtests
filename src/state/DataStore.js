import ArrayUtil from '@util/ArrayUtil'
import ObjectUtil from '@util/ObjectUtil'
import {FilterStore} from '@state/UIStore'
import {FilterUtil} from '@util/FilterUtil'
import {FluxStore, ComputedStore} from '@state/Flux'
import {Present} from '@util/Present'

export const VendorStore = new class extends FluxStore {
  constructor() {
    super()
    this.byName = {}
  }

  getByName(name) {
    if (!this.byName[name]) {
      fetch(`/api/vendor?name=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(vendor => {
          this.byName[vendor.name] = Present.resolve(vendor)
          this.notify()
        })
      this.byName[name] = Present.pend
    }
    return this.byName[name]
  }
}()

class FilteredProductsFetcher {
  fetch(filter) {
    if (this.aborter) {
      this.aborter.abort()
    }
    this.aborter = new AbortController()

    const url = FilterUtil.toURL(filter, '/api/products')
    return fetch(url, {
      signal: this.aborter.signal,
    })
      .then(response => {
        delete this.aborter
        return response.json()
      })
  }
}

export const FilteredProductStore = new class extends FluxStore {
  constructor() {
    super()
    this.products = Present.pend
    this.fetcher = new FilteredProductsFetcher()
    FilterStore.subscribe(this.notify.bind(this))
  }

  get() {
    if (typeof window !== 'undefined') {
      const filter = FilterStore.get()
      if (ObjectUtil.deepEquals(filter, this.lastFilter)) {
        return this.products
      }
      this.lastFilter = {...filter}

      this.fetcher.fetch(filter)
        .then(products => {
          this.products = Present.resolve(products)
          this.notify()
        })
      this.products = Present.pend
    }
    return this.products
  }
}()


export const FilteredVendorStore = new ComputedStore([FilteredProductStore], productsPresent =>
  productsPresent.then(products => {
    const byName = ObjectUtil.map(products, (_, product) => [product.vendorName, product.vendor])
    return ArrayUtil.sortBy(Object.values(byName), x => [x.distance, x.name])
  })
)

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
      .then(response => response.json())
  }
}

export class TypeaheadStore extends FluxStore {
  constructor(fieldName) {
    super()
    this.byName = {}
    this.items = Present.pend
    this.fetcher = new TypeaheadFetcher(fieldName)
  }

  search = keyword => {
    if (typeof window !== 'undefined') {
      this.fetcher.fetch(keyword)
        .then(items => {
          for (const item of items) {
            this.byName[item.name] = item
          }
          this.items = Present.resolve(items)
          this.notify()
        })
    }

    return this.items.orElse(() => [])
  }

  getByName = name => this.byName[name]
}

export const BrandTypeaheadStore = new TypeaheadStore('brand')

export const CultivarTypeaheadStore = new TypeaheadStore('cultivar')

export const VendorTypeaheadStore = new TypeaheadStore('vendor')

export const LocationTypeaheadStore = new TypeaheadStore('location')

