'use client'
import {TMTable, ActionHeaderCell, makeColumns} from '@components/Table'
import {Table, Button} from 'flowbite-react'
import {BlueLink} from '@components/Link'
import Link from 'next/link'

const NameCell = ({item: vendor}) =>
  <Table.Cell className="p-4">
    <BlueLink href={`/admin/vendors/${vendor.id}`}>{vendor.name}</BlueLink>
  </Table.Cell>

const LocationCell = ({value: location}) =>
  <Table.Cell className="p-4 whitespace-pre-line">
    {location.address}
  </Table.Cell>

const ActionCell = ({item: {id}}) =>
  <Table.Cell>
    <BlueLink href={`/admin/vendors/${id}/edit`} className="font-medium">
      Edit
    </BlueLink>
  </Table.Cell>

export const VendorTable = ({vendors}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'location', label: 'Location', Cell: LocationCell},
    {key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell},
  ])

  return (
    <>
      <ActionBar />
      <TMTable columns={columns} items={producers} />
    </>
  )
}

const ActionBar = () => 
  <div className="flex justify-end gap-2 p-2">
    <Link href={`/admin/vendors/create`}>
      <Button>Add Vendor</Button>
    </Link>
  </div>
