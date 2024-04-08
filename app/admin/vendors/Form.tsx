'use client'
import {AdminOnlyFieldDesc} from '@app/admin/components/AdminForm'
import {Button, Label, TextInput, Textarea} from 'flowbite-react'
import {Controller, useController} from 'react-hook-form'
import {FormattedInput} from '@components/FormattedInput'
import {ImageInput} from '@app/admin/components/ImageInput'
import {orEmpty} from '@util/ValidationUtil'
import {preprocessFormData} from './Schema'
import {PreviewContainer} from './Pane'
import {useTreemapForm, nullResolver, FormField, InputWithError, FieldDesc, FieldError, FormError, LabeledRadio, Watch} from '@components/Form'
import {VendorScheduleInput} from '@app/admin/components/VendorScheduleInput'
import {VendorUtil} from '@util/VendorUtil'

export const Form = ({vendor, imageRefs, isAdmin, action}) => {
  const {register, registerChecked, handleSubmit, formState: {errors}, control} = useTreemapForm({
    resolver: nullResolver(),
    defaultValues: vendor,
  })

  return (
    <form className="AdminForm" action={handleSubmit(action)}>
      <section>
        <h2>Store</h2>

        <FormField>
          <Label htmlFor="name">Store name</Label>
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
          <Label htmlFor="location.address">Storefront address</Label>
          <FieldDesc id="location.address.desc">
            Physical address, where customers will visit your dispensary.
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

        {vendor.id &&
          <FormField>
            <Label htmlFor="mainImageRefId">Photos of store</Label>
            <FieldDesc id="mainImageRefId.desc">
              Include at least one photo of your storefront. Minumum size 360x240, recommended 1440x1440 or higher. Photo should be taken in daytime without excessive filters or watermarking.
            </FieldDesc>
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
          </FormField>
        }
      </section>

      <section>
        <h2>Contact &amp; Socials</h2>

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

        <FormField>
          <Label htmlFor="contact.twitter">X/Twitter (Optional)</Label>
          <InputWithError errors={errors} name="contact.twitter">
            <TextInput
              {...register('contact.twitter')}
              autoComplete="twitter"
              id="contact.twitter"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="contact.facebook">Facebook Page (Optional)</Label>
          <InputWithError errors={errors} name="contact.facebook">
            <TextInput
              {...register('contact.facebook')}
              autoComplete="facebook"
              id="contact.facebook"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="contact.instagram">Instagram (Optional)</Label>
          <InputWithError errors={errors} name="contact.instagram">
            <TextInput
              {...register('contact.instagram')}
              autoComplete="instagram"
              id="contact.instagram"
            />
          </InputWithError>
        </FormField>
      </section>

      <section>
        <h2>Business Hours</h2>

        <InputWithError errors={errors} name="operatingStatus">
          <fieldset>
            <legend>Is your store open?</legend>

            <LabeledRadio
              {...registerChecked('operatingStatus', 'open')}
              aria-describedby="vendor.operatingStatus.open">
              Open
            </LabeledRadio>
            <FieldDesc id="vendor.operatingStatus.open">
              Store is in business.
            </FieldDesc>

            <LabeledRadio
              {...registerChecked('operatingStatus', 'temporarilyClosed')}
              aria-describedby="vendor.operatingStatus.temporarilyClosed">
              Temporarily closed
            </LabeledRadio>
            <FieldDesc id="vendor.operatingStatus.temporarilyClosed">
              Store will reopen in the future.
            </FieldDesc>

            <LabeledRadio
              {...registerChecked('operatingStatus', 'permanentlyClosed')}
              aria-describedby="vendor.operatingStatus.permanentlyClosed">
              Permanently closed
            </LabeledRadio>
            <FieldDesc id="vendor.operatingStatus.permanentlyClosed">
              Store is closed and will not reopen.
            </FieldDesc>
          </fieldset>
        </InputWithError>

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
          <Label htmlFor="license.number">OMMA Dispensary License Number</Label>
          <FieldDesc id="license.number.desc">
            The dispensary license is issued by the Oklahoma Medical Marijuana Authority (OMMA). The license number is 12 character alphanumeric code, e.g. <code>DAAA-1234-5XYZ</code>.
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

      <section>
        <h2>SEO</h2>

        <FormField>
          <Label htmlFor="slug">URL Slug</Label>
          <FieldDesc id="slug.desc">
            The slug represents this dispensary in URLs. For example <code>http://treemap.com/vendor/<strong>acme-joint-emporium</strong></code>.
          </FieldDesc>
          <InputWithError errors={errors} name="slug">
            <TextInput
              {...register('slug')}
              aria-describedby="slug.desc slug.desc2"
              autoComplete="vendor-slug"
              id="slug"
            />
          </InputWithError>
          <FieldDesc id="slug.desc2">
            Dash-separated alphanumeric characters only. 60 characters max.
          </FieldDesc>
        </FormField>
      </section>

      <FormError errors={errors} />
      <Button type="submit">Save</Button>

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
  )
}
