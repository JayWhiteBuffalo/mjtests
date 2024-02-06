import './ProductList.css'
import ArrayUtil from '@util/ArrayUtil'
import Image from 'next/Image'
import MathUtil from '@util/MathUtil'
import {Button, Dropdown, Spinner} from 'flowbite-react'
import {FilteredProductStore} from '@state/DataStore'
import {FluxContainer} from '@state/Flux'
import {Fragment, useState, useRef} from 'react'
import {LayoutStore} from '@state/UIStore'
import {TerpSelectorItem} from './TerpsFilter'
import {Treemap} from '@/Treemap'
import {useFloating, useClick, useDismiss, useInteractions, flip, offset, shift, FloatingArrow, arrow} from '@floating-ui/react'
import {VendorPopupContentContainer, OpenStatus, VendorRating} from './VendorPopup'

const emDash = '—'

const ProductTypeLabel = ({product}) =>
  <div className="ProductTypeLabel">
    {Treemap.productTypesByKey[product.productType].name}
    {
      product.productType === 'concentrate' 
        ? ` ${emDash} ${Treemap.concentrateTypesByKey[product.concentrateType].name}` 
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

const ProductPills = ({product}) => {

  // openNow, closing soon
  return (
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
  )
}

const VendorNameButton = ({vendorName}) =>
  <Dropdown
    inline
    placement="top"
    renderTrigger={() =>
      <button className="text-cyan-600 hover:underline dark:text-cyan-500">
        {vendorName}
      </button>
    }>
    <Dropdown.Item><VendorPopupContentContainer vendorName={vendorName} /></Dropdown.Item>
  </Dropdown>

const TerpItem = ({terpName, value}) => {
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
    useClick(context),
    useDismiss(context),
  ])

  const terpProps = Treemap.terpenesByName[terpName]

  return (
    <>
      <li className="ProductTerpItem"
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
          <TerpSelectorItem terp={terpProps} />
          <FloatingArrow ref={arrowRef} context={context} fill="white" stroke="#aaa" strokeWidth="1" />
        </div>
      }
    </>
  )
}


const Product = ({product, mode}) => {
  const terpEntries = ArrayUtil.sortBy(Object.entries(product.terps || []), ([_, x]) => -x)

  return (
    <li className={`Product ${mode}`}>
      <div className="ProductImageWrapper">
        <Image 
          alt="Product"
          className="ProductImage"
          fill={true}
          src={product.imageUrl}
          />
      </div>
      <ProductTypeLabel product={product} />
      <div className="ProductHeader">
        <h5 className="ProductName">{product.name}</h5>
        <span className="ProductPrice">${product.price}</span>
      </div>
      <div className="ProductSubheader">
        <span className="ProductVendor">
          Sold by <VendorNameButton vendorName={product.vendor.name} />
          &nbsp;
          <span className="ProductDistance">({MathUtil.roundTo(product.distance / 1609.34, 1)} mi)</span>
        </span>
        <span className="ProductPricePerGram">(${MathUtil.roundTo(product.pricePerGram, 1)}/g)</span>
      </div>
      {mode === 'full' && product.rating ? <VendorRating rating={product.rating} /> : undefined}
      <OpenStatus status={product.vendor.openStatus} />
      <ProductPills product={product} />

      {mode === 'full'
        ? <dl className="ProductAttributeList">
            <dt>Brand</dt>
            <dd className="ProductBrand">{product.brand}</dd>

            <dt>Strain</dt>
            <dd className="ProductStrain">{product.cultivar}</dd>

            <dt>Weight</dt>
            <dd className="ProductWeight">{product.weight}g</dd>

            <dt>Total THC</dt>
            <dd className="ProductPotency">{MathUtil.roundTo(product.potency.thc * 100, 2)}%</dd>

            {
              product.potency.cbd > 0
                ? <>
                    <dt>Total CBD</dt>
                    <dd className="ProductPotency">{MathUtil.roundTo(product.potency.cbd * 100, 2)}%</dd>
                  </>
                : undefined
            }
          </dl>
        : undefined
      }
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
            ? products.map(product => <Product key={product.key} product={product} mode={mode} />)
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
