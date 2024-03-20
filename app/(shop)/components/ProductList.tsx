import './ProductList.css'
import ArrayUtil from '@util/ArrayUtil'
import clsx from 'clsx'
import MathUtil from '@util/MathUtil'
import {BlueButton} from '@components/Link'
import {Button, Dropdown, Spinner} from 'flowbite-react'
import {ErrorBoundary} from '@components/Error'
import {FilteredProductStore} from '../state/DataStore'
import {Fragment, useState, useRef} from 'react'
import {Image} from '@components/Image'
import {LayoutStore} from '../state/UIStore'
import {TerpeneSelectorItem} from '@components/TerpeneSelector'
import {Treemap} from '@/Treemap'
import {useFloating, useClick, useDismiss, useInteractions, flip, offset, shift, FloatingArrow, arrow} from '@floating-ui/react'
import {useFluxStore} from '@/state/Flux'
import {VendorPopupContentContainer, OpenStatus, VendorRating} from './VendorPopup'

const emDash = '—'

const ProductTypeLabel = ({product}) =>
  <div className="text-gray-500 text-sm font-bold leading-none uppercase">
    {Treemap.productTypesByKey[product.productType]?.name}
    {
      product.productType === 'concentrate'
        ? ` ${emDash} ${Treemap.concentrateTypesByKey[product.concentrateType]?.name ?? 'Unknown'}`
        : undefined
    }
  </div>

const Pill = props =>
  <Button
    {...props}
    className={`p-0 ${props.className}`}
    pill
    size="xs">
    {props.label}
  </Button>

const ProductPills = ({product}) =>
  // openNow, closing soon
  <div className="flex flex-wrap gap-1 mb-1">
    {
      product.subspecies
        ? <Pill label={Treemap.subspeciesByKey[product.subspecies].name} />
        : undefined
    }
    {
      product.flags.new
        ? <Pill label="New Listing" gradientDuoTone="pinkToOrange" />
        : undefined
    }
    {
      product.flags.topSeller
        ? <Pill label="Top Seller" gradientDuoTone="greenToBlue" />
        : undefined
    }
    {
      product.flags.hot
        ? <Pill label="Hot!" gradientMonochrome="failure" />
        : undefined
    }
    {
      product.flags.promotion
        ? <Pill label="Promotion" gradientMonochrome="pink" />
        : undefined
    }
  </div>

const VendorNameButton = ({vendor}) =>
  <Dropdown
    inline
    placement="top"
    renderTrigger={() =><BlueButton>{vendor.name}</BlueButton>}
  >
    <Dropdown.Item>
      <ErrorBoundary>
        <VendorPopupContentContainer vendorId={vendor.id} />
      </ErrorBoundary>
    </Dropdown.Item>
  </Dropdown>

const ProductSubheader = ({product}) =>
  product.vendor
    ? <div className="flex justify-between">
        <span className="text-sm">
          Sold by <VendorNameButton vendor={product.vendor} />
          &nbsp;
          {
            product.distance != null
              ? <span className="inline-block">({MathUtil.roundTo(product.distance / 1609.34, 1)} mi)</span>
              : undefined
          }
        </span>
        {
          product.pricePerGram != null
            ? <span className="text-sm">(${MathUtil.roundTo(product.pricePerGram, 1)}/g)</span>
            : undefined
        }
      </div>
    : undefined

export const ProductAttributeList = ({product}) =>
  <dl className="ProductAttributeList py-1 border-t border-gray-400">
    {
      product.brand
        ? <>
          <dt>Brand</dt>
          <dd className="ProductBrand">{product.brand}</dd>
        </>
        : undefined
    }

    {
      product.cultivar
        ? <>
          <dt>Strain</dt>
          <dd className="ProductStrain">{product.cultivar}</dd>
        </>
        : undefined
    }

    {
      product.weight != null
        ? <>
          <dt>Weight</dt>
          <dd className="ProductWeight">{product.weight}g</dd>
        </>
        : undefined
    }

    {
      product.potency.thc != null
        ? <>
          <dt>Total THC</dt>
          <dd className="ProductPotency">{MathUtil.roundTo(product.potency.thc * 100, 2)}%</dd>
        </>
        : undefined
    }

    {
      product.potency.cbd > 0
        ? <>
            <dt>Total CBD</dt>
            <dd className="ProductPotency">{MathUtil.roundTo(product.potency.cbd * 100, 2)}%</dd>
          </>
        : undefined
    }
  </dl>

