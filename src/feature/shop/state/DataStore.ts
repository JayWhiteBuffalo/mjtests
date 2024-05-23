import ArrayUtil from '@util/ArrayUtil'
import ObjectUtil from '@util/ObjectUtil'
import {FilterStore} from './UIStore'
import {FluxFieldStore, ComputedStore} from '@/state/Flux'
import {jsonOnOk} from '@util/FetchUtil'
import {Present} from '@util/Present'
import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'
import {RecordStore} from '@/state/RecordStore'
import {SerialFetcher} from '@/state/SerialFetcher'
import {TypeaheadStore} from '@/state/TypeaheadStore'
import {UrlUtil} from '@util/UrlUtil'

export const FilteredProductStore = new (class extends FluxFieldStore {
  constructor() {
    super()
    this.value = {}
    this.fetcher = new SerialFetcher((filter, signal) => {
      const query = ProductFilterUtil.toQuery(filter)
      const url = UrlUtil.makeUrl('/api/products', query)
      return fetch(url, {signal})
    })
    FilterStore.subscribe(this.notify.bind(this))
  }

  get() {
    const filter = FilterStore.get()
    if (!ObjectUtil.deepEquals(filter, this.value.filter)) {
      this.value = {filter, products: Present.pend}

      if (typeof window !== 'undefined') {
        this.fetcher
          .fetch(filter)
          .then(jsonOnOk)
          .then(products =>
            this.set({filter, products: Present.resolve(products)}),
          )
      }
    }

    return this.value.products
  }
})()

export const FilteredVendorStore = new ComputedStore(
  [FilteredProductStore],
  productsPresent =>
    productsPresent.then(products => {
      const byName = ObjectUtil.map(products, (_, product) => [
        product.vendor.name,
        product.vendor,
      ])
      return ArrayUtil.sortBy(Object.values(byName), vendor => [
        vendor.distance ?? Infinity,
        vendor.name,
      ])
    }),
)

export const VendorStore = new RecordStore('vendor')

export const BrandTypeaheadStore = new TypeaheadStore('brand')

export const CultivarTypeaheadStore = new TypeaheadStore('cultivar')

export const VendorTypeaheadStore = new TypeaheadStore('vendor')

export const LocationTypeaheadStore = new TypeaheadStore('location')
