import './FilterPane.css'
import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import {CgClose} from 'react-icons/cg'
import {CheckboxGroup, ButtonCbGroup} from '@/feature/shared/component/CheckboxGroup'
import {
  CultivarTypeaheadStore,
  VendorTypeaheadStore,
  BrandTypeaheadStore,
} from '@feature/shop/state/DataStore'
import {ErrorBoundary} from '@/feature/shared/component/Error'
import {FilterStore} from '@feature/shop/state/UIStore'
import {HiOutlineShoppingBag} from 'react-icons/hi2'
import {IntervalTextbox} from '@/feature/shared/component/IntervalControl'
import {LuClock2} from 'react-icons/lu'
import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'
import {RemoveButton} from '@/feature/shared/component/Form'
import {Slider, Button} from '@nextui-org/react'
import {SmallMultiDropdown, LargeMultiDropdown} from '@/feature/shared/component/MultiDropdown'
import {TerpeneSelector} from '@/feature/shared/component/TerpeneSelector'
import {Treemap} from '@/Treemap'
import {useFluxStore, dispatch} from '@/state/Flux'

export const ClearFilterButton = ({onClick}) => (
  <Button
    className="-my-1"
    isIconOnly
    onPress={onClick}
    size="sm"
    variant="light"
  >
    <CgClose className="w-6 h-6" />
  </Button>
)

const FlagFilterItems = [
  {
    key: 'openNow',
    name: 'Open now',
    Icon: LuClock2,
  },
  {
    key: 'promotion',
    name: 'On Sale',
    Icon: HiOutlineShoppingBag,
  },
]

const FilterSection = ({children}) => (
  <section className="border-gray-500 border-t my-3">{children}</section>
)

const FilterSectionHeader = ({children}) => (
  <header className="flex justify-between items-center my-1">{children}</header>
)

const FilterItem = ({children}) => (
  <div className="FilterPaneItem flex items-center justify-around my-1">
    {children}
  </div>
)

const CommonFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !ObjectUtil.equals(filter.flags, defaultFilter.flags) ? (
    <ClearFilterButton onClick={() => onChange({flags: defaultFilter.flags})} />
  ) : undefined

  return (
    <FilterSection>
      <FilterSectionHeader>
        <span>Flags</span>
        {clearButton}
      </FilterSectionHeader>

      <FilterItem>
        <CheckboxGroup
          aria-label="Select common flag filters"
          items={FlagFilterItems}
          onChange={flags => onChange({flags})}
          orientation="horizontal"
          values={filter.flags}
        />
      </FilterItem>
    </FilterSection>
  )
}

const ProductTypeFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !(
    ObjectUtil.equals(filter.productTypes, defaultFilter.productTypes) &&
    ObjectUtil.equals(
      filter.concentrateTypes,
      defaultFilter.concentrateTypes,
    ) &&
    ObjectUtil.equals(filter.brands, defaultFilter.brands)
  ) ? (
    <ClearFilterButton
      onClick={() =>
        onChange({
          productTypes: defaultFilter.productTypes,
          concentrateTypes: defaultFilter.concentrateTypes,
          brands: defaultFilter.brands,
        })
      }
    />
  ) : undefined

  return (
    <FilterSection>
      <FilterSectionHeader>
        <span>Category</span>
        {clearButton}
      </FilterSectionHeader>

      <FilterItem>
        <CheckboxGroup
          aria-label="Select product types"
          items={Treemap.productTypes}
          onChange={productTypes => onChange({productTypes})}
          orientation="horizontal"
          values={filter.productTypes}
        />
      </FilterItem>

      <FilterItem>
        <label className="flex-1" htmlFor="concentrateTypes">
          Concentrates
        </label>
        <SmallMultiDropdown
          className="w-40"
          id="concentrateTypes"
          items={Treemap.concentrateTypes}
          values={filter.concentrateTypes}
          placeholder="Concentrates"
          onChange={concentrateTypes => onChange({concentrateTypes})}
        />
      </FilterItem>

      <FilterItem>
        <label className="flex-1" htmlFor="brands">
          Brands
        </label>
        <LargeMultiDropdown
          className="w-40"
          id="brands"
          onChange={brands => onChange({brands})}
          placeholder="Brands"
          TypeaheadStore={BrandTypeaheadStore}
          values={filter.brands}
        />
      </FilterItem>
    </FilterSection>
  )
}

const SpeciesFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !(
    ObjectUtil.equals(filter.subspecies, defaultFilter.subspecies) &&
    ObjectUtil.equals(filter.cultivars, defaultFilter.cultivars)
  ) ? (
    <ClearFilterButton
      onClick={() =>
        onChange({
          subspecies: defaultFilter.subspecies,
          cultivars: defaultFilter.cultivars,
        })
      }
    />
  ) : undefined

  return (
    <FilterSection>
      <FilterSectionHeader>
        <span>Species</span>
        {clearButton}
      </FilterSectionHeader>

      <FilterItem>
        <ButtonCbGroup
          items={Treemap.filterableSubspecies}
          values={filter.subspecies}
          onChange={subspecies => onChange({subspecies})}
        />
      </FilterItem>

      <FilterItem>
        <label className="flex-1" htmlFor="cultivars">
          Strains
        </label>
        <LargeMultiDropdown
          className="w-40"
          id="cultivars"
          onChange={cultivars => onChange({cultivars})}
          placeholder="Strains"
          TypeaheadStore={CultivarTypeaheadStore}
          values={filter.cultivars}
        />
      </FilterItem>
    </FilterSection>
  )
}

const PotencyFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !(
    ObjectUtil.deepEquals(filter.potency, defaultFilter.potency) &&
    ArrayUtil.equals(filter.weight, defaultFilter.weight)
  ) ? (
    <ClearFilterButton
      onClick={() =>
        onChange({potency: defaultFilter.potency, weight: defaultFilter.weight})
      }
    />
  ) : undefined

  return (
    <FilterSection>
      <FilterSectionHeader>
        <span>Potency and Weight</span>
        {clearButton}
      </FilterSectionHeader>
      <PotencyFilter
        potency={filter.potency}
        onChange={potency => onChange({potency})}
      />
      {/* <WeightFilter
        range={filter.weight}
        onChange={weight => onChange({weight})}
      /> */}
    </FilterSection>
  )
}

const PotencyFilter = ({potency, onChange}) => (
  <>
    <FilterItem>
      <label className="flex-1" htmlFor="potency.thc.min">
        Total THC (%)
      </label>
      <IntervalTextbox
        bound={[0, 1].map(x => x * 100)}
        id="potency.thc"
        onChange={range =>
          onChange({...potency, thc: MathUtil.mapRange(range, x => x / 100)})
        }
        step={0.1}
        value={MathUtil.mapRange(potency.thc, x =>
          MathUtil.roundTo(x * 100, 3),
        )}
      />
    </FilterItem>

    <FilterItem>
      <label className="flex-1" htmlFor="potency.cbd.min">
        Total CBD (%)
      </label>
      <IntervalTextbox
        bound={[0, 1].map(x => x * 100)}
        id="potency.cbd"
        onChange={range =>
          onChange({...potency, cbd: MathUtil.mapRange(range, x => x / 100)})
        }
        step={0.1}
        value={MathUtil.mapRange(potency.cbd, x =>
          MathUtil.roundTo(x * 100, 3),
        )}
      />
    </FilterItem>
  </>
)

const WeightFilter = ({range, onChange}) => (
  <FilterItem>
    <label className="flex-1" htmlFor="weight.min">
      Weight (g)
    </label>
    <IntervalTextbox
      bound={[0, 100]}
      id="weight"
      onChange={onChange}
      step={0.5}
      value={range}
    />
  </FilterItem>
)

const PriceFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !(
    ArrayUtil.equals(filter.price, defaultFilter.price) &&
    ArrayUtil.equals(filter.pricePerGram, defaultFilter.pricePerGram)
  ) ? (
    <ClearFilterButton
      onClick={() =>
        onChange({
          price: defaultFilter.price,
          pricePerGram: defaultFilter.pricePerGram,
        })
      }
    />
  ) : undefined

  return (
    <FilterSection>
      <FilterSectionHeader>
        <span>Price</span>
        {clearButton}
      </FilterSectionHeader>
      <FilterItem>
        <label className="flex-1" htmlFor="price.min">
          Price ($)
        </label>
        <IntervalTextbox
          bound={[0, 1000]}
          id="price"
          onChange={price => onChange({price})}
          step={0.1}
          value={filter.price}
        />
      </FilterItem>
      <FilterItem>
        <label className="flex-1" htmlFor="pricePerGram.min">
          Price per gram ($/g)
        </label>
        <IntervalTextbox
          bound={[0, 1000]}
          id="pricePerGram"
          onChange={pricePerGram => onChange({pricePerGram})}
          step={0.1}
          value={filter.pricePerGram}
        />
      </FilterItem>
    </FilterSection>
  )
}

