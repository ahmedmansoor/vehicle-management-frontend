const nextConfig = {
  images: {
    domains: ['vehicle-api.laravel.cloud'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vehicle-api.laravel.cloud',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; 