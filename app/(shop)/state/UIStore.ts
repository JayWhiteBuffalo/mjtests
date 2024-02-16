import {dispatch} from '../state/Action'
import {ProductFilterUtil} from '@util/ProductFilterUtil'
import {FluxStore} from '@/state/Flux'
import {UrlUtil} from '@util/UrlUtil'

export const RouteStore = new class extends FluxStore {
  replace(query) {
    const url = UrlUtil.makeUrl(this.value.pathname, {...this.value.query, ...query})
    window.history.replaceState(null, '', url.toString())
  }
}()

export const FilterStore = new class extends FluxStore {
  constructor() {
    super()
    this.value = ProductFilterUtil.defaultFilter()
  }

  set(changes) {
    const changed = super.set(changes)

    if (changed) {
      RouteStore.replace(ProductFilterUtil.toQuery(this.get()))
    }
  }

  setQuery(query) {
    super.set(ProductFilterUtil.fromQuery(query))
  }
}()

export const LayoutStore = new class extends FluxStore {
  constructor() {
    super()
    this.value = {
      expandMapPane: false,
      pinMapPane: false,
      productListMode: 'full',
      showFilterPane: true,
      showMapPane: false,
    }
  }

  get() {
    return this.value
  }
}()

export const MapStore = new class extends FluxStore {
  constructor() {
    super()
    this.value = {
      center: [35.481918, -97.508469],
      zoom: 10,
      keyword: '',
      city: undefined,
      filterFollowsMap: true,
      geolocationInProgress: false,
    }
  }

  set(changes) {
    super.set(changes)

    const map = MapStore.get()
    FilterStore.set({location: {
      ...FilterStore.get().location,
      center: map.filterFollowsMap ? map.center : map.city?.latLon || map.geolocationCenter,
    }})
  }

  geolocate() {
    if (navigator.geolocation) {
      this.set({geolocationInProgress: true})
      navigator.geolocation.getCurrentPosition(
        position => {
          const geolocationCenter = [position.coords.latitude, position.coords.longitude]
          dispatch({
            type: 'map.set',
            map: {
              center: geolocationCenter,
              zoom: 10,
              geolocationCenter,
              geolocationInProgress: false,
              keyword: '',
              filterFollowsMap: false,
            },
          })
        },
        _error => {
          dispatch({
            type: 'map.set',
            map: {
              geolocationInProgress: false,
            },
          })
        },
        {maximumAge: Infinity}
      )
    }
  }
}()
