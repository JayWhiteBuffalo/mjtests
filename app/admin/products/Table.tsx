'use client'
import {TMTable, ActionHeaderCell, makeColumns} from '@components/Table'
import {Table, Button} from 'flowbite-react'
import {BlueLink} from '@components/Link'
import Link from 'next/link'

const NameCell = ({item: product}) =>
  <Table.Cell className="p-4">
    <BlueLink href={`/admin/products/${product.id}`}>{product.name}</BlueLink>
  </Table.Cell>

const ActionCell = ({item: {id}}) =>
  <Table.Cell>
    <BlueLink href={`/admin/products/${id}/edit`} className="font-medium">
      Edit
    </BlueLink>
  </Table.Cell>

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
