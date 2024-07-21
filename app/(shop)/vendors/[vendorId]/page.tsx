import VendorDto from '@/data/VendorDto';
import ProductDto from '@/data/ProductDto';
import {VendorContact, VendorRating} from '@/feature/shop/component/VendorPopup'
import type {Vendor} from '@prisma/client'
import icon from '@/public/icon.png'
import {VendorProfile} from '@/feature/shop/component/VendorProfile'


const Page = async ({params} : {
     slug: string 
}) => {


    const vendor = await VendorDto._getRaw(params.vendorId)
    const products = await ProductDto.getProductsByVendorId(vendor); 
    console.log("Vendor Log++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" + vendor)
    console.log(products)

  return (
    <>
      <VendorProfile vendor={vendor} products={products}/>
    </>
  )
}

export default Page;
