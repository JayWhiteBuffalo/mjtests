'use client'
import {TMTable, ActionHeaderCell, makeColumns} from '@components/Table'
import {TableCell, Button} from '@nextui-org/react'
import {BlueLink} from '@components/Link'
import Link from 'next/link'

const NameCell = ({item: vendor}) =>
  <TableCell className="p-4">
    <BlueLink href={`/admin/vendors/${vendor.id}`}>{vendor.name}</BlueLink>
  </TableCell>

const LocationCell = ({value: location}) =>
  <TableCell className="p-4 whitespace-pre-line">
    {location.address}
  </TableCell>

const ActionCell = ({item: {id}}) =>
  <TableCell>
    <BlueLink href={`/admin/vendors/${id}/edit`} className="font-medium">
      Edit
    </BlueLink>
  </TableCell>

export const VendorTable = ({vendors}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'location', label: 'Location', Cell: LocationCell},
    {key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell},
  ])

  return (
    <>
      <ActionBar />
      <TMTable columns={columns} items={vendors} />
    </>
  )
}

const ActionBar = () =>
  <div className="flex justify-end gap-2 p-2">
    <Link href={`/admin/vendors/create`}>
      <Button>Add Vendor</Button>
    </Link>
  </div>
