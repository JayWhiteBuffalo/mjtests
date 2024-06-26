'use client'

import {AutocompleteAdapter} from '@/feature/shared/component/AutocompleteAdapter'
import {FieldLayout, FormErrors, nullResolver} from '@/feature/shared/component/Form'
import {TypeaheadStore} from '@/state/TypeaheadStore'
import {Permission, hasAdminPermission, hasOwnerPermission, hasRole} from '@/util/Roles'
import {OptionsDropdown} from '@mantine/core'
import {Button, Input, Select, SelectItem} from '@nextui-org/react'
import {subscribe} from 'diagnostics_channel'
import {useEffect} from 'react'
import {FormProvider, useForm} from 'react-hook-form'

// const VendorTypeaheadStore = new TypeaheadStore('vendor');
// const ProducerTypeaheadStore = new TypeaheadStore('producers');

export const Form = ({user, action, vendors, producers}) => {

    const methods = useForm({
        resolver: nullResolver(),
        defaultValues : user,
            })
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
    } = methods

    // const methods = useForm()
    // const { handleSubmit, formState: { errors } } = methods

    const onSubmit = async (formData) => {
        const formattedData = {
            user: {
              firstname: formData.firstname,
              lastname: formData.lastname,
              email: formData.email,
            },
            password: formData.password,
            createdAt: new Date(),
            createdBy: '', // You might want to replace this with the actual creator's ID
            role: formData.role,
            account: {
            //   owner: formData.owner, // You might need to set this based on your application's logic
              producer: formData.producer || null,
              vendor: formData.vendor || null,
            },
            mainImageRefId: formData.mainImageRefId || null,
          }

        const result = await action(formattedData)
        if (result.issues) {
          // Handle validation errors
          console.log(result.issues)
        } else {
          // Handle successful form submission
          console.log('User created successfully')
          window.location.href = '/admin/users';
        }
      }

    return (
        <>
        <FormProvider {...methods}>
            <form className="AdminForm" action={handleSubmit(onSubmit)}>
                <section>
                    <h2>Create User Form</h2>

                    <FieldLayout>
                        <Select label="Select role" {...register('role')}>
                            <SelectItem key={"employee"} value={"employee"}>
                                Employee
                            </SelectItem>
                            <SelectItem key={"manager"} value={"manager"}>
                                Manager
                            </SelectItem>
                            {/* <SelectItem key={"other"}>
                                Other
                            </SelectItem> */}
                        </Select>
                    </FieldLayout>

                <div className='flex gap-8'>
                    <FieldLayout
                        error={errors.fname}
                        label="First Name"
                    >
                        <Input
                            {...register('firstname')}
                            autoComplete='off'
                            classNames={{

                            }}
                            />
                    </FieldLayout>

                    <FieldLayout
                        error={errors.lname}
                        label="Last Name"
                    >
                        <Input
                            {...register('lastname')}
                            autoComplete='off'
                            classNames={{

                            }}
                            />
                    </FieldLayout>
                </div>

                <FieldLayout>
                    <Input 
                        autoComplete='on'
                        type='email'
                        {...register('email')}
                        />
                </FieldLayout>

                    
                    <FieldLayout
                        error={errors.password}
                        label="Employee Password"
                    >
                        <Input
                            {...register('password')}
                            autoComplete='off'
                            type='password'
                            classNames={{

                            }}
                            />
                    </FieldLayout>

                    {/* POSSIBLE FIELD TO SELECT PERMISSIONS */}

                    {/* If user is not an owner or manager and does not have a associated subscriber account active/valid/logged in
                    then we need to have a option to select the associated store or producer to this user creation */}


                    {/* SELECT PARENT ACCOUNT */}
    
                        <>

                        <FieldLayout label="Vendor">
                        <select {...methods.register('vendor', { required: true })}>
                            <option value="">Select Vendor</option>
                            {vendors.map(vendor => (
                            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                             ))}
                        </select> 
                        </FieldLayout>

                        <FieldLayout label="Producer">
                        <select {...methods.register('producer', { required: true })}>
                            <option value="">Select Producer</option>
                            {producers.map(producer => (
                            <option key={producer.id} value={producer.id}>{producer.name}</option>
                             ))}
                        </select> 
                        </FieldLayout>

                    {/* <FieldLayout label="Vendor" error={errors.vendor}>
                        <AutocompleteAdapter
                        allowsCustomValue
                        TypeaheadStore={VendorTypeaheadStore}
                        {...register('vendor')}
                        />
                    </FieldLayout> */}
                    
                    {/* <FieldLayout label="Producer" error={errors.producer}>
                        <AutocompleteAdapter
                        allowsCustomValue
                        name="producer"
                        TypeaheadStore={ProducerTypeaheadStore}
                        {...register('user.producer')}
                        />
                    </FieldLayout> */}
                    </>
  
                      
                    
                    </section>

                    <FormErrors errors={errors} />
                    <Button type="submit">Create</Button>
                
            </form>
        </FormProvider>
        </>
                    
    )
}