import ProductDto from '@data/ProductDto';
import { AppContainer } from '@feature/shop/component/App';
import { ProductFilterUtil } from '@/feature/shop/util/ProductFilterUtil';
import { UserProvider } from '@/context/UserContext';
import UserDto from '@/data/UserDto';

export const generateStaticParams = () => ({ searchParams: {} });

const Page = async ({ searchParams: query }) => {
  const filter = ProductFilterUtil.fromQuery(query);

  // Fetch all products and user data in parallel
  const [allProducts, user] = await Promise.all([
    ProductDto.getProducts(),                // Fetch all products
    UserDto.getCurrent(),                    // Fetch current user
  ]);

  // Filter products based on the current query
  const filteredProducts = ProductFilterUtil.applyFilters(allProducts, filter);
  
  // Extract unique brands, stores, and strains (commented out for now)
  // const brands = extractUniqueBrands(allProducts);
  // const stores = extractUniqueStores(allProducts);
  // const strains = extractUniqueStrains(allProducts);

  const initial = { query, filter, products: filteredProducts };

  return (
    <UserProvider initialUser={user}>
      <AppContainer user={user} initial={initial} />
    </UserProvider>
  );
};

export default Page;
