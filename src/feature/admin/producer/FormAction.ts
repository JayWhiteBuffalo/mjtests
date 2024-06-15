'use server'
import ImageRefDto from '@data/ImageRefDto'
import ProducerDto from '@data/ProducerDto'
import {formSchema} from './Schema'
import {redirect} from 'next/navigation'
import {hasAdminPermission} from '@/util/Roles'

export const save = async (producerId, formData) => {
  'use server'
  const result = formSchema.safeParse(formData)
  if (!result.success) {
    return {issues: result.error.issues}
  }
  const id = await ProducerDto.createOrUpdate(producerId, result.data)
  redirect(`/admin/producers/${id}`)
}

export const getFormProps = async (user, producerId) => {
  let imageRefs
  if (producerId) {
    imageRefs = await ImageRefDto.findMany({
      where: {producerId},
      orderBy: {updatedAt: 'asc'},
    })
  } else {
    imageRefs = []
  }

  return {
    imageRefs,
    isAdmin: (user.roles.includes('admin') || hasAdminPermission(user.roles)),
  }
}
