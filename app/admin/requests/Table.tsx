'use client'
import {BlueLink} from '@components/Link'
import {TMTable, makeColumns, LocationCell} from '@components/Table'

const NameCell = ({item: request}) =>
  <BlueLink href={`/admin/requests/${request.id}`} className="p-4">
    {request.vendor.name}
  </BlueLink>

export const RequestTable = ({requests}) => {
  const columns = makeColumns([
    {key: 'vendor.name', label: 'Name', Cell: NameCell},
    {key: 'vendor.address', label: 'Location', Cell: LocationCell},
  ])


  return (
    <TMTable
      aria-label="Table of business requests"
      columns={columns}
      items={requests} 
    />
  )
}
