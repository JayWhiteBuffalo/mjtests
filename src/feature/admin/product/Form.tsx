'use client'
import ArrayUtil from '@util/ArrayUtil'
import {AdminOnlyText} from '@/feature/admin/component/AdminForm'
import {ImageInput} from '@/feature/admin/component/ImageInput'
import {Input, Button} from '@nextui-org/react'
import {
  PotencyTableInput,
} from '@/feature/admin/component/TerpeneInput'
import {preprocessFormData} from './Schema'
import {PreviewContainer} from './Pane'
import {TerpeneInput} from '@/feature/admin/component/TerpeneInput'
import {Treemap} from '@/Treemap'
import {TypeaheadStore} from '@/state/TypeaheadStore'
import {Controller, FormProvider} from 'react-hook-form'
import {
  Watch,
  nullResolver,
  useForm,
  FieldLayout,
  FormErrors,
} from '@/feature/shared/component/Form'
import {DropdownAdapter} from '@/feature/shared/component/DropdownAdapter'
import {AutocompleteAdapter} from '@/feature/shared/component/AutocompleteAdapter'
import {PriceListInput} from '@/feature/admin/product/PriceListInput'

const BrandTypeaheadStore = new TypeaheadStore('brand')
const CultivarTypeaheadStore = new TypeaheadStore('cultivar')

const sortedProductTypes = ArrayUtil.sortBy(Treemap.productTypes, x => x.name)

export const Form = ({
  product,
  vendorItems,
  producerItems,
  imageRefs,
  isAdmin,
  isEmployee,
  publish,
  saveDraft,
  submitForReview, 
}) => {
  const methods = useForm({
    resolver: nullResolver(),
    defaultValues: product,
  })
  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
    watch,
    setValue,
  } = methods
  const productType = watch('productType')

  
  return (
    <FormProvider {...methods}>
      <form className="AdminForm" action={handleSubmit(saveDraft)}>
        <section>
          <h2>General</h2>

          <FieldLayout error={errors.name} label="Product Name">
            <Input
              {...register('name')}
              autoComplete="off"
              placeholder="Mary Jane"
            />
          </FieldLayout>

          <FieldLayout error={errors.productType} label="Product Type">
            <DropdownAdapter
              items={sortedProductTypes}
              name="productType"
              placeholder="Select product type"
            />
          </FieldLayout>

          <FieldLayout label="Concentrate Type" error={errors.concentrateType}>
            <DropdownAdapter
              isDisabled={productType !== 'concentrate'}
              items={Treemap.concentrateTypes}
              name="concentrateType"
              placeholder="Select concentrate type"
            />
          </FieldLayout>

          <FieldLayout label="Brand" error={errors.brand}>
            <AutocompleteAdapter
              allowsCustomValue
              name="brand"
              TypeaheadStore={BrandTypeaheadStore}
            />
          </FieldLayout>
        </section>

        <section>
          <h2>Weight and Price</h2>

          <FieldLayout
            bottomDescription={
              <AdminOnlyText isAdmin={isAdmin && product.vendorId != null} />
            }
            error={errors.concentrateType}
            label="Dispensary"
          >
            <DropdownAdapter
              items={vendorItems}
              name="vendorId"
              readOnly={!isAdmin && product.vendorId != null}
            />
          </FieldLayout>

          <PriceListInput
            defaultPriceList={product.priceList ?? []}
            onChange={priceList => setValue('priceList', priceList)}
            errors={errors.priceList}
          />
        </section>

        <section>
          <h2>Activity</h2>
          
          <FieldLayout
            bottomDescription={
              <AdminOnlyText isAdmin={isAdmin && product.producerId != null} />
            }
            error={errors.producerId}
            label="Grower"
          >
            <DropdownAdapter
              items={producerItems}
              name="producerId"
              // value={product.producerId || producerItems.key}
              defaultValue={producerItems.map((item) => item.key)}
              readOnly={!isAdmin && product.producerId != null}
            />
          </FieldLayout>

          <FieldLayout error={errors.batch} label="Batch number (Optional)">
            <Input {...register('batch')} />
          </FieldLayout>

          <FieldLayout error={errors.subspecies} label="Subspecies">
            <DropdownAdapter
              items={Treemap.subspecies}
              name="subspecies"
              placeholder="Select subspecies"
            />
          </FieldLayout>

          <FieldLayout label="Cultivar" error={errors.cultivar}>
            <AutocompleteAdapter
              allowsCustomValue
              name="cultivar"
              TypeaheadStore={CultivarTypeaheadStore}
            />
          </FieldLayout>

          <Controller
            control={control}
            name="potency"
            render={({field, fieldState}) => (
              <PotencyTableInput
                errors={fieldState.error}
                onChange={field.onChange}
                potency={field.value ?? {}}
              />
            )}
          />

          <Controller
            control={control}
            name="terps"
            render={({field, fieldState}) => (
              <TerpeneInput
                errors={fieldState.error}
                onChange={field.onChange}
                terps={field.value ?? {}}
              />
            )}
          />
        </section>

        <section>
          <h2>Images</h2>
          <Controller
            control={control}
            name="mainImageRefId"
            render={({field, fieldState}) => (
              <ImageInput
                errors={fieldState.error}
                imageRefFields={{productId: product?.id}}
                imageRefs={imageRefs}
                mainImageRefId={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </section>

        <section className="hidden">
          <h2>SEO</h2>

          <FieldLayout
            bottomDescription="Dash-separated alphanumeric characters only. 60 characters max."
            error={errors.slug}
            label="URL Slug"
            description={
              <span>
                The slug represents this product in URLs. For example{' '}
                <code>
                  http://treemap.com/product/<strong>beth-harmon-7g</strong>
                </code>
                .
              </span>
            }
          >
            <Input {...register('slug')} autoComplete="product-slug" />
          </FieldLayout>
        </section>

        <FormErrors errors={errors} />

        <div className="flex gap-2">
          <Button 
            color={product.isDraft ? 'primary' : 'default'}
            type="submit"
          >
            {product.isDraft ? 'Save as Draft' : 'Revert to draft'}
          </Button>

        {!isEmployee &&
          <Button
            type="submit"
            color={product.isDraft ? 'secondary' : 'primary'}
            formAction={handleSubmit(publish)}
          >
            {product.isDraft ? 'Publish' : 'Save'}
          </Button>
        }

        {isEmployee &&
          <Button
            type="submit"
            color={product.isDraft ? 'secondary' : 'primary'}
            formAction={handleSubmit(submitForReview)}
          >
            {product.isDraft ? 'Submit for Review' : 'Save'}
          </Button>
        }
        </div>

        <hr className="my-4 border-gray-400" />
        <section>
          <h2>Preview</h2>
          <Watch
            control={control}
            render={formData => (
              <PreviewContainer
                product={preprocessFormData({isDraft: true})(formData)}
              />
            )}
          />
        </section>
      </form>
    </FormProvider>
  )
}
