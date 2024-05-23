import FlagObjectUtil from '@util/FlagObjectUtil'
import {
  Checkbox,
  CheckboxGroup as NextUiCheckboxGroup,
  Button,
  ButtonGroup,
} from '@nextui-org/react'

type Values = {[key: string]: boolean}
type CheckboxGroupItem = {
  name: string
  key: string
  Icon: any
}

type CheckboxGroupProps = {
  items: Array<CheckboxGroupItem>
  values: Values
  onChange: (values: Values) => void
}

export const CheckboxGroup = ({
  items,
  values,
  onChange,
  ...rest
}: CheckboxGroupProps) => (
  <NextUiCheckboxGroup
    onChange={values => onChange(FlagObjectUtil.fromIterable(values))}
    values={Object.keys(values)}
    {...rest}
  >
    {items.map(item => (
      <Checkbox
        key={item.key}
        icon={() => item.Icon && <item.Icon className="h-4 w-4" />}
        value={item.key}
      >
        {item.name}
      </Checkbox>
    ))}
  </NextUiCheckboxGroup>
)

const ButtonCbGroupItem = ({item, selected, onClick}) => (
  <Button color={selected ? 'primary' : 'default'} onPress={onClick}>
    {item.name}
  </Button>
)

export const ButtonCbGroup = ({
  items,
  values,
  onChange,
}: CheckboxGroupProps) => (
  <ButtonGroup className="flex flex-wrap">
    {items.map(item => (
      <ButtonCbGroupItem
        key={item.key}
        item={item}
        selected={item.key in values}
        onClick={() => onChange(FlagObjectUtil.toggle(values, item.key))}
      />
    ))}
  </ButtonGroup>
)
