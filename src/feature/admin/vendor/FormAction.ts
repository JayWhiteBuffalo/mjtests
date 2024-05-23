'use server'
import ImageRefDto from '@data/ImageRefDto'
import VendorDto from '@data/VendorDto'
import {formSchema} from './Schema'
import {redirect} from 'next/navigation'

export const save = async (vendorId, formData) => {
  'use server'
  const result = formSchema.safeParse(formData)
  if (!result.success) {
    return {issues: result.error.issues}
  }
  const id = await VendorDto.createOrUpdate(vendorId, result.data)
  redirect(`/admin/vendors/${id}`)
}

export const getFormProps = async (user, vendorId) => {
  let imageRefs
  if (vendorId) {
    imageRefs = await ImageRefDto.findMany({
      where: {vendorId},
      orderBy: {updatedAt: 'asc'},
    })
  } else {
    imageRefs = []
  }

  return {
    imageRefs,
    isAdmin: user.roles.includes('admin'),
  }
}
