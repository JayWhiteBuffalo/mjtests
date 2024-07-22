import './SearchBar.css'
import {BsGrid, BsGrid3X3} from 'react-icons/bs'
import {CgSearch} from 'react-icons/cg'
import {ErrorBoundary} from '@/feature/shared/component/Error'
import {FiDollarSign} from 'react-icons/fi'
import {FilterStore, LayoutStore, MapStore} from '@feature/shop/state/UIStore'
import {useFluxStore, dispatch} from '@/state/Flux'
import {GiPathDistance} from 'react-icons/gi'
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDown,
  HiLocationMarker,
} from 'react-icons/hi'
import {LocationTypeaheadStore} from '@feature/shop/state/DataStore'
import {TbSortAscendingLetters} from 'react-icons/tb'
import {
  Button,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Input,
} from '@nextui-org/react'
import {
  useFloating,
  useDismiss,
  useInteractions,
  useRole,
  flip,
  shift,
  size,
  FloatingFocusManager,
  useListNavigation,
} from '@floating-ui/react'
import {useState, useCallback, useRef, forwardRef, type ReactNode, type HTMLProps, type PropsWithChildren, type KeyboardEvent} from 'react'
import {Treemap} from '@/Treemap'
import type {ProductSort} from '@/feature/shop/type/Shop'
import type {ProductListMode} from '@/feature/shop/type/Ui'
import {nullthrows} from '@/util/nullthrows'

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

