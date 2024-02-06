import './SearchBar.css'
import {BsGrid, BsGrid3X3} from 'react-icons/bs'
import {CgSearch} from 'react-icons/cg'
import {LocationTypeaheadStore} from '@state/DataStore'
import {dispatch} from '@state/Action'
import {FiDollarSign} from 'react-icons/fi'
import {FilterStore, LayoutStore, MapStore} from '@state/UIStore'
import {FluxContainer} from '@state/Flux'
import {GiPathDistance} from 'react-icons/gi'
import {HiOutlineChevronDoubleUp, HiOutlineChevronDoubleDown, HiOutlineChevronDown, HiLocationMarker} from 'react-icons/hi'
import {TbSortAscendingLetters} from 'react-icons/tb'
import {TextInput, Button, Dropdown, Spinner} from 'flowbite-react'
import {useFloating, useDismiss, useInteractions, useRole, flip, shift, size, FloatingFocusManager, useListNavigation} from '@floating-ui/react'
import {useState, useCallback, useRef, forwardRef, useId} from 'react'

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

const SortDropdownContainer = FluxContainer(
  [FilterStore],
  (filter) =>
    <SortDropdown
      sortBy={filter.sortBy}
      onChange={sortBy => dispatch({type: 'filter.set', filter: {sortBy}})} />
)

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

const ToggleFilterPaneContainer = FluxContainer(
  [LayoutStore],
  (layout) =>
    <ToggleFilterPane
      showFilterPane={layout.showFilterPane}
      onClick={() => dispatch({type: 'layout.set', layout: {showFilterPane: !layout.showFilterPane}})} />
)




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

const ProductListModeSelectorContainer = FluxContainer(
  [LayoutStore],
  (layout) =>
    <ProductListModeSelector
      mode={layout.productListMode}
      onChange={mode => dispatch({type: 'layout.set', layout: {productListMode: mode}})} />
)

const FilterKeyword = ({keyword, onChange}) =>
  <TextInput
    id="filterKeyword"
    type="search"
    className="FilterKeyword"
    value={keyword} 
    placeholder="Search products"
    icon={CgSearch}
    onChange={e => onChange(e.target.value)} />

const FilterKeywordContainer = FluxContainer(
  [FilterStore],
  filter => <FilterKeyword
    keyword={filter.keyword}
    onChange={keyword => dispatch({type: 'filter.set', filter: {keyword}})} />
)

const MapKeywordItem = forwardRef(({children, className, active, ...rest}, ref) => 
  <button
    {...rest}
    ref={ref}
    id={useId()}
    className={`${className} ${active ? 'active' : ''}`}
    role="option"
    tabIndex={-1}
    aria-selected={active}>
    {children}
  </button>
)

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
    useRole(context, {role: 'listbox'}),
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
          <div
            {...getFloatingProps()}
            ref={refs.setFloating}
            className="MapKeywordPopup shadow"
            style={floatingStyles}>

            <MapKeywordItem
              {...getItemProps({onClick: onClickItem(0)})}
              ref={node => listRef.current[0] = node}
              active={activeIndex === 0}
              className="flex justify-between place-items-center">
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
                ref={node => listRef.current[index + 1] = node}
                active={activeIndex === index + 1}
                key={item.name}>
                {item.name}
              </MapKeywordItem>
            )}
          </div>
        </FloatingFocusManager>
      }
    </>
  )
}

const MapKeywordContainer = FluxContainer(
  [MapStore, LocationTypeaheadStore],
  (map, _) =>
    <MapKeyword
      keyword={map.keyword}
      items={LocationTypeaheadStore.search(map.keyword)}
      exact={map.keyword === map.city?.name}
      geolocationInProgress={map.geolocationInProgress}
      onChangeKeyword={keyword => dispatch({type: 'map.changeKeyword', keyword})}
      onSelectCity={item => dispatch({type: 'map.selectCity', city: item})}
      onGeolocate={() => dispatch({type: 'map.geolocate'})} />
)

const SearchBar = () =>
  <div className="SearchBar">
    <search className="SearchBarLeft">
      <FilterKeywordContainer />
      <MapKeywordContainer />
    </search>
    <div className="SearchBarRight">
      <SortDropdownContainer />
      <ToggleFilterPaneContainer />
      <ProductListModeSelectorContainer />
    </div>
  </div>

export const SearchBarContainer = SearchBar
