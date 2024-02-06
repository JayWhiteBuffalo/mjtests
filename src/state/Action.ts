import {FilterStore, MapStore, LayoutStore} from '@state/UIStore'
import {Dispatcher} from '@state/Flux'

const FilterActions = {
  set: action => FilterStore.set(action.filter),
  addTerp: action => FilterStore.addTerp(action.terpName),
}

const LayoutActions = {
  set: action => LayoutStore.set(action.layout),
}

const MapActions = {
  set: action => MapStore.set(action.map),
  panAndZoom: action => MapStore.set(action.map),
  geolocate: () => {
    const map = MapStore.get()
    if (map.geolocationCenter) {
      MapStore.set({center: map.geolocationCenter})
    } else {
      MapStore.geolocate()
    }
  },
  changeKeyword: ({keyword}) => {
    const map = MapStore.get()
    MapStore.set({
      keyword,
      item: keyword ? map.item : undefined,
      filterFollowsMap: keyword ? map.filterFollowsMap: true,
    })
  },
  selectCity: ({city}) => {
    MapStore.set({
      city, 
      center: city.latLon, 
      zoom: 10,
      keyword: city.name, 
      filterFollowsMap: false,
    })
  },
}

export const Actions = {
  filter: FilterActions,
  layout: LayoutActions,
  map: MapActions,
}

export const dispatcher = new Dispatcher(Actions)
export const dispatch = dispatcher.dispatch.bind(dispatcher)