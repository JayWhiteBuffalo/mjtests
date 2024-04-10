import FlagObjectUtil from '@util/FlagObjectUtil'
import FnUtil from '@util/FnUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import StringUtil from '@util/StringUtil'

export const ProductFilterUtil = {
  defaultFilter: FnUtil.memoize(() =>
    Object.freeze({
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
    })
  ),

  testProductFilter(filter, product) {
    return ProductFilterUtil.testKeywordFilter(filter.keyword, product)
      && MathUtil.inRange(filter.price, product.price)
      && MathUtil.inRange(filter.pricePerGram, product.pricePerGram)
      && MathUtil.inRange(filter.weight, product.weight)
      && MathUtil.inRange(filter.potency.thc, product.potency.thc)
      && MathUtil.inRange(filter.potency.cbd, product.potency.cbd)
      && ProductFilterUtil.testSubspeciesFilter(filter.subspecies, product)
      && (ObjectUtil.isEmpty(filter.productTypes) || filter.productTypes[product.productType])
      && (product.productType !== 'concentrate' || ObjectUtil.isEmpty(filter.concentrateTypes) || filter.concentrateTypes[product.concentrateType])
      && (ObjectUtil.isEmpty(filter.brands) || filter.brands[product.brand])
      && (ObjectUtil.isEmpty(filter.cultivars) || filter.cultivars[product.cultivar])
      && (ObjectUtil.isEmpty(filter.vendors) || filter.vendors[product.vendor])
      && ProductFilterUtil.testTerpFilter(filter.terps, product.normalizedTerps)
      && ProductFilterUtil.testLocationFilter(filter.location, product)
      && ProductFilterUtil.testFlagsFilter(filter.flags, product)
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
    return filterLocation.distance === undefined
      || (product.vendor.distance ?? Infinity) <= filterLocation.distance * 1609.34
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

  fromQuery(query) {
    const defaultFilter = ProductFilterUtil.defaultFilter()
    return {
      brands: ProductFilterUtil.flagsFromUrl(query.brands),
      concentrateTypes: ProductFilterUtil.flagsFromUrl(query.concentrateTypes),
      cultivars: ProductFilterUtil.flagsFromUrl(query.cultivars),
      flags: ProductFilterUtil.flagsFromUrl(query.flags),
      keyword: query.keyword ?? '',
      location: {
        distance: ProductFilterUtil.numberFromUrl(+query['location.distance']),
        center: ProductFilterUtil.pointFromUrl(query['location.center']) ?? defaultFilter.location.center,
      },
      potency: {thc: ProductFilterUtil.rangeFromUrl(query['potency.thc']), cbd: ProductFilterUtil.rangeFromUrl(query['potency.cbd'])},
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

  toQuery(filter) {
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
      sortBy: filter.sortBy !== defaultFilter.sortBy ? filter.sortBy : undefined,
      subspecies: ProductFilterUtil.flagsToUrl(filter.subspecies),
      vendors: ProductFilterUtil.flagsToUrl(filter.vendors),
      weight: ProductFilterUtil.rangeToUrl(filter.weight),
    }
  },

  terpsFromUrl(query) {
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

  terpsToUrl(terps) {
    return ObjectUtil.map(terps, (terpName, range) =>

      [`terps.${terpName}`, ProductFilterUtil.rangeToUrl(range)]
    )
  },

  flagsFromUrl(urlValue) {
    return urlValue != null
      ? FlagObjectUtil.fromIterable(urlValue.split(','))
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
        ProductFilterUtil.keywordToPrisma(filter.keyword),
        ProductFilterUtil.rangesToPrisma(filter.terps, 'normalizedTerps'),
        ProductFilterUtil.rangesToPrisma(filter.potency, 'potency'),
        ProductFilterUtil.multiFlagsToPrisma(filter.flags, 'flags'),
      ),
      brand: ProductFilterUtil.flagsToPrisma(filter.brands),
      concentrateType: ProductFilterUtil.flagsToPrisma(filter.concentrateTypes),
      cultivar: ProductFilterUtil.flagsToPrisma(filter.cultivars),
      //location
      price: ProductFilterUtil.rangeToPrisma(filter.price),
      pricePerGram: ProductFilterUtil.rangeToPrisma(filter.pricePerGram),
      productType: ProductFilterUtil.flagsToPrisma(filter.productTypes),
      subspecies: ProductFilterUtil.flagsToPrisma(filter.subspecies),
      vendor: {is: {
        name: ProductFilterUtil.flagsToPrisma(filter.vendors),
      }},
      weight: ProductFilterUtil.rangeToPrisma(filter.weight),
    }

    return {where, orderBy: ProductFilterUtil.sortToPrisma(filter.sortBy)}
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
            ...ProductFilterUtil.rangeToPrisma(range),
          }
        })
      )
  },

  keywordToPrisma(keyword) {
    return keyword
      ? [{
        OR: [
          {name: {contains: keyword, mode: 'insensitive'}},
          {brand: {contains: keyword, mode: 'insensitive'}},
          {cultivar: {contains: keyword, mode: 'insensitive'}},
          {vendor: {is:
            {name: {contains: keyword, mode: 'insensitive'}},
          }},
        ],
      }]
      : []
  },

  flagsToPrisma(flags) {
    return ObjectUtil.isNotEmpty(flags)
      ? {in: Object.keys(flags).toSorted()}
      : undefined
  },

  multiFlagsToPrisma(flags_, fieldName) {
    const flags = ObjectUtil.delete(flags_, 'openNow')
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
