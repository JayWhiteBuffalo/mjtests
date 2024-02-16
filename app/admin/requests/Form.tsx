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
        <h2>About your dispensary</h2>

        <FormField>
          <Label htmlFor="vendor.name">Name of dispensary</Label>
          <FieldDesc id="vendor.name.desc">This is the public facing name of your dispensary, for example <i>Acme Joint Emporium.</i></FieldDesc>
          <InputWithError errors={errors} name="vendor.name">
            <TextInput
              {...register('vendor.name')}
              aria-describedby="vendor.name.desc"
              autoComplete="organization"
              id="vendor.name"
              />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="vendor.email">Email (Optional)</Label>
          <FieldDesc id="vendor.email.desc">Your dispensary&apos;s public, general contact email.</FieldDesc>
          <InputWithError errors={errors} name="vendor.email">
            <TextInput
              {...register('vendor.email')}
              aria-describedby="vendor.email.desc"
              autoComplete="email"
              id="vendor.email"
              placeholder="contact@acmejoint.com"
              />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="vendor.url">Website (Optional)</Label>
          <InputWithError errors={errors} name="vendor.url">
            <TextInput
              {...register('vendor.url')}
              autoComplete="url"
              id="vendor.url"
              />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="vendor.address">Storefront address</Label>
          <FieldDesc id="vendor.address.desc">Physical address, where customers will visit your dispensary.</FieldDesc>
          <InputWithError errors={errors} name="vendor.address">
            <Textarea
              {...register('vendor.address')}
              aria-describedby="vendor.address.desc"
              autoComplete="street-address"
              id="vendor.address"
              placeholder={"101 E Main St\nNorman, OK 73069"}
              />
          </InputWithError>
        </FormField>
      </section>

      <section>
        <h2>Miscellaneous</h2>

        <FormField>
          <Label htmlFor="referrer">Were you referred to us by anyone?</Label>
          <InputWithError errors={errors} name="referrer">
            <TextInput
              {...register('referrer')}
              id="referrer"
              />
          </InputWithError>
        </FormField>
      </section>

      <FormError errors={errors} />
      <Button type="submit">Submit</Button>
    </form>
  )
}
