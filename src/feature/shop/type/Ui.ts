

export type ShopRoute = {
  pathname: string
  query: Record<string, string>
}

export type ProductListMode = 'full' | 'compact'

export type ShopLayout = {
  expandMapPane: boolean
  pinMapPane: boolean
  productListMode: ProductListMode
  showFilterPane: boolean
  showMapPane: boolean
}

export type City = {
  name: string;
  latLon: [number, number]
}

export type ShopMap = {
  center: [number, number]
  zoom: number
  keyword: string
  city?: City
  filterFollowsMap: boolean
  geolocationInProgress: boolean
}