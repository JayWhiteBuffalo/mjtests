import './CheckboxGroup.css'
import clsx from 'clsx'
import FlagObjectUtil from '@util/FlagObjectUtil'
import {Button, Checkbox, Label} from 'flowbite-react'

type Values = {[key: string]: boolean}
type CheckboxGroupItem = {
  name: string,
  key: string,
  Icon: any,
}

type CheckboxGroupProps = {
  items: Array<CheckboxGroupItem>,
  values: Values,
  onChange: (values: Values) => void,
}

const CheckboxGroupItem = ({item, checked, onChange}) =>
  <Label
    htmlFor={item.key}
    className="inline-flex items-center mx-1 my-1 select-none"
    tabIndex="-1"
  >
    <Checkbox
      checked={checked}
      className="CheckboxGroupItemBox align-text-bottom mr-1"
      id={item.key}
      onChange={onChange}
    />
    {item.Icon ? <item.Icon className="mr-1 inline-block h-4 w-4" /> : undefined}
    {item.name}
  </Label>

export const CheckboxGroup = ({items, values, onChange}: CheckboxGroupProps) => 
  <div className="CheckboxGroup">
    {items.map(item =>
      <CheckboxGroupItem
        item={item}
        key={item.key}
        checked={item.key in values}
        onChange={() => onChange(FlagObjectUtil.toggle(values, item.key))}
      />
    )}
  </div>

const ButtonCbGroupItem = ({item, selected, onClick}) =>
  <Button
    color="gray"
    theme={{
      color: {
        gray: 'text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 :ring-cyan-700 focus:text-cyan-700',
      },
    }}
    size="sm"
    className={clsx(
      'ButtonCbGroupItem',
      'border-gray-300 transition rounded-none',
      selected ? 'bg-sky-50 border-sky-600 z-20' : undefined,
    )}
    onClick={onClick}
    onMouseDown={event => event.preventDefault()}
  >
    {item.name}
  </Button>

export const ButtonCbGroup = ({items, values, onChange}: CheckboxGroupProps) => 
  <div className="flex flex-wrap">
    {items.map(item =>
      <ButtonCbGroupItem
        key={item.key}
        item={item} 
        selected={item.key in values}
        onClick={() => onChange(FlagObjectUtil.toggle(values, item.key))}
      />
    )}
  </div>
