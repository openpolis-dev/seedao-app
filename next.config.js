module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
  assetPrefix: undefined,
  basePath: undefined,
  compiler: {
    styledComponents: true
  },
  images: {
    unoptimized: true,
    loader: 'akamai',
    path: '/',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// please refer https://github.com/gregrickaby/nextjs-github-pages for github pages deployment
// github page issue https://medium.com/geekculture/github-pages-with-dynamic-routes-40f512900efa
