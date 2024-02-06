import FlagsUtil from '@util/FlagsUtil'
import FnUtil from '@util/FnUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import StringUtil from '@util/StringUtil'

export const FilterUtil = {
  defaultFilter: FnUtil.memoize(() => {
    return {
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
      weight: [undefined, undefined],
    }
  }),

  testProductFilter(filter, product) {
    return FilterUtil.testKeywordFilter(filter.keyword, product)
      && MathUtil.inRange(filter.price, product.price)
      && MathUtil.inRange(filter.pricePerGram, product.pricePerGram)
      && MathUtil.inRange(filter.weight, product.weight)
      && MathUtil.inRange(filter.potency.thc, product.potency.thc)
      && MathUtil.inRange(filter.potency.cbd, product.potency.cbd)
      && FilterUtil.testSubspeciesFilter(filter.subspecies, product)
      && (ObjectUtil.isEmpty(filter.productTypes) || filter.productTypes[product.productType])
      && (product.productType !== 'concentrate' || ObjectUtil.isEmpty(filter.concentrateTypes) || filter.concentrateTypes[product.concentrateType])
      && (ObjectUtil.isEmpty(filter.brands) || filter.brands[product.brand])
      && (ObjectUtil.isEmpty(filter.cultivars) || filter.cultivars[product.cultivar])
      && (ObjectUtil.isEmpty(filter.vendors) || filter.vendors[product.vendor])
      && FilterUtil.testTerpFilter(filter.terps, product.terps)
      && FilterUtil.testLocationFilter(filter.location, product)
      && FilterUtil.testFlagsFilter(filter.flags, product)
  },

  testTerpFilter(filterTerps, productTerps) {
    for (const terpName in filterTerps) {
      if (!MathUtil.inRange(filterTerps[terpName], productTerps[terpName] || 0)) {
        return false
      }
    }
    return true
  },

  testKeywordFilter(keyword, product) {
    const normalize = StringUtil.normalizeForSearch
    const normKeyword = normalize(keyword)
    return normalize(product.name).includes(normKeyword)
      || normalize(product.cultivar).includes(normKeyword)
      || normalize(product.vendor).includes(normKeyword)
      || normalize(product.brand).includes(normKeyword)
  },

  testSubspeciesFilter(subspecies, product) {
    return ObjectUtil.isEmpty(subspecies)
      || subspecies[product.subspecies] 
      || product.subspecies === 'hybrid' && (subspecies.hybridIndica || subspecies.hybridSativa)
  },

  testLocationFilter(filterLocation, product) {
    const distance = MathUtil.earthDistance(product.vendor.latLng, filterLocation.center)
    return filterLocation.distance === undefined
      || distance <= filterLocation.distance * 1609.34
  },

  testFlagsFilter(filterFlags, product) {
    if (filterFlags.openNow) {
      if (!product.vendor.openStatus.isOpen) {
        return false
      }
    }

    return (!filterFlags.promotion || product.flags.promotion)
      && (!filterFlags.new || product.flags.new)
  },

  fromURL(url) {
    const defaultFilter = FilterUtil.defaultFilter()
    const query = ObjectUtil.fromEntries(url.searchParams.entries())
    return {
      brands: FilterUtil.flagsFromUrl(query.brands),
      concentrateTypes: FilterUtil.flagsFromUrl(query.concentrateTypes),
      cultivars: FilterUtil.flagsFromUrl(query.cultivars),
      flags: FilterUtil.flagsFromUrl(query.flags),
      keyword: query.keyword ?? '',
      location: {
        distance: FilterUtil.numberFromUrl(+query['location.distance']), 
        center: FilterUtil.pointFromUrl(query['location.center']) ?? defaultFilter.location.center,
      },
      potency: {thc: FilterUtil.rangeFromUrl(query['potency.thc']), cbd: FilterUtil.rangeFromUrl(query['potency.cbd'])},
      price: FilterUtil.rangeFromUrl(query.price),
      pricePerGram: FilterUtil.rangeFromUrl(query.pricePerGram),
      productTypes: FilterUtil.flagsFromUrl(query.productTypes),
      sortBy: query.sortBy ?? defaultFilter.sortBy,
      subspecies: FilterUtil.flagsFromUrl(query.subspecies),
      terps: FilterUtil.terpsFromUrl(query),
      vendors: FilterUtil.flagsFromUrl(query.vendors),
      weight: FilterUtil.rangeFromUrl(query.weight),
    }
  },

  toURL(filter, pathname) {
    const defaultFilter = FilterUtil.defaultFilter()
    const query = {
      ...FilterUtil.terpsToUrl(filter.terps),
      brands: FilterUtil.flagsToUrl(filter.brands),
      concentrateTypes: FilterUtil.flagsToUrl(filter.concentrateTypes),
      cultivars: FilterUtil.flagsToUrl(filter.cultivars),
      flags: FilterUtil.flagsToUrl(filter.flags),
      keyword: filter.keyword || undefined,
      ['location.distance']: filter.location.distance?.toString(),
      ['location.center']: FilterUtil.pointToUrl(filter.location.center),
      ['potency.thc']: FilterUtil.rangeToUrl(filter.potency.thc),
      ['potency.cbd']: FilterUtil.rangeToUrl(filter.potency.cbd),
      price: FilterUtil.rangeToUrl(filter.price),
      pricePerGram: FilterUtil.rangeToUrl(filter.pricePerGram),
      productTypes: FilterUtil.flagsToUrl(filter.productTypes),
      sortBy: filter.sortBy !== defaultFilter.sortBy ? filter.sortBy : undefined,
      subspecies: FilterUtil.flagsToUrl(filter.subspecies),
      vendors: FilterUtil.flagsToUrl(filter.vendors),
      weight: FilterUtil.rangeToUrl(filter.weight),
    }

    const url = new URL(pathname, window.origin)
    for (const paramName in query) {
      if (query[paramName] != null) {
        url.searchParams.set(paramName, query[paramName])
      }
    }
    return url
  },

  terpsFromUrl(query) {
    const terps = {}
    for (const paramName in query) {
      const match = /^terps\.(.+)$/.exec(paramName)
      const terpName = match?.[1]
      if (terpName) {
        terps[terpName] = FilterUtil.rangeFromUrl(query[paramName])
      }
    }
    return terps
  },

  terpsToUrl(terps) {
    return ObjectUtil.map(terps, (terpName, range) => 
      [`terps.${terpName}`, FilterUtil.rangeToUrl(range)]
    )
  },

  flagsFromUrl(urlValue) {
    return urlValue != null
      ? FlagsUtil.fromIterable(urlValue.split(','))
      : {}
  },

  flagsToUrl(flags) {
    const keys = [...Object.keys(flags)]
    return keys.length !== 0
      ? keys.toSorted().join(',').replace(' ', '+')
      : undefined
  },

  rangeFromUrl(urlValue) {
    return urlValue != null
      ? urlValue.split(',').map(x => x != 'null' ? +x : undefined)
      : [undefined, undefined]
  },

  rangeToUrl(range) {
    return range.some(x => x != null)
      ? range.map(x => x != null ? x.toString() : 'null').join(',')
      : undefined
  },

  numberFromUrl(urlValue) {
    const x = +urlValue
    return isNaN(x) ? undefined : x
  },

  pointFromUrl(urlValue) {
    return urlValue != null
      ? urlValue.split(',').map(x => +x)
      : undefined
  },

  pointToUrl(point) {
    return point.map(x => x.toString()).join(',')
  },

  toPrisma(filter) {
    const where = {
      AND: [].concat(
        FilterUtil.keywordToPrisma(filter.keyword),
        FilterUtil.rangesToPrisma(filter.terps, 'terps'),
        FilterUtil.rangesToPrisma(filter.potency, 'potency'),
        FilterUtil.multiFlagsToPrisma(filter.flags, 'flags'),
      ),
      brand: FilterUtil.flagsToPrisma(filter.brands),
      concentrateType: FilterUtil.flagsToPrisma(filter.concentrateTypes),
      cultivar: FilterUtil.flagsToPrisma(filter.cultivars),
      //location
      price: FilterUtil.rangeToPrisma(filter.price),
      pricePerGram: FilterUtil.rangeToPrisma(filter.pricePerGram),
      productType: FilterUtil.flagsToPrisma(filter.productTypes),
      subspecies: FilterUtil.flagsToPrisma(filter.subspecies),
      vendorName: FilterUtil.flagsToPrisma(filter.vendors),
      weight: FilterUtil.rangeToPrisma(filter.weight),
    }

    return {where, orderBy: FilterUtil.sortToPrisma(filter.sortBy)}
  },

  sortToPrisma(sortBy) {
    return sortBy === 'distance' ? [{name: 'asc'}] // {distance: 'asc'}
      : sortBy === 'price' ? [{price: 'asc'}, {name: 'asc'}]
      : sortBy === 'pricePerGram' ? [{pricePerGram: 'asc'}, {name: 'asc'}]
      : sortBy === 'name' ? {name: 'asc'}
      : {name: 'asc'}
  },

  rangeToPrisma(range) {
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
      .map(([name, range]) =>
        ({
          [fieldName]: {
            path: [name],
            ...FilterUtil.rangeToPrisma(range),
          }
        })
      )
  },

  keywordToPrisma(keyword) {
    return keyword
      ? [{
        OR: [
          {name: {contains: filter.keyword, mode: 'insensitive'}},
          {brand: {contains: filter.keyword, mode: 'insensitive'}},
          {cultivar: {contains: filter.keyword, mode: 'insensitive'}},
          {vendorName: {contains: filter.keyword, mode: 'insensitive'}},
        ],
      }]
      : []
  },

  flagsToPrisma(flags) {
    return ObjectUtil.isNotEmpty(flags)
      ? {in: Object.keys(flags).toSorted()}
      : undefined
  },

  multiFlagsToPrisma(flags, fieldName) {
    return Object.entries(flags).map(([name, _]) =>
      ({
        [fieldName]: {
          path: [name],
          equals: true,
        }
      })
    )
  },
}
