import MathUtil from '@util/MathUtil'
import {FormattedInput} from '@/feature/shared/component/FormattedInput'
import {RemoveButton, RecursiveErrors} from '@/feature/shared/component/Form'
import {mapDefined, parseAndUnnan} from '@util/ValidationUtil'
import {Button, Select, SelectItem} from '@nextui-org/react'
import {useState} from 'react'
import ArrayUtil from '@/util/ArrayUtil'
import ComponentToRemove from '@/feature/shared/component/VisableWrap'

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

export const PriceItemInput = ({item, onChange, onRemove}: {
  item: PartialPriceItem
  onChange: (item: PartialPriceItem) => void
}) => {

  const handleRemoveAndChange = () => {
    onChange({ ...item, price: undefined, weight: undefined });
  };


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
       <Button onClick={handleRemoveAndChange}> Clear </Button>
    </div>
  )
}

const validatePriceList = (items: PartialPriceItem[]) => 
  ArrayUtil.sortBy(
    items.filter(item => item.price != null && item.weight != null && item.weight > 0),
    item => item.weight,
  ) as PriceItem[]

  export const PriceListInput = ({ defaultPriceList, errors, onChange }: {
    defaultPriceList: PriceItem[];
    errors?: Record<string, string>;
    onChange: (priceList: PriceItem[]) => void;
  }) => {
    const [priceList, setPriceList] = useState<PartialPriceItem[]>(() => 
      defaultPriceList.length > 0 
        ? defaultPriceList 
        : [{ price: undefined, weight: undefined, weightUnit: 'g' }]
    );
  
    const changeItem = (item: PartialPriceItem, index: number) => {
      const list = [...priceList];
      list[index] = item;
      if (index === list.length - 1 && (item.price != null || item.weight != null)) {
        list.push({ price: undefined, weight: undefined, weightUnit: 'g' });
      }
  
      setPriceList(list);
      onChange(validatePriceList(list));
    };
  
    const handleRemove = (idToRemove: number) => {
      const updatedPriceList = priceList.filter((item, index) => index !== idToRemove);
      setPriceList(updatedPriceList);
      onChange(validatePriceList(updatedPriceList));
      console.log("Hand Removed fired");
    };
  
    return (
      <div className="grid items-center gap-2" >
        <div className="font-bold grid grid-cols-4 gap-10 justify-evenly">
          <p cl>Weight</p>
          <p>Unit</p>
          <p>Price</p>
          <p />
        </div>

        <div className='w-full'>
        {priceList.map((item, index) => (
        <ComponentToRemove key={index} id={index} onRemove={() => handleRemove(index)} onChange={() => console.log('Item changed')}>
          <PriceItemInput
            item={item}
            key={index}
            onChange={(updatedItem) => changeItem(updatedItem, index)}
          />
        </ComponentToRemove>
      ))}
      </div>

      {/* Assuming RecursiveErrors is another component to display errors */}
      <RecursiveErrors errors={errors} />
    </div>
  );
};


