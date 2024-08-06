// import './ProductList.css'
// import ArrayUtil from '@util/ArrayUtil'
// import clsx from 'clsx'
// import MathUtil from '@util/MathUtil'
// import {BlueButton} from '@feature/shared/component/Link'
// import {ErrorBoundary} from '@feature/shared/component/Error'
// import {FilteredProducerStore, FilteredProductStore, FilteredVendorStore} from '../state/DataStore'
// import {FilterStore, LayoutStore} from '../state/UIStore'
// import {useState, useRef, useEffect} from 'react'
// import {Image} from '@feature/shared/component/Image'
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   Spinner,
//   Chip,
//   Button,
//   Link,
// } from '@nextui-org/react'
// import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'
// import {TerpeneSelectorItem} from '@feature/shared/component/TerpeneSelector'
// import {Treemap} from '@/Treemap'
// import {
//   useFloating,
//   useClick,
//   useDismiss,
//   useInteractions,
//   flip,
//   offset,
//   shift,
//   FloatingArrow,
//   arrow,
// } from '@floating-ui/react'
// import {useFluxStore} from '@/state/Flux'
// import {
//   VendorPopupContentContainer,
//   OpenStatus,
//   VendorRating,
//   VendorLocation,
//   VendorOperatingStatus,
//   VendorHours,
//   VendorContact,
// } from './VendorPopup'
// import {type Producer, type Product, type Vendor} from '@prisma/client'
// import type {ProductFilter} from '@/feature/shop/type/Shop'
// import type {ProductListMode} from '@/feature/shop/type/Ui'
// import TerpsDetails from '@/feature/shop/component/TerpDetails'
// import SingleProduct from '@/feature/shop/component/SingleProduct'
// import icon from '@/public/icon.png'
// import {name} from '@cloudinary/url-gen/actions/namedTransformation'
// import {Average} from 'next/font/google'
// import {VendorSchedule} from '@util/VendorSchedule'
// import {redirect} from 'next/dist/server/api-utils'

// const emDash = '—'



// const ProducerNameButton = ({producer}: {
//   producer: Producer
// }) => (
//   <Popover placement="top" shouldCloseOnInteractOutside={() => true}>
//     <PopoverTrigger>
//       <BlueButton>{producer.name}</BlueButton>
//     </PopoverTrigger>
//     <PopoverContent>
//       <ErrorBoundary>
//         <VendorPopupContentContainer producerId={producer.id} />
//       </ErrorBoundary>
//     </PopoverContent>
//   </Popover>
// )



// export const ProducerItem = ({producer, mode}: {
//     producer: Producer
//   mode: ProductListMode
// }) => {

//   return (
//     <li
//       className={clsx(
//         `Product ${mode}`,
//         'p-4 text-base transition flex flex-col mb-8 neu-product-card',
//         'min-w-full',
//       )}
//     >
//       <div className=''>
//             <div  className='grid grid-cols-4  '>
//                 <div className='col-span-1 '>
//                     {producer.mainImageRefId ? (
//                         <div
//                             className={clsx(
//                                 'relative',
//                                 mode === 'full' ? 'h-[175px]' : 'h-auto]',
//                             )}
//                             >
//                             <Image
//                                 alt="Producer"
//                                 className="mx-auto object-contain"
//                                 fill={true}
//                                 publicId={producer.mainImageRefId}
//                                 sizes="360px"
//                             />
//                         </div>
//                     ) : (
//                         <div
//                             className={clsx(
//                             'relative',
//                             mode === 'full' ? 'h-[175px]' : 'h-auto]',
//                             )}
//                         >
//                             <Image
//                             alt="Vendor"
//                             className="mx-auto object-contain"
//                             fill={true}
//                             src={icon}
//                             sizes="360px"
//                             />
//                         </div>
//                     )}
//                 </div>

//                 <div className='col-span-3 grid grid-row-2 w-full text-large'>
//                     <div className='flex flex-col gap-1 p-4 '>
//                     {mode === 'full' && producer.name ? (
//                         <h1 className='text-3xl'>{producer.name}</h1>
//                     ) : undefined}

                                
//                     {/* {mode === 'full' && producer.rating ? (
//                             <ProducerRating rating={producer.rating} />
//                         ) : undefined} */}

//                     {/* {producer.contact ? <ProducerContact contact={producer.contact} /> : undefined} */}

