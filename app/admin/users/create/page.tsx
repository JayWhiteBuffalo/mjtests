
import {Form} from '@feature/admin/user/forms/Form'
import {getRoute as getParentRoute} from '../page'
import {makeMain, UnauthorizedPage} from '@/feature/admin/util/Main'
import {ProductUtil} from '@util/ProductUtil'
import { createUser, getFormProps } from '@/feature/admin/user/forms/FormAction'
import UserDto from '@/data/UserDto'

export const getRoute = async params => {
  return [
    ...(await getParentRoute(params)),
    {
      name: 'Create',
      segment: 'create',
    },
  ]
}

const Page = async ({user}) => {
  // if (!(await UserDto.canCreate(user))) {
  //   return <UnauthorizedPage />
  // }


  return (
    <>
<h1> Create User Page</h1>
<Form
      {...await getFormProps()}
      action={createUser.bind(null)}
      />
</>
  )
}

export default makeMain({Page, getRoute})
