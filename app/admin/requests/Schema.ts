import ObjectUtil from '@util/ObjectUtil'
import {unempty} from '@util/ValidationUtil'
import {z} from 'zod'

export const apiSchema = z.object({
  producer: z.object({}),
  referrer: z.string().max(300).optional(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  type: z.enum(['vendor', 'producer']),
  user: z.object({
    name: z.string().min(1, {message: 'Please enter your name'}).max(100),
    email: z.string().email({message: 'Please enter your email'}),
  }),
  vendor: z.object({
    address: z.string().min(10).max(300),
    email: z.string().email().max(255).optional(),
    name: z.string().min(1, {message: 'Please enter a name'}).max(100),
    url: z.string().url().max(255).optional(),
  }),
})

const preprocessFormData = formData => ({
  producer: {},
  referrer: unempty(formData.referrer),
  status: 'pending',
  type: 'vendor',
  user: ObjectUtil.mapValue(formData.user, unempty),
  vendor: ObjectUtil.mapValue(formData.vendor, unempty),
})

export const formSchema = z.preprocess(preprocessFormData, apiSchema)
