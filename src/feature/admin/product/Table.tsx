'use client'
import Link from 'next/link'
import {BlueLink} from '@/feature/shared/component/Link'
import {Button} from '@nextui-org/react'
import {TMTable, ActionHeaderCell, makeColumns} from '@/feature/shared/component/Table'

const deleteProduct = async (product) => {
  try {
        const response = await fetch(`/api/products/${product.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          console.log('Product deleted successfully');
          window.location.reload();
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
  }

const NameCell = ({item: product}) => (
  <BlueLink href={`/admin/products/${product.id}`}>{product.name}</BlueLink>
)

const ActionCell = ({item: {id, isDraft}, isEmployee}) => {
  if(!isDraft && isEmployee){
    return null;
  }
  return(
  <BlueLink href={`/admin/products/${id}/edit`} className="font-medium">
    Edit
  </BlueLink>
  )
}

const DeleteCell = ({ item: product }) => (
  <Button
    color="danger"
    onClick={() => deleteProduct(product)}
    size="sm"
  >
    Delete
  </Button>
)

const StatusCell = ({ item: product }) => (
  <span>{product.isDraft ? 'Draft' : 'Published'}</span>
)

const ActionBar = () => (
  <div className="flex justify-end gap-2 p-2">
    <Link href={`/admin/products/create`}>
      <Button>New Product</Button>
    </Link>
  </div>
)

export const ProductTable = ({products, canEdit, isEmployee}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'vendor.name', label: 'Vendor'},
    {key: 'productType', label: 'Product Type'},
    {key: 'isDraft', label: 'Status', Cell: StatusCell},
    { key: 'action', HeaderCell: ActionHeaderCell, Cell: ({ item }) => <ActionCell item={item} isEmployee={isEmployee} /> },
    ...(canEdit ? [{key: 'actions', label: 'Actions', Cell: DeleteCell}] : []),
  ])

  return (
    <>
      <ActionBar />
      <TMTable
        aria-label="Table of products"
        columns={columns}
        items={products}
      />
    </>
  )
}

export const PendingTable = ({pendingProducts, canEdit, isEmployee}) => {
  const columns = makeColumns([
    {key: 'name', label: 'Name', Cell: NameCell},
    {key: 'vendor.name', label: 'Vendor'},
    {key: 'productType', label: 'Product Type'},
    {key: 'isDraft', label: 'Status', Cell: StatusCell},
    { key: 'action', HeaderCell: ActionHeaderCell, Cell: ({ item }) => <ActionCell item={item} isEmployee={isEmployee} /> },
    ...(canEdit ? [{key: 'actions', label: 'Actions', Cell: DeleteCell}] : []),
  ])

  return (
    <>
      <ActionBar />
      <TMTable
        aria-label="Table of products"
        columns={columns}
        items={pendingProducts}
      />
    </>
  )
}





