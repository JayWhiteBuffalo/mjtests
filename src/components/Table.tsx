'use client'
import ObjectUtil from '@util/ObjectUtil'
import {BlueLink} from '@components/Link'
import {
  Checkbox,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableColumn,
} from '@nextui-org/react'

export const DefaultCell = ({value}) => value

export const DefaultHeaderCell = ({label}) => label

export const CheckboxCell = () => (
  <div className="px-2">
    <Checkbox />
  </div>
)

export const CheckboxHeaderCell = () => (
  <div className="px-2">
    <Checkbox />
  </div>
)

export const ActionCell = () => (
  <BlueLink href="#" className="font-medium">
    Edit
  </BlueLink>
)

export const ActionHeaderCell = () => <span className="sr-only">Actions</span>

export const LocationCell = ({value: location}) => (
  <div className="whitespace-pre-line">{location.address}</div>
)

export const TMTable = ({items, columns, getItemKey, ...rest}) => {
  getItemKey ??= item => item.id ?? item.key
  const columnsByKey = ObjectUtil.fromIterable(columns, column => column.key)

  return (
    <div className="overflow-x-auto">
      <Table {...rest}>
        <TableHeader columns={columns}>
          {column => (
            <TableColumn>
              <column.HeaderCell key={column.key} label={column.label} />
            </TableColumn>
          )}
        </TableHeader>

        <TableBody className="divide-y" items={items}>
          {item => (
            <TableRow
              key={getItemKey(item)}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {columnKey => {
                const column = columnsByKey[columnKey]
                return (
                  <TableCell>
                    <column.Cell
                      key={column.key}
                      value={ObjectUtil.getByPath(item, column.key)}
                      item={item}
                      column={column}
                    />
                  </TableCell>
                )
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export const makeColumn = options => {
  if (typeof options === 'string') {
    options = {key: options}
  }
  options.label ??= options.key
  options.Cell ??= DefaultCell
  options.HeaderCell ??= DefaultHeaderCell
  return options
}

export const makeColumns = columns => columns.map(makeColumn)
