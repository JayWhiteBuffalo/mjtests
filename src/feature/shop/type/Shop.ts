import type {FlagObject} from '@/util/FlagObjectUtil'
import type {NumberRange, OptionalNumberRange} from '@/util/NumberRange'

export type ProductType = 'flower' | 'concentrate' | 'edible' | 'topical' | 'preroll' | 'vape' | 'gear' | 'other'
export type ConcentrateType = 'shatter' | 'wax' | 'sugar' | 'crumble' | 'budder' | 'live resin' | 'rosin' | 'distillate' | 'sauce' | 'diamonds' | 'badder' | 'sugar wax' | 'honeycomb' | 'pull n snap' | 'live sugar' | 'live badder' | 'live budder' | 'live sauce' | 'live diamonds' | 'live pull n snap' | 'live sugar wax' | 'live honeycomb' | 'live resin sugar' | 'live resin badder' | 'live resin budder' | 'live resin sauce' | 'live resin diamonds' | 'live resin pull n snap' | 'live resin sugar wax' | 'live resin honeycomb' | 'live resin live sugar' | 'live resin live badder' | 'live resin live budder' | 'live resin live sauce' | 'live resin live diamonds' | 'live resin live pull n snap' | 'live resin live sugar wax' | 'live resin live honeycomb' | 'live resin live resin'
export type Subspecies = 'indica' | 'hybridIndica' | 'hybrid' | 'hybridSativa' | 'sativa'

export type LocationFilter = {
  distance: number
}
export type ProductFilter = {
  potency: PotencyFilters
  terps: TerpFilters
  flags: ProductFlagsFilter
  sortBy: ProductSort
  productTypes: FlagObject<ProductType>
  concentrateTypes: FlagObject<ConcentrateType>
  brands: FlagObject<string>
  subspecies: FlagObject<Subspecies>
  cultivars: FlagObject<string>
  vendors: FlagObject<string>
  location: LocationFilter
}

export type ProductSort = string

export type ProductFlagName = 'openNow' | 'promotion'
export type ProductFlagsFilter = FlagObject<ProductFlagName>

export type TerpName = string
export type TerpFilters = Record<TerpName, OptionalNumberRange>

export type IngredientName = string
export type PotencyFilters = Record<IngredientName, OptionalNumberRange>
