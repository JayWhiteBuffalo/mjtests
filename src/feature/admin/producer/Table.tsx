'use client'
import Link from 'next/link'
import {BlueLink} from '@/feature/shared/component/Link'
import {Button} from '@nextui-org/react'
import {
  TMTable,
  ActionHeaderCell,
  makeColumns,
  LocationCell,
} from '@/feature/shared/component/Table'


const deleteProducer = async (producerId) => {
  try {
    const response = await fetch(`/api/producers/${producerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      console.log('Producer deleted successfully')
      window.location.reload()
    } else {
      console.error('Failed to delete producer')
    }
  } catch (error) {
    console.error('Error deleting producer:', error)
  }
}

const NameCell = ({item: producer}) => (
  <BlueLink href={`/admin/producers/${producer.id}`} className="py-4">
    {producer.name}
  </BlueLink>
)

const ActionCell = ({item: {id}}) => (
  <BlueLink href={`/admin/producers/${id}/edit`} className="font-medium">
    Edit
  </BlueLink>
)

const DeleteCell = ({ item: producer }) => (
  <Button
    color="danger"
    onClick={() => deleteProducer(producer.id)}
    size="sm"
  >
    Delete
  </Button>
)

export const ProducerTable = ({producers, isAdmin, isOwnerAccount}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'location', label: 'Location', Cell: LocationCell},
    ...(isAdmin || isOwnerAccount ? [{key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell}] : []),
    ...(isAdmin ? [{key: 'actions', label: 'Actions', Cell: DeleteCell}] : [])
  ])

  return (
    <>
    {isAdmin ? (<ActionBar />):(null)}
      <TMTable
        aria-label="Table of producers"
        columns={columns}
        items={producers}
      />
    </>
  )
}

const ActionBar = () => (
  <div className="flex justify-end gap-2 p-2">
    <Link href={`/admin/producers/create`}>
      <Button>Add Producer</Button>
    </Link>
  </div>
)
