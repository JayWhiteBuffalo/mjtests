'use client'
import {TMTable, ActionHeaderCell, makeColumns} from '@/feature/shared/component/Table'
import {Button} from '@nextui-org/react'
import {BlueLink} from '@/feature/shared/component/Link'
import Link from 'next/link'

const deleteVendor = async (vendorId) => {
  try {
    const response = await fetch(`/api/vendor/${vendorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      console.log('Vendor deleted successfully')
      window.location.reload()
    } else {
      console.error('Failed to delete vendor')
    }
  } catch (error) {
    console.error('Error deleting vendor:', error)
  }
}

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

const DeleteCell = ({ item: vendor }) => (
  <Button
    color="danger"
    onClick={() => deleteVendor(vendor.id)}
    size="sm"
  >
    Delete
  </Button>
)


export const VendorTable = ({vendors, isAdmin}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'location', label: 'Location', Cell: LocationCell},
    {key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell},
    ...(isAdmin ? [{key: 'actions', label: 'Actions', Cell: DeleteCell}] : [])
  ])

  return (
    <>
    {isAdmin ? 
      (<ActionBar />) : (null)
    }
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
