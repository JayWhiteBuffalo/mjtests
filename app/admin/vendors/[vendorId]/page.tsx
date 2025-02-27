import VendorDto from '@data/VendorDto'
import {getRoute as getParentRoute} from '../page'
import {makeMain} from '@/feature/admin/util/Main'
import {VendorPane} from '@feature/admin/vendor/Pane'

export const getRoute = async ({vendorId, ...params}) => {
  const vendor = await VendorDto.get(vendorId)
  return [
    ...(await getParentRoute(params)),
    {
      name: vendor?.name,
      segment: vendorId,
    },
  ]
}

const Page = async ({user, vendorId}) => {
  const vendor = await VendorDto.get(vendorId)
  if (!vendor) {
    notFound()
  }
  
  const canEdit = await VendorDto.canEdit(user, vendorId)
  return <VendorPane vendor={vendor} canEdit={canEdit} />
}

export default makeMain({Page, getRoute})
