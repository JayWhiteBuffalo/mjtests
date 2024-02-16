import ImageRefDto from '@data/ImageRefDto'
import ProducerDto from '@data/ProducerDto'
import ProductDto from '@data/ProductDto'
import UserOnProducerDto from '@data/UserOnProducerDto'
import UserOnVendorDto from '@data/UserOnVendorDto'
import VendorDto from '@data/VendorDto'
import {draftFormSchema, publishFormSchema} from './Schema'
import {redirect} from 'next/navigation'


const save = async (productId, product, imageRefIds) => {
  const id = await ProductDto.createOrUpdate(productId, product)
  await Promise.all((imageRefIds ?? []).map(publicId =>
    ImageRefDto.update(publicId, {productId: id})
  ))
  redirect(`/admin/products/${id}`)
}

export const saveDraft = async (productId, formData) => {
  'use server'
  formData.isDraft = true
  const result = draftFormSchema.safeParse(formData)
  if (!result.success) {
    return {issues: result.error.issues}
  }
  return await save(productId, result.data)
}

export const publish = async (productId, formData) => {
  'use server'
  const result = publishFormSchema.safeParse(formData)
  if (!result.success) {
    return {issues: result.error.issues}
  }
  return await save(productId, result.data)
}

export const getFormProps = async (user, productId) => {
  let imageRefs
  if (productId) {
    imageRefs = await ImageRefDto.findMany({
      where: {productId},
      orderBy: {updatedAt: 'asc'},
    })
  } else {
    imageRefs = []
  }

  let producerItems
  if (user.roles.includes('admin') || user.roles.includes('sales')) {
    const producers = await ProducerDto.findMany()
    producerItems = producers.map(producer => ({key: producer.id, name: producer.name}))
  } else {
    const producerEdges = await UserOnProducerDto.findMany({
      where: {userId: user.id},
      select: {
        producerId: true,
        producer: {select: {name: true}},
      },
    })
    producerItems = producerEdges.map(edge => ({key: edge.producerId, name: edge.producer.name}))
  }

  let vendorItems
  if (user.roles.includes('admin') || user.roles.includes('sales')) {
    const vendors = await VendorDto.findMany()
    vendorItems = vendors.map(vendor => ({key: vendor.id, name: vendor.name}))
  } else {
    const vendorEdges = await UserOnVendorDto.findMany({
      where: {userId: user.id},
      select: {
        vendorId: true,
        vendor: {select: {name: true}},
      },
    })
    vendorItems = vendorEdges.map(edge => ({key: edge.vendorId, name: edge.vendor.name}))
  }

  return {
    imageRefs,
    isAdmin: user.roles.includes('admin') || user.roles.includes('sales'),
    producerItems, 
    vendorItems,
  }
}
