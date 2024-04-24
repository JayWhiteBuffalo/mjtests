'use client'
import ArrayUtil from '@util/ArrayUtil'
import {AdminOnlyText} from '@app/admin/components/AdminForm'
import {Dropdown, Typeahead} from '@components/Dropdown'
import {ImageInput} from '@app/admin/components/ImageInput'
import {Input, Button} from '@nextui-org/react'
import {PotencyInput} from '@app/admin/components/TerpeneInput'
import {preprocessFormData} from './Schema'
import {PreviewContainer} from './Pane'
import {TerpeneInput} from '@app/admin/components/TerpeneInput'
import {Treemap} from '@/Treemap'
import {TypeaheadStore} from '@/state/TypeaheadStore'
import {useController, Controller} from 'react-hook-form'
import {Watch, nullResolver, useTreemapForm, FieldLayout, FormErrors} from '@components/Form'

const BrandTypeaheadStore = new TypeaheadStore('brand')
const CultivarTypeaheadStore = new TypeaheadStore('cultivar')

const sortedProductTypes = ArrayUtil.sortBy(Treemap.productTypes, x => x.name)

export const Form = ({product, vendorItems, producerItems, imageRefs, isAdmin, publish, saveDraft}) => {
  const {register, handleSubmit, formState: {errors}, control, watch} = useTreemapForm({
    resolver: nullResolver(),
    defaultValues: product,
  })
  const productType = watch('productType')

  return (
    <form className="AdminForm" action={handleSubmit(saveDraft)}>
      <section>
        <h2>General</h2>

        <FieldLayout
          error={errors.name}
          label="Product Name"
        >
          <Input
            {...register('name')}
            autoComplete="off"
            placeholder="Mary Jane"
          />
        </FieldLayout>

        <FieldLayout
          error={errors.productType}
          label="Product Type"
        >
          <Dropdown
            {...useController({control, name: 'productType'}).field}
            items={sortedProductTypes}
            placeholder="Select product type"
          />
        </FieldLayout>

        <FieldLayout
          label="Concentrate Type"
          error={errors.concentrateType}
        >
          <Dropdown
            {...useController({
              control,
              name: 'concentrateType',
              disabled: productType !== 'concentrate',
            }).field}
            items={Treemap.concentrateTypes}
            placeholder="Select concentrate type"
          />
        </FieldLayout>

        <FieldLayout
          label="Brand"
          error={errors.brand}
        >
          <Typeahead
            {...useController({control, name: 'brand'}).field}
            TypeaheadStore={BrandTypeaheadStore}
          />
        </FieldLayout>
      </section>

      <section>
        <h2>Weight and Price</h2>

        <FieldLayout
          bottomDescription={<AdminOnlyText isAdmin={isAdmin && product.vendorId != null} />}
          error={errors.concentrateType}
          label="Dispensary"
        >
          <Dropdown
            {...useController({control, name: 'vendorId'}).field}
            items={vendorItems}
            readOnly={!isAdmin && product.vendorId != null}
          />
        </FieldLayout>

        <FieldLayout
          error={errors.price}
          label="Price (USD)"
        >
          <Input
            step={0.01}
            type="number"
            {...register('price')}
          />
        </FieldLayout>

        <FieldLayout
          error={errors.weight}
          label="Weight (g)"
        >
          <Input
            step={0.01}
            type="number"
            {...register('weight')}
          />
        </FieldLayout>
      </section>

      <section>
        <h2>Activity</h2>

        <FieldLayout
          bottomDescription={<AdminOnlyText isAdmin={isAdmin && product.producerId != null} />}
          error={errors.producerId}
          label="Grower"
        >
          <Dropdown
            {...useController({control, name: 'producerId'}).field}
            items={producerItems}
            readOnly={!isAdmin && product.producerId != null}
          />
        </FieldLayout>

        <FieldLayout
          error={errors.subspecies}
          label="Subspecies"
        >
          <Dropdown
            {...useController({control, name: 'subspecies'}).field}
            items={Treemap.subspecies}
            placeholder="Select subspecies"
          />
        </FieldLayout>

        <FieldLayout
          label="Cultivar"
          error={errors.cultivar}
        >
          <Typeahead
            {...useController({control, name: 'cultivar'}).field}
            TypeaheadStore={CultivarTypeaheadStore}
          />
        </FieldLayout>

        <FieldLayout
          bottomDescription="Max precision 1ppm"
          error={errors.potency?.thc}
          label="THC Potency (%)"
          description="Enter the total THC content, as a percent of concentration by weight."
        >
          <PotencyInput
            {...useController({control, name: 'potency.thc'}).field}
          />
        </FieldLayout>

        <FieldLayout
          bottomDescription="Max precision 1ppm"
          error={errors.potency?.cbd}
          label="THC Potency (%)"
          description="Enter the total CBD content, as a percent of concentration by weight."
        >
          <PotencyInput
            {...useController({control, name: 'potency.cbd'}).field}
          />
        </FieldLayout>

        <Controller
          control={control}
          name="terps"
          render={({field, fieldState}) =>
            <TerpeneInput
              errors={fieldState.error}
              onChange={field.onChange}
              terps={field.value ?? {}}
            />
          }
        />
      </section>

      <section>
        <h2>Images</h2>
        <Controller
          control={control}
          name="mainImageRefId"
          render={({field, fieldState}) =>
            <ImageInput
              errors={fieldState.error}
              imageRefFields={{productId: product?.id}}
              imageRefs={imageRefs}
              mainImageRefId={field.value}
              onChange={field.onChange}
            />
          }
        />
      </section>

      <section>
        <h2>SEO</h2>

        <FieldLayout
          bottomDescription="Dash-separated alphanumeric characters only. 60 characters max."
          error={errors.slug}
          label="URL Slug"
          description={
            <span>
              The slug represents this product in URLs. For example <code>http://treemap.com/product/<strong>beth-harmon-7g</strong></code>.
            </span>
          }
        >
          <Input
            {...register('slug')}
            autoComplete="product-slug"
          />
        </FieldLayout>
      </section>

      <FormErrors errors={errors} />

      <div className="flex gap-2">
        <Button type="submit">Save as Draft</Button>
        <Button type="submit" color="secondary" formAction={handleSubmit(publish)}>Publish</Button>
      </div>

      <hr className="my-4 border-gray-400" />
      <section>
        <h2>Preview</h2>
        <Watch
          control={control}
          render={formData =>
            <PreviewContainer product={preprocessFormData({isDraft: true})(formData)} />
          }
        />
      </section>
    </form>
  )
}


