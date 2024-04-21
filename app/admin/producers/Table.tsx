'use client'
import Link from 'next/link'
import {BlueLink} from '@components/Link'
import {TableCell, Button} from '@nextui-org/react'
import {TMTable, ActionHeaderCell, makeColumns} from '@components/Table'

const NameCell = ({item: producer}) =>
  <TableCell className="p-4">
    <BlueLink href={`/admin/producers/${producer.id}`}>{producer.name}</BlueLink>
  </TableCell>

const LocationCell = ({value: location}) =>
  <TableCell className="p-4 whitespace-pre-line">
    {location.address}
  </TableCell>

const ActionCell = ({item: {id}}) =>
  <TableCell>
    <BlueLink href={`/admin/producers/${id}/edit`} className="font-medium">
      Edit
    </BlueLink>
  </TableCell>

export const ProducerTable = ({producers}) => {
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
    <Link href={`/admin/producers/create`}>
      <Button>Add Producer</Button>
    </Link>
  </div>
