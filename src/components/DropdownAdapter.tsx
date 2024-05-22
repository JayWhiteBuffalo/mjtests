import { Select, SelectItem } from "@nextui-org/react"
import { useFormContext } from "react-hook-form"

export const DropdownAdapter = ({items, name, ...rest}) => {
  const {register, watch} = useFormContext()
  const value = watch(name)
  return (
    <Select
      {...register(name)}
      items={items}
      aria-label="Select item"
      className="max-w-xs"
      selectedKeys={value ? [value] : []}
      {...rest}
    >
      {(item) => <SelectItem key={item.key} value={item.key}>{item.name}</SelectItem>}
    </Select>
  )
}