const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  reactStrictMode: true,
  // swcMinify: false,
  trailingSlash: true,
  experimental: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  // images: {
  //   unoptimized: true,
  // },
  // assetPrefix: isProd ? '/os-frontend-preview/' : '',
  // basePath: isProd ? '/os-frontend-preview' : '',
  images: {
    loader: 'akamai',
    path: '/',
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

// please refer https://github.com/gregrickaby/nextjs-github-pages for github pages deployment
// github page issue https://medium.com/geekculture/github-pages-with-dynamic-routes-40f512900efa