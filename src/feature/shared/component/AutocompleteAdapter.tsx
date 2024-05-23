import {useFluxStore} from '@/state/Flux'
import {Autocomplete, AutocompleteItem} from '@nextui-org/react'
import {useFormContext} from 'react-hook-form'

export const AutocompleteAdapter = ({TypeaheadStore, name, ...rest}) => {
  const {register, watch} = useFormContext()
  const value = watch(name)
  useFluxStore(TypeaheadStore)
  const items = TypeaheadStore.search(value)

  return (
    <Autocomplete
      {...register(name)}
      items={items}
      aria-label="Select item"
      className="max-w-xs"
      selectedKeys={value ? [value] : []}
      {...rest}
    >
      {item => (
        <AutocompleteItem key={item.key} value={item.key}>
          {item.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  )
}
