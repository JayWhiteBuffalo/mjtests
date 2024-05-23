import VendorDto from '@data/VendorDto'
import {Form} from '../../Form'
import {getRoute as getParentRoute} from '../page.tsx'
import {makeMain, UnauthorizedPage} from '@app/admin/Main'
import {notFound} from 'next/navigation'
import {save, getFormProps} from '../../FormAction'

export const getRoute = async params => [
  ...(await getParentRoute(params)),
  {
    name: 'Edit',
    segment: 'edit',
  },
]

const Page = async ({user, vendorId}) => {
  const vendor = await VendorDto.get(vendorId)
  if (!vendor) {
    notFound()
  }
  if (!(await VendorDto.canEdit(user, vendorId))) {
    return <UnauthorizedPage />
  }
  return (
    <Form
      {...await getFormProps(user, vendorId)}
      action={save.bind(null, vendorId)}
      vendor={vendor}
    />
  )
}

export default makeMain({Page, getRoute})
