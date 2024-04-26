import ObjectUtil from '@util/ObjectUtil'
import {license} from '@app/admin/vendors/Schema'
import {unempty} from '@util/ValidationUtil'
import {z} from 'zod'

export const dbSchema = z.object({
  contact: z.object({
    email: z.string().email().max(255).optional(),
    tel: z.string().optional(),
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
})

export const preprocessFormData = formData => ({
  ...formData,
  contact: ObjectUtil.mapValue(formData.contact, unempty),
  flags: {},
  license: ObjectUtil.mapValue(formData.license, unempty),
  mainImageRefId: formData.mainImageRefId ?? null,
})

export const formSchema = z.preprocess(preprocessFormData, dbSchema)
