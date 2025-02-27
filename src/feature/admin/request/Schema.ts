import ObjectUtil from '@util/ObjectUtil'
import {licenseNumber, licenseState} from '@/feature/admin/vendor/Schema'
import {unempty} from '@util/ValidationUtil'
import {z} from 'zod'

export const apiSchema = z.object({
  producer: z
    .object({
      address: z.string().min(10).max(300).optional(),
      email: z.string().email().max(255).optional(),
      licenseNumber,
      licenseState,
      name: z.string().min(1, {message: 'Please enter a name'}).max(100),
      tel: z.string().optional(),
      url: z.string().url().max(255).optional(),
    })
    .nullable(),
  referrer: z.string().max(300).optional(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  type: z.enum(['vendor', 'producer']),
  user: z.object({
    name: z.string().min(1, {message: 'Please enter your name'}).max(100),
    email: z.string().email({message: 'Please enter your email'}),
  }),
  vendor: z
    .object({
      address: z.string().min(10).max(300),
      email: z.string().email().max(255).optional(),
      licenseNumber,
      licenseState,
      name: z.string().min(1, {message: 'Please enter a name'}).max(100),
      tel: z.string().optional(),
      url: z.string().url().max(255).optional(),
    })
    .nullable(),
})

const preprocessProducer = formProducer => ({
  ...ObjectUtil.mapValue(formProducer, unempty),
  licenseState: 'Oklahoma',
})

const preprocessVendor = formVendor => ({
  ...ObjectUtil.mapValue(formVendor, unempty),
  licenseState: 'Oklahoma',
})

const preprocessFormData = formData => ({
  producer: formData.producer ? preprocessProducer(formData.producer) : null,
  referrer: unempty(formData.referrer),
  status: 'pending',
  type: formData.type,
  user: ObjectUtil.mapValue(formData.user, unempty),
  vendor: formData.vendor ? preprocessVendor(formData.vendor) : null,
})

export const formSchema = z.preprocess(preprocessFormData, apiSchema)
