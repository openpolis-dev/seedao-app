const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  reactStrictMode: true,
  // swcMinify: false,
  trailingSlash: true,
  experimental: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },

  // assetPrefix: isProd ? '/os-frondend-preview' : '',
};
