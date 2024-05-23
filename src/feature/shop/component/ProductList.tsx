import './ProductList.css'
import ArrayUtil from '@util/ArrayUtil'
import clsx from 'clsx'
import MathUtil from '@util/MathUtil'
import {BlueButton} from '@components/Link'
import {ErrorBoundary} from '@components/Error'
import {FilteredProductStore} from '../state/DataStore'
import {FilterStore, LayoutStore} from '../state/UIStore'
import {Fragment, useState, useRef} from 'react'
import {Image} from '@components/Image'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Chip,
} from '@nextui-org/react'
import {ProductFilterUtil} from '@util/ProductFilterUtil'
import {TerpeneSelectorItem} from '@components/TerpeneSelector'
import {Treemap} from '@/Treemap'
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  flip,
  offset,
  shift,
  FloatingArrow,
  arrow,
} from '@floating-ui/react'
import {useFluxStore} from '@/state/Flux'
import {
  VendorPopupContentContainer,
  OpenStatus,
  VendorRating,
} from './VendorPopup'

const emDash = '—'

const ProductTypeLabel = ({product}) => (
  <div className="text-gray-500 text-sm font-bold leading-none uppercase">
    {Treemap.productTypesByKey[product.productType]?.name}
    {product.productType === 'concentrate'
      ? ` ${emDash} ${Treemap.concentrateTypesByKey[product.concentrateType]?.name ?? 'Unknown'}`
      : undefined}
  </div>
)

const ProductChips = ({product}) => (
  // openNow, closing soon
  <div className="flex flex-wrap gap-1 mb-1">
    {product.subspecies ? (
      <Chip className="bg-cyan-700 dark:bg-cyan-600 text-white" size="sm">
        {Treemap.subspeciesByKey[product.subspecies].name}
      </Chip>
    ) : undefined}
    {product.flags.new ? (
      <Chip
        className="bg-gradient-to-br from-pink-500 to-orange-400 text-white"
        size="sm"
      >
        New Listing
      </Chip>
    ) : undefined}
    {product.flags.topSeller ? (
      <Chip
        className="bg-gradient-to-br from-green-400 to-cyan-600 text-white"
        size="sm"
      >
        Top Seller
      </Chip>
    ) : undefined}
    {product.flags.hot ? (
      <Chip
        className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white"
        size="sm"
      >
        Hot!
      </Chip>
    ) : undefined}
    {product.flags.promotion ? (
      <Chip
        className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white"
        size="sm"
      >
        Promotion
      </Chip>
    ) : undefined}
  </div>
)

const VendorNameButton = ({vendor}) => (
  <Popover placement="top" shouldCloseOnInteractOutside={() => true}>
    <PopoverTrigger>
      <BlueButton>{vendor.name}</BlueButton>
    </PopoverTrigger>
    <PopoverContent>
      <ErrorBoundary>
        <VendorPopupContentContainer vendorId={vendor.id} />
      </ErrorBoundary>
    </PopoverContent>
  </Popover>
)

const ProductSubheader = ({product}) =>
  product.vendor ? (
    <div className="flex justify-between">
      <span className="text-sm">
        Sold by <VendorNameButton vendor={product.vendor} />
        &nbsp;
        {product.vendor.distance != null ? (
          <span className="inline-block">
            ({MathUtil.roundTo(product.vendor.distance / 1609.34, 1)} mi)
          </span>
        ) : undefined}
      </span>
      {product.pricePerGram != null ? (
        <span className="text-sm">
          (${MathUtil.roundTo(product.pricePerGram, 1)}/g)
        </span>
      ) : undefined}
    </div>
  ) : undefined

