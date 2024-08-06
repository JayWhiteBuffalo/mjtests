import ProductDto from '@data/ProductDto'
import {AppContainer} from '@feature/shop/component/App'
import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'
import UserDto from '@/data/UserDto'


export const generateStaticParams = () => ({searchParams: {}})

const Page = async ({searchParams: query}) => {
  
  const filter = ProductFilterUtil.fromQuery(query)
  const allProducts = await ProductDto.getProducts()
  const products = await ProductDto.getProducts(filter)
  const producerProducts = await ProductDto.getProducerProducts(filter);
  const brands = extractUniqueBrands(allProducts)
  const stores = extractUniqueStores(allProducts)
  const strains = extractUniqueStrains(allProducts)
  const dropDownData = {strains, stores, brands}
  const initial = {query, filter, products, producerProducts, dropDownData} 
  const user = await UserDto.getCurrent()

  return <AppContainer user={user} initial={initial} />


// Helper function to extract unique brands from products and producerProducts
function extractUniqueBrands(products) {
  const brandsMap = {};
  products.forEach(product => {
    if (product.brand && !brandsMap[product.brand]) {
      brandsMap[product.brand] = {
        key: product.brand,
        name: product.brand,
      };
    }
  });
  return Object.values(brandsMap);
}

// Helper function to extract unique stores from products
function extractUniqueStores(products) {
  const storesMap = {};
  products.forEach(product => {
    if (product.vendorId && !storesMap[product.vendorId]) {
      storesMap[product.vendorId] = {
        name: product.vendorId,
        key: product.vendorId, // Assuming vendorId is unique and can be used directly as key
      };
    }
  });
  return Object.values(storesMap);
}

// Helper function to extract unique strains from products and producerProducts
function extractUniqueStrains(products) {
  const strainsMap = {};
  products.forEach(product => {
    if (product.cultivar && !strainsMap[product.cultivar]) {
      strainsMap[product.cultivar] = {
        name: product.cultivar,
        key: product.id,
      };
    }
  });
  return Object.values(strainsMap);
}

}

export default Page;