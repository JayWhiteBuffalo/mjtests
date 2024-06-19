'use server'
import {createServerActionClient} from '@/api/supabaseServer'
import ProducerDto from '@/data/ProducerDto'
import UserDto from '@/data/UserDto'
import VendorDto from '@/data/VendorDto'
import {prisma} from '@/db'
import {formSchema} from '@/feature/admin/user/forms/Schema'
import {signUpApiSchema} from '@/feature/auth/Schema'
import {Permission, hasAdminPermission, hasRole, isVendor} from '@/util/Roles'
import {User} from '@nextui-org/react'
import { headers } from 'next/headers'

const getRoleKey = (request) => {
  if(request.account.vendor){
    if(request.role === "employee"){
      return [Permission.VENDOR_EMPLOYEE]
    } else {
      return [Permission.VENDOR_MANAGER]
    }
  } else if (request.account.producer){
    if(request.role === "employee"){
      return [Permission.PRODUCER_EMPLOYEE]
    } else {
      return [Permission.PRODUCER_MANAGER]
    }
  }
}


export const getVendors = async () => {
  try {
    const vendors = await prisma.vendor.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    return vendors
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return []
  }
}

const makeReturnToUrl = (returnTo: string) =>
  `http://${headers().get('Host')}${returnTo}`


export const createUser = async (formData) => {
    'use server'

    try {
      // if(hasRole(currentUser.roles, Permission.PRODUCER_OWNER )){
      //   formData.producer = currentProducerId
      // }
      // if(hasRole(currentUser.roles, Permission.VENDOR_OWNER)){
      //   formData.vendor = currentVendorId
      // }
    // const user = await UserDto.getCurrent()
    const result = formSchema.safeParse(formData)

    if (!result.success) {
      return {issues: result.error.issues}
    }

    const request = result.data

    console.log("RESULT DATA LOG ==============" + JSON.stringify(result))
    

    const apiData = {
      email: request.user.email,
      password: request.password,
      confirmPassword: request.password,
    }

    const signUpResult = signUpApiSchema.safeParse(apiData)

    if (!signUpResult.success) {
      return { issues: signUpResult.error.issues }
    }

    const supabase = createServerActionClient();

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: signUpResult.data.email,
      password: signUpResult.data.password,
      options: {
        emailRedirectTo: makeReturnToUrl('/verify-email'), // Adjust this URL as needed
      }
    })

    if (error) {
      throw error
    }

    const { user: supabaseUser } = signUpData

    if (!supabaseUser) {
      throw new Error('Failed to create user in Supabase')
    }

  
    const newUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        name: `${request.user.firstname} ${request.user.lastname}`,
        email: request.user.email,
        roles: getRoleKey(request),
      }
    })


        // Associate user with vendor or producer
        if (request.account.vendor) {
          await prisma.UserOnVendor.create({
            data: {
              userId: newUser.id,
              vendorId: request.account.vendor,
              role: newUser.role === 'employee' ? Permission.VENDOR_MANAGER : Permission.VENDOR_EMPLOYEE,
            }
          })
        } else if (formData.producer) {
          await prisma.userOnProducer.create({
            data: {
              userId: newUser.id,
              producerId: request.account.producer,
              role: newUser.role === 'employee' ? Permission.PRODUCER_MANAGER : Permission.PRODUCER_EMPLOYEE,
            }
          })
        }


return { success: true }

} catch (error) {
console.error('Error creating user:', error)
return { issues: [{ message: 'Internal server error' }] }
}

}

export const getFormProps = async () => {
 const user = await UserDto.getCurrent();
 const vendors = await getVendors()
  return {
    user,
    vendors,
    isAdmin: (user.roles.includes('admin') || hasAdminPermission(user.roles)),
    // isAdmin: (user.roles.includes('admin') || hasAdminPermission(user.roles)),
    // isProducerOwner: hasRole(user.roles, Permission.PRODUCER_OWNER),
    // isVendorOwner: hasRole(user.roles, Permission.VENDOR_OWNER),

  }
}