//                     {/* {mode == 'full' && producer.location ? (
//                         <span>{producer.location.address}</span>
//                     ) : undefined} */}
//                     {/* 
//                         {mode == 'full' && vendor.operatingStatus ? (
//                         <span>{vendor.operatingStatus}</span>
//                     ) : undefined} */}
//                             <div>
//                                 <Link href={`/producers/${producer.id}`}>
//                                 Details
//                                 </Link>
//                             </div>
//                     </div>

//                     <div>

//                     {/* {vendor.rating ? <VendorRating rating={vendor.rating} /> : undefined} */}
//                     {/* {VendorSchedule.hasSchedule(vendor.schedule) ? (
//                     <VendorHours display="row" schedule={vendor.schedule} />
//                     ) : undefined} */}
//                     </div>

//                 </div>



//             </div>

//                     {/* {vendor.location ? (
//                 <VendorLocation location={vendor.location} />
//             ) : undefined}
//             <VendorOperatingStatus status={vendor.operatingStatus} />
//             {vendor.openStatus ? (
//                 <OpenStatus status={vendor.openStatus} />
//             ) : undefined} */}


//         </div>
        
//     </li>
//   )
// }

// const ProducerList = ({filter, producers, mode} : {
//   filter: ProductFilter
//   producers: Producer[]
//   mode: ProductListMode



// }) => {
    
//   console.log(producers)
//   return(
//   <>
//     {producers.length !== 0 ? (
//       <p>
//         {producers.length}
//         {producers.length === 1 ? 'producer ' : 'producers '}
//         match your filter criteria
//       </p>
//     ) : undefined}
//     <ul
//       className={clsx(
//         `ProductList ${mode}`,
//         'grid p-2 min-h-0 justify-center',
//         mode === 'full' ? 'gap-3' : undefined,
//       )}
//     >
//       {producers.map(producer => (
//         <>
//         {producer.id &&
//         <ErrorBoundary key={producer.id}>
//           <ProducerItem mode={mode} producer={producer} />
//         </ErrorBoundary>
//         }
//         </>
//       ))}
//     </ul>
//     {producers.length === 0 ? (
//       <p className="text-gray-400 italic my-2 text-center">
//         No vendors match your filter criteria
//       </p>
//     ) : undefined}
//   </>
// )
// }

// const ProducerListPane = ({filter, producers, mode}) => (
//   <div
//     className={clsx(
//       'ProductListPane flex-1 basis-[400px]',
//       'flex flex-col items-stretch',
//     )}
//   >
//     <ErrorBoundary>
//       {producers
//         .then(producers => (
//           <ProducerList filter={filter} producers={producers} mode={mode} />
//         ))
//         .orPending(() => (
//           <div
//           className={clsx(
//             `ProductList ${mode}`,
//             ' w-full h-full min-h-max',
//             'productListLoadingPanel'
            
//           )}>
//             <Spinner size="xl" className="mt-6" />
//           </div>
//         ))}
//     </ErrorBoundary>
//   </div>
// )

// export const ProducerListPaneContainer = () => {

// //   const [seeProducers, setSeeProducer] = useState(true)

// //   const getStatus = () => {
// //   if(seeProducers === true){
// //     const products = useFluxStore(FilteredProductStore)
// //     return products
// //   } else {
// //     const products = useFluxStore(FilteredProductStore)
// //     return products
// //   }
// // }

//   const filter = useFluxStore(FilterStore)


// //   const products = useFluxStore(FilteredProductStore)
//   //  let products = useFluxStore(FilteredProducerStore)
//   const producers = useFluxStore(FilteredProducerStore)
//   console.log("PRODUCER ++++++++++++++++++++++++++++++++++++++++++" + JSON.stringify(producers))
//   const layout = useFluxStore(LayoutStore)
// //   const [singleProductOpen, setSingleProductOpen] = useState(false);
// //   const [productId, setProductId] = useState(null);

// //   useEffect(() => {
// //     if (productId !== null) {
// //       setSingleProductOpen(true);
// //     } else {
// //       setSingleProductOpen(false);
// //     }
// //   }, [productId]);

// //   const toggleProductPanel = () => {
// //     if(singleProductOpen){
// //       setSingleProductOpen(false)
// //     }
// //   }

//   return (
//     <>
//     {/* {singleProductOpen && productId != null? (
//       <>
//       <SingleProduct product={productId} togglePanel={toggleProductPanel}/>
//       </>
//     ) : ( */}
//       <ProducerListPane 
//       filter={filter}
//       mode={layout.productListMode}
//       producers={producers}
//       //setProductId={setProductId}
//       // producer={producer}
//     />
//     {/* )
//   } */}
//     </>
//   )
// }
