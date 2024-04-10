'use client'
import {Button, Label, TextInput, Textarea} from 'flowbite-react'
import {useTreemapForm, FormField, InputWithError, FieldDesc, FormError} from '@components/Form'
import {zodResolver} from '@hookform/resolvers/zod'
import {formSchema} from './Schema'

export const Form = ({user, action}) => {
  const {register, handleSubmit, formState: {errors}} = useTreemapForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <form className="AdminForm" action={handleSubmit(action)}>
      <section>
        <h2>About you</h2>

        <FormField>
          <Label htmlFor="user.name">Your Name</Label>
          <InputWithError errors={errors} name="user.name">
            <TextInput
              {...register('user.name')}
              id="user.name"
              placeholder="Mary Jane"
              autoComplete="name"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="user.email">Your Email</Label>
          <FieldDesc id="user.email.desc">We will use this to contact you about your application.</FieldDesc>
          <InputWithError errors={errors} name="user.email">
            <TextInput
              {...register('user.email')}
              aria-describedby="user.email.desc"
              id="user.email"
              readOnly
              defaultValue={user.email}
            />
          </InputWithError>
        </FormField>
      </section>

      <section>
        <h2>About your business</h2>

        <FormField>
          <Label htmlFor="producer.name">Name of business</Label>
          <FieldDesc id="producer.name.desc">This is the name of your business, for example <i>Acme Joint Emporium.</i></FieldDesc>
          <InputWithError errors={errors} name="producer.name">
            <TextInput
              {...register('producer.name')}
              aria-describedby="producer.name.desc"
              autoComplete="organization"
              id="producer.name"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="producer.email">Email (Optional)</Label>
          <FieldDesc id="producer.email.desc">Your business&apos;s, general contact email. If you provide this, it will be shown to potential distributors.</FieldDesc>
          <InputWithError errors={errors} name="producer.email">
            <TextInput
              {...register('producer.email')}
              aria-describedby="producer.email.desc"
              autoComplete="email"
              id="producer.email"
              placeholder="contact@acmejoint.com"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="producer.url">Website (Optional)</Label>
          <InputWithError errors={errors} name="producer.url">
            <TextInput
              {...register('producer.url')}
              autoComplete="url"
              id="producer.url"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="producer.address">Physical address (Optional)</Label>
          <FieldDesc id="producer.address.desc">Physical address of your business. If you provide this, it will be shown to potential distributors.</FieldDesc>
          <InputWithError errors={errors} name="producer.address">
            <Textarea
              {...register('producer.address')}
              aria-describedby="producer.address.desc"
              autoComplete="street-address"
              id="producer.address"
              placeholder={"101 E Main St\nNorman, OK 73069"}
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="producer.tel">Phone (Optional)</Label>
          <FieldDesc id="producer.tel.desc">Your business&apos;s public, general contact phone number.</FieldDesc>
          <InputWithError errors={errors} name="producer.tel">
            <TextInput
              {...register('producer.tel')}
              aria-describedby="producer.tel.desc"
              autoComplete="tel"
              id="producer.tel"
            />
          </InputWithError>
        </FormField>
      </section>

      <section>
        <h2>Miscellaneous</h2>

        <FormField>
          <Label htmlFor="referrer">Were you aided in onboarding by an onboarding specialist? If so, who?</Label>
          <InputWithError errors={errors} name="referrer">
            <TextInput
              {...register('referrer')}
              id="referrer"
            />
          </InputWithError>
        </FormField>
      </section>

      <input
        {...register('type')}
        type="hidden"
        name="type"
        value="producer"
      />

      <FormError errors={errors} />
      <Button type="submit">Submit</Button>
    </form>
  )
}
