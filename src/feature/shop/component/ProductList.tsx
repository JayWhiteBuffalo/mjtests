import './ProductList.css'
import ArrayUtil from '@util/ArrayUtil'
import clsx from 'clsx'
import MathUtil from '@util/MathUtil'
import {BlueButton} from '@feature/shared/component/Link'
import {ErrorBoundary} from '@feature/shared/component/Error'
import {FilteredProducerStore, FilteredProductStore} from '../state/DataStore'
import {FilterStore, LayoutStore} from '../state/UIStore'
import {useState, useRef, useEffect} from 'react'
import {Image} from '@feature/shared/component/Image'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Chip,
  Button,
} from '@nextui-org/react'
import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'
import {TerpeneSelectorItem} from '@feature/shared/component/TerpeneSelector'
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
import {type Product, type Vendor} from '@prisma/client'
import type {ProductFilter} from '@/feature/shop/type/Shop'
import type {ProductListMode} from '@/feature/shop/type/Ui'
import TerpsDetails from '@/feature/shop/component/TerpDetails'
import SingleProduct from '@/feature/shop/component/SingleProduct'
import useViewport from '@/feature/shop/state/ViewPort'

const emDash = '—'

export const ProductTypeLabel = ({product}: {
  product: Product
}) => (
  <div className="text-gray-500 text-sm font-bold leading-none uppercase">
    {Treemap.productTypesByKey[product.productType]?.name}
    {product.productType === 'concentrate'
      ? ` ${emDash} ${Treemap.concentrateTypesByKey[product.concentrateType]?.name ?? 'Unknown'}`
      : undefined}
  </div>
)

