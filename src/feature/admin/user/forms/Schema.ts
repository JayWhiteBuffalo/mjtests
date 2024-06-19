import ObjectUtil from '@util/ObjectUtil'
import {unempty} from '@util/ValidationUtil'
import {z} from 'zod'

export const dbSchema = z.object({
  user: z.object({
    firstname: z.string().min(1).max(100),
    lastname: z.string().min(1).max(100),
    email: z.string().email().max(255).optional(),
  }),
  flags: z.object({}),
  mainImageRefId: z.string().nullable(),
  createdAt: z.date(),
  createdBy: z.string(),
  password: z.string().min(7).max(20),
  role: z.string(),
  account: z.object({
    // owner: z.string().nullable(),
    producer: z.string().nullable(),
    vendor: z.string().nullable(),
  })
})

export const preprocessFormData = formData => ({
 ...formData,
user: ObjectUtil.mapValue(formData.user, unempty),
//
    // firstname: ObjectUtil.mapValue(formData.user, unempty),
    // lastname: ObjectUtil.mapValue(formData.user, unempty),
    // email: ObjectUtil.mapValue(formData.user, unempty),
//
  flags: {},
  mainImageRefId: formData.mainImageRefId ?? null,
  password: formData.password,
  createdAt: formData.createdAt ?? new Date(),
  createdBy: formData.createdBy ?? '',
  role: formData.role,
  account: ObjectUtil.mapValue(formData.account, unempty),
  // account: {
  //   owner: ObjectUtil.mapValue(formData.account, unempty),
  //   producer: formData.account.producer ?? null,
  //   vendor: formData.account.vendor ?? null,
  //   },
});

export const formSchema = z.preprocess(preprocessFormData, dbSchema);
