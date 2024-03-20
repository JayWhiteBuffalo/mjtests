import './SearchBar.css'
import {BsGrid, BsGrid3X3} from 'react-icons/bs'
import {CgSearch} from 'react-icons/cg'
import {ErrorBoundary} from '@components/Error'
import {FiDollarSign} from 'react-icons/fi'
import {FilterStore, LayoutStore, MapStore} from '../state/UIStore'
import {useFluxStore, dispatch} from '@/state/Flux'
import {GiPathDistance} from 'react-icons/gi'
import {HiOutlineChevronDoubleUp, HiOutlineChevronDoubleDown, HiOutlineChevronDown, HiLocationMarker} from 'react-icons/hi'
import {LocationTypeaheadStore} from '../state/DataStore'
import {TbSortAscendingLetters} from 'react-icons/tb'
import {TextInput, Button, Dropdown, Spinner} from 'flowbite-react'
import {useFloating, useDismiss, useInteractions, useRole, flip, shift, size, FloatingFocusManager, useListNavigation} from '@floating-ui/react'
import {useState, useCallback, useRef, forwardRef} from 'react'

const sortItemProps = [
  {
    key: 'distance',
    Icon: GiPathDistance,
    label: 'Distance',
  },
  {
    key: 'price',
    Icon: FiDollarSign,
    label: 'Price',
  },
  {
    key: 'name',
    Icon: TbSortAscendingLetters,
    label: 'Name',
  },
]

const SortDropdown = ({sortBy, onChange}) => {
  const selectedProps = sortItemProps.find(x => x.key === sortBy)
  const BaseButton = () =>
    <Button className="SortDropdown" size="sm">
      <selectedProps.Icon className="mr-2 h-4 w-4 inline-block" />
      Sort: {selectedProps.label}
      <HiOutlineChevronDown className="ml-2 h-4 w-4" />
    </Button>

  return (
    <Dropdown renderTrigger={BaseButton}>
      {sortItemProps.map(props =>
        <Dropdown.Item
          key={props.key}
          onClick={() => onChange(props.key)}
          icon={props.Icon}>
            {props.label}
        </Dropdown.Item>
      )}
    </Dropdown>
  )
}

const SortDropdownContainer = () => {
  const filter = useFluxStore(FilterStore)
  return (
    <SortDropdown
      sortBy={filter.sortBy}
      onChange={sortBy => dispatch({type: 'filter.set', filter: {sortBy}})}
    />
  )
}

const ToggleFilterPane = ({showFilterPane, onClick}) =>
  <Button
    className="ToggleFilterPane"
    size="sm"
    onClick={onClick}>
    Filters
    {
      showFilterPane
        ? <HiOutlineChevronDoubleUp className="ml-1 h-4 w-4" />
        : <HiOutlineChevronDoubleDown className="ml-1 h-4 w-4" />
    }
  </Button>

const ToggleFilterPaneContainer = () => {
  const layout = useFluxStore(LayoutStore)
  return (
    <ToggleFilterPane
      showFilterPane={layout.showFilterPane}
      onClick={() => dispatch({type: 'layout.set', layout: {showFilterPane: !layout.showFilterPane}})}
    />
  )
}

const modeItemProps = [
  {
    key: 'compact',
    Icon: BsGrid3X3,
    label: 'Compact',
  },
  {
    key: 'full',
    Icon: BsGrid,
    label: 'Detailed',
  },
]

const ProductListModeSelector = ({mode, onChange}) => {
  const selectedProps = modeItemProps.find(x => x.key === mode)
  const BaseButton = () =>
    <Button
      theme={{size: {xs: 'text-xs px-1'}}}
      className="SortDropdown"
      size="xs">
      <selectedProps.Icon className="h-5 w-5" />
    </Button>

  return (
    <Dropdown renderTrigger={BaseButton}>
      {modeItemProps.map(props =>
        <Dropdown.Item
          key={props.key}
          onClick={() => onChange(props.key)}
          icon={props.Icon}>
            {props.label}
        </Dropdown.Item>
      )}
    </Dropdown>
  )
}

const ProductListModeSelectorContainer = () => {
  const layout = useFluxStore(LayoutStore)
  return (
    <ProductListModeSelector
      mode={layout.productListMode}
      onChange={mode => dispatch({type: 'layout.set', layout: {productListMode: mode}})}
    />
  )
}

const FilterKeyword = ({keyword, onChange}) =>
  <TextInput
    className="FilterKeyword"
    icon={CgSearch}
    id="filterKeyword"
    onChange={e => onChange(e.target.value)}
    placeholder="Search products"
    type="search"
    value={keyword}
  />

const FilterKeywordContainer = () => {
  const filter = useFluxStore(FilterStore)
  return (
    <FilterKeyword
      keyword={filter.keyword}
      onChange={keyword => dispatch({type: 'filter.set', filter: {keyword}})}
    />
  )
}

