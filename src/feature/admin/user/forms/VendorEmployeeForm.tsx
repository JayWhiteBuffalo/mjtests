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

const VendorTypeaheadStore = new TypeaheadStore('vendor');

export const Form = ({user, createEmployee, vendorId, userOnVendor}) => {

    const methods = useForm({
        resolver: nullResolver(),
        defaultValues: {
            user,
            // producer: currentProducerId || null,
            // vendor: currentVendorId || null,
                }
            })
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
    } = methods
    return (
        <>
        <FormProvider {...methods}>
            <form className="AdminForm" action={handleSubmit(createEmployee)}>
                <section>
                    <h2>Create User Form</h2>

                    <FieldLayout>
                        <Select label="Select role" {...register('user.role')}>
                            <SelectItem key={"employee"} value={"employee"}>
                                Employee
                            </SelectItem>
                            <SelectItem key={"manager"} value={"manager"}>
                                Manager
                            </SelectItem>
                            <SelectItem key={"other"}>
                                Other
                            </SelectItem>
                        </Select>
                    </FieldLayout>

                <div className='flex gap-8'>
                    <FieldLayout
                        error={errors.user.firstname}
                        label="First Name"
                    >
                        <Input
                            {...register('user.firstname')}
                            autoComplete='off'
                            classNames={{

                            }}
                            />
                    </FieldLayout>

                    <FieldLayout
                        error={errors.user.lastname}
                        label="Last Name"
                    >
                        <Input
                            {...register('user.lastname')}
                            autoComplete='off'
                            classNames={{

                            }}
                            />
                    </FieldLayout>
                </div>

                    
                    <FieldLayout
                        error={errors.user.password}
                        label="Employee Password"
                    >
                        <Input
                            {...register('user.password')}
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
                    {/* <FieldLayout label="Vendor" error={errors.vendor}>
                        <AutocompleteAdapter
                        allowsCustomValue
                        name="vendor"
                        TypeaheadStore={VendorTypeaheadStore}
                        {...register('vendorId')}
                        />
                    </FieldLayout> */}

                    

                      
                    
                    </section>

                    <FormErrors errors={errors} />
                    <Button type="submit">Create</Button>
                
            </form>
        </FormProvider>
        </>
                    
    )
}