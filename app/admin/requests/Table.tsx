'use client'
import {BlueLink} from '@components/Link'
import {TableCell} from '@nextui-org/react'
import {TMTable, makeColumns} from '@components/Table'

const NameCell = ({item: request}) =>
  <TableCell className="p-4">
    <BlueLink href={`/admin/requests/${request.id}`}>{request.vendor.name}</BlueLink>
  </TableCell>

const LocationCell = ({value}) =>
  <TableCell className="p-4">
    {value}
  </TableCell>

export const RequestTable = ({requests}) => {
  const columns = makeColumns([
    {key: 'vendor.name', label: 'Name', Cell: NameCell},
    {key: 'vendor.address', label: 'Location', Cell: LocationCell},
  ])

  return <TMTable columns={columns} items={requests} />
}
