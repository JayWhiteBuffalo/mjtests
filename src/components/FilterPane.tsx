import './FilterPane.css'
import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import ObjectUtil from '@util/ObjectUtil'
import {CgClose} from 'react-icons/cg'
import {CheckboxGroup, ButtonCbGroup} from './CheckboxGroup'
import {CultivarTypeaheadStore, VendorTypeaheadStore, BrandTypeaheadStore} from '@state/DataStore'
import {dispatch} from '@state/Action'
import {FilterStore} from '@state/UIStore'
import {FilterUtil} from '@util/FilterUtil'
import {FluxContainer} from '@state/Flux'
import {HiOutlineShoppingBag} from 'react-icons/hi2'
import {IntervalTextbox} from './IntervalControl'
import {Label, RangeSlider} from 'flowbite-react'
import {LuClock2} from 'react-icons/lu'
import {SmallMultiDropdown, LargeMultiDropdown} from './MultiDropdown'
import {TerpsFilterSection} from './TerpsFilter'
import {Treemap} from '@/Treemap'

export const ClearFilterButton = ({onClick}) => 
  <button
    className="ClearFilterButton ml-2" 
    onClick={onClick}>
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

const CommonFilterSection = ({filter, onChange}) => {
  const defaultFilter = FilterUtil.defaultFilter()
  const clearButton = !ObjectUtil.equals(filter.flags, defaultFilter.flags)
    ? <ClearFilterButton
        onClick={() => onChange({flags: defaultFilter.flags})} />
    : undefined

  return (
    <fieldset className="FilterPaneSection">
      <legend>
        <span>Flags</span>
        {clearButton}
      </legend>
      <div className="FilterPaneItem">
        <CheckboxGroup
          items={FlagFilterItems}
          values={filter.flags}
          onChange={flags => onChange({flags})}
        />
      </div>
    </fieldset>
  )
}

const ProductTypeFilterSection = ({filter, onChange}) => {
  const defaultFilter = FilterUtil.defaultFilter()
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
        })} />
    : undefined

  return (
    <fieldset className="FilterPaneSection">
      <legend>
        <span>Category</span>
        {clearButton}
      </legend>
      <div className="FilterPaneItem">
        <CheckboxGroup
          items={Treemap.productTypes}
          values={filter.productTypes}
          onChange={productTypes => onChange({productTypes})}
        />
      </div>
      <div className="FilterPaneItem">
        <Label className="FilterPaneItemLabel" htmlFor="concentrateTypes">Concentrates</Label>
        <SmallMultiDropdown
          id="concentrateTypes"
          items={Treemap.concentrateTypes}
          values={filter.concentrateTypes}
          placeholder="Concentrates"
          onChange={concentrateTypes => onChange({concentrateTypes})} />
      </div>
      <div className="FilterPaneItem">
        <Label className="FilterPaneItemLabel" htmlFor="brands">Brands</Label>
        <LargeMultiDropdown
          id="brands"
          onChange={brands => onChange({brands})} 
          placeholder="Brands"
          TypeaheadStore={BrandTypeaheadStore}
          values={filter.brands}
          />
      </div>
    </fieldset>
  )
}

const SpeciesFilterSection = ({filter, onChange}) => {
  const defaultFilter = FilterUtil.defaultFilter()
  const clearButton = !(
    ObjectUtil.equals(filter.subspecies, defaultFilter.subspecies)
      && ObjectUtil.equals(filter.cultivars, defaultFilter.cultivars)
  )
    ? <ClearFilterButton 
        onClick={() => onChange({
          subspecies: defaultFilter.subspecies,
          cultivars: defaultFilter.cultivars,
        })} />
    : undefined

  return (
    <fieldset className="FilterPaneSection">
      <legend>
        <span>Species</span>
        {clearButton}
      </legend>
      <div className="FilterPaneItem">
        <ButtonCbGroup
          items={Treemap.filterableSubspecies}
          values={filter.subspecies}
          onChange={subspecies => onChange({subspecies})} />
      </div>
      <div className="FilterPaneItem">
        <Label className="FilterPaneItemLabel" htmlFor="cultivars">Strains</Label>
        <LargeMultiDropdown
          id="cultivars"
          onChange={cultivars => onChange({cultivars})} 
          placeholder="Strains"
          TypeaheadStore={CultivarTypeaheadStore}
          values={filter.cultivars}
          />
      </div>
    </fieldset>
  )
}

const PotencyFilterSection = ({filter, onChange}) => {
  const defaultFilter = FilterUtil.defaultFilter()
  const clearButton = !(
    ObjectUtil.deepEquals(filter.potency, defaultFilter.potency)
      && ArrayUtil.equals(filter.weight, defaultFilter.weight)
  )
    ? <ClearFilterButton 
        onClick={() => onChange({potency: defaultFilter.potency, weight: defaultFilter.weight})} />
    : undefined

  return (
    <fieldset className="FilterPaneSection">
      <legend>
        <span>Potency and Weight</span>
        {clearButton}
      </legend>
      <PotencyFilter potency={filter.potency} onChange={potency => onChange({potency})} />
      <WeightFilter range={filter.weight} onChange={weight => onChange({weight})} />
    </fieldset>
  )
}

