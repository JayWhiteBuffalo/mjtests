import {Select, SelectItem} from '@nextui-org/react'
import {useFormContext} from 'react-hook-form'

export const DropdownAdapter = ({items, name, defaultValue, ...rest}) => {
  console.log(defaultValue)
  const {register, watch} = useFormContext()
  const value = watch(name)
  const selectedKey = value || defaultValue || '';
  return (
    <Select
      {...register(name)}
      items={items}
      aria-label="Select item"
      className="max-w-xs"
      selectedKeys={selectedKey ? [selectedKey] : []}
      {...rest}
    >
      {item => (
        <SelectItem key={item.key} value={item.key}>
          {item.name}
        </SelectItem>
      )}
    </Select>
  )
}
