'use client'
import Link from 'next/link'
import MathUtil from '@util/MathUtil'
import {AuditingSection} from '@/feature/admin/component/AuditingSection'
import {BlueLink} from '@/feature/shared/component/Link'
import {Button, Spinner} from '@nextui-org/react'
import {None, Unknown, InfoSection} from '@/feature/shared/component/InfoSection'
import {Present} from '@util/Present'
import {ProductItem} from '@/feature/shop/component/ProductList'
import {Treemap} from '@/Treemap'
import {useFluxStore} from '@/state/Flux'
import {VendorStore} from '@/feature/admin/state/DataStore'
import {AdminPane} from '@/feature/admin/component/Pane'
import { calculatePricePerGram, formatWeight, priceBreaks } from '@/util/CalculationHelper'

export const ProductPane = ({product, canEdit, producer}) => (
  <AdminPane>
    <div className="flex justify-end gap-2">
      {canEdit ? (
        <Link href={`/admin/products/${product.id}/edit`}>
          <Button>Edit</Button>
        </Link>
      ) : undefined}
    </div>

    <InfoSection>
      <header>
        <h2>General</h2>
      </header>
      <dl>
        <dt>Product ID</dt>
        <dd>
          <code>{product.id}</code>
        </dd>

        <dt>Name</dt>
        <dd>{product.name}</dd>

        <dt>Product type</dt>
        <dd>
          {product.productType ? (
            Treemap.productTypesByKey[product.productType].name
          ) : (
            <Unknown />
          )}
        </dd>

        {product.productType === 'concentrate' ? (
          <>
            <dt>Concentrate type</dt>
            <dd>
              {product.concentrateType ? (
                Treemap.concentrateTypesByKey[product.concentrateType].name
              ) : (
                <Unknown />
              )}
            </dd>
          </>
        ) : undefined}

        <dt>Brand</dt>
        <dd>{product.brand ?? <None />}</dd>

        <dt>Vendor</dt>
        <dd>
          {product.vendor ? (
            <BlueLink href={`/admin/vendors/${product.vendorId}`}>
              {product.vendor.name}
            </BlueLink>
          ) : (
            <None />
          )}
        </dd>

        <dt>Producer</dt>
        <dd>
          {product.producerId ? (
            <BlueLink href={`/admin/producers/${product.producerId}`}>
              {producer.name}
            </BlueLink>
          ) : (
            <Unknown />
          )}
        </dd>

        <dt>Flags</dt>
        <dd>
          <code>{JSON.stringify(product.flags)}</code>
        </dd>

        <dt>Rating</dt>
        <dd>
          <code>{JSON.stringify(product.rating)}</code>
        </dd>

        <dt className="hidden">Slug</dt>
        <dd className="hidden">
          <code>{product.slug}</code>
        </dd>

        <dt>Published</dt>
        <dd>{product.isDraft ? 'No (Draft)' : 'Yes'}</dd>

        <dt>Last updated</dt>
        <dd>{product.updatedAt.toString()}</dd>
      </dl>
    </InfoSection>

    <InfoSection>
      <header>
        <h2>Activity</h2>
      </header>
      <dl>
        <dt>Batch number</dt>
        <dd>
          {product.batch ? `${product.batch}` : <None />}
        </dd>

        <dt>Subspecies</dt>
        <dd>
          {product.subspecies ? (
            Treemap.subspeciesByKey[product.subspecies].name
          ) : (
            <Unknown />
          )}
        </dd>

        <dt>Cultivar</dt>
        <dd>{product.cultivar ?? <Unknown />}</dd>

        <dt>Total THC</dt>
        <dd>
          {product.potency.thc != null ? (
            MathUtil.roundTo(product.potency.thc * 100, 2) + '%'
          ) : (
            <Unknown />
          )}
        </dd>

        <dt>Total CBD</dt>
        <dd>
          {product.potency.cbd != null ? (
            MathUtil.roundTo(product.potency.cbd * 100, 2) + '%'
          ) : (
            <Unknown />
          )}
        </dd>
      </dl>
    </InfoSection>

    <InfoSection>
      <header>
        <h2>Price and Weight</h2>
      </header>

      {product.priceList.length > 0 ? (
      <dl>
        <dt>Price</dt>
        <dd>     
          {product.priceList && product.priceList.length > 0 
          ? `$${product.priceList[0].price}` 
          : <Unknown />
      }</dd>

        <dt>Weight</dt>
        <dd>{product.priceList && product.priceList.length > 0 
          ? `${product.priceList[0].weight}${product.priceList[0].weightUnit}` 
          : <Unknown />}
        </dd>
        
        {priceBreaks.map((breakWeight) => {
          const pricePerGram = calculatePricePerGram(
            product.priceList[0].price,
            breakWeight,
            'g'
          );
          return (
            <dl key={breakWeight}>
              <dt> {breakWeight}g</dt>
              <dd>{`&${pricePerGram}`}</dd>
            </dl>
          );
        })}
      </dl>
      ) : (
        <Unknown/>
      )
      }
    </InfoSection>
    

    <AuditingSection record={product} isAdmin={true} />

    <InfoSection>
      <header>
        <h2>Preview</h2>
      </header>
      <section>
        <PreviewContainer product={product} />
      </section>
    </InfoSection>
  </AdminPane>
)

export const PreviewContainer = ({product}) => {
  useFluxStore(VendorStore)
  const vendorPresent = product.vendorId
    ? VendorStore.getPresentById(product.vendorId)
    : Present.resolve(null)

  return vendorPresent
    .then(vendor => (
      <div className="w-full flex gap-4 flex-wrap">
        {/* <ul className=" w-full bg-white">
          <ProductItem product={{...product, vendor}} mode="full" />
        </ul> */}
        <ul className="w-[300px] bg-white">
          <ProductItem product={{...product, vendor}} mode="compact" />
        </ul>
      </div>
    ))
    .orPending(() => <Spinner />)
}
