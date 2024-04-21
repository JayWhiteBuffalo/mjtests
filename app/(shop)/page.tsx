import ProductDto from '@data/ProductDto'
import UserDto from '@data/UserDto'
import {AppContainer} from './components/App'
import {getPathname} from '@nimpl/getters/get-pathname'
import {ProductFilterUtil} from '@util/ProductFilterUtil'
import {signIn} from '@/auth'

export const generateStaticParams = () => (
  {searchParams: {}}
)

const requireLogin = false
const Page = async ({searchParams: query}) => {
  const user = await UserDto.getCurrent()
  if (requireLogin && !user.loggedIn) {
    return signIn(null, {redirectTo: getPathname()})
  }

  const filter = ProductFilterUtil.fromQuery(query)
  const products = await ProductDto.getProducts(filter)
  const initial = {query, filter, products}
  return <AppContainer initial={initial} />
}
export default Page
