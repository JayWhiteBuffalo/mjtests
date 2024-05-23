'use client'
import Link from 'next/link'
import {BlueLink} from '@components/Link'
import {Button} from '@nextui-org/react'
import {
  TMTable,
  ActionHeaderCell,
  makeColumns,
  LocationCell,
} from '@components/Table'

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

export const ProducerTable = ({producers}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'location', label: 'Location', Cell: LocationCell},
    {key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell},
  ])

  return (
    <>
      <ActionBar />
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