const PotencyFilter = ({potency, onChange}) => 
  <>
    <div className="FilterPaneItem">
      <Label className="FilterPaneItemLabel" htmlFor="potency.thc.min">Total THC (%)</Label>
      <IntervalTextbox
        id="potency.thc"
        bound={[0, 1].map(x => x * 100)}
        value={MathUtil.mapRange(potency.thc, x => MathUtil.roundTo(x * 100, 3))}
        onChange={range => onChange({...potency, thc: MathUtil.mapRange(range, x => x / 100)})}
      />
    </div>
    <div className="FilterPaneItem">
      <Label className="FilterPaneItemLabel" htmlFor="potency.cbd.min">Total CBD (%)</Label>
      <IntervalTextbox
        id="potency.cbd"
        bound={[0, 1].map(x => x * 100)}
        value={MathUtil.mapRange(potency.cbd, x => MathUtil.roundTo(x * 100, 3))}
        onChange={range => onChange({...potency, cbd: MathUtil.mapRange(range, x => x / 100)})}
      />
    </div>
  </>

const WeightFilter = ({range, onChange}) => 
  <div className="FilterPaneItem">
    <Label className="FilterPaneItemLabel" htmlFor="weight.min">Weight (g)</Label>
    <IntervalTextbox
      id="weight"
      bound={[0, 100]}
      value={range}
      step={0.5}
      onChange={onChange} />
  </div>

const PriceFilterSection = ({filter, onChange}) => {
  const defaultFilter = FilterUtil.defaultFilter()
  const clearButton = !(
    ArrayUtil.equals(filter.price, defaultFilter.price)
      && ArrayUtil.equals(filter.pricePerGram, defaultFilter.pricePerGram)
  )
    ? <ClearFilterButton 
        onClick={() => onChange({price: defaultFilter.price, pricePerGram: defaultFilter.pricePerGram})} />
    : undefined

  return (
    <fieldset className="FilterPaneSection">
      <legend>
        <span>Price</span>
        {clearButton}
      </legend>
      <div className="FilterPaneItem">
        <Label className="FilterPaneItemLabel" htmlFor="price.min">Price ($)</Label>
        <IntervalTextbox
          id="price"
          bound={[0, 1000]}
          value={filter.price}
          onChange={price => onChange({price})} />
      </div>
      <div className="FilterPaneItem">
        <Label className="FilterPaneItemLabel" htmlFor="pricePerGram.min">Price per gram ($/g)</Label>
        <IntervalTextbox
          id="pricePerGram"
          bound={[0, 1000]}
          value={filter.pricePerGram}
          step={0.1}
          onChange={pricePerGram => onChange({pricePerGram})} />
      </div>
    </fieldset>
  )
}

const LocationFilterSection = ({filter, onChange}) => {
  const bound = [0, 30]

  const defaultFilter = FilterUtil.defaultFilter()
  const clearButton = !(
    filter.location.distance === defaultFilter.location.distance
      && ObjectUtil.equals(filter.vendors, defaultFilter.vendors)
  )
    ? <ClearFilterButton 
        onClick={() => onChange({location: {...filter.location, distance: defaultFilter.location.distance}, vendors: defaultFilter.vendors})} />
    : undefined

  return (
    <fieldset className="FilterPaneSection">
      <legend>
        <span>Location</span>
        {clearButton}
      </legend>
      <div className="FilterPaneItem">
        <Label htmlFor="location.distance" className="FilterPaneItemLabel">Distance (mi)</Label>
        <RangeSlider
          style={{width: '163px'}}
          id="location.distance"
          min={bound[0]}
          max={bound[1]}
          value={filter.location.distance || bound[1]}
          onChange={e => onChange({location: {...filter.location, distance: +e.target.value}})}
        />
      </div>
      <div className="FilterPaneItem">
        <Label className="FilterPaneItemLabel" htmlFor="vendors">Stores</Label>
        <LargeMultiDropdown
          id="vendors"
          onChange={vendors => onChange({vendors})} 
          placeholder="Stores"
          TypeaheadStore={VendorTypeaheadStore}
          values={filter.vendors}
          />
      </div>
    </fieldset>
  )
}

const FilterLeftPane = ({filter, onChange}) =>
  <div className="FilterPaneColumn">
    <CommonFilterSection filter={filter} onChange={onChange} />
    <ProductTypeFilterSection filter={filter} onChange={onChange} />
    <SpeciesFilterSection filter={filter} onChange={onChange} />
    <PotencyFilterSection filter={filter} onChange={onChange} />
    <PriceFilterSection filter={filter} onChange={onChange} />
    <LocationFilterSection filter={filter} onChange={onChange} />
  </div>

const FilterRightPane = ({filter, onChange, onRemoveTerp}) =>
  <div className="FilterPaneColumn">
    <TerpsFilterSection
      terps={filter.terps}
      onChange={terps => onChange({terps})}
      onRemove={onRemoveTerp} />
  </div>

const FilterPane = ({filter, onChange, onRemoveTerp}) =>
  <form className="FilterPane">
    <FilterLeftPane filter={filter} onChange={onChange} />
    <FilterRightPane filter={filter} onChange={onChange} onRemoveTerp={onRemoveTerp} />
  </form>

export const FilterPaneContainer = FluxContainer(
  [FilterStore],
  (filter) =>
    <FilterPane
      filter={filter}
      onChange={filter => dispatch({type: 'filter.set', filter})} />
)
