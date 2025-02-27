'use client'
import {Button, Input, Textarea} from '@nextui-org/react'
import {FormattedInput} from '@/feature/shared/component/FormattedInput'
import {formSchema} from './Schema'
import {orEmpty} from '@util/ValidationUtil'
import {FormProvider, useController} from 'react-hook-form'
import {useForm, FieldLayout, FormErrors} from '@/feature/shared/component/Form'
import {VendorUtil} from '@util/VendorUtil'
import {zodResolver} from '@hookform/resolvers/zod'

export const Form = ({user, action}) => {
  const methods = useForm({
    resolver: zodResolver(formSchema),
  })
  const {
    control,
    register,
    handleSubmit,
    formState: {errors},
  } = methods

  return (
    <FormProvider {...methods}>
      <form className="AdminForm" action={handleSubmit(action)}>
        <section>
          <h2>About you</h2>

          <FieldLayout error={errors.user?.name} label="Your Name">
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
              classNames={{
                input: 'cursor-not-allowed',
                inputWrapper: '!cursor-not-allowed bg-zinc-200',
              }}
              defaultValue={user.email}
              isReadOnly
            />
          </FieldLayout>
        </section>

        <section>
          <h2>About your business</h2>

          <FieldLayout
            description={
              <span>
                This is the name of your business, for example{' '}
                <i>Acme Joint Emporium.</i>
              </span>
            }
            error={errors.producer?.name}
            label="Name of business"
          >
            <Input {...register('producer.name')} autoComplete="organization" />
          </FieldLayout>

          <FieldLayout
            description={
              <span>
                Your business&apos;s, general contact email. If you provide
                this, it will be shown to potential distributors.
              </span>
            }
            error={errors.producer?.email}
            label="Email (Optional)"
          >
            <Input
              {...register('producer.email')}
              autoComplete="email"
              placeholder="contact@acmejoint.com"
            />
          </FieldLayout>

          <FieldLayout error={errors.producer?.url} label="Website (Optional)">
            <Input {...register('producer.url')} autoComplete="url" />
          </FieldLayout>

          <FieldLayout
            description="Physical address of your business. If you provide this, it will be shown to potential distributors."
            error={errors.producer?.address}
            label="Physical address (Optional)"
          >
            <Textarea
              {...register('producer.address')}
              autoComplete="street-address"
              placeholder={'101 E Main St\nNorman, OK 73069'}
            />
          </FieldLayout>

          <FieldLayout
            error={errors.producer?.tel}
            description="Your business's public, general contact phone number."
            label="Phone (Optional)"
          >
            <Input {...register('producer.tel')} autoComplete="tel" />
          </FieldLayout>

          <FieldLayout
            error={errors.producer?.licenseNumber}
            label="OMMA License Number"
            description={
              <span>
                The grower or processor license is issued by the Oklahoma
                Medical Marijuana Authority (OMMA). The license number is 12
                character alphanumeric code, e.g. <code>GAAA-1234-5XYZ</code>.
              </span>
            }
          >
            <FormattedInput
              {...useController({control, name: 'producer.licenseNumber'})
                .field}
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
            <Input {...register('referrer')} />
          </FieldLayout>

          <FieldLayout
            label= "Which POS Systems (if any) do you currently use and plan to continue using in the near future?"
            error={errors.pos}
            >
              <Input {...register('pos')}/>
            </FieldLayout>
        </section>

        <input
          {...register('type')}
          type="hidden"
          name="type"
          value="producer"
        />

        <FormErrors errors={errors} />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  )
}
