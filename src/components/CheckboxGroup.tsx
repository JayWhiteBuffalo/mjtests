import './CheckboxGroup.css'
import FlagsUtil from '@util/FlagsUtil'
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

export const CheckboxGroup = ({items, values, onChange}: CheckboxGroupProps) => {
  const CheckboxItem = item =>
    <Label
      htmlFor={item.key}
      className="CheckboxGroupItem"
      tabIndex="-1"
      key={item.key}>
      <Checkbox
        className="CheckboxGroupItemBox"
        id={item.key}
        onChange={() => onChange(FlagsUtil.toggle(values, item.key))}
        checked={values[item.key] ? 'checked' : ''} />
      {item.Icon ? <item.Icon className="mr-1 inline-block h-4 w-4" /> : undefined}
      {item.name}
    </Label>
  return <div className="CheckboxGroup">{items.map(CheckboxItem)}</div>
}


export const ButtonCbGroup = ({items, values, onChange}: CheckboxGroupProps) => {
  const Item = item =>
    <Button
      color="gray"
      theme={{
        color: {
          gray: 'text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 :ring-cyan-700 focus:text-cyan-700',
        },
      }}
      size="sm"
      className={`ButtonCbGroupItem ${values[item.key] ? 'checked' : ''}`}
      onClick={() => onChange(FlagsUtil.toggle(values, item.key))}
      onMouseDown={event => event.preventDefault()}
      key={item.key}>
      {item.name}
    </Button>
  return (
    <div className="ButtonCbGroup">
      {items.map(Item)}
    </div>
  )
}
