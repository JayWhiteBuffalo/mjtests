import FlagObjectUtil from '@util/FlagObjectUtil'
import {
  Checkbox,
  CheckboxGroup as NextUiCheckboxGroup,
  Button,
  ButtonGroup,
} from '@nextui-org/react'
import clsx from 'clsx'

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
    className='w-full flex items-stretch justify-center'
    {...rest}
  >
    {items.map(item => (
      <Checkbox
        key={item.key}
        icon={() => item.Icon && <item.Icon className="h-4 w-4" />}
        value={item.key}
        className={clsx(
          "neoButton hover:bg-content2",
          "flex bg-content1 m-1 w-auto",
          "items-center justify-start",
          "cursor-pointer p-4 text-center text-sm"
        )}
      >
        {item.name}
      </Checkbox>
    ))}
  </NextUiCheckboxGroup>
)

// export const CheckboxGroup = ({
//   items,
//   values,
//   onChange,
//   ...rest
// }: CheckboxGroupProps) => (
//   <NextUiCheckboxGroup
//     onChange={values => onChange(FlagObjectUtil.fromIterable(values))}
//     values={Object.keys(values)}
//     {...rest}
//     className='w-full flex items-stretch justify-center'
//   >
//     {items.map(item => (
//       <>
//               <label
//           className={clsx(
//             "neoButton hover:bg-content2",
//             "flex bg-content1 m-1 w-auto",
//             "items-center justify-start",
//             "cursor-pointer p-4 text-center text-sm"
//           )}
//         >
//       <Checkbox
//       classNames={{
//         base: clsx(
//           "absolute w-full h-full opacity-0 cursor-pointer"
//         ),
        
//       }}
//         key={item.key}
//         icon={() => item.Icon && <item.Icon className="h-4 w-4" />}
//         value={item.key}
//       >
//         {item.name}
//       </Checkbox>
// {item.name}</label>
//       </>
//     ))}
    
//  </NextUiCheckboxGroup>
//)

const ButtonCbGroupItem = ({item, selected, onClick}) => (
  <Button 
    className="flex m-1 w-full hover:bg-content2 items-center justify-center cursor-pointer rounded-lg gap-1 neoButton"
    color={selected ? 'primary' : 'bg-content2'} onPress={onClick}>
    {item.name}
  </Button>
)

export const ButtonCbGroup = ({
  items,
  values,
  onChange,
}: CheckboxGroupProps) => (
  <ButtonGroup className="grid grid-cols-2 w-full items-center justify-center gap-1">
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
