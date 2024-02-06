import './Map.css'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import Image from 'next/Image'
import ObjectUtil from '@util/ObjectUtil'
import {createRoot} from 'react-dom/client'
import {dispatch} from '@state/Action'
import {FilteredVendorStore} from '@state/DataStore'
import {FluxContainer} from '@state/Flux'
import {MapStore, LayoutStore} from '@state/UIStore'
import {RiExpandUpDownLine, RiContractUpDownLine} from 'react-icons/ri'
import {TbPin, TbPinned} from 'react-icons/tb'
import {useFloating, useHover, useFocus, useDismiss, useInteractions, safePolygon, flip, offset, shift, FloatingPortal} from '@floating-ui/react'
import {useState, useRef, useEffect, useCallback, forwardRef} from 'react'
import {VendorPopupContentContainer} from './VendorPopup'

const blueIcon = {
  iconUrl: require('leaflet-color-markers/img/marker-icon-2x-blue.png'),
  shadowUrl: require('leaflet-color-markers/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}

const redIcon = {
  iconUrl: require('leaflet-color-markers/img/marker-icon-2x-red.png'),
  shadowUrl: require('leaflet-color-markers/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
}


const Map = ({center, zoom, vendors, onChange, expandMapPane}) => {
  const containerRef = useRef(null)
  const [map, setMap] = useState()

  const [initialOptions, _] = useState({center, zoom})
  useEffect(() => {
    const map = L.map(containerRef.current, initialOptions)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    map.zoomControl.setPosition('topright')
    new ControlWrapper({Control: <LayoutButtonsContainer />}).addTo(map)
    map.attributionControl.setPrefix(false)

    setMap(map)
    return () => map.remove()
  }, [initialOptions])

  useEffect(() => {
    const notify = () => {
      const mapCenter = map.getCenter()
      const same = 
        Math.abs(mapCenter.lat - center[0]) < 1e-3
          && Math.abs(mapCenter.lng - center[1]) < 1e-3
          && map.getZoom() === zoom
      if (!same) {
        onChange({
          center: [mapCenter.lat, mapCenter.lng],
          zoom: map.getZoom(),
        })
      }
    }

    if (map) {
      map.on('moveend', notify)
      return () => map.off('moveend', notify)
    }
  }, [map, onChange, center, zoom])

  useEffect(() => {
    if (map && !(
      ObjectUtil.equals(map.getCenter(), L.latLng(center))
        && map.getZoom() === zoom
    )) {
      map.setView(center, zoom)
    }
  }, [map, center, zoom])

  useEffect(() => {map && map.invalidateSize(false)}, [map, expandMapPane])

  return (
    <>
      <div className="Map" ref={containerRef} />
      {map ? <MapOverlay vendors={vendors} map={map} /> : undefined}
    </>
  )
}

export const MapContainer = FluxContainer(
  [MapStore, FilteredVendorStore, LayoutStore],
  (map, vendors, layout) =>
    <Map
      center={map.center}
      zoom={map.zoom}
      vendors={vendors.orElse(() => [])}
      expandMapPane={layout.expandMapPane}
      onChange={useCallback(map => dispatch({type: 'map.panAndZoom', map}), [])} />
)

export const MapPaneContainer = FluxContainer([LayoutStore], layout =>
  <div className={`MapPane ${layout.expandMapPane ? 'expanded' : ''}`}>
    <MapContainer />
  </div>
)

const ReactMarkerIcon = forwardRef(function ReactMarkerIcon(props, ref) {
  const {type, options, style, alt, ...rest} = props

  const anchor = options[`${type}Anchor`] || options.iconAnchor
  const size = options[`${type}Size`] || options.iconSize
  return (
    <Image
      {...rest}
      alt={alt}
      ref={ref}
      className={`ReactMarkerIcon leaflet-zoom-hide`}
      src={options[`${type}RetinaUrl`] || options[`${type}Url`]}
      style={{
        ...style,
        marginLeft: `${-anchor[0]}px`,
        marginTop: `${-anchor[1]}px`,
        width: `${size[0]}px`,
        height: `${size[1]}px`,
        zIndex: type === 'icon' ? 200 : 100,
      }} />
  )
})

const ReactMarker = forwardRef(function ReactMarker(props, ref) {
  const {iconOptions, alt, style, ...rest} = props
  return (
    <>
      <ReactMarkerIcon
        {...rest}
        ref={ref}
        type="icon"
        alt={alt}
        tabIndex={0}
        role="button"
        style={style}
        options={iconOptions}
        />
      <ReactMarkerIcon 
        type="shadow"
        alt="" 
        style={style}
        options={iconOptions}
        />
    </>
  )
})

const VendorMarker = ({vendor, map}) => {
  const [pos, setPos] = useState(map.latLngToLayerPoint(vendor.latLng).round())

  useEffect(() => {
    const update = () => 
      setPos(map.latLngToLayerPoint(vendor.latLng).round())
    map.on('zoomend viewreset', update)
    return () => map.off('zoomend viewreset', update)
  }, [map, vendor.latLng])

  const [showPopup, setShowPopup] = useState(false)
  const middleware = [
    offset(4), 
    flip(), 
    shift({padding: 8}), 
  ]
  const {refs, floatingStyles, context} = useFloating({
    open: showPopup,
    onOpenChange: setShowPopup,
    placement: 'top',
    middleware,
  })
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {handleClose: safePolygon()}),
    useFocus(context),
    useDismiss(context),
  ])

  return (
    <>
      <ReactMarker 
        {...getReferenceProps()}
        ref={refs.setReference}
        iconOptions={vendor.openStatus.isOpen ? blueIcon : redIcon}
        alt={vendor.name}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }} />
      {showPopup
        ? <FloatingPortal>
            <div
              {...getFloatingProps()}
              ref={refs.setFloating}
              className="MapVendorPopup shadow"
              style={floatingStyles}>
                <VendorPopupContentContainer vendorName={vendor.name} />
            </div>
          </FloatingPortal>
        : undefined
      }
    </>
  )
}

