/** @type {import('next').NextConfig} */
const repoName = 'tumen-front';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : '',
  }
};

// Dev-only proxy to local backend to avoid CORS during next dev
nextConfig.rewrites = async () => {
  if (!isProd) {
    return [
      { source: '/api/search/:path*', destination: 'http://localhost:3000/search/:path*' },
      { source: '/api/lottery/:path*', destination: 'http://localhost:3000/lottery/:path*' },
    ];
  }
  return [];
};

module.exports = nextConfig;