export const ProductChips = ({product}: {
  product: Product
}) => (
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

const VendorNameButton = ({vendor}: {
  vendor: Vendor
}) => (
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

export const ProductSubheader = ({product}: {
  product: Product
}) =>
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
      {/* {product.pricePerGram != null ? (
        <span className="text-sm">
          (${MathUtil.roundTo(product.pricePerGram, 1)}/g)
        </span>
      ) : undefined} */}
    </div>
  ) : undefined

export const ProductAttributeList = ({product}: {
  product: Product
}) => (
  <dl className="ProductAttributeList p-2 border-l border-gray-400">
    {product.brand ? (
      <>
      <div className='whitespace-nowrap'>
        <dt>Brand</dt>
        <dd className="ProductBrand">{product.brand}</dd>
      </div>
      </>
    ) : undefined}

    {product.cultivar ? (
      <>
        <dt>Strain</dt>
        <dd className="ProductStrain">{product.cultivar}</dd>
      </>
    ) : undefined}

    {/* {product.weight != null ? (
      <>
        <dt>Weight</dt>
        <dd className="ProductWeight">{product.weight}g</dd>
      </>
    ) : undefined} */}

    {product.potency?.thc != null ? (
      <>
        <dt>Total THC</dt>
        <dd>
          {MathUtil.roundTo(product.potency.thc * 100, 2)}%
        </dd>
      </>
    ) : undefined}

    {product.potency?.thca != null ? (
      <>
        <dt>THCa</dt>
        <dd>
          {MathUtil.roundTo(product.potency.thca * 100, 2)}%
        </dd>
      </>
    ) : undefined}

    {product.potency?.delta8 != null ? (
      <>
        <dt>Delta-8</dt>
        <dd>
          {MathUtil.roundTo(product.potency.delta8 * 100, 2)}%
        </dd>
      </>
    ) : undefined}

    {product.potency?.cbd > 0 ? (
      <>
        <dt>Total CBD</dt>
        <dd>
          {MathUtil.roundTo(product.potency.cbd * 100, 2)}%
        </dd>
      </>
    ) : undefined}
  </dl>
)

export const TerpItem = ({enabled = false, terpName, value}: {
  enabled: boolean
  terpName: TerpName
  value: number
}) => {
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

export const PriceList = ({priceList, viewport}) => (
  <ul className={clsx(
    {
      'flex': viewport === 'mobile',
      'flex flex-row flex-wrap justify-center gap-4': viewport !== 'mobile',
    }
    )}>
    {priceList.map(({price, weight, weightUnit}) => (
      <li key={weight} className="w-[40%] text-center">
        {weight} {weightUnit} = ${price}
      </li>
    ))}
  </ul>
)

export const ProductItem = ({product, mode, setProductId}: {
  product: Product
  mode: ProductListMode
}) => {
  const terpEntries = ArrayUtil.sortBy(
    Object.entries(product.terps || []),
    ([_, x]) => -x,
  )

  const {viewport} = useViewport();

  return (
    <li
      className={clsx(
        `Product ${mode} ${viewport}`,
        'p-4 text-base transition flex flex-col mb-8 neu-product-card',
      )}
    >
      <div>
        <div className={clsx(
          
          `productCard ${mode} ${viewport}`,
          {
            '': viewport === 'mobile',
            'grid grid-cols-8 gap-8 p-2': viewport !== 'mobile',
          }
          )}>
          <div  className='col-span-2'>

          {product.mainImageRefId ? (
            <div
              className={clsx(
                'relative',
                mode === 'full' ? 'h-[175px]' : 'h-auto]',
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
          </div>

          <div className='flex flex-col justify-between items-stretch col-span-3'>
            <div className='pt-2 flex flex-col gap-1'>
            <ProductTypeLabel product={product} />
              <div className="flex justify-between">
                <h5 className="flex-1 font-bold text-2xl">{product.name}</h5>
                {/* {product.price != null ? (
                  <span className="ProductPrice">${product.price}</span>
                ) : undefined} */}
              </div>
            <ProductSubheader product={product} />
            
            {mode === 'full' && product.rating ? (
                <VendorRating rating={product.rating} />
              ) : undefined}
            </div>


            <div className='flex flex-col gap-1'>

              {/* {product.vendor?.openStatus ? (
                <OpenStatus status={product.vendor.openStatus} />
              ) : undefined} */}
              <ProductChips product={product} />
            </div>
          </div>

          {mode === 'full' ? (
            <>
          <div className='flex flex-col p-2 justify-center items-center'>
            <ProductAttributeList product={product} />
          </div>
        
        {product.priceList != undefined &&
          <div>
            <PriceList priceList={product.priceList} viewport={viewport} />
          </div>
          }
          </>
          )
            : (null)   
        
          }

          <div>
            <Button onClick={()=> setProductId(product)}>
              Details
            </Button>
          </div>

        </div>
        
        </div>

        {mode === 'full' && (
        <div className="flex flex-col gap-4">
          {terpEntries.length ? (
              <TerpsDetails terpEntries={terpEntries} viewport={viewport} />
          ) : null}
        </div>
      )}
    </li>
  )
}

export const 
 ProductList = ({filter, products, mode, setProductId}: {
  filter: ProductFilter
  products: Product[]
  mode: ProductListMode


}) => {
  return(
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
        <>
        {product.id &&
        <ErrorBoundary key={product.id}>
          <ProductItem mode={mode} product={product} setProductId={setProductId} />
        </ErrorBoundary>
        }
        </>
      ))}
    </ul>
    {products.length === 0 ? (
      <p className="text-gray-400 italic my-2 text-center">
        No products match your filter criteria
      </p>
    ) : undefined}
  </>
)
}

export const ProductListPane = ({filter, products, mode, setProductId}) => (
  <div
    className={clsx(
      'ProductListPane flex-1 basis-[400px]',
      'flex flex-col items-stretch',
    )}
  >
    <ErrorBoundary>
      {products
        .then(products => (
          <ProductList filter={filter} products={products} mode={mode} setProductId={setProductId} />
        ))
        .orPending(() => (
          <div
          className={clsx(
            `ProductList ${mode}`,
            ' w-full h-full min-h-max',
            'productListLoadingPanel'
            
          )}>
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
  const [singleProductOpen, setSingleProductOpen] = useState(false);
  const [productId, setProductId] = useState(null);

  const viewport = useViewport();

  useEffect(() => {
    if (productId !== null) {
      setSingleProductOpen(true);
    } else {
      setSingleProductOpen(false);
    }
  }, [productId]);

  const toggleProductPanel = () => {
    if(singleProductOpen){
      setSingleProductOpen(false)
    }
  }


  return (
    <>
    {singleProductOpen && productId != null? (
      <>
      <SingleProduct product={productId} togglePanel={toggleProductPanel} viewport={viewport}/>
      </>
    ) : (
      <ProductListPane 
      filter={filter}
      mode={layout.productListMode}
      products={products}
      setProductId={setProductId}
    />
    )
  }
    </>
  )
}