const MapKeywordItem = forwardRef(({children, className, active, ...rest}, ref) =>
  <button
    {...rest}
    className={`${className} ${active ? 'active' : ''}`}
    ref={ref}
    tabIndex={-1}
    type="button">
    {children}
  </button>
)
MapKeywordItem.displayName = 'MapKeywordItem'

const MapKeyword = ({keyword, items, exact, onChangeKeyword, geolocationInProgress, onSelectCity, onGeolocate}) => {
  const [open, setOpen] = useState(false)
  const {refs, floatingStyles, context} = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [
      flip(),
      shift({padding: 8}),
      size({
        padding: 8,
        apply({availableHeight, elements}) {
          elements.floating.style.maxHeight = `${availableHeight}px`
          elements.floating.style.width = `${elements.reference.offsetWidth}px`
        },
      }),
    ],
  })
  const [activeIndex, setActiveIndex] = useState()
  const listRef = useRef([])
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'select'}),
    useDismiss(context),
    useListNavigation(context, {
      activeIndex,
      listRef,
      loop: true,
      onNavigate: setActiveIndex,
      virtual: true,
    }),
  ])

  const onKeyDown = useCallback(event => {
    if (event.key === 'Enter' && activeIndex != null) {
      if (activeIndex === 0) {
        onGeolocate()
      } else if (activeIndex - 1 < items.length) {
        onSelectCity(items[activeIndex - 1])
      }
      setActiveIndex(undefined)
      setOpen(false)
    }
  }, [onSelectCity, onGeolocate, activeIndex, items])

  const onChange = useCallback(event => {
    setActiveIndex(0)
    setOpen(true)
    onChangeKeyword(event.target.value)
  }, [onChangeKeyword])

  const onClickItem = index => () => {
    if (index === 0) {
      onGeolocate()
    } else {
      onSelectCity(items[index - 1])
    }
    setOpen(false)
  }

  const onFocus = useCallback(() => {
    if (!exact) {
      setOpen(true)
    }
  }, [exact])

  const onClick = useCallback(() => setOpen(true), [])

  const Floating = () =>
    <div
      {...getFloatingProps()}
      className="MapKeywordPopup shadow"
      ref={refs.setFloating}
      style={floatingStyles}>
      <MapKeywordItem
        {...getItemProps({onClick: onClickItem(0)})}
        active={activeIndex === 0}
        className="flex justify-between place-items-center"
        ref={node => listRef.current[0] = node}>
        <div className="flex place-items-center">
          <HiLocationMarker className="h-4 w-4 mr-2" />
          Current Location
        </div>
        {geolocationInProgress
          ? <Spinner className="spinner" aria-label="Geolocation in progress" size="sm" />
          : undefined
        }
      </MapKeywordItem>

      <div className="divider" />

      {items.map((item, index) =>
        <MapKeywordItem
          {...getItemProps({onClick: onClickItem(index + 1)})}
          active={activeIndex === index + 1}
          key={item.name}
          ref={node => listRef.current[index + 1] = node}>
          {item.name}
        </MapKeywordItem>
      )}
    </div>

  return (
    <>
      <TextInput
        {...getReferenceProps({onKeyDown, onChange, onFocus, onClick})}
        aria-autocomplete="list"
        autoComplete="off"
        className="MapKeyword"
        icon={HiLocationMarker}
        id="mapKeyword"
        placeholder="Near me"
        ref={refs.setReference}
        type="search"
        value={keyword}
      />
      {open &&
        <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
          <ErrorBoundary>
            {Floating()}
          </ErrorBoundary>
        </FloatingFocusManager>
      }
    </>
  )
}

const MapKeywordContainer = () => {
  const map = useFluxStore(MapStore)
  useFluxStore(LocationTypeaheadStore)
  return (
    <MapKeyword
      exact={map.keyword === map.city?.name}
      geolocationInProgress={map.geolocationInProgress}
      items={LocationTypeaheadStore.search(map.keyword)}
      keyword={map.keyword}
      onChangeKeyword={keyword => dispatch({type: 'map.changeKeyword', keyword})}
      onGeolocate={() => dispatch({type: 'map.geolocate'})}
      onSelectCity={item => dispatch({type: 'map.selectCity', city: item})}
    />
  )
}

const SearchBar = () =>
  <div className="SearchBar">
    <search className="SearchBarLeft">
      <ErrorBoundary>
        <FilterKeywordContainer />
        <MapKeywordContainer />
      </ErrorBoundary>
    </search>
    <div className="SearchBarRight">
      <ErrorBoundary>
        <SortDropdownContainer />
        <ToggleFilterPaneContainer />
        <ProductListModeSelectorContainer />
      </ErrorBoundary>
    </div>
  </div>

export const SearchBarContainer = SearchBar
