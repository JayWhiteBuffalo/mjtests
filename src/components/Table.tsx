'use client'
import ObjectUtil from '@util/ObjectUtil'
import {BlueLink} from '@components/Link'
import {Checkbox, Table, TableHeader, TableBody, TableCell, TableRow, TableColumn} from '@nextui-org/react'

export const DefaultCell = ({value}) =>
  <TableCell>
    {value}
  </TableCell>

export const DefaultHeaderCell = ({label}) =>
  <TableColumn>
    {label}
  </TableColumn>

export const CheckboxCell = () =>
  <TableCell className="p-4">
    <Checkbox />
  </TableCell>

export const CheckboxHeaderCell = () =>
  <TableCell className="p-4">
    <Checkbox />
  </TableCell>

export const ActionCell = () =>
  <TableCell>
    <BlueLink href="#" className="font-medium">
      Edit
    </BlueLink>
  </TableCell>

export const ActionHeaderCell = () =>
  <TableColumn>
    <span className="sr-only">Actions</span>
  </TableColumn>

export const TMTable = ({items, columns, getItemKey}) => {
  getItemKey ??= item => item.id ?? item.key

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader columns={columns}>
          {column =>
            <column.HeaderCell key={column.key} label={column.label} />
          }
        </TableHeader>
        <TableBody className="divide-y" items={items}>
          {item =>
            <TableRow key={getItemKey(item)} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              {column =>
                <column.Cell
                  key={column.key}
                  value={ObjectUtil.getByPath(item, column.key)}
                  item={item}
                  column={column}
                />
              }
            </TableRow>
          }
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