const MapOverlay = ({vendors, map}) => {
  const layerRef = useRef()
  const [anim, setAnim] = useState(false)

  useEffect(() => {
    const update = () => {
      const pos = map._getMapPanePos()
      layerRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
    }
    const setAnimTrue = () => setAnim(true)
    const setAnimFalse = () => setAnim(false)
    map.on('move', update)
    map.on('zoomanim', setAnimTrue)
    map.on('zoom', setAnimFalse)
    return () => {
      map.off('move', update)
      map.off('zoomanim', setAnimTrue)
      map.off('zoom', setAnimFalse)
    }
  }, [map])
  
  return (
    <div className={`MapOverlay ${anim ? 'leaflet-zoom-anim' : ''}`}>
      <div className="MapOverlayLayer" ref={layerRef}>
        {vendors.map(vendor =>
          <VendorMarker
            map={map}
            vendor={vendor}
            key={vendor.key} />
        )}
      </div>
    </div>
  )
}

const ControlWrapper = L.Control.extend({
  onAdd(_map) {
    const rootElem = document.createElement('div')
    this.reactRoot = createRoot(rootElem)
    this.reactRoot.render(this.options.Control)
    return rootElem
  },

  onRemove() {
    queueMicrotask(() => this.reactRoot.unmount())
  },
})

const LayoutButtons = ({expandMapPane, pinMapPane, onChange}) => 
  <div className="leaflet-bar leafle-control">
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a
      href="#"
      role="button"
      aria-label={expandMapPane ? 'Shrink map pane' : 'Expand map pane'}
      style={{padding: '1px'}}
      onClick={event => {
        event.stopPropagation()
        event.preventDefault()
        onChange && onChange({expandMapPane: !expandMapPane})
      }}>
    {
      expandMapPane
        ? <RiContractUpDownLine size="28px" />
        : <RiExpandUpDownLine size="28px" />
    }
    </a>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a
      href="#"
      role="button"
      aria-label={pinMapPane ? 'Unpin map pane' : 'Pin map pane'}
      style={{padding: '1px'}}
      onClick={event => {
        event.stopPropagation()
        event.preventDefault()
        onChange && onChange({pinMapPane: !pinMapPane})
      }}>
    {
      pinMapPane
        ? <TbPinned size="28px" />
        : <TbPin size="28px" />
    }
    </a>
  </div>

export const LayoutButtonsContainer = FluxContainer([LayoutStore], layout =>
  <LayoutButtons
    expandMapPane={layout.expandMapPane}
    pinMapPane={layout.pinMapPane}
    onChange={layout => dispatch({type: 'layout.set', layout})} />
)
