'use client'
import {AdminOnlyText} from '@app/admin/components/AdminForm'
import {BsFacebook, BsInstagram, BsTwitter} from 'react-icons/bs'
import {Button, Input, Textarea, RadioGroup, Radio} from '@nextui-org/react'
import {Controller, FormProvider, useController} from 'react-hook-form'
import {FormattedInput} from '@components/FormattedInput'
import {HiMail, HiPhone} from 'react-icons/hi'
import {ImageInput} from '@app/admin/components/ImageInput'
import {orEmpty} from '@util/ValidationUtil'
import {preprocessFormData} from './Schema'
import {PreviewContainer} from './Pane'
import {useForm, nullResolver, FieldLayout, FieldError, FormErrors, Watch} from '@components/Form'
import {VendorScheduleInput} from '@app/admin/components/VendorScheduleInput'
import {VendorUtil} from '@util/VendorUtil'

export const Form = ({vendor, imageRefs, isAdmin, action}) => {
  const methods = useForm({
    resolver: nullResolver(),
    defaultValues: vendor,
  })
  const {register, handleSubmit, formState: {errors, isSubmitting}, control} = methods

  return (
    <FormProvider {...methods}>
    <form className="AdminForm" action={handleSubmit(action)}>
      <section>
        <h2>Store</h2>

        <FieldLayout
          bottomDescription={<AdminOnlyText isAdmin={isAdmin} />}
          error={errors.name}
          label="Store Name"
        >
          <Input
            {...register('name')}
            autoComplete="off"
            classNames={{
              input: !isAdmin ? 'cursor-not-allowed' : undefined,
              inputWrapper: !isAdmin ? '!cursor-not-allowed bg-zinc-200' : undefined,
            }}
            isReadOnly={!isAdmin}
          />
        </FieldLayout>

        <FieldLayout
          bottomDescription={<AdminOnlyText isAdmin={isAdmin} />}
          description="Physical address, where customers will visit your dispensary."
          error={errors.location?.address}
          label="Storefront Address"
        >
          <Textarea
            {...register('location.address')}
            autoComplete="street-address"
            isReadOnly={!isAdmin}
            classNames={{
              input: !isAdmin ? 'cursor-not-allowed' : undefined,
              inputWrapper: !isAdmin ? '!cursor-not-allowed bg-zinc-200' : undefined,
            }}
          />
        </FieldLayout>

        {vendor.id &&
          <FieldLayout
            description="Include at least one photo of your storefront. Minumum size 360x240, recommended 1440x1440 or higher. Photo should be taken in daytime without excessive filters or watermarking."
            label="Photos of Store"
          >
            <Controller
              control={control}
              name="mainImageRefId"
              render={({field, fieldState}) =>
                <ImageInput
                  errors={fieldState.error}
                  imageRefFields={{vendorId: vendor?.id}}
                  imageRefs={imageRefs}
                  mainImageRefId={field.value}
                  onChange={field.onChange}
                />
              }
              />
          </FieldLayout>
        }
      </section>

      <section>
        <h2>Contact &amp; Socials</h2>

        <FieldLayout
          error={errors.contact?.tel}
          label="Phone (Optional)"
          startContent={<HiPhone className="fill-gray-500 w-4 h-4" />}
        >
          <Input
            {...register('contact.tel')}
            autoComplete="tel"
          />
        </FieldLayout>

        <FieldLayout
          description="Your dispensary&apos;s public, general contact email."
          error={errors.contact?.email}
          label="Email (Optional)"
          startContent={<HiMail className="fill-gray-500 w-4 h-4" />}
        >
          <Input
            {...register('contact.email')}
            autoComplete="email"
            placeholder="contact@acmejoint.com"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.contact?.url}
          label="Website (Optional)"
        >
          <Input
            {...register('contact.url')}
            autoComplete="url"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.contact?.twitter}
          label="X/Twitter (Optional)"
          startContent={<BsTwitter className="fill-gray-500 w-4 h-4" />}
        >
          <Input
            {...register('contact.twitter')}
              autoComplete="twitter"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.contact?.facebook}
          label="Facebook Page (Optional)"
          startContent={<BsFacebook className="fill-gray-500 w-4 h-4" />}
        >
          <Input
            {...register('contact.facebook')}
              autoComplete="facebook"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.contact?.instagram}
          label="Instagram (Optional)"
          startContent={<BsInstagram className="fill-gray-500 w-4 h-4" />}
        >
          <Input
            {...register('contact.instagram')}
              autoComplete="instagram"
          />
        </FieldLayout>
      </section>

      <section>
        <h2>Business Hours</h2>

        <Controller
          control={control}
          name="operatingStatus"
          render={({field, fieldState}) =>
            <RadioGroup
              errorMessage={fieldState.error?.operatingStatus}
              isInvalid={'operatingStatus' in errors}
              label="Is your store open?"
              onValueChange={field.onChange}
              value={field.value}
            >
              <Radio
                description="Store is in business."
                value="open">
                Open
              </Radio>
              <Radio
                description="Store will reopen in the future."
                value="temporarilyClosed">
                Temporarily closed
              </Radio>
              {
                (isAdmin || field.value === 'permanentlyClosed') ?
                  <Radio
                    description="Store is closed and will not reopen."
                    value="permanentlyClosed">
                    Permanently closed
                  </Radio>
                  : undefined
              }
            </RadioGroup>
          }
        />

        <Controller
          control={control}
          name="schedule"
          render={({field, fieldState}) =>
            <VendorScheduleInput
              errors={fieldState.error}
              onChange={field.onChange}
              schedule={field.value}
            />
          }
        />
        <FieldError error={errors.schedule} />
      </section>

      <section>
        <h2>Legal</h2>

        <FieldLayout
          error={errors.license?.state}
          label="State of operation"
        >
          <Input
            {...register('license.state')}
            classNames={{
              input: 'cursor-not-allowed',
              inputWrapper: '!cursor-not-allowed bg-zinc-200',
            }}
            isReadOnly
          />
        </FieldLayout>

        <FieldLayout
          error={errors.license?.number}
          label="OMMA Dispensary License Number"
          description={
            <span>The dispensary license is issued by the Oklahoma Medical Marijuana Authority (OMMA). The license number is 12 character alphanumeric code, e.g. <code>DAAA-1234-5XYZ</code>.</span>
          }
        >
          <FormattedInput
            {...useController({control, name: 'license.number'}).field}
            autoComplete="off"
            format={orEmpty}
            parse={VendorUtil.parsePartialOmmaNumber}
          />
        </FieldLayout>
      </section>

      <section className="hidden">
        <h2>SEO</h2>

        <FieldLayout
          bottomDescription="Dash-separated alphanumeric characters only. 60 characters max."
          error={errors.slug}
          label="URL Slug"
          description={
            <span>The slug represents this dispensary in URLs. For example <code>http://treemap.com/vendor/<strong>acme-joint-emporium</strong></code>.</span>
          }
        >
          <Input
            {...register('slug')}
            autoComplete="vendor-slug"
          />
        </FieldLayout>
      </section>

      <FormErrors errors={errors} />
      <Button type="submit" isLoading={isSubmitting}>Save</Button>

      <hr className="my-4 border-gray-400" />
      <section>
        <h2>Preview</h2>
        <Watch
          control={control}
          render={formData =>
            <PreviewContainer vendor={preprocessFormData(formData)} />
          }
        />
      </section>
    </form>
    </FormProvider>
  )
}
