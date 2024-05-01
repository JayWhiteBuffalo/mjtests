import ObjectUtil from '@util/ObjectUtil'
import {unempty} from '@util/ValidationUtil'
import {VendorSchedule} from '@util/VendorSchedule'
import {VendorUtil} from '@util/VendorUtil'
import {z} from 'zod'

const daySchedule = z.union([
  z.literal('unknown'),
  z.literal('closed'),
  z.number().min(0).max(48 * 3600)
    .array().length(2)
      .refine(([a, b]) => b - a <= 24 * 3600)
      .refine(([a, b]) => a < b)
      .refine(([a, _]) => a < 24 * 3600),
])

const schedule = z.object({
  week: daySchedule.array().length(7),
  special: z.record(
    z.enum(Object.keys(VendorSchedule.namedDaysByKey)),
    daySchedule,
  ),
})

export const licenseNumber = z.string().regex(VendorUtil.ommaNumberPattern, 'Invalid format')
export const licenseState = z.literal('Oklahoma')
export const license = 
  z.object({
    number: licenseNumber.optional(),
    state: licenseState.optional(),
  })

export const dbSchema = z.object({
  contact: z.object({
    email: z.string().email().max(255).optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tel: z.string().optional(),
    twitter: z.string().optional(),
    url: z.string().url().max(255).optional(),
  }),
  flags: z.object({}),
  license,
  location: z.object({
    address: z.string().min(10).max(300),
  }),
  mainImageRefId: z.string().nullable(),
  signupStatus: z.object({

  }),
  name: z.string().min(1).max(100),
  operatingStatus: z.enum(['open', 'temporarilyClosed', 'permanentlyClosed']),
  schedule,
  slug: z.string().min(3).max(60).optional(),
})

export const preprocessFormData = formData => ({
  ...formData,
  contact: ObjectUtil.mapValue(formData.contact, unempty),
  flags: {},
  license: ObjectUtil.mapValue(formData.license, unempty),
  mainImageRefId: formData.mainImageRefId ?? null,
  slug: unempty(formData.slug) ?? null,
})

export const formSchema = z.preprocess(preprocessFormData, dbSchema)
