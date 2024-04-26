'use server'
import BusinessRequestDto from '@data/BusinessRequestDto'
import UserDto from '@data/UserDto'
import VendorDto from '@data/VendorDto'
import ProducerDto from '@data/ProducerDto'
import UserOnVendorDto from '@data/UserOnVendorDto'
import UserOnProducerDto from '@data/UserOnProducerDto'
import {redirect} from 'next/navigation'
import {formSchema} from './Schema'
import {VendorUtil} from '@util/VendorUtil'

export const apply = async formData => {
  'use server'
  const user = await UserDto.getCurrent()
  const result = formSchema.safeParse(formData)
  if (!result.success) {
    return {issues: result.error.issues}
  }
  const request = result.data
  if (request.user.email !== user.email) {
    return {error: 'Email must be your own'}
  }
  await BusinessRequestDto.create({
    ...request,
    status: 'pending',
  })
  redirect(`/admin/apply/${request.type}/success`)
}

export const approve = async requestId => {
  'use server'
  const request = await BusinessRequestDto.get(requestId)

  if (request.status !== 'pending') {
    return {error: 'Request has already been resolved'}
  }

  if (request.type === 'vendor') {
    const vendor = VendorUtil.read({
      contact: {
        email: request.vendor.email,
        tel: request.vendor.tel,
        url: request.vendor.url,
      },
      license: request.vendor.liense,
      location: {
        address: request.vendor.address,
      },
      name: request.vendor.name,
    })
    const vendorId = await VendorDto.createOrUpdate(undefined, vendor)

    const requestUser = await UserDto.getByEmail(request.user.email)
    await UserOnVendorDto.create({
      userId: requestUser.id,
      vendorId,
      role: 'admin',
    })

    await BusinessRequestDto.update(requestId, {
      status: 'approved',
      archived: true,
    })
    redirect(`/admin/vendors/${vendorId}`)

  } else if (request.type === 'producer') {
    const producer = {
      contact: {
        email: request.producer.email,
        tel: request.producer.tel,
        url: request.producer.url,
      },
      license: request.producer.liense,
      location: {
        address: request.producer.address,
      },
      name: request.producer.name,
    }
    const producerId = await ProducerDto.createOrUpdate(undefined, producer)

    const requestUser = await UserDto.getByEmail(request.user.email)
    await UserOnProducerDto.create({
      userId: requestUser.id,
      producerId,
      role: 'admin',
    })

    await BusinessRequestDto.update(requestId, {
      status: 'approved',
      archived: true,
    })
    redirect(`/admin/producers/${producerId}`)
  }
}

export const reject = async requestId => {
  'use server'
  const request = await BusinessRequestDto.get(requestId)

  if (request.status !== 'pending') {
    return {error: 'Request has already been resolved'}
  }

  await BusinessRequestDto.update(requestId, {
    status: 'rejected',
    archived: true,
  })
  redirect('/admin/requests')
}
