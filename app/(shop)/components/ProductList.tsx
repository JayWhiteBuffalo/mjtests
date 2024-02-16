import './ProductList.css'
import ArrayUtil from '@util/ArrayUtil'
import MathUtil from '@util/MathUtil'
import {BlueButton} from '@components/Link'
import {Button, Dropdown, Spinner} from 'flowbite-react'
import {Image} from '@components/Image'
import {FilteredProductStore} from '../state/DataStore'
import {FluxContainer} from '@/state/Flux'
import {Fragment, useState, useRef} from 'react'
import {LayoutStore} from '../state/UIStore'
import {TerpeneSelectorItem} from '@components/TerpeneSelector'
import {Treemap} from '@/Treemap'
import {useFloating, useClick, useDismiss, useInteractions, flip, offset, shift, FloatingArrow, arrow} from '@floating-ui/react'
import {VendorPopupContentContainer, OpenStatus, VendorRating} from './VendorPopup'

const emDash = '—'

const ProductTypeLabel = ({product}) =>
  <div className="ProductTypeLabel">
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
    className={`p-0 ${props.className} Pill`}
    pill
    size="xs">
    {props.label}
  </Button>

const ProductPills = ({product}) =>
  // openNow, closing soon
  <div className="ProductPills">
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
    renderTrigger={() =><BlueButton>{vendor.name}</BlueButton>}>
    <Dropdown.Item><VendorPopupContentContainer vendorId={vendor.id} /></Dropdown.Item>
  </Dropdown>

const ProductSubheader = ({product}) =>
  product.vendor
    ? <div className="ProductSubheader">
        <span className="ProductVendor">
          Sold by <VendorNameButton vendor={product.vendor} />
          &nbsp;
          {
            product.distance != null
              ? <span className="ProductDistance">({MathUtil.roundTo(product.distance / 1609.34, 1)} mi)</span>
              : undefined
          }
        </span>
        {
          product.pricePerGram != null
            ? <span className="ProductPricePerGram">(${MathUtil.roundTo(product.pricePerGram, 1)}/g)</span>
            : undefined
        }
      </div>
    : undefined

export const ProductAttributeList = ({product}) =>
  <dl className="ProductAttributeList">
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

const TerpItem = ({enabled, terpName, value}) => {
  enabled = !!enabled

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
          className="TerpTooltip shadow"
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
    <li className={`Product ${mode}`}>
      {
        product.mainImageRefId
          ? <div className="ProductImageWrapper">
              <Image
                alt="Product"
                className="ProductImage"
                fill={true}
                publicId={product.mainImageRefId}
                sizes="360px"
               />
            </div>
          : undefined
      }
      <ProductTypeLabel product={product} />
      <div className="ProductHeader">
        <h5 className="ProductName">{product.name}</h5>
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
          ? <ul className="ProductTerpList">
              {terpEntries.map(([terpName, value]) =>
                <TerpItem key={terpName} terpName={terpName} value={value} />
              )}
            </ul>
          : undefined
      }
    </li>
  )
}

const ProductListPane = ({products, mode}) =>
  <div className="ProductListPane">
    <ul className={`ProductList ${mode}`}>
      {products
        .then(products =>
          products.length !== 0
            ? products.map(product => <Product key={product.id} product={product} mode={mode} />)
            : <span className="EmptyList">No products match your filter criteria</span>
        )
        .orElse(() => <Spinner />)
      }
    </ul>
  </div>

export const ProductListPaneContainer = FluxContainer(
  [FilteredProductStore, LayoutStore],
  (products, layout) => <ProductListPane products={products} mode={layout.productListMode} />
)
