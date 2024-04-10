'use client'
import ArrayUtil from '@util/ArrayUtil'
import {AdminOnlyFieldDesc} from '@app/admin/components/AdminForm'
import {Button, Label, TextInput} from 'flowbite-react'
import {Dropdown, Typeahead} from '@components/Dropdown'
import {ImageInput} from '@app/admin/components/ImageInput'
import {PotencyInput} from '@app/admin/components/TerpeneInput'
import {preprocessFormData} from './Schema'
import {PreviewContainer} from './Pane'
import {TerpeneInput} from '@app/admin/components/TerpeneInput'
import {Treemap} from '@/Treemap'
import {TypeaheadStore} from '@/state/TypeaheadStore'
import {useController, Controller} from 'react-hook-form'
import {Watch, nullResolver, useTreemapForm, FormField, InputWithError, FieldDesc, FormError} from '@components/Form'

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

        <FormField>
          <Label htmlFor="name">Product Name</Label>
          <InputWithError errors={errors} name="name">
            <TextInput
              {...register('name')}
              autoComplete="off"
              id="name"
              placeholder="Mary Jane"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="productType">Product Type</Label>
          <InputWithError errors={errors} name="productType">
            <Dropdown
              {...useController({control, name: 'productType'}).field}
              id="productType"
              items={sortedProductTypes}
              placeholder="Select product type"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="concentrateType">Concentrate Type</Label>
          <InputWithError errors={errors} name="concentrateType">
            <Dropdown
              {...useController({
                control,
                name: 'concentrateType',
                disabled: productType !== 'concentrate',
              }).field}
              id="concentrateType"
              items={Treemap.concentrateTypes}
              placeholder="Select concentrate type"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="brand">Brand</Label>
          <InputWithError errors={errors} name="brand">
            <Typeahead
              {...useController({control, name: 'brand'}).field}
              id="brand"
              TypeaheadStore={BrandTypeaheadStore}
            />
          </InputWithError>
        </FormField>
      </section>

      <section>
        <h2>Weight and Price</h2>

        <FormField>
          <Label htmlFor="vendorId">Dispensary</Label>
          <InputWithError errors={errors} name="vendorId">
            <Dropdown
              {...useController({control, name: 'vendorId'}).field}
              id="vendorId"
              items={vendorItems}
              readOnly={!isAdmin && product.vendorId != null}
            />
          </InputWithError>
          <AdminOnlyFieldDesc isAdmin={isAdmin && product.vendorId != null} />
        </FormField>

        <FormField>
          <Label htmlFor="price">Price (USD)</Label>
          <InputWithError errors={errors} name="price">
            <TextInput
              {...register('price')}
              id="price"
              type="number"
              step={0.01}
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="weight">Weight (g)</Label>
          <InputWithError errors={errors} name="weight">
            <TextInput
              {...register('weight')}
              id="weight"
              type="number"
              step={0.01}
            />
          </InputWithError>
        </FormField>
      </section>

      <section>
        <h2>Activity</h2>

        <FormField>
          <Label htmlFor="producerId">Grower</Label>
          <InputWithError errors={errors} name="producerId">
            <Dropdown
              {...useController({control, name: 'producerId'}).field}
              id="producerId"
              items={producerItems}
              readOnly={!isAdmin && product.producerId != null}
            />
          </InputWithError>
          <AdminOnlyFieldDesc isAdmin={isAdmin && product.producerId != null} />
        </FormField>

        <FormField>
          <Label htmlFor="subspecies">Subspecies</Label>
          <InputWithError errors={errors} name="subspecies">
            <Dropdown
              {...useController({control, name: 'subspecies'}).field}
              id="subspecies"
              items={Treemap.subspecies}
              placeholder="Select subspecies"
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="cultivar">Cultivar</Label>
          <InputWithError errors={errors} name="cultivar">
            <Typeahead
              {...useController({control, name: 'cultivar'}).field}
              id="cultivar"
              TypeaheadStore={CultivarTypeaheadStore}
            />
          </InputWithError>
        </FormField>

        <FormField>
          <Label htmlFor="potency.thc">THC Potency (%)</Label>
          <FieldDesc id="potency.cbd.desc">
            Enter the total THC content, as a percent of concentration by weight.
          </FieldDesc>
          <InputWithError errors={errors} name="potency.thc">
            <PotencyInput
              {...useController({control, name: 'potency.thc'}).field}
              aria-describedby="potency.thc potency.thc2"
              id="potency.thc"
            />
          </InputWithError>
          <FieldDesc id="potency.thc2">
            Max precision 1ppm
          </FieldDesc>
        </FormField>

        <FormField>
          <Label htmlFor="potency.cbd">CBD Potency (%)</Label>
          <FieldDesc id="potency.cbd.desc">
            Enter the total CBD content, as a percent of concentration by weight.
          </FieldDesc>
          <InputWithError errors={errors} name="potency.cbd">
            <PotencyInput
              {...useController({control, name: 'potency.cbd'}).field}
              aria-describedby="potency.cbd potency.cbd2"
              id="potency.cbd"
            />
          </InputWithError>
          <FieldDesc id="potency.cbd2">
            Max precision 1ppm
          </FieldDesc>
        </FormField>

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

        <FormField>
          <Label htmlFor="slug">URL Slug</Label>
          <FieldDesc id="slug.desc">
            The slug represents this product in URLs. For example <code>http://treemap.com/product/<strong>beth-harmon-7g</strong></code>.
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

      <div className="flex gap-2">
        <Button type="submit">Save as Draft</Button>
        <Button type="submit" color="purple" formAction={handleSubmit(publish)}>Publish</Button>
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


