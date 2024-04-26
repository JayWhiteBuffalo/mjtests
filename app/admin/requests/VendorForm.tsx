'use client'
import {Button, Input, Textarea} from '@nextui-org/react'
import {FormattedInput} from '@components/FormattedInput'
import {formSchema} from './Schema'
import {useTreemapForm, FieldLayout, FormErrors} from '@components/Form'
import {zodResolver} from '@hookform/resolvers/zod'

export const Form = ({user, action}) => {
  const {register, handleSubmit, formState: {errors}} = useTreemapForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <form className="AdminForm" action={handleSubmit(action)}>
      <section>
        <h2>About you</h2>

        <FieldLayout
          label="Your Name"
          error={errors.user?.name}
        >
          <Input
            {...register('user.name')}
            placeholder="Mary Jane"
            autoComplete="name"
          />
        </FieldLayout>

        <FieldLayout
          description="We will use this to contact you about your application."
          error={errors.user?.email}
          label="Your Email"
        >
          <Input
            {...register('user.email')}
            readOnly
            defaultValue={user.email}
          />
        </FieldLayout>
      </section>

      <section>
        <h2>About your dispensary</h2>

        <FieldLayout
          error={errors.vendor?.name}
          description="This is the public facing name of your dispensary, for example <i>Acme Joint Emporium."
          label="Name of dispensary"
        >
          <Input
            {...register('vendor.name')}
            autoComplete="organization"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.vendor?.email}
          description="Your dispensary&apos;s public, general contact email."
          label="Email (Optional)"
        >
          <Input
            {...register('vendor.email')}
            autoComplete="email"
            placeholder="contact@acmejoint.com"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.vendor?.url}
          label="Website (Optional)"
        >
          <Input
            {...register('vendor.url')}
            autoComplete="url"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.vendor?.address}
          description="Physical address, where customers will visit your dispensary."
          label="Storefront address"
        >
          <Textarea
            {...register('vendor.address')}
            autoComplete="street-address"
            placeholder={"101 E Main St\nNorman, OK 73069"}
          />
        </FieldLayout>

        <FieldLayout
          error={errors.vendor?.tel}
          description={<span>Your dispensary&apos;s public, general contact phone number.</span>}
          label="Phone (Optional)"
        >
          <Input
            {...register('vendor.tel')}
            autoComplete="tel"
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
            {...useController({control, name: 'vendor.license?.number'}).field}
            autoComplete="off"
            format={orEmpty}
            parse={VendorUtil.parsePartialOmmaNumber}
          />
        </FieldLayout>
      </section>

      <section>
        <h2>Miscellaneous</h2>

        <FieldLayout
          error={errors.referrer}
          label="Were you aided in onboarding by an onboarding specialist? If so, who?"
        >
          <Input
            {...register('referrer')}
          />
        </FieldLayout>
      </section>

      <input
        {...register('type')}
        type="hidden"
        name="type"
        value="vendor"
      />

      <FormErrors errors={errors} />
      <Button type="submit">Submit</Button>
    </form>
  )
}
