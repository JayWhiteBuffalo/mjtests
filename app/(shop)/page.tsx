import ProductDto from '@data/ProductDto'
import {AppContainer} from './components/App'
import {ProductFilterUtil} from '@util/ProductFilterUtil'

export const generateStaticParams = () => (
  {searchParams: {}}
)

const requireLogin = false
const Page = async ({searchParams: query}) => {
  const filter = ProductFilterUtil.fromQuery(query)
  const products = await ProductDto.getProducts(filter)
  const initial = {query, filter, products}
  return <AppContainer initial={initial} />
}
export default Page
