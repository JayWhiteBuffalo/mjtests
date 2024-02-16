'use client'
import {TMTable, makeColumns} from '@components/Table'
import {Table} from 'flowbite-react'
import {BlueLink} from '@components/Link'

const NameCell = ({item: request}) =>
  <Table.Cell className="p-4">
    <BlueLink href={`/admin/requests/${request.id}`}>{request.vendor.name}</BlueLink>
  </Table.Cell>

const LocationCell = ({value}) =>
  <Table.Cell className="p-4">
    {value}
  </Table.Cell>

export const RequestTable = ({requests}) => {
  const columns = makeColumns([
    {key: 'vendor.name', label: 'Name', Cell: NameCell},
    {key: 'vendor.address', label: 'Location', Cell: LocationCell},
  ])

  return <TMTable columns={columns} items={requests} />
}
