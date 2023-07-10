module.exports = {
  reactStrictMode: true,
  // swcMinify: false,
  trailingSlash: true,
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  assetPrefix: '',
  basePath: '',
  images: {
    loader: 'akamai',
    path: '/',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// please refer https://github.com/gregrickaby/nextjs-github-pages for github pages deployment
// github page issue https://medium.com/geekculture/github-pages-with-dynamic-routes-40f512900efa
