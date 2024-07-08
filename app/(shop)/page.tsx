import ProductDto from '@data/ProductDto'
import {AppContainer} from '@feature/shop/component/App'
import {ProductFilterUtil} from '@/feature/shop/util/ProductFilterUtil'

export const generateStaticParams = () => ({searchParams: {}})

const Page = async ({searchParams: query}) => {
  
  const filter = ProductFilterUtil.fromQuery(query)
  const products = await ProductDto.getProducts(filter)
  const producerProducts = await ProductDto.getProducerProducts(filter);
  const initial = {query, filter, products, producerProducts}


  return <AppContainer initial={initial} />
}
export default Page