const LocationFilterSection = ({filter, onChange}) => {
  const bound = [0, 30]

  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !(
    filter.location.distance === defaultFilter.location.distance &&
    ObjectUtil.equals(filter.vendors, defaultFilter.vendors)
  ) ? (
    <ClearFilterButton
      onClick={() =>
        onChange({
          location: {
            ...filter.location,
            distance: defaultFilter.location.distance,
          },
          vendors: defaultFilter.vendors,
        })
      }
    />
  ) : undefined

  return (
    <FilterSection>
      <FilterSectionHeader>
        <span>Location</span>
        {clearButton}
      </FilterSectionHeader>

      <FilterItem>
        <label htmlFor="location.distance" className="flex-1">
          Distance (mi)
        </label>
        <Slider
          aria-label="Select distance in miles"
          id="location.distance"
          maxValue={bound[1]}
          minValue={bound[0]}
          onChange={distance =>
            onChange({location: {...filter.location, distance}})
          }
          showTooltip
          style={{width: '163px'}}
          value={filter.location.distance || bound[1]}
        />
      </FilterItem>

      <FilterItem>
        <label className="flex-1" htmlFor="vendors">
          Stores
        </label>
        <LargeMultiDropdown
          className="w-40"
          id="vendors"
          onChange={vendors => onChange({vendors})}
          placeholder="Stores"
          TypeaheadStore={VendorTypeaheadStore}
          values={filter.vendors}
        />
      </FilterItem>
    </FilterSection>
  )
}

const FilterLeftPane = ({filter, onChange}) => (
  <div className="py-3 px-2">
    <ErrorBoundary>
      <CommonFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary>
    <ErrorBoundary>
      <ProductTypeFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary>
    <ErrorBoundary>
      <SpeciesFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary>
    <ErrorBoundary>
      <PotencyFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary>
    {/* <ErrorBoundary>
      <PriceFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary> */}
    <ErrorBoundary>
      <LocationFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary>
  </div>
)

const TerpFilterItem = ({terpName, range, bound, onChange, onRemove}) => {
  const color = Treemap.terpenesByName[terpName].color
  return (
    <FilterItem>
      <label
        className="flex-1"
        style={{textTransform: 'capitalize', color}}
        htmlFor={'terps.' + terpName + '.min'}
      >
        {terpName} (%)
      </label>
      <IntervalTextbox
        bound={bound.map(x => x * 100)}
        id={'terps.' + terpName}
        onChange={range => onChange(MathUtil.mapRange(range, x => x / 100))}
        step={0.1}
        value={MathUtil.mapRange(range, x => MathUtil.roundTo(x * 100, 3))}
      />
      <RemoveButton onClick={onRemove} />
    </FilterItem>
  )
}

export const TerpsFilterSection = ({terps, onChange}) => {
  const entries = ArrayUtil.sortBy(
    Object.entries(terps),
    ([terpName, _]) => Treemap.terpenesByName[terpName].index,
  )

  const terpFilterNodes = entries.map(([terpName, range]) => (
    <TerpFilterItem
      bound={[0, 1]}
      key={terpName}
      onChange={range => onChange({...terps, [terpName]: range})}
      onRemove={() => onChange(ObjectUtil.delete(terps, terpName))}
      range={range}
      terpName={terpName}
    />
  ))

  const clearButton = !ObjectUtil.isEmpty(terps) ? (
    <ClearFilterButton onClick={() => onChange({})} />
  ) : undefined

  return (
    <FilterSection>
      <FilterSectionHeader>
        <span>Terpenes</span>
        {clearButton}
      </FilterSectionHeader>
      <TerpeneSelector
        onSelect={terpName => dispatch({type: 'filter.addTerp', terpName})}
        disabledTerps={terps}
      />
      {terpFilterNodes}
    </FilterSection>
  )
}

const getMostPotentFilter = terps => {
  const entries = Object.entries(terps)
  if (entries.length !== 0) {
    const [terpName, range] = ArrayUtil.sortBy(entries, ([_, range]) => -range[0])[0]
    if (range[0] > 0) {
      return terpName
    }
  }
  return undefined
}

const FilterRightPane = ({filter, onChange, onRemoveTerp}) => {
  const onTerpsChange = terps => {
    const mostPotent = getMostPotentFilter(terps)
    let sortBy = undefined
    if (mostPotent) {
      sortBy = `terps.${mostPotent}`
    } else if (filter.sortBy.startsWith('terps.')) {
      sortBy = 'name'
    }
    if (sortBy) {
      onChange({terps, sortBy})
    } else {
      onChange({terps})
    }
    
  }

  return (
    <div className="py-3 px-2">
      <ErrorBoundary>
        <TerpsFilterSection
          terps={filter.terps}
          onChange={onTerpsChange}
          onRemove={onRemoveTerp}
        />
      </ErrorBoundary>
    </div>

  )
}

const FilterPane = ({filter, onChange, onRemoveTerp}) => (
  <form className="FilterPane grid border-t border-gray-300">
    <FilterLeftPane filter={filter} onChange={onChange} />
    <FilterRightPane
      filter={filter}
      onChange={onChange}
      onRemoveTerp={onRemoveTerp}
    />
  </form>
)

export const FilterPaneContainer = () => {
  const filter = useFluxStore(FilterStore)
  return (
    <FilterPane
      filter={filter}
      onChange={filter => dispatch({type: 'filter.set', filter})}
    />
  )
}
