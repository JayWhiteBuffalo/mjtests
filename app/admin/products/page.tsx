import ProductDto from '@data/ProductDto'
import {getRootPageRouteItem} from '@/feature/admin/util/RootPage'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {ProductTable} from '@feature/admin/product/Table'
import { Permission, hasPermission, hasRole, hasAdminPermission, isVendor, isProducer, hasEmployeePermission } from '@/util/Roles'
import { TabTable } from '@/feature/admin/product/TabTable'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  getRootPageRouteItem('products'),
]

const Page = async ({user}) => {
  const userPermission = user.roles;
  let products;
  let isEmployee = hasEmployeePermission(userPermission)
  let canEdit = await ProductDto.canUseEdit(user);

  if(hasAdminPermission(userPermission) || user.roles.includes('admin'))
    {
        products = await ProductDto.findMany({
          include: {vendor: true},
        })
    } else if (
      isVendor(userPermission))
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
      isProducer(userPermission))
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

  return (
  <>
    {/* <ProductTable products={products} canEdit={canEdit} isEmployee={isEmployee}/> */}
    <TabTable products={products} canEdit={canEdit} isEmployee={isEmployee} />

  </>
  )
}

export default makeMain({Page, getRoute})
