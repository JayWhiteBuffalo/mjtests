import VendorDto from '@/data/VendorDto';
import {VendorContact, VendorRating} from '@/feature/shop/component/VendorPopup'
import type {Vendor} from '@prisma/client'
import icon from '@/public/icon.png'
import {VendorProfile} from '@/feature/shop/component/VendorProfile'

// const getData = async () => {
//     const response = await fetch ('need prop data here')
//     return response
// }
const Page = async ({params} : {
     slug: string 
}) => {

    const vendor = await VendorDto._getRaw(params.vendorId)

  return (
    <>
      <VendorProfile vendor={vendor}/>
    </>
  )
}

export default Page;
