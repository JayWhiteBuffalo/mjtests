import {FilterStore, MapStore, LayoutStore, RouteStore} from '../state/UIStore'

const RouteActions = {
  initialize: ({pathname, query}) => {
    RouteStore.set({pathname, query})
    FilterStore.setQuery(query)
  },

  set: ({pathname, query}) => {
    RouteStore.set({pathname, query})
    FilterStore.setQuery(query)
  },
}

const FilterActions = {
  set: ({filter}) => {
    FilterStore.set(filter)
  },

  addTerp: ({terpName}) => {
    const terps = {
      [terpName]: [undefined, undefined],
      ...FilterStore.get().terps,
    }
    FilterStore.set({terps})
  },
}

const LayoutActions = {
  set: ({layout}) => LayoutStore.set(layout),
}

const MapActions = {
  set: ({map}) => MapStore.set(map),
  panAndZoom: ({map}) => MapStore.set(map),
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
      filterFollowsMap: keyword ? map.filterFollowsMap : true,
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
  route: RouteActions,
}
