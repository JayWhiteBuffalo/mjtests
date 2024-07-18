import VendorDto from '@/data/VendorDto';
import { UrlUtil } from '@/util/UrlUtil';

export async function getServerSideProps(context) {
  const { params, req } = context;

  const url = `http://${req.headers.host}${req.url}`;
  const vendorId = "knZiCn8yb7pmMUIEIi-Be";

  if (!vendorId) {
    return {
      notFound: true,
    };
  }

  try {
    const vendor = await VendorDto._getRaw(vendorId);
    if (!vendor) {
      return {
        notFound: true,
      };
    }

    console.log('Fetched vendor:', vendor); // Log the fetched vendor for debugging

    return {
      props: {
        vendor,
      },
    };
  } catch (error) {
    console.error('Error fetching vendor data:', error);

    // Optionally, you can log the error details for debugging
    return {
      notFound: true, // Or handle specific error cases based on your application's requirements
    };
  }
}
