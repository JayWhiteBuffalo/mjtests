'use server'
import {createServerActionClient} from '@/api/supabaseServer'
import ProducerDto from '@/data/ProducerDto'
import UserDto from '@/data/UserDto'
import VendorDto from '@/data/VendorDto'
import {prisma} from '@/db'
import {formSchema} from '@/feature/admin/user/forms/Schema'
import {signUpApiSchema} from '@/feature/auth/Schema'
import {Permission, hasAdminPermission, hasRole, isVendor} from '@/util/Roles'
import {User, select} from '@nextui-org/react'
import { headers } from 'next/headers'
import supabase from '@/api/supabaseBrowser'

const getRoleKey = (request) => {
  if(request.account.vendor != null){
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

export const getProducers = async () => {
  try{
    const producers = await prisma.producer.findMany({
      select: {
        id: true,
        name: true,
      },
    })
    return producers
  } catch (error) {
    console.error('Error fetching producers', error)
    return []
  }
}

export const getUserOnVendor = async (userId: number) => {
  try {
    const userOnVendor = await prisma.userOnVendor.findFirst({
      where: {
        userId: userId,
      },
      select: {
        vendorId: true,
        // Add other fields as needed
      },
    });

    return userOnVendor; // Return the fetched data
  } catch (error) {
    console.error('Error fetching userOnVendor:', error);
    throw error; // Handle or rethrow the error as per your application's needs
  }
};

export const getUserOnProducer = async (userId: number) => {
  try {
    const userOnProducer = await prisma.userOnProducer.findFirst({
      where: {
        userId: userId,
      },
      select: {
        producerId: true,
        // Add other fields as needed
      },
    });

    return userOnProducer; // Return the fetched data
  } catch (error) {
    console.error('Error fetching userOnVendor:', error);
    throw error; // Handle or rethrow the error as per your application's needs
  }
};


const makeReturnToUrl = (returnTo: string) =>
  `http://${headers().get('Host')}${returnTo}`


export const createUser = async (formData) => {
    'use server'

    try {
    const result = formSchema.safeParse(formData)

    if (!result.success) {
      return {issues: result.error.issues}
    }

    const request = result.data  

    const apiData = {
      email: request.user.email,
      password: request.password,
      confirmPassword: request.password,
    }

    const signUpResult = signUpApiSchema.safeParse(apiData)

    if (!signUpResult.success) {
      return { issues: signUpResult.error.issues }
    } else {
      console.log("Sign up Result Success 500" + signUpResult)
    }

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

    const newUser = await prisma.user.update({
      where: {
        id: supabaseUser.id, // This specifies the user to update by their ID
      },
      data: {
        name: `${request.user.firstname} ${request.user.lastname}`, // Update name
        email: request.user.email, // Update email
        roles: getRoleKey(request), // Update roles
      },
    });
    

        // Associate user with vendor or producer
        if (request.account.vendor != null) {
          await prisma.UserOnVendor.create({
            data: {
              userId: newUser.id,
              vendorId: request.account.vendor,
              role: request.role === 'employee' ? Permission.VENDOR_MANAGER : Permission.VENDOR_EMPLOYEE,
            }
          })
        } else if (request.account.producer != null) {
          await prisma.userOnProducer.create({
            data: {
              userId: newUser.id,
              producerId: request.account.producer,
              role: request.role === 'employee' ? Permission.PRODUCER_MANAGER : Permission.PRODUCER_EMPLOYEE,
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
 const producers = await getProducers()
 const userOnVendor = await getUserOnVendor(user.id);
 const userOnProducer = await getUserOnProducer(user.id)
  return {
    user,
    vendors,
    producers,
    userOnVendor,
    userOnProducer,
    isAdmin: (user.roles.includes('admin') || hasAdminPermission(user.roles)),
    // isAdmin: (user.roles.includes('admin') || hasAdminPermission(user.roles)),
    // isProducerOwner: hasRole(user.roles, Permission.PRODUCER_OWNER),
    // isVendorOwner: hasRole(user.roles, Permission.VENDOR_OWNER),

  }
}
