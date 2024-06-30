import MathUtil from '@util/MathUtil'
import {FormattedInput} from '@/feature/shared/component/FormattedInput'
import {RemoveButton, RecursiveErrors} from '@/feature/shared/component/Form'
import {mapDefined, parseAndUnnan} from '@util/ValidationUtil'
import {Select, SelectItem} from '@nextui-org/react'
import {useState} from 'react'
import ArrayUtil from '@/util/ArrayUtil'

export type WeightUnit = 'g' | 'oz' | 'lb'
export type PriceItem = {
  price: number
  weight: number
  weightUnit: WeightUnit
}

export type PartialPriceItem = {
  price: number | undefined
  weight: number | undefined
  weightUnit: WeightUnit
}


export const parseWeight = (x: string) =>
  mapDefined(parseAndUnnan(x), x => MathUtil.roundTo(x, 3))

export const parsePrice = (x: string) =>
  mapDefined(parseAndUnnan(x.replace('$', '')), x => MathUtil.roundTo(x, 2))

export const formatPrice = (price: number) => 
  price ? `$${price.toFixed(2)}` : ''

export const PriceItemInput = ({item, onChange}: {
  item: PartialPriceItem
  onChange: (item: PartialPriceItem) => void
}) => {
  return (
    <div className="contents">
      <FormattedInput
        className="mr-4"
        onChange={weight => onChange({...item, weight})}
        placeholder="0.000"
        value={item.weight}
        parse={parseWeight}
        format={weight => weight?.toString() ?? ''}
      />
      <Select
        aria-label="Select weight unit"
        className="mr-4"
        onSelectionChange={units => {
          const selectedUnit = Array.from(units)[0] as WeightUnit;
          onChange({...item, weightUnit: selectedUnit});
        }}
        selectedKeys={[item.weightUnit]}
      >
        <SelectItem key="g" value="g">g</SelectItem>
        <SelectItem key="oz" value="oz">oz</SelectItem>
        <SelectItem key="lb" value="lb">lb</SelectItem>
      </Select>
      <FormattedInput
        className="mr-4"
        onChange={price => onChange({...item, price})}
        placeholder="$0.00"
        value={item.price}
        parse={parsePrice}
        format={formatPrice}
      />
      <RemoveButton onClick={() => onChange({...item, price: undefined, weight: undefined})} />
    </div>
  )
}

const validatePriceList = (items: PartialPriceItem[]) => 
  ArrayUtil.sortBy(
    items.filter(item => item.price != null && item.weight != null && item.weight > 0),
    item => item.weight,
  ) as PriceItem[]

export const PriceListInput = ({defaultPriceList, errors, onChange}: {
  defaultPriceList: PriceItem[]
  errors?: Record<string, string>
  onChange: (priceList: PriceItem[]) => void
}) => {
  const [priceList, setPriceList] = useState<PartialPriceItem[]>(() => 
    defaultPriceList.length > 0 
      ? defaultPriceList 
      : [{price: undefined, weight: undefined, weightUnit: 'g'}]
  )

  const changeItem = (item: PartialPriceItem, index: number) => {
    const list = [...priceList]
    list[index] = item
    if (index === list.length - 1 && (item.price != null || item.weight != null)) {
      list.push({price: undefined, weight: undefined, weightUnit: 'g'})
    }

    setPriceList(list)
    onChange(validatePriceList(list))
  }

  return (
    <div
      className="grid items-center gap-2"
      style={{gridTemplateColumns: '160px 120px 160px max-content'}}
    >
      <div className="contents font-bold">
        <p>Weight</p>
        <p>Unit</p>
        <p>Price</p>
        <p />
      </div>

      {priceList.map((item, ix) =>
        <PriceItemInput
          item={item}
          key={ix}
          onChange={item => changeItem(item, ix)}
        />
      )}

      <RecursiveErrors errors={errors} />
    </div>
  )
}
