import ArrayUtil from '@util/ArrayUtil'
import ObjectUtil from '@util/ObjectUtil'
import {FilterStore} from '../state/UIStore'
import {FluxStore, ComputedStore} from '@/state/Flux'
import {jsonOnOk} from '@util/FetchUtil'
import {Present} from '@util/Present'
import {ProductFilterUtil} from '@util/ProductFilterUtil'
import {TypeaheadStore} from '@/state/TypeaheadStore'
import {UrlUtil} from '@util/UrlUtil'
import {RecordStore} from '@/state/RecordStore'

class FilteredProductsFetcher {
  fetch(filter) {
    if (this.aborter) {
      this.aborter.abort()
    }
    this.aborter = new AbortController()

    const query = ProductFilterUtil.toQuery(filter)
    const url = UrlUtil.makeUrl('/api/products', query)
    return fetch(url, {
      signal: this.aborter.signal,
    })
      .finally(() => delete this.aborter)
      .then(jsonOnOk)
  }
}

export const FilteredProductStore = new class extends FluxStore {
  constructor() {
    super()
    this.value = {}
    this.fetcher = new FilteredProductsFetcher()
    FilterStore.subscribe(this.notify.bind(this))
  }

  get() {
    const filter = FilterStore.get()
    if (!ObjectUtil.deepEquals(filter, this.value.filter)) {
      this.set({filter, products: Present.pend})

      if (typeof window !== 'undefined') {
        this.fetcher.fetch(filter)
          .then(products =>
            this.set({filter, products: Present.resolve(products)})
          )
      }
    }

    return this.value.products
  }
}()

export const FilteredVendorStore = new ComputedStore([FilteredProductStore], productsPresent =>
  productsPresent.then(products => {
    const byName = ObjectUtil.map(products, (_, product) => [product.vendor.name, product.vendor])
    return ArrayUtil.sortBy(Object.values(byName), x => [x.distance, x.name])
  })
)

export const VendorStore = new RecordStore('vendor')

export const BrandTypeaheadStore = new TypeaheadStore('brand')

export const CultivarTypeaheadStore = new TypeaheadStore('cultivar')

export const VendorTypeaheadStore = new TypeaheadStore('vendor')

export const LocationTypeaheadStore = new TypeaheadStore('location')
