import './FilterPane.css'
import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import {CgClose} from 'react-icons/cg'
import {CheckboxGroup, ButtonCbGroup} from '@components/CheckboxGroup'
import {CultivarTypeaheadStore, VendorTypeaheadStore, BrandTypeaheadStore} from '../state/DataStore'
import {ErrorBoundary} from '@components/Error'
import {FilterStore} from '../state/UIStore'
import {HiOutlineShoppingBag} from 'react-icons/hi2'
import {IntervalTextbox} from '@components/IntervalControl'
import {Label, RangeSlider} from 'flowbite-react'
import {LuClock2} from 'react-icons/lu'
import {ProductFilterUtil} from '@util/ProductFilterUtil'
import {RemoveButton} from '@components/Form'
import {SmallMultiDropdown, LargeMultiDropdown} from '@components/MultiDropdown'
import {TerpeneSelector} from '@components/TerpeneSelector'
import {Treemap} from '@/Treemap'
import {useFluxStore, dispatch} from '@/state/Flux'

export const ClearFilterButton = ({onClick}) =>
  <button
    className="ClearFilterButton ml-2"
    onClick={onClick}
    type="button">
    <CgClose size="1.5em" />
  </button>

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

const FilterSection = ({children}) =>
  <section className="border-gray-500 border-t my-3">
    {children}
  </section>

const FilterItem = ({children}) =>
  <div className="FilterPaneItem flex items-center justify-around my-1">
    {children}
  </div>


const CommonFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !ObjectUtil.equals(filter.flags, defaultFilter.flags)
    ? <ClearFilterButton
        onClick={() => onChange({flags: defaultFilter.flags})}
      />
    : undefined

  return (
    <FilterSection>
      <header className="flex justify-between">
        <span>Flags</span>
        {clearButton}
      </header>
      
      <FilterItem>
        <CheckboxGroup
          items={FlagFilterItems}
          values={filter.flags}
          onChange={flags => onChange({flags})}
        />
      </FilterItem>
    </FilterSection>
  )
}

const ProductTypeFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !(
    ObjectUtil.equals(filter.productTypes, defaultFilter.productTypes)
      && ObjectUtil.equals(filter.concentrateTypes, defaultFilter.concentrateTypes)
      && ObjectUtil.equals(filter.brands, defaultFilter.brands)
  )
    ? <ClearFilterButton
        onClick={() => onChange({
          productTypes: defaultFilter.productTypes,
          concentrateTypes: defaultFilter.concentrateTypes,
          brands: defaultFilter.brands,
        })}
      />
    : undefined

  return (
    <FilterSection>
      <header className="flex justify-between">
        <span>Category</span>
        {clearButton}
      </header>

      <FilterItem>
        <CheckboxGroup
          items={Treemap.productTypes}
          values={filter.productTypes}
          onChange={productTypes => onChange({productTypes})}
        />
      </FilterItem>

      <FilterItem>
        <Label className="flex-1" htmlFor="concentrateTypes">Concentrates</Label>
        <SmallMultiDropdown
          id="concentrateTypes"
          items={Treemap.concentrateTypes}
          values={filter.concentrateTypes}
          placeholder="Concentrates"
          onChange={concentrateTypes => onChange({concentrateTypes})}
        />
      </FilterItem>

      <FilterItem>
        <Label className="flex-1" htmlFor="brands">Brands</Label>
        <LargeMultiDropdown
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
    ObjectUtil.equals(filter.subspecies, defaultFilter.subspecies)
      && ObjectUtil.equals(filter.cultivars, defaultFilter.cultivars)
  )
    ? <ClearFilterButton
        onClick={() => onChange({
          subspecies: defaultFilter.subspecies,
          cultivars: defaultFilter.cultivars,
        })}
      />
    : undefined

  return (
    <FilterSection>
      <header className="flex justify-between">
        <span>Species</span>
        {clearButton}
      </header>

      <FilterItem>
        <ButtonCbGroup
          items={Treemap.filterableSubspecies}
          values={filter.subspecies}
          onChange={subspecies => onChange({subspecies})}
        />
      </FilterItem>

      <FilterItem>
        <Label className="flex-1" htmlFor="cultivars">Strains</Label>
        <LargeMultiDropdown
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
    ObjectUtil.deepEquals(filter.potency, defaultFilter.potency)
      && ArrayUtil.equals(filter.weight, defaultFilter.weight)
  )
    ? <ClearFilterButton
        onClick={() => onChange({potency: defaultFilter.potency, weight: defaultFilter.weight})}
      />
    : undefined

  return (
    <FilterSection>
      <header className="flex justify-between">
        <span>Potency and Weight</span>
        {clearButton}
      </header>
      <PotencyFilter potency={filter.potency} onChange={potency => onChange({potency})} />
      <WeightFilter range={filter.weight} onChange={weight => onChange({weight})} />
    </FilterSection>
  )
}

