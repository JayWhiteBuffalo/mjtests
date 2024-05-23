import ProductDto from '@data/ProductDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage.js'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain} from '@/feature/admin/util/Main.jsx'
import {ProductTable} from '@feature/admin/product/Table.jsx'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('products'),
]

const Page = async ({user}) => {
  let products
  if (user.roles.includes('admin')) {
    products = await ProductDto.findMany({
      include: {vendor: true},
    })
  } else if (user.roles.includes('vendor')) {
    const vendorIds = user.vendors.map(edge => edge.vendorId)
    products = await ProductDto.findMany({
      where: {
        vendorId: {in: vendorIds},
      },
      include: {vendor: true},
      orderBy: {name: 'asc'},
    })
  } else if (user.roles.includes('producer')) {
    const producerIds = user.producers.map(edge => edge.producerId)
    products = await ProductDto.findMany({
      where: {
        producerId: {in: producerIds},
      },
      include: {vendor: true},
      orderBy: {name: 'asc'},
    })
  } else {
    products = []
  }

  return <ProductTable products={products} />
}

export default makeMain({Page, getRoute})
