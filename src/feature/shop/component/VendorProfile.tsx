'use client'
import VendorDto from '@/data/VendorDto';
import {OpenStatus, VendorContact, VendorHours, VendorOperatingStatus, VendorRating} from '@/feature/shop/component/VendorPopup'
import {VendorSchedule} from '@util/VendorSchedule'
import type {Vendor} from '@prisma/client'
import icon from '@/public/icon.png'
import {useEffect} from 'react'
import {ProductItem, ProductList, ProductListPane} from '@/feature/shop/component/ProductList'
import {ErrorBoundary} from 'react-error-boundary'
import clsx from 'clsx'


export const VendorProfile = ({vendor, products}) => {

console.log("Products + ++++++++++++++++++++++++++++++++++++++++++++++++++++++++" + JSON.stringify(products))
let mode = 'full'

  if (!vendor) {
    return <div>Vendor not found</div>;
  }

  return (
    <>
      <main className='w-full flex flex-col gap-4'>
        <header className='w-full flex justify-center items-center'>
          <h1 className='border-1 border-black w-5/6 p-4 text-center'>
            {vendor.name || 'Vendor name Unavailable'}
          </h1>
        </header>
        <div className='flex justify-center items-center'>
          <div className='w-5/6 h-48 bg-slate-300'></div>
        </div>
        <div className='flex items-center justify-center'>
          <section className='grid grid-cols-3 w-5/6 gap-6 '>
            <div className='col-span-1 flex flex-col gap-3'>
              <div className='w-full h-48 bg-slate-400'>
              {vendor.mainImageRefId ? (
                        <div
                            >
                            <img
                                alt="Vendor"
                                className="mx-auto object-contain"
                                src={vendor.mainImageRefId}
                                sizes="360px"
                            />
                        </div>
                    ) : (
                        <div
                        >
                            <img
                            alt="Vendor"
                            className="mx-auto object-contain"
                            src={icon}
                            sizes="360px"
                            />
                        </div>
                    )}
                </div>
              
              <div className='flex flex-col gap-4 justify-center items-center'>

              {vendor.rating ? (
                            <VendorRating rating={vendor.rating} />
                        ) : undefined
              }

              {vendor.operatingStatus ? (
                      <VendorOperatingStatus status={vendor.operatingStatus} />
              ) : undefined}

                      {vendor.openStatus ? (
                        <OpenStatus status={vendor.openStatus} />
                      ) : undefined}
                    
              </div>
            </div>
            <div className='col-span-2 '>
              <div className='w-full flex flex-col gap-2'>
                {/* <span>Address: </span>
                <span> Phone #:</span>
                <span> E-mail: </span> */}
                {vendor.contact ? <VendorContact contact={vendor.contact} /> : undefined}
                {vendor.location ? (
                        <span>{vendor.location.address}</span>
                    ) : undefined}
                <div className='flex flex-wrap gap-1'>
                  {/* <span> Flags/Tags </span>
                  <span> Flags/Tags </span>
                  <span> Flags/Tags </span>
                  <span> Flags/Tags </span>
                  <span> Flags/Tags </span> */}
                </div>
              </div>
              <div>
                <div className='flex justify-evenly'>
                {vendor.openStatus ? (
        <OpenStatus status={vendor.openStatus} />
      ) : undefined}
                  <button>Directions</button>
                </div>
                <div className='grid grid-flow-row gap-3'>
                {VendorSchedule.hasSchedule(vendor.schedule) ? (
                    <VendorHours display="row" schedule={vendor.schedule} />
                    ) : undefined}
                  {/* <div className='flex justify-evenly'>
                    <span>Mon: ##:## - ##:##</span>
                    <span>Mon: ##:## - ##:##</span>
                  </div>
                  <div className='flex justify-evenly'>
                    <span>Mon: ##:## - ##:##</span>
                    <span>Mon: ##:## - ##:##</span>
                  </div>
                  <div className='flex justify-evenly'>
                    <span>Mon: ##:## - ##:##</span>
                    <span>Mon: ##:## - ##:##</span>
                  </div>
                  <div className='flex justify-center'>
                    <span>Mon: ##:## - ##:##</span>
                  </div> */}
                </div>
              </div>
            </div>
          </section>
        </div>
        <section>
          <div className='w-full flex justify-center items-center'>
            <h2 className='border-1 border-black w-5/6 p-4 text-center'>Current Menu</h2>
          </div>
          <div className='w-full flex flex-co justify-center items-center'>
            <ul
              className={clsx(
                `ProductList ${mode}`,
                'grid p-2 min-h-0 justify-center relative',
                mode === 'full' ? 'gap-3' : undefined,
              )}
            >
              {products.map(product => (
                <>
                {product.id &&
                <ErrorBoundary key={product.id}>
                  <ProductItem mode={mode} product={product}/>
                </ErrorBoundary>
                }
                </>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};


