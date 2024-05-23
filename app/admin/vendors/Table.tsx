'use client'
import {TMTable, ActionHeaderCell, makeColumns} from '@components/Table'
import {Button} from '@nextui-org/react'
import {BlueLink} from '@components/Link'
import Link from 'next/link'

const NameCell = ({item: vendor}) => (
  <BlueLink href={`/admin/vendors/${vendor.id}`}>{vendor.name}</BlueLink>
)

const LocationCell = ({value: location}) => (
  <div className="whitespace-pre-line">{location.address}</div>
)

const ActionCell = ({item: {id}}) => (
  <BlueLink href={`/admin/vendors/${id}/edit`} className="font-medium">
    Edit
  </BlueLink>
)

export const VendorTable = ({vendors}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'location', label: 'Location', Cell: LocationCell},
    {key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell},
  ])

  return (
    <>
      <ActionBar />
      <TMTable
        aria-label="Table of vendors"
        columns={columns}
        items={vendors}
      />
    </>
  )
}

const ActionBar = () => (
  <div className="flex justify-end gap-2 p-2">
    <Link href={`/admin/vendors/create`}>
      <Button>Add Vendor</Button>
    </Link>
  </div>
)
