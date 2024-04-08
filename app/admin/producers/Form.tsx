'use client'
import {AdminOnlyFieldDesc} from '@app/admin/components/AdminForm'
import {Button, Label, TextInput, Textarea} from 'flowbite-react'
import {FormattedInput} from '@components/FormattedInput'
import {orEmpty} from '@util/ValidationUtil'
import {Controller, useController} from 'react-hook-form'
import {ImageInput} from '@app/admin/components/ImageInput'
import {useTreemapForm, nullResolver, FormField, InputWithError, FieldDesc, FormError} from '@components/Form'
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

        <FormField>
          <Label htmlFor="name">Producer name</Label>
          <InputWithError errors={errors} name="name">
            <TextInput
              {...register('name')}
              id="name"
              aria-describedby="name.desc"
              autoComplete="off"
              readOnly={!isAdmin}
            />
          </InputWithError>
          <AdminOnlyFieldDesc id="name.desc" isAdmin={isAdmin} />
        </FormField>

        <FormField>
          <Label htmlFor="location.address">Address</Label>
          <FieldDesc id="location.address.desc">
            Physical address of your business.
          </FieldDesc>
          <InputWithError errors={errors} name="location.address">
            <Textarea
              {...register('location.address')}
              aria-describedby="location.address.desc location.address.desc2"
              autoComplete="street-address"
              id="location.address"
              readOnly={!isAdmin}
            />
          </InputWithError>
          <AdminOnlyFieldDesc id="location.address.desc2" isAdmin={isAdmin} />
        </FormField>
      </section>

      <section>
        <h2>Contact</h2>

        <FormField>
          <Label htmlFor="contact.tel">Phone (Optional)</Label>
          <InputWithError errors={errors} name="contact.tel">
            <TextInput
              {...register('contact.tel')}
              autoComplete="tel"
              id="contact.tel"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="contact.email">Email (Optional)</Label>
          <FieldDesc id="contact.email.desc">Your dispensary&apos;s public, general contact email.</FieldDesc>
          <InputWithError errors={errors} name="contact.email">
            <TextInput
              {...register('contact.email')}
              aria-describedby="contact.email.desc"
              autoComplete="email"
              id="contact.email"
              placeholder="contact@acmejoint.com"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="contact.url">Website (Optional)</Label>
          <InputWithError errors={errors} name="contact.url">
            <TextInput
              {...register('contact.url')}
              autoComplete="url"
              id="contact.url"
            />
          </InputWithError>
        </FormField>
      </section>

      <section>
        <h2>Brand</h2>
        {producer.id &&
          <FormField>
            <Label htmlFor="mainImageRefId">Logo</Label>
            <FieldDesc id="mainImageRefId.desc">
              Include at least one logo or branding of your products. Minumum size 360x240, recommended 1440x1440 or higher.
            </FieldDesc>
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
          </FormField>
        }
      </section>

      <section>
        <h2>Legal</h2>

        <FormField>
          <Label htmlFor="license.state">State of operation</Label>
          <InputWithError errors={errors} name="license.state">
            <TextInput
              {...register('license.state')}
              id="license.state"
              readOnly>
            </TextInput>
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="license.number">OMMA License Number</Label>
          <FieldDesc id="license.number.desc">
            The grower or processor license is issued by the Oklahoma Medical Marijuana Authority (OMMA). The license number is 12 character alphanumeric code, e.g. <code>GAAA-1234-5XYZ</code>.
          </FieldDesc>
          <InputWithError errors={errors} name="license.number">
            <FormattedInput
              {...useController({control, name: 'license.number'}).field}
              aria-describedby="license.number.desc license.number.desc2"
              autoComplete="off"
              format={orEmpty}
              id="license.number"
              parse={VendorUtil.parsePartialOmmaNumber}
            />
          </InputWithError>
          <FieldDesc id="license.number.desc2">

          </FieldDesc>
        </FormField>
      </section>

      <FormError errors={errors} />
      <Button type="submit">Save</Button>
    </form>
  )
}
