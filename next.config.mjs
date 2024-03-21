export default {
  reactStrictMode: false,
  images: {
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
