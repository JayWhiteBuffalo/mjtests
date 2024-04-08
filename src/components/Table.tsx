'use client'
import ObjectUtil from '@util/ObjectUtil'
import {BlueLink} from '@components/Link'
import {Checkbox} from 'flowbite-react'
import {Table} from 'flowbite-react'

export const DefaultCell = ({value}) =>
  <Table.Cell>
    {value}
  </Table.Cell>

export const DefaultHeaderCell = ({label}) =>
  <Table.HeadCell>
    {label}
  </Table.HeadCell>

export const CheckboxCell = () =>
  <Table.Cell className="p-4">
    <Checkbox />
  </Table.Cell>

export const CheckboxHeaderCell = () =>
  <Table.Cell className="p-4">
    <Checkbox />
  </Table.Cell>

export const ActionCell = () =>
  <Table.Cell>
    <BlueLink href="#" className="font-medium">
      Edit
    </BlueLink>
  </Table.Cell>

export const ActionHeaderCell = () =>
  <Table.HeadCell>
    <span className="sr-only">Actions</span>
  </Table.HeadCell>

export const TMTable = ({items, columns, getItemKey}) => {
  getItemKey ??= item => item.id ?? item.key

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          {columns.map(column =>
            <column.HeaderCell key={column.key} label={column.label} />
          )}
        </Table.Head>
        <Table.Body className="divide-y">
          {items.map(item =>
            <Table.Row key={getItemKey(item)} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              {columns.map(column =>
                <column.Cell
                  key={column.key}
                  value={ObjectUtil.getByPath(item, column.key)}
                  item={item}
                  column={column}
                />
              )}
            </Table.Row>
          )}
        </Table.Body>
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
