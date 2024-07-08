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
import ProducerDto from '@/data/ProducerDto'

export const FilteredProductStore = new (class extends FluxFieldStore {
  constructor() {
    super({})
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

// export const FilteredProductStore = new (class extends FluxFieldStore {
//   constructor() {
//     super({})
//     this.productFetcher = new SerialFetcher((filter, signal) => {
//       const query = ProductFilterUtil.toQuery(filter)
//       const url = UrlUtil.makeUrl('/api/products', query)
//       return fetch(url, { signal })
//     })

//     this.producerFetcher = new SerialFetcher((filter, signal) => {
//       const url = '/api/producers'; // Assuming this endpoint returns a list of producers
//       return fetch(url, { signal });
//     })

//     FilterStore.subscribe(this.notify.bind(this))
//   }

//   get() {
//     const filter = FilterStore.get()

//     // Check if the filter has changed or if products are not yet fetched
//     if (!ObjectUtil.deepEquals(filter, this.value.filter) || !this.value.products) {
//       this.value = { filter, products: Present.pend, producers: Present.pend }

//       // Fetch products
//       if (typeof window !== 'undefined') {
//         this.productFetcher
//           .fetch(filter)
//           .then(jsonOnOk)
//           .then(products =>
//             this.set({ filter, products: Present.resolve(products) }),
//           )
//       }

//       // Fetch producers
//       if (typeof window !== 'undefined') {
//         this.producerFetcher
//           .fetch(filter)  // Adjust filter or query as needed for producers
//           .then(jsonOnOk)
//           .then(producers =>
//             this.set({ filter, producers: Present.resolve(producers) }),
//           )
//       }
//     }

//     // Return both products and producers
//     return { products: this.value.products, producers: this.value.producers };
//   }
// })();


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

// export const FilteredProducerStore = new ComputedStore(
  
//   [FilteredProductStore],
//   async (productsPresent) => {
//     const products = await productsPresent;

//     console.log(products); // Logging for debugging

//     // Assuming ProducerDto._getRaw fetches producer details by IDs asynchronously
//     const producerIds = products.map(product => product.producerId);
//     const producers = await ProducerDto._getRaw(producerIds);

//     // Create a map of producers by ID and their details
//     const byId = ObjectUtil.map(products, (_, product) => {
//       const producer = producers.find(p => p.id === product.producerId); // Find producer by ID
//       return [
//         product.producerId || '', // Use producer ID as key
//         producer || null, // Return producer details or null if not found
//       ];
//     });

    // Sort producers by distance and name
//     return ArrayUtil.sortBy(Object.values(byId), producer => [
//       producer.distance ?? Infinity,
//       producer.name,
//     ]);
//   }
// );
// export const FilteredProducerStore = new ComputedStore(
//   [FilteredProductStore],
//   productsPresent => {
//     // Convert productsPresent to an array of products
//     const products = [productsPresent]; 

//     // Filter products to include only those with a valid producerId
//     const filteredProducts = products.filter(product => product.producerId);
//     console.log(filteredProducts)

//     // Map filtered products to match the structure expected by ComputedStore
//     const byId = filteredProducts.reduce((acc, product) => {
//       // Use producerId as key and store product details
//       acc[product.producerId] = product;
//       return acc;
//     }, {});

//     // Convert the byId object into an array and sort by producerId
//     const sortedProducts = Object.values(byId).sort((a, b) => {
//       // Sort by producerId (assuming producerId is a string, otherwise adjust sorting logic)
//       return a.producerId.localeCompare(b.producerId);
//     });

//     return sortedProducts;
//   }
// );

export const ProducerStore = new RecordStore('producer')

export const ProducerTypeaheadStore = new TypeaheadStore('producer')

export const VendorStore = new RecordStore('vendor')

export const BrandTypeaheadStore = new TypeaheadStore('brand')

export const CultivarTypeaheadStore = new TypeaheadStore('cultivar')

export const VendorTypeaheadStore = new TypeaheadStore('vendor')

export const LocationTypeaheadStore = new TypeaheadStore('location')
