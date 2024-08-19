import './ProductList.css'
import clsx from 'clsx'
import {BlueButton} from '@feature/shared/component/Link'
import {ErrorBoundary} from '@feature/shared/component/Error'
import {FilteredVendorStore} from '../state/DataStore'
import {FilterStore, LayoutStore} from '../state/UIStore'
import {Image} from '@feature/shared/component/Image'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
  Link,
} from '@nextui-org/react'
import {useFluxStore} from '@/state/Flux'
import {
  VendorPopupContentContainer,
  VendorRating,
  VendorHours,
  VendorContact,
} from './VendorPopup'
import {type Product, type Vendor} from '@prisma/client'
import type {ProductFilter} from '@/feature/shop/type/Shop'
import type {ProductListMode} from '@/feature/shop/type/Ui'
import icon from '@/public/icon.png'
import {VendorSchedule} from '@util/VendorSchedule'

const emDash = '—'



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



export const VendorItem = ({vendor, mode}: {
    vendor: Vendor
  mode: ProductListMode
}) => {

  return (
    <li
      className={clsx(
        `Product ${mode}`,
        'p-4 text-base transition flex flex-col mb-8 neu-product-card',
        'min-w-full',
      )}
    >
      <div className=''>
            <div  className='grid grid-cols-4  '>
                <div className='col-span-1 '>
                    {vendor.mainImageRefId ? (
                        <div
                            className={clsx(
                                'relative',
                                mode === 'full' ? 'h-[175px]' : 'h-auto]',
                            )}
                            >
                            <Image
                                alt="Vendor"
                                className="mx-auto object-contain"
                                fill={true}
                                publicId={vendor.mainImageRefId}
                                sizes="360px"
                            />
                        </div>
                    ) : (
                        <div
                            className={clsx(
                            'relative',
                            mode === 'full' ? 'h-[175px]' : 'h-auto]',
                            )}
                        >
                            <Image
                            alt="Vendor"
                            className="mx-auto object-contain"
                            fill={true}
                            src={icon}
                            sizes="360px"
                            />
                        </div>
                    )}
                </div>

                <div className='col-span-3 grid grid-row-2 w-full text-large'>
                    <div className='flex flex-col gap-1 p-4 '>
                    {mode === 'full' && vendor.name ? (
                        <h1 className='text-3xl'>{vendor.name}</h1>
                    ) : undefined}

                                
                    {mode === 'full' && vendor.rating ? (
                            <VendorRating rating={vendor.rating} />
                        ) : undefined}

                    {vendor.contact ? <VendorContact contact={vendor.contact} /> : undefined}

                    {mode == 'full' && vendor.location ? (
                        <span>{vendor.location.address}</span>
                    ) : undefined}
                    {/* 
                        {mode == 'full' && vendor.operatingStatus ? (
                        <span>{vendor.operatingStatus}</span>
                    ) : undefined} */}
                            <div>
                                <Link href={`/vendors/${vendor.id}`}>
                                Details
                                </Link>
                            </div>
                    </div>

                    <div>

                    {/* {vendor.rating ? <VendorRating rating={vendor.rating} /> : undefined} */}
                    {VendorSchedule.hasSchedule(vendor.schedule) ? (
                    <VendorHours display="row" schedule={vendor.schedule} />
                    ) : undefined}
                    </div>

                </div>



            </div>

                    {/* {vendor.location ? (
                <VendorLocation location={vendor.location} />
            ) : undefined}
            <VendorOperatingStatus status={vendor.operatingStatus} />
            {vendor.openStatus ? (
                <OpenStatus status={vendor.openStatus} />
            ) : undefined} */}


        </div>
        
    </li>
  )
}

const VendorList = ({filter, vendors, mode} : {
  filter: ProductFilter
  vendors: Vendor[]
  mode: ProductListMode


}) => {
  return(
  <>
    {vendors.length !== 0 ? (
      <p>
        {vendors.length}
        {vendors.length === 1 ? 'vendor ' : 'vendors '}
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
      {vendors.map(vendor => (
        <>
        {vendor.id &&
        <ErrorBoundary key={vendor.id}>
          <VendorItem mode={mode} vendor={vendor} />
        </ErrorBoundary>
        }
        </>
      ))}
    </ul>
    {vendors.length === 0 ? (
      <p className="text-gray-400 italic my-2 text-center">
        No vendors match your filter criteria
      </p>
    ) : undefined}
  </>
)
}

const VendorListPane = ({filter, vendors, mode}) => (
  <div
    className={clsx(
      'ProductListPane flex-1 basis-[400px]',
      'flex flex-col items-stretch',
    )}
  >
    <ErrorBoundary>
      {vendors
        .then(vendors => (
          <VendorList filter={filter} vendors = {vendors} mode={mode} />
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

export const VendorListPaneContainer = () => {

//   const [seeProducers, setSeeProducer] = useState(true)

//   const getStatus = () => {
//   if(seeProducers === true){
//     const products = useFluxStore(FilteredProductStore)
//     return products
//   } else {
//     const products = useFluxStore(FilteredProductStore)
//     return products
//   }
// }

  const filter = useFluxStore(FilterStore)


//   const products = useFluxStore(FilteredProductStore)
  //  let products = useFluxStore(FilteredProducerStore)
  const vendors = useFluxStore(FilteredVendorStore)
  const layout = useFluxStore(LayoutStore)
//   const [singleProductOpen, setSingleProductOpen] = useState(false);
//   const [productId, setProductId] = useState(null);

//   useEffect(() => {
//     if (productId !== null) {
//       setSingleProductOpen(true);
//     } else {
//       setSingleProductOpen(false);
//     }
//   }, [productId]);

//   const toggleProductPanel = () => {
//     if(singleProductOpen){
//       setSingleProductOpen(false)
//     }
//   }

  return (
    <>
    {/* {singleProductOpen && productId != null? (
      <>
      <SingleProduct product={productId} togglePanel={toggleProductPanel}/>
      </>
    ) : ( */}
      <VendorListPane 
      filter={filter}
      mode={layout.productListMode}
      vendors={vendors}
      //setProductId={setProductId}
      // producer={producer}
    />
    {/* )
  } */}
    </>
  )
}
