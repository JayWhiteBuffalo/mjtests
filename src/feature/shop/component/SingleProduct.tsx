'use client'
import './SingleProduct.css'
import { OpenStatus, VendorRating } from '@/feature/shop/component/VendorPopup';
import { ProductChips, ProductTypeLabel, ProductSubheader, ProductAttributeList, TerpItem } from '@/feature/shop/component/ProductList';
import {Image} from '@feature/shared/component/Image'
import clsx from 'clsx';
import TerpDetails from '@/feature/shop/component/TerpDetails'
import ArrayUtil from '@/util/ArrayUtil';
import MathUtil from '@/util/MathUtil';
import {Divider} from '@nextui-org/react'
import { FaArrowLeftLong } from "react-icons/fa6";


const SingleProduct =({product, togglePanel, viewport}) => {

    const terpEntries = ArrayUtil.sortBy(
      Object.entries(product.terps || []),
      ([_, x]) => -x,
    )

    const AccordianRow = ({children}) => {
        return(
            <div className='w-full'>
                <div className='flex flex-col justify-start items-center gap-8 p-4'>
                    <div>
                        {children}
                    </div>
                </div>

            </div>
        )
    }

 const ProductAttributeList1 = ({product}: {
        product: Product
      }) => (
        <dl className="flex p-2 w-full justify-evenly">
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
    
    const THCDetails = () => {

        return(
        <div className='flex flex-1'>
            <ul className=' flex flex-1 flex-col justify-center items-start gap-6'>
                <li>THC: ##.###%</li>
                <li>THCa: ##.###%</li>
                <li>THCo: ##.###%</li>
                <li>Delta-8: ##.###%</li>
                <li>Delta-10: ##.###%</li>
                <li>THCCV: ##.###%</li>
                <li>THCP: ##.###%</li>
            </ul>
        </div>
        )
    }


const TerpsDetailPane = ({ terpEntries }) => {

  return (

        <>
            {terpEntries.length &&
                <div className='flex flex-col items-start px-2'>
                    <ul className="py-1 grid grid-cols-2 col-auto gap-4 items-start justify-between mt-2">
                        {terpEntries.map(([terpName, value]) => (
                        <TerpItem key={terpName} terpName={terpName} value={value} />
                        ))}
                    </ul>
                </div>}
        </>
  );
};

    return(

        <section className={clsx(
                            `singleProductSection ${viewport}`,
        )}>
            <div className='singleProductCont '>
                <button className='closeButton' onClick={togglePanel}>
                    <FaArrowLeftLong className='w-8 h-6 hover:scale-110'/>
                </button>
                <div className='productCardHead'>
                    <div className='productCardImage'>
                        {product.mainImageRefId ? (
                        <div
                            className={clsx(
                                'relative',
                                'h-[175px]',
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
                    <Divider orientation="vertical"/>
                    <div className='productCardInfoSection'>
                        <div className='productCardTitle'>
                            <ProductTypeLabel product={product} />
                        </div>
                        <div className='productCardInfoCont'>
                            <div className='flex flex-col justify-between items-stretch col-span-3'>
                                <div className='pt-2 flex flex-col gap-1'>
                                    <div className="flex justify-between">
                                        <h5 className="flex-1 font-bold text-2xl">{product.name}</h5>
                                        {/* {product.price != null ? (
                                        <span className="ProductPrice">${product.price}</span>
                                        ) : undefined} */}
                                    </div>
                                    <ProductSubheader product={product} />
                                    <VendorRating rating={product.rating} />
                                </div>
                                <div className='flex flex-col gap-1'>
                                {product.vendor?.openStatus ? (
                                    <OpenStatus status={product.vendor.openStatus} />
                                ) : undefined}
                                    <ProductChips product={product} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div>
                        <div>
                            <AccordianRow product={product}>
                                <ProductAttributeList1 product={product}/>
                            </AccordianRow>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div>
                                <AccordianRow>
                                    <TerpsDetailPane terpEntries={terpEntries}/>
                                </AccordianRow>
                            </div>
                            <div>
                                <AccordianRow>
                                    <THCDetails/>
                                </AccordianRow>
                            </div>
                        </div>
                    <div>
                        <h1>Allergy Warnings</h1>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SingleProduct;