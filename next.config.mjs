export default {
  reactStrictMode: false,
  images: {
    domains: ['www.worldatlas.com','www.countryflags.com'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dsvfkffwe/image/**',
      },
    ],
  },

  typescript: {
    // Disable typescript for npm build
    ignoreBuildErrors: true,
  },
}