const SortDropdown = ({sortBy, onChange}: {
  sortBy: ProductSort
  onChange: (sortBy: ProductSort) => void
}) => {
  let selectedProps = sortItemProps.find(x => x.key === sortBy)
  const itemProps = sortItemProps
  if (!selectedProps && sortBy.startsWith('terps.')) {
    const terpName = sortBy.split('.')[1]
    selectedProps = {
      Icon: () => undefined,
      key: sortBy,
      label: Treemap.terpenesByName[terpName].name,
    }
    itemProps.push(selectedProps)
  }
  nullthrows(selectedProps)

  return (
    <Dropdown classNames={{content: 'min-w-90'}}>
      <DropdownTrigger>
        <Button
          className="SortDropdown neu-input"
          startContent={selectedProps.Icon && <selectedProps.Icon />}
          endContent={<HiOutlineChevronDown />}
        >
          Sort: {selectedProps.label}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Product list sort by"
        onAction={key => onChange(key)}
        className='neu-input'
      >
        {itemProps.map(props => (
          <DropdownItem key={props.key} startContent={props.Icon && <props.Icon />}>
            {props.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
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

const ToggleFilterPane = ({showFilterPane, onClick}: {
  showFilterPane: boolean
  onClick: () => void
}) => (
  <Button
    className="ToggleFilterPane neu-input"
    onPress={onClick}
    endContent={
      showFilterPane ? (
        <HiOutlineChevronDoubleUp />
      ) : (
        <HiOutlineChevronDoubleDown />
      )
    }
  >
    Filters
  </Button>
)

const ToggleFilterPaneContainer = () => {
  const layout = useFluxStore(LayoutStore)
  return (
    <ToggleFilterPane
      showFilterPane={layout.showFilterPane}
      onClick={() =>
        dispatch({
          type: 'layout.set',
          layout: {showFilterPane: !layout.showFilterPane},
        })
      }
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

const ProductListModeSelector = ({mode, onChange}: {
  mode: ProductListMode
  onChange: (mode: ProductListMode) => void
}) => {
  const selectedProps = modeItemProps.find(x => x.key === mode)!

  return (
    <Dropdown>
      <DropdownTrigger >
        <Button className="ToggleFilterPane bg-blue-300 neu-input" isIconOnly>
          <selectedProps.Icon className="h-5 w-5" />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Product list details mode"
        onAction={key => onChange(key)}
      >
        {modeItemProps.map(props => (
          <DropdownItem key={props.key} startContent={<props.Icon />}>
            {props.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

const ProductListModeSelectorContainer = () => {
  const layout = useFluxStore(LayoutStore)
  return (
    <ProductListModeSelector
      mode={layout.productListMode}
      onChange={mode =>
        dispatch({type: 'layout.set', layout: {productListMode: mode}})
      }
    />
  )
}

const FilterKeyword = ({keyword, onChange}: {
  keyword: string
  onChange: (keyword: string) => void
}) => (
  //<Input
  //   className="shadow-neu flex-1 basis-40"
  //   id="filterKeyword"
  //   isClearable
  //   onChange={e => onChange(e.target.value)}
  //   placeholder="Search products"
  //   startContent={<CgSearch className="w-6 h-6 text-gray-500" />}
  //   type="search"
  //   value={keyword}
  // />
  <input className="shadow-neu flex-1 basis-40 neu-input"
    id="filterKeyword"
    // isClearable
    onChange={e => onChange(e.target.value)}
    placeholder="Search products"
    // startContent={<CgSearch className="w-6 h-6 text-gray-500" />}
    type="search"
    value={keyword}></input>
)

const FilterKeywordContainer = () => {
  const filter = useFluxStore(FilterStore)
  return (
    <FilterKeyword
      keyword={filter.keyword}
      onChange={keyword => dispatch({type: 'filter.set', filter: {keyword}})}
    />
  )
}

export type MapKeywordItemProps = {
  children: ReactNode
  className?: string
  active: boolean
} & HTMLProps<HTMLButtonElement>

const MapKeywordItem = forwardRef<HTMLButtonElement, MapKeywordItemProps>(
  ({children, className, active, ...rest}: PropsWithChildren<MapKeywordItemProps>, ref) => (
    <button
      className={`${className} ${active ? 'active' : ''}`}
      ref={ref}
      tabIndex={-1}
      type="button"
      {...rest}
    >
      {children}
    </button>
  ),
)
MapKeywordItem.displayName = 'MapKeywordItem'

const MapKeyword = ({
  keyword,
  items,
  exact,
  onChangeKeyword,
  geolocationInProgress,
  onSelectCity,
  onGeolocate,
}: {
  keyword: string
  items: Array<{name: string}>
  exact: boolean
  onChangeKeyword: (keyword: string) => void
  geolocationInProgress: boolean
  onSelectCity: (item: {name: string}) => void
  onGeolocate: () => void
}) => {
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

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && activeIndex != null) {
        if (activeIndex === 0) {
          onGeolocate()
        } else if (activeIndex - 1 < items.length) {
          onSelectCity(items[activeIndex - 1])
        }
        setActiveIndex(undefined)
        setOpen(false)
      }
    },
    [onSelectCity, onGeolocate, activeIndex, items],
  )

  const onChange = useCallback(
    (event: KeyboardEvent) => {
      setActiveIndex(0)
      setOpen(true)
      onChangeKeyword(event.target.value)
    },
    [onChangeKeyword],
  )

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

  const Floating = () => (
    <div
      {...getFloatingProps()}
      className="MapKeywordPopup shadow"
      ref={refs.setFloating}
      style={floatingStyles}
    >
      <MapKeywordItem
        {...getItemProps({onClick: onClickItem(0)})}
        active={activeIndex === 0}
        className="flex justify-between place-items-center"
        ref={node => (listRef.current[0] = node)}
      >
        <div className="flex place-items-center">
          <HiLocationMarker className="h-4 w-4 mr-2" />
          Current Location
        </div>
        {geolocationInProgress ? (
          <Spinner
            className="spinner"
            aria-label="Geolocation in progress"
            size="sm"
          />
        ) : undefined}
      </MapKeywordItem>

      <div className="divider" />

      {items.map((item, index) => (
        <MapKeywordItem
          {...getItemProps({onClick: onClickItem(index + 1)})}
          active={activeIndex === index + 1}
          key={item.name}
          ref={node => (listRef.current[index + 1] = node)}
        >
          {item.name}
        </MapKeywordItem>
      ))}
    </div>
  )

  return (
    <>
      <input
        {...getReferenceProps({onKeyDown, onChange, onFocus, onClick})}
        aria-autocomplete="list"
        autoComplete="off"
        className="flex-1 basis-32 neu-input"
        // startContent={<HiLocationMarker className="w-6 h-6 fill-gray-500" />}
        id="mapKeyword"
        placeholder="Near me"
        ref={refs.setReference}
        type="search"
        value={keyword}
      />
      {open && (
        <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
          <ErrorBoundary>{Floating()}</ErrorBoundary>
        </FloatingFocusManager>
      )}
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
      onChangeKeyword={keyword =>
        dispatch({type: 'map.changeKeyword', keyword})
      }
      onGeolocate={() => dispatch({type: 'map.geolocate'})}
      onSelectCity={item => dispatch({type: 'map.selectCity', city: item})}
    />
  )
}

const VendorPanelToggle = ({updatePane}) => {

  

  return (
    <button onClick={()=>updatePane('vendors')} className=" px-4 shadow-neu flex-1 basis-40 neu-input">
      Vendors
    </button>
  )
}

const SearchBar = (setToggle) => (
  <div className="searchBarCont">
    <search className="flex flex-wrap gap-4 ">
      <ErrorBoundary>
        <VendorPanelToggle setToggle={setToggle}/>
        <FilterKeywordContainer />
        <MapKeywordContainer />
        <SortDropdownContainer />
        <ToggleFilterPaneContainer />
        <ProductListModeSelectorContainer />
      </ErrorBoundary>
    </search>
  </div>
)

export const SearchBarContainer = SearchBar
