import {AppContainer} from './components/App'
import {ProductFilterUtil} from '@util/ProductFilterUtil'
import ProductDto from '@data/ProductDto'

export const generateStaticParams = () => (
  {searchParams: {}}
)

export default async ({searchParams: query}) => {
  const filter = ProductFilterUtil.fromQuery(query)
  const products = await ProductDto.getProducts(filter)
  const initial = {query, filter, products}
  return <AppContainer initial={initial} />
}