const TerpItem = ({enabled = false, terpName, value}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const arrowRef = useRef()
  const {refs, floatingStyles, context} = useFloating({
    open: showTooltip,
    onOpenChange: setShowTooltip,
    placement: 'left',
    middleware: [
      offset(8),
      flip({fallbackAxisSideDirection: 'end'}),
      shift({padding: 8}),
      arrow({element: arrowRef}),
    ],
  })
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context, {enabled}),
    useDismiss(context, {enabled}),
  ])

  const terpProps = Treemap.terpenesByName[terpName]

  return (
    <>
      <li className={`ProductTerpItem ${enabled ? 'enabled' : ''}`}
        {...getReferenceProps()}
        ref={refs.setReference}
        style={{color: terpProps.color}}>
        {terpName}: {MathUtil.roundTo(value * 100, 2)}%
      </li>
      {showTooltip &&
        <div
          {...getFloatingProps()}
          className="TerpTooltip bg-white border border-gray-400 w-[300px] shadow"
          ref={refs.setFloating}
          style={floatingStyles}>
          <TerpeneSelectorItem terp={terpProps} />
          <FloatingArrow ref={arrowRef} context={context} fill="white" stroke="#aaa" strokeWidth="1" />
        </div>
      }
    </>
  )
}

export const Product = ({product, mode}) => {
  const terpEntries = ArrayUtil.sortBy(Object.entries(product.terps || []), ([_, x]) => -x)

  return (
    <li
      className={clsx(
        `Product ${mode}`,
        'p-2 border-gray-400 border text-base transition',
      )}>
      {
        product.mainImageRefId
          ? <div 
              className={clsx(
                'relative',
                mode === 'full' ? 'h-[240px]' : 'h-[100px]',
              )}>
              <Image
                alt="Product"
                className="mx-auto object-contain"
                fill={true}
                publicId={product.mainImageRefId}
                sizes="360px"
              />
            </div>
          : undefined
      }
      <ProductTypeLabel product={product} />
      <div className="flex justify-between">
        <h5 className="flex-1 font-bold">{product.name}</h5>
        {
          product.price != null
            ? <span className="ProductPrice">${product.price}</span>
            : undefined
        }
      </div>
      <ProductSubheader product={product} />
      {mode === 'full' && product.rating ? <VendorRating rating={product.rating} /> : undefined}
      {product.vendor?.openStatus ? <OpenStatus status={product.vendor.openStatus} /> : undefined}
      <ProductPills product={product} />

      {mode === 'full' ? <ProductAttributeList product={product} /> : undefined}
      {
        terpEntries.length && mode === 'full'
          ? <ul className="py-1 border-gray-400 border-t flex flex-col items-start">
              {terpEntries.map(([terpName, value]) =>
                <TerpItem key={terpName} terpName={terpName} value={value} />
              )}
            </ul>
          : undefined
      }
    </li>
  )
}

const ProductList = ({products, mode}) =>
  <>
    <ul 
      className={clsx(
        `ProductList ${mode}`,
        'grid p-2 min-h-0 justify-center',
        mode === 'full' ? 'gap-3' : undefined,
      )}>
      {products.map(product => 
        <ErrorBoundary key={product.id}>
          <Product
            mode={mode} 
            product={product} 
          />
        </ErrorBoundary>
      )}
    </ul>
    {products.length === 0
      ? <p className="text-gray-400 italic my-2 text-center">
          No products match your filter criteria
        </p>
      : undefined
    }
  </>

const ProductListPane = ({products, mode}) =>
  <div 
    className={clsx(
      'ProductListPane border-t border-gray-300 flex-1 basis-[400px]',
      'flex flex-col items-stretch',
    )}>
    <ErrorBoundary>
      {products
        .then(products => <ProductList products={products} mode={mode} />)
        .orPending(() => 
          <div className="flex justify-center">
            <Spinner size="xl" className="mt-6" />
          </div>
        )
      }
    </ErrorBoundary>
  </div>

export const ProductListPaneContainer = () => {
  const products = useFluxStore(FilteredProductStore)
  const layout = useFluxStore(LayoutStore)
  return (
    <ProductListPane 
      mode={layout.productListMode}
      products={products} 
    />
  )
}
