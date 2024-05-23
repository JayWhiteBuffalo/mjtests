import ObjectUtil from '@util/ObjectUtil'
import {Treemap} from '@/Treemap'
import {unempty, unNan} from '@util/ValidationUtil'
import {z} from 'zod'

const terps = z.record(
  z.enum(Object.keys(Treemap.terpenesByName)),
  z.number().min(0).max(1),
)

const potency = z.object({
  thc: z.number().min(0).max(1).optional(),
  cbd: z.number().min(0).max(1).optional(),
})

export const publishDbSchema = z.object({
  batch: z.string().nullable(),
  brand: z.string(),
  concentrateType: z.enum(Treemap.concentrateTypes.map(x => x.key)).nullable(),
  cultivar: z.string(),
  flags: z.object({}),
  isDraft: z.literal(false),
  mainImageRefId: z.string(),
  name: z.string().min(3).max(100),
  potency,
  price: z.number().min(0).safe(),
  pricePerGram: z.number().min(0).safe(),
  producerId: z.string().nullable(),
  productType: z.enum(Treemap.productTypes.map(x => x.key)),
  rating: z.any(),
  slug: z.string().min(3).max(60),
  subspecies: z.enum(Treemap.subspecies.map(x => x.key)),
  terps,
  vendorId: z.string().nullable(),
  weight: z.number().min(0).safe(),
})

export const dbSchema = z.object({
  batch: z.string().nullable(),
  brand: z.string().nullable(),
  concentrateType: z.enum(Treemap.concentrateTypes.map(x => x.key)).nullable(),
  cultivar: z.string().nullable(),
  flags: z.object({}),
  isDraft: z.literal(true),
  mainImageRefId: z.string().nullable(),
  name: z.string().min(3).max(100),
  potency,
  price: z.number().min(0).safe().nullable(),
  pricePerGram: z.number().min(0).safe().nullable(),
  producerId: z.string().nullable(),
  productType: z.enum(Treemap.productTypes.map(x => x.key)).nullable(),
  slug: z.string().min(3).max(60).nullable(),
  subspecies: z.enum(Treemap.subspecies.map(x => x.key)).nullable(),
  terps,
  vendorId: z.string().nullable(),
  weight: z.number().min(0).safe().nullable(),
})

export const preprocessFormData =
  ({isDraft}) =>
  formData => {
    const product = {
      ...formData,
      batch: unempty(formData.batch) ?? null,
      brand: unempty(formData.brand) ?? null,
      concentrateType: formData.concentrateType ?? null,
      cultivar: unempty(formData.cultivar) ?? null,
      flags: {},
      isDraft,
      mainImageRefId: formData.mainImageRefId ?? null,
      name: unempty(formData.name) ?? null,
      potency: ObjectUtil.mapValue(formData.potency, unNan),
      price: unNan(formData.price) ?? null,
      producerId: formData.producerId ?? null,
      productType: formData.productType ?? null,
      slug: unempty(formData.slug) ?? null,
      subspecies: formData.subspecies ?? null,
      terps: ObjectUtil.mapValue(formData.terps, unNan),
      vendorId: formData.vendorId ?? null,
      weight: unNan(formData.weight) ?? null,
    }
    product.pricePerGram =
      product.price !== null && product.weight !== null
        ? product.price / product.weight
        : null
    return product
  }

export const publishFormSchema = z.preprocess(
  preprocessFormData({isDraft: false}),
  publishDbSchema,
)
export const draftFormSchema = z.preprocess(
  preprocessFormData({isDraft: true}),
  dbSchema,
)
