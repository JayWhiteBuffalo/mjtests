import ProductDto from '@data/ProductDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {ProductTable} from '@feature/admin/product/Table'
import { Permission, hasPermission, hasRole } from '@/util/Roles'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('products'),
]

const Page = async ({user}) => {
  const userPermission = user.roles;
  let products

  if(hasPermission(userPermission, Permission.DEV))
    {
        products = await ProductDto.findMany({
          include: {vendor: true},
        })
    } else if (
      hasPermission(userPermission, Permission.DEV) ||
      hasRole(userPermission, Permission.VENDOR_OWNER) ||
      hasRole(userPermission, Permission.VENDOR_MANAGER) || 
      hasRole(userPermission, Permission.VENDOR_EMPLOYEE ))
    {
      const vendorIds = user.vendors.map(edge => edge.vendorId)
      products = await ProductDto.findMany({
      where: {
        vendorId: {in: vendorIds},
      },
      include: {vendor: true},
      orderBy: {name: 'asc'},
      })
    } else if (
      hasPermission(userPermission, Permission.DEV) ||
      hasRole(userPermission, Permission.PRODUCER_OWNER) ||
      hasRole(userPermission, Permission.PRODUCER_MANAGER) || 
      hasRole(userPermission, Permission.PRODUCER_EMPLOYEE ))
    {
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
