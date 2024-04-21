'use client'
import {AdminOnlyText} from '@app/admin/components/AdminForm'
import {Button, Input, Textarea} from '@nextui-org/react'
import {Controller, useController} from 'react-hook-form'
import {FormattedInput} from '@components/FormattedInput'
import {HiMail, HiPhone} from 'react-icons/hi'
import {ImageInput} from '@app/admin/components/ImageInput'
import {orEmpty} from '@util/ValidationUtil'
import {useTreemapForm, nullResolver, FormError, FieldLayout} from '@components/Form'
import {VendorUtil} from '@util/VendorUtil'

export const Form = ({producer, isAdmin, imageRefs, action}) => {
  const {register, handleSubmit, formState: {errors}, control} = useTreemapForm({
    resolver: nullResolver(),
    defaultValues: producer,
  })

  return (
    <form className="AdminForm" action={handleSubmit(action)}>
      <section>
        <h2>Producer</h2>

        <FieldLayout
          bottomDescription={<AdminOnlyText isAdmin={isAdmin} />}
          error={errors.name}
          label="Producer Name"
        >
          <Input
            {...register('name')}
            autoComplete="off"
            readOnly={!isAdmin}
          />
        </FieldLayout>

        <FieldLayout
          label="Address"
          description="Physical address of your business."
          bottomDescription={<AdminOnlyText isAdmin={isAdmin} />}
          error={errors.location?.address}
        >
          <Textarea
            {...register('location.address')}
            autoComplete="street-address"
            readOnly={!isAdmin}
          />
        </FieldLayout>
      </section>

      <section>
        <h2>Contact</h2>

        <FieldLayout
          description="Physical address of your business."
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
          description="Your business&apos;s public, general contact email."
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
      </section>

      <section>
        <h2>Brand</h2>
        {producer.id &&
          <FieldLayout
            label="Logo"
            description="Include at least one logo or branding of your products. Minumum size 360x240, recommended 1440x1440 or higher."
          >
            <Controller
              control={control}
              name="mainImageRefId"
              render={({field, fieldState}) =>
                <ImageInput
                  errors={fieldState.error}
                  imageRefFields={{producerId: producer?.id}}
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
        <h2>Legal</h2>

        <FieldLayout
          error={errors.license?.state}
          label="State of Operation"
        >
          <Input
            {...register('license.state')}
            readOnly
          />
        </FieldLayout>

        <FieldLayout
          error={errors.license?.number}
          label="OMMA License Number"
          description={
            <span>The grower or processor license is issued by the Oklahoma Medical Marijuana Authority (OMMA). The license number is 12 character alphanumeric code, e.g. <code>GAAA-1234-5XYZ</code>.</span>
          }
        >
          <FormattedInput
            {...useController({control, name: 'license.number'}).field}
            aria-describedby="license.number.desc license.number.desc2"
            autoComplete="off"
            format={orEmpty}
            id="license.number"
            parse={VendorUtil.parsePartialOmmaNumber}
          />
        </FieldLayout>
      </section>

      <FormError errors={errors} />
      <Button type="submit">Save</Button>
    </form>
  )
}