export const ProductAttributeList = ({product}) => (
  <dl className="ProductAttributeList py-1 border-t border-gray-400">
    {product.brand ? (
      <>
        <dt>Brand</dt>
        <dd className="ProductBrand">{product.brand}</dd>
      </>
    ) : undefined}

    {product.cultivar ? (
      <>
        <dt>Strain</dt>
        <dd className="ProductStrain">{product.cultivar}</dd>
      </>
    ) : undefined}

    {product.weight != null ? (
      <>
        <dt>Weight</dt>
        <dd className="ProductWeight">{product.weight}g</dd>
      </>
    ) : undefined}

    {product.potency.thc != null ? (
      <>
        <dt>Total THC</dt>
        <dd className="ProductPotency">
          {MathUtil.roundTo(product.potency.thc * 100, 2)}%
        </dd>
      </>
    ) : undefined}

    {product.potency.cbd > 0 ? (
      <>
        <dt>Total CBD</dt>
        <dd className="ProductPotency">
          {MathUtil.roundTo(product.potency.cbd * 100, 2)}%
        </dd>
      </>
    ) : undefined}
  </dl>
)

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
      <li
        className={`ProductTerpItem ${enabled ? 'enabled' : ''}`}
        {...getReferenceProps()}
        ref={refs.setReference}
        style={{color: terpProps.color}}
      >
        {terpName}: {MathUtil.roundTo(value * 100, 2)}%
      </li>
      {showTooltip && (
        <div
          {...getFloatingProps()}
          className="TerpTooltip bg-white border border-gray-400 w-[300px] shadow"
          ref={refs.setFloating}
          style={floatingStyles}
        >
          <TerpeneSelectorItem terp={terpProps} />
          <FloatingArrow
            ref={arrowRef}
            context={context}
            fill="white"
            stroke="#aaa"
            strokeWidth="1"
          />
        </div>
      )}
    </>
  )
}

export const Product = ({product, mode}) => {
  const terpEntries = ArrayUtil.sortBy(
    Object.entries(product.terps || []),
    ([_, x]) => -x,
  )

  return (
    <li
      className={clsx(
        `Product ${mode}`,
        'p-2 border-gray-400 border text-base transition',
      )}
    >
      {product.mainImageRefId ? (
        <div
          className={clsx(
            'relative',
            mode === 'full' ? 'h-[240px]' : 'h-[100px]',
          )}
        >
          <Image
            alt="Product"
            className="mx-auto object-contain"
            fill={true}
            publicId={product.mainImageRefId}
            sizes="360px"
          />
        </div>
      ) : undefined}
      <ProductTypeLabel product={product} />
      <div className="flex justify-between">
        <h5 className="flex-1 font-bold">{product.name}</h5>
        {product.price != null ? (
          <span className="ProductPrice">${product.price}</span>
        ) : undefined}
      </div>
      <ProductSubheader product={product} />
      {mode === 'full' && product.rating ? (
        <VendorRating rating={product.rating} />
      ) : undefined}
      {product.vendor?.openStatus ? (
        <OpenStatus status={product.vendor.openStatus} />
      ) : undefined}
      <ProductChips product={product} />

      {mode === 'full' ? <ProductAttributeList product={product} /> : undefined}
      {terpEntries.length && mode === 'full' ? (
        <ul className="py-1 border-gray-400 border-t flex flex-col items-start">
          {terpEntries.map(([terpName, value]) => (
            <TerpItem key={terpName} terpName={terpName} value={value} />
          ))}
        </ul>
      ) : undefined}
    </li>
  )
}

const ProductList = ({filter, products, mode}) => (
  <>
    {products.length !== 0 && ProductFilterUtil.isEmpty(filter) ? (
      <p>
        {products.length}
        {products.length === 1 ? 'product' : 'products'}
        match your filter criteria
      </p>
    ) : undefined}
    <ul
      className={clsx(
        `ProductList ${mode}`,
        'grid p-2 min-h-0 justify-center',
        mode === 'full' ? 'gap-3' : undefined,
      )}
    >
      {products.map(product => (
        <ErrorBoundary key={product.id}>
          <Product mode={mode} product={product} />
        </ErrorBoundary>
      ))}
    </ul>
    {products.length === 0 ? (
      <p className="text-gray-400 italic my-2 text-center">
        No products match your filter criteria
      </p>
    ) : undefined}
  </>
)

const ProductListPane = ({filter, products, mode}) => (
  <div
    className={clsx(
      'ProductListPane border-t border-gray-300 flex-1 basis-[400px]',
      'flex flex-col items-stretch',
    )}
  >
    <ErrorBoundary>
      {products
        .then(products => (
          <ProductList filter={filter} products={products} mode={mode} />
        ))
        .orPending(() => (
          <div className="flex justify-center">
            <Spinner size="xl" className="mt-6" />
          </div>
        ))}
    </ErrorBoundary>
  </div>
)

export const ProductListPaneContainer = () => {
  const filter = useFluxStore(FilterStore)
  const products = useFluxStore(FilteredProductStore)
  const layout = useFluxStore(LayoutStore)
  return (
    <ProductListPane
      filter={filter}
      mode={layout.productListMode}
      products={products}
    />
  )
}