const PotencyFilter = ({potency, onChange}) =>
  <>
    <FilterItem>
      <Label className="flex-1" htmlFor="potency.thc.min">Total THC (%)</Label>
      <IntervalTextbox
        bound={[0, 1].map(x => x * 100)}
        id="potency.thc"
        onChange={range => onChange({...potency, thc: MathUtil.mapRange(range, x => x / 100)})}
        step={0.1}
        value={MathUtil.mapRange(potency.thc, x => MathUtil.roundTo(x * 100, 3))}
      />
    </FilterItem>

    <FilterItem>
      <Label className="flex-1" htmlFor="potency.cbd.min">Total CBD (%)</Label>
      <IntervalTextbox
        bound={[0, 1].map(x => x * 100)}
        id="potency.cbd"
        onChange={range => onChange({...potency, cbd: MathUtil.mapRange(range, x => x / 100)})}
        step={0.1}
        value={MathUtil.mapRange(potency.cbd, x => MathUtil.roundTo(x * 100, 3))}
      />
    </FilterItem>
  </>

const WeightFilter = ({range, onChange}) =>
  <FilterItem>
    <Label className="flex-1" htmlFor="weight.min">Weight (g)</Label>
    <IntervalTextbox
      bound={[0, 100]}
      id="weight"
      onChange={onChange}
      step={0.5}
      value={range}
    />
  </FilterItem>

const PriceFilterSection = ({filter, onChange}) => {
  const defaultFilter = ProductFilterUtil.defaultFilter()
  const clearButton = !(
    ArrayUtil.equals(filter.price, defaultFilter.price)
      && ArrayUtil.equals(filter.pricePerGram, defaultFilter.pricePerGram)
  )
    ? <ClearFilterButton
        onClick={() => onChange({price: defaultFilter.price, pricePerGram: defaultFilter.pricePerGram})}
      />
    : undefined

  return (
    <FilterSection>
      <header className="flex justify-between">
        <span>Price</span>
        {clearButton}
      </header>
      <FilterItem>
        <Label className="flex-1" htmlFor="price.min">Price ($)</Label>
        <IntervalTextbox
          bound={[0, 1000]}
          id="price"
          onChange={price => onChange({price})}
          step={0.1}
          value={filter.price}
        />
      </FilterItem>
      <FilterItem>
        <Label className="flex-1" htmlFor="pricePerGram.min">Price per gram ($/g)</Label>
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
    filter.location.distance === defaultFilter.location.distance
      && ObjectUtil.equals(filter.vendors, defaultFilter.vendors)
  )
    ? <ClearFilterButton
        onClick={() => onChange({location: {...filter.location, distance: defaultFilter.location.distance}, vendors: defaultFilter.vendors})}
      />
    : undefined

  return (
    <FilterSection>
      <header className="flex justify-between">
        <span>Location</span>
        {clearButton}
      </header>

      <FilterItem>
        <Label htmlFor="location.distance" className="flex-1">Distance (mi)</Label>
        <RangeSlider
          id="location.distance"
          max={bound[1]}
          min={bound[0]}
          onChange={e => onChange({location: {...filter.location, distance: +e.target.value}})}
          style={{width: '163px'}}
          value={filter.location.distance || bound[1]}
        />
      </FilterItem>

      <FilterItem>
        <Label className="flex-1" htmlFor="vendors">Stores</Label>
        <LargeMultiDropdown
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

const FilterLeftPane = ({filter, onChange}) =>
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
    <ErrorBoundary>
      <PriceFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary>
    <ErrorBoundary>
      <LocationFilterSection filter={filter} onChange={onChange} />
    </ErrorBoundary>
  </div>

const TerpFilterItem = ({terpName, range, bound, onChange, onRemove}) => {
  const color = Treemap.terpenesByName[terpName].color
  return (
    <FilterItem>
      <Label
        className="flex-1"
        style={{textTransform: 'capitalize', color}}
        htmlFor={'terps.' + terpName + '.min'}>
        {terpName} (%)
      </Label>
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
  const entries = ArrayUtil.sortBy(Object.entries(terps), ([terpName, _]) => Treemap.terpenesByName[terpName].index)
  const terpFilterNodes = entries.map(([terpName, range]) =>
    <TerpFilterItem
      bound={[0, 1]}
      key={terpName}
      onChange={range => onChange({...terps, [terpName]: range})}
      onRemove={() => onChange(ObjectUtil.delete(terps, terpName))}
      range={range}
      terpName={terpName}
    />
  )

  const clearButton = !ObjectUtil.isEmpty(terps)
    ? <ClearFilterButton onClick={() => onChange({})} />
    : undefined

  return (
    <FilterSection>
      <header className="flex justify-between">
        <span>Terpenes</span>
        {clearButton}
      </header>
      <TerpeneSelector
        onSelect={terpName => dispatch({type: 'filter.addTerp', terpName})}
        disabledTerps={terps}
      />
      {terpFilterNodes}
    </FilterSection>
  )
}

const FilterRightPane = ({filter, onChange, onRemoveTerp}) =>
  <div className="py-3 px-2">
    <ErrorBoundary>
      <TerpsFilterSection
        terps={filter.terps}
        onChange={terps => onChange({terps})}
        onRemove={onRemoveTerp}
      />
    </ErrorBoundary>
  </div>

const FilterPane = ({filter, onChange, onRemoveTerp}) =>
  <form className="FilterPane grid border-t border-gray-300">
    <FilterLeftPane filter={filter} onChange={onChange} />
    <FilterRightPane filter={filter} onChange={onChange} onRemoveTerp={onRemoveTerp} />
  </form>

export const FilterPaneContainer = () => {
  const filter = useFluxStore(FilterStore)
  return (
    <FilterPane
      filter={filter}
      onChange={filter => dispatch({type: 'filter.set', filter})}
    />
  )
}
