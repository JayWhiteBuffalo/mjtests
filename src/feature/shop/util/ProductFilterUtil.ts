import ArrayUtil from '@/util/ArrayUtil'
import FlagObjectUtil, {type FlagObject} from '@util/FlagObjectUtil'
import {memoize} from '@util/FnUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import StringUtil from '@util/StringUtil'
import type {LocationFilter, ProductFilter, ProductFlagsFilter, ProductSort, Subspecies, TerpFilters} from '@/feature/shop/type/Shop'
import type {Product} from '@prisma/client'
import type {OptionalNumberRange} from '@/util/NumberRange'

const defaultFilter = Object.freeze({
  brands: {},
  concentrateTypes: {},
  cultivars: {},
  flags: {},
  keyword: '',
  location: {distance: undefined, center: [35.481918, -97.508469]},
  potency: {thc: [undefined, undefined], cbd: [undefined, undefined]},
  price: [undefined, undefined],
  pricePerGram: [undefined, undefined],
  productTypes: {},
  sortBy: 'distance',
  subspecies: {},
  terps: {},
  vendors: {},
  producers: {},
  weight: [undefined, undefined],
})

export const ProductFilterUtil = {
  defaultFilter: (): ProductFilter => defaultFilter,

  isEmpty(filter_: ProductFilter): boolean {
    const filter = ObjectUtil.deepClone(filter_)
    delete filter.sortBy
    delete filter.location.center

    const defaultFilter = ProductFilterUtil.defaultFilter()
    const diff = ObjectUtil.filter(
      filter,
      (key, value) => !ObjectUtil.equals(value, defaultFilter[key]),
    )
    return ObjectUtil.isEmpty(diff)
  },

  testProductFilter(filter: ProductFilter, product: Product): boolean {
    return (
      ProductFilterUtil.testKeywordFilter(filter.keyword, product) &&
      //MathUtil.inRange(filter.price, product.price) &&
      //MathUtil.inRange(filter.pricePerGram, product.pricePerGram) &&
      //MathUtil.inRange(filter.weight, product.weight) &&
      MathUtil.inRange(filter.potency.thc, product.potency.thc) &&
      MathUtil.inRange(filter.potency.cbd, product.potency.cbd) &&
      ProductFilterUtil.testSubspeciesFilter(filter.subspecies, product) &&
      (ObjectUtil.isEmpty(filter.productTypes) ||
        filter.productTypes[product.productType]) &&
      (product.productType !== 'concentrate' ||
        ObjectUtil.isEmpty(filter.concentrateTypes) ||
        filter.concentrateTypes[product.concentrateType]) &&
      (ObjectUtil.isEmpty(filter.brands) || filter.brands[product.brand]) &&
      (ObjectUtil.isEmpty(filter.cultivars) ||
        filter.cultivars[product.cultivar]) &&
      (ObjectUtil.isEmpty(filter.vendors) || filter.vendors[product.vendor]) &&
      ProductFilterUtil.testTerpFilter(filter.terps, product.normalizedTerps) &&
      ProductFilterUtil.testLocationFilter(filter.location, product) &&
      ProductFilterUtil.testFlagsFilter(filter.flags, product)
    )
  },

  testTerpFilter(filterTerps: TerpFilters, productTerps) {
    for (const terpName in filterTerps) {
      if (
        !MathUtil.inRange(filterTerps[terpName], productTerps[terpName] || 0)
      ) {
        return false
      }
    }
    return true
  },

  testKeywordFilter(keyword: string, product: Product) {
    const normalize = StringUtil.normalizeForSearch
    const normKeyword = normalize(keyword)
    return (
      normalize(product.name).includes(normKeyword) ||
      normalize(product.cultivar).includes(normKeyword) ||
      normalize(product.vendor).includes(normKeyword) ||
      normalize(product.brand).includes(normKeyword)
    )
  },

  testSubspeciesFilter(subspecies: FlagObject<Subspecies>, product: Product) {
    return (
      ObjectUtil.isEmpty(subspecies) ||
      subspecies[product.subspecies] ||
      (product.subspecies === 'hybrid' &&
        (subspecies.hybridIndica || subspecies.hybridSativa))
    )
  },

  testLocationFilter(filterLocation: LocationFilter, product: Product) {
    return (
      filterLocation.distance === undefined ||
      (product.vendor.distance ?? Infinity) <= filterLocation.distance * 1609.34
    )
  },

  testFlagsFilter(filterFlags: ProductFlagsFilter, product: Product) {
    if (filterFlags.openNow) {
      if (!product.vendor.openStatus.isOpen) {
        return false
      }
    }

    return (
      (!filterFlags.promotion || product.flags.promotion) &&
      (!filterFlags.new || product.flags.new)
    )
  },

  fromQuery(query: Record<string, string>) {
    const defaultFilter = ProductFilterUtil.defaultFilter()
    return {
      brands: ProductFilterUtil.flagsFromUrl(query.brands),
      concentrateTypes: ProductFilterUtil.flagsFromUrl(query.concentrateTypes),
      cultivars: ProductFilterUtil.flagsFromUrl(query.cultivars),
      flags: ProductFilterUtil.flagsFromUrl(query.flags),
      keyword: query.keyword ?? '',
      location: {
        distance: ProductFilterUtil.numberFromUrl(+query['location.distance']),
        center:
          ProductFilterUtil.pointFromUrl(query['location.center']) ??
          defaultFilter.location.center,
      },
      potency: {
        thc: ProductFilterUtil.rangeFromUrl(query['potency.thc']),
        cbd: ProductFilterUtil.rangeFromUrl(query['potency.cbd']),
      },
      price: ProductFilterUtil.rangeFromUrl(query.price),
      pricePerGram: ProductFilterUtil.rangeFromUrl(query.pricePerGram),
      productTypes: ProductFilterUtil.flagsFromUrl(query.productTypes),
      sortBy: query.sortBy ?? defaultFilter.sortBy,
      subspecies: ProductFilterUtil.flagsFromUrl(query.subspecies),
      terps: ProductFilterUtil.terpsFromUrl(query),
      vendors: ProductFilterUtil.flagsFromUrl(query.vendors),
      weight: ProductFilterUtil.rangeFromUrl(query.weight),
    }
  },

  toQuery(filter: ProductFilter) {
    const defaultFilter = ProductFilterUtil.defaultFilter()
    return {
      ...ProductFilterUtil.terpsToUrl(filter.terps),
      brands: ProductFilterUtil.flagsToUrl(filter.brands),
      concentrateTypes: ProductFilterUtil.flagsToUrl(filter.concentrateTypes),
      cultivars: ProductFilterUtil.flagsToUrl(filter.cultivars),
      flags: ProductFilterUtil.flagsToUrl(filter.flags),
      keyword: filter.keyword || undefined,
      ['location.distance']: filter.location.distance?.toString(),
      ['location.center']: ProductFilterUtil.pointToUrl(filter.location.center),
      ['potency.thc']: ProductFilterUtil.rangeToUrl(filter.potency.thc),
      ['potency.cbd']: ProductFilterUtil.rangeToUrl(filter.potency.cbd),
      price: ProductFilterUtil.rangeToUrl(filter.price),
      pricePerGram: ProductFilterUtil.rangeToUrl(filter.pricePerGram),
      productTypes: ProductFilterUtil.flagsToUrl(filter.productTypes),
      sortBy:
        filter.sortBy !== defaultFilter.sortBy ? filter.sortBy : undefined,
      subspecies: ProductFilterUtil.flagsToUrl(filter.subspecies),
      vendors: ProductFilterUtil.flagsToUrl(filter.vendors),
      weight: ProductFilterUtil.rangeToUrl(filter.weight),
    }
  },

  terpsFromUrl(query: Record<string, string>): TerpFilters {
    const terps = {}
    for (const paramName in query) {
      const match = /^terps\.(.+)$/.exec(paramName)
      const terpName = match?.[1]
      if (terpName) {
        terps[terpName] = ProductFilterUtil.rangeFromUrl(query[paramName])
      }
    }
    return terps
  },

  terpsToUrl(terps: TerpFilters): Record<string, string> {
    return ObjectUtil.map(terps, (terpName, range) => [
      `terps.${terpName}`,
      ProductFilterUtil.rangeToUrl(range),
    ])
  },

  flagsFromUrl(urlValue?: string): FlagObject<string> {
    if (!urlValue) {
      return {};
    }
    
    // Decode the URL value first
    const decodedValue = decodeURIComponent(urlValue);
  
    // Split the decoded URL value by comma and trim whitespace
    const values = decodedValue.split(',').map(value => value.trim());
    
    // Create a FlagObject with each value as key with value true
    const flagObject: FlagObject<string> = {};
    values.forEach(value => {
      flagObject[value] = true;
    });
  
    return flagObject;
  },

  
  // flagsFromUrl(urlValue?: string): ProductFlagsFilter {
  //   return urlValue != null
  //     ? FlagObjectUtil.fromIterable(urlValue.split(','))
  //     : {}
  // },

  // flagsToUrl(flags) {
  //   const keys = [...Object.keys(flags)]
  //   console.log("Keys" + JSON.stringify(keys))
  //   return keys.length !== 0
  //     ? keys.toSorted().join(',').replace(' ', ' ')
  //     : undefined
  // },

flagsToUrl(flags) {
    const keys = Object.keys(flags);
  
    // Sort keys alphabetically
    keys.sort();
  
    // Join sorted keys into a comma-separated string
    const queryString = keys.map(key => encodeURIComponent(key)).join(',');
  
    return queryString.length !== 0 ? queryString : undefined;
  },

  rangeFromUrl(urlValue) {
    return urlValue != null
      ? urlValue.split(',').map(x => (x != 'null' ? +x : undefined))
      : [undefined, undefined]
  },

  rangeToUrl(range) {
    return range.some(x => x != null)
      ? range.map(x => (x != null ? x.toString() : 'null')).join(',')
      : undefined
  },

  numberFromUrl(urlValue) {
    const x = +urlValue
    return isNaN(x) ? undefined : x
  },

  pointFromUrl(urlValue) {
    return urlValue != null ? urlValue.split(',').map(x => +x) : undefined
  },

  pointToUrl(point) {
    return point.map(x => x.toString()).join(',')
  },

  toPrisma(filter: ProductFilter) {
    const where = {
      AND: [].concat(
        ProductFilterUtil.keywordToPrisma(filter.keyword),
        ProductFilterUtil.rangesToPrisma(filter.terps, 'normalizedTerps'),
        ProductFilterUtil.rangesToPrisma(filter.potency, 'potency'),
        ProductFilterUtil.multiFlagsToPrisma(filter.flags, 'flags'),
      ),
      brand: ProductFilterUtil.flagsToPrisma(filter.brands),
      concentrateType: ProductFilterUtil.flagsToPrisma(filter.concentrateTypes),
      cultivar: ProductFilterUtil.flagsToPrisma(filter.cultivars),
      //location
      isDraft: false,
      //price: ProductFilterUtil.rangeToPrisma(filter.price),
      //pricePerGram: ProductFilterUtil.rangeToPrisma(filter.pricePerGram),
      productType: ProductFilterUtil.flagsToPrisma(filter.productTypes),
      subspecies: ProductFilterUtil.flagsToPrisma(filter.subspecies),
      vendor: {
        is: {
          name: ProductFilterUtil.flagsToPrisma(filter.vendors),
        },
      },
      //weight: ProductFilterUtil.rangeToPrisma(filter.weight),
    }

    return {where, orderBy: ProductFilterUtil.sortToPrisma(filter.sortBy)}
  },

  sortToPrisma(sortBy: ProductSort) {
    if (sortBy === 'distance') {
      return {name: 'asc'}
    } else if (sortBy === 'name') {
      return {name: 'asc'}
    // } else if (sortBy === 'price') {
    //   return [{price: 'asc'}, {name: 'asc'}]
    // } else if (sortBy === 'pricePerGram') {
    //   return [{pricePerGram: 'asc'}, {name: 'asc'}]
    } else if (sortBy.startsWith('terps.')) {
      return {
        normalizedTerps: {
          path: [sortBy.split('.')[1]],
          sort: 'desc',
        },
      }
    } else {
      return {name: 'asc'}
    }
  },

  rangeToPrisma(range: OptionalNumberRange) {
    if (range.some(x => x != null)) {
      return {
        gte: range[0],
        lt: range[1],
      }
    } else {
      return undefined
    }
  },

  rangesToPrisma(ranges, fieldName) {
    return Object.entries(ranges)
      .filter(([_, range]) => range.some(x => x != null))
      .map(([name, range]) => ({
        [fieldName]: {
          path: [name],
          ...ProductFilterUtil.rangeToPrisma(range),
        },
      }))
  },

  keywordToPrisma(keyword) {
    return keyword
      ? [
          {
            OR: [
              {name: {contains: keyword, mode: 'insensitive'}},
              {brand: {contains: keyword, mode: 'insensitive'}},
              {cultivar: {contains: keyword, mode: 'insensitive'}},
              {vendor: {is: {name: {contains: keyword, mode: 'insensitive'}}}},
            ],
          },
        ]
      : []
  },

  flagsToPrisma(flags) {
    return ObjectUtil.isNotEmpty(flags)
      ? {in: Object.keys(flags).toSorted()}
      : undefined
  },

  multiFlagsToPrisma(flags_, fieldName) {
    const flags = ObjectUtil.delete(flags_, 'openNow')
    return Object.entries(flags).map(([name, _]) => ({
      [fieldName]: {
        path: [name],
        equals: true,
      },
    }))
  },

  applyTerpeneSort(products, orderBy) {
    let firstSort = orderBy?.normalizedTerps
    firstSort = firstSort instanceof Array ? firstSort[0] : firstSort
    const terpName = firstSort?.path?.[0]
    if (!terpName) {
      return products
    }

    const metric = product => {
      const terpValue = product.normalizedTerps[terpName]
      if (terpValue == null) {
        return Infinity
      }
      return firstSort.direction === 'asc' ? terpValue : -terpValue
    }

    return ArrayUtil.sortBy(products, metric)
  },
}
