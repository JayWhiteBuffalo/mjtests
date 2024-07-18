

// HEADER
// MAP
// SEARCH PANEL
// FILTER PANEL
// VENDOR ITEM LIST
// FOOTER
import UserDto from '@/data/UserDto'
import VendorDto from '@/data/VendorDto'
import {FilterPaneWrapper} from '@/feature/shop/component/App'
import {MapPaneContainer} from '@/feature/shop/component/MapPane'
import {Header} from '@/feature/shop/component/Nav/Header'
import {SearchBarContainer} from '@/feature/shop/component/SearchBar'
import clsx from 'clsx'


// export const generateStaticParams = () => ({searchParams: {}})

const Page = async ({user, layout}) => {
  
//   const filter = ProductFilterUtil.fromQuery(query)
//   const allProducts = await ProductDto.getProducts()
//   const products = await ProductDto.getProducts(filter)
//   const producerProducts = await ProductDto.getProducerProducts(filter);
//   const brands = extractUniqueBrands(allProducts)
//   const stores = extractUniqueStores(allProducts)
//   const strains = extractUniqueStrains(allProducts)
//   const dropDownData = {strains, stores, brands}
//   const initial = {query, filter, products, producerProducts, dropDownData} 
  //const user = await UserDto.getCurrent()
  const vendors = await VendorDto.findMany()

    return(
    <main
      className={clsx(
        'App',
        'flex flex-col items-stretch',
        // layout.pinMapPane ? 'pinMapPane overflow-hidden h-screen' : undefined,
      )}
    >
      {/* <Header user={user}/> */}
      {/* {layout.showMapPane ? <MapPaneContainer /> : undefined} */}
      {/* <SearchBarContainer /> */}
      <section className='w-full h-full flex p-10'>
        <div className='relative flex justify-center items-center w-1/3 h-full'>
          {/* <FilterPaneWrapper layout={layout} /> */}
        </div>
      {/* <VendorListPaneContainer /> */}
      </section>
      {/* <ShopFooter /> */}
    </main>
  )
  }

export default Page;