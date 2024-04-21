'use client'
import Link from 'next/link'
import {BlueLink} from '@components/Link'
import {TableCell, Button} from '@nextui-org/react'
import {TMTable, ActionHeaderCell, makeColumns} from '@components/Table'

const NameCell = ({item: product}) =>
  <TableCell className="p-4">
    <BlueLink href={`/admin/products/${product.id}`}>{product.name}</BlueLink>
  </TableCell>

const ActionCell = ({item: {id}}) =>
  <TableCell>
    <BlueLink href={`/admin/products/${id}/edit`} className="font-medium">
      Edit
    </BlueLink>
  </TableCell>

export const ProductTable = ({products}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'vendor.name', label: 'Vendor'},
    {key: 'productType', label: 'Product Type'},
    {key: 'action', HeaderCell: ActionHeaderCell, Cell: ActionCell},
  ])

  return (
    <>
      <ActionBar />
      <TMTable columns={columns} items={products} />
    </>
  )
}

const ActionBar = () =>
  <div className="flex justify-end gap-2 p-2">
    <Link href={`/admin/products/create`}>
      <Button>New Product</Button>
    </Link>
  </div>
