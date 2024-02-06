import {dispatch} from '@state/Action'
import {FilterUtil} from '@util/FilterUtil'
import {FluxStore} from '@state/Flux'

export const LayoutStore = new class extends FluxStore {
  constructor() {
    super()
    this.layout = {
      showFilterPane: true,
      showMapPane: true,
      expandMapPane: false,
      pinMapPane: false,
      productListMode: 'full',
    }
  }

  get() {
    return this.layout
  }

  set(changes) {
    Object.assign(this.layout, changes)
    this.notify()
  }
}()

export const FilterStore = new class extends FluxStore {
  constructor() {
    super()
    this.value = {...FilterUtil.defaultFilter()}
  }

  addTerp(terpName) {
    if (!this.value.terps[terpName]) {
      this.value.terps[terpName] = [undefined, undefined]
      this.notify()
    }
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
